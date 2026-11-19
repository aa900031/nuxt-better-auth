import type { Nuxt } from '@nuxt/schema'
import { genImport } from 'knitwork'
import { dirname, join } from 'pathe'
import { relativeWithDot } from './paths'
import { genPluginEntries, genPluginImports } from './plugins'

export function genTypeClientOptions(
	filename: string,
	targetPath: string | undefined,
	plugins: string[],
	nuxt: Nuxt,
): string {
	const outputDir = dirname(join(nuxt.options.buildDir, filename))

	return /* typescript */`
${genImport('better-auth/client', ['createAuthClient'])}
${targetPath ? genImport(relativeWithDot(outputDir, targetPath), 'ClientOptionsLoader') : ''}
${genPluginImports(plugins, path => relativeWithDot(outputDir, path))}

type BaseOptions = ${targetPath ? 'NonNullable<ReturnType<typeof ClientOptionsLoader>>' : '{}'}
type BasePlugins = BaseOptions extends { plugins: infer P extends readonly unknown[] } ? P : []

export type AuthClientOptions = Omit<BaseOptions, 'plugins'> & {
	plugins: [...BasePlugins${genPluginEntries(plugins, name => `typeof ${name}`)}]
}

export type AuthClientResult = ReturnType<typeof createAuthClient<AuthClientOptions>>

`
}
