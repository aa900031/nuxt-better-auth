import type { Nuxt } from '@nuxt/schema'
import { genImport } from 'knitwork'
import { dirname, join, relative } from 'pathe'

export function genTypeClientOptions(
	filename: string,
	targetPath: string | undefined,
	plugins: string[],
	nuxt: Nuxt,
): string {
	const outputDir = dirname(join(nuxt.options.buildDir, filename))

	const pluginImports = plugins
		.map((path, index) => genImport(relative(outputDir, path), `_plugin${index}`))
		.join('\n')
	const pluginTypes = plugins
		.map((_, index) => `typeof _plugin${index}`)
		.join(', ')

	return /* typescript */`
${genImport('better-auth/client', ['createAuthClient'])}
${targetPath ? genImport(relative(outputDir, targetPath), 'ClientOptionsLoader') : ''}
${pluginImports}

type BaseOptions = ${targetPath ? 'NonNullable<ReturnType<typeof ClientOptionsLoader>>' : '{}'}
type BasePlugins = BaseOptions extends { plugins: infer P extends readonly unknown[] } ? P : []

export type AuthClientOptions = Omit<BaseOptions, 'plugins'> & {
	plugins: [...BasePlugins${pluginTypes ? `, ${pluginTypes}` : ''}]
}

export type AuthClientResult = ReturnType<typeof createAuthClient<AuthClientOptions>>

`
}
