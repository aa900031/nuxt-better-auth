import type { Nuxt } from '@nuxt/schema'
import { genImport } from 'knitwork'
import { dirname, join, relative } from 'pathe'

export function genTypeServerOptionsExtended(
	filename: string,
	filepath: string | undefined,
	plugins: string[],
	nuxt: Nuxt,
): string {
	const outputDir = dirname(join(nuxt.options.buildDir, filename))

	const loaderImport = filepath
		? genImport(relative(outputDir, filepath), '_loader')
		: 'declare const _loader: (..._args: unknown[]) => {}'
	const pluginImports = plugins
		.map((path, index) => genImport(relative(outputDir, path), `_plugin${index}`))
		.join('\n')
	const pluginTypes = plugins
		.map((_, index) => `typeof _plugin${index}`)
		.join(', ')

	return /* typescript */`
${loaderImport}
${pluginImports}

type _Options = NonNullable<ReturnType<typeof _loader>>
type _Plugins = _Options extends { plugins: infer P extends readonly unknown[] } ? P : []

declare const _default: (...args: Parameters<typeof _loader>) => Omit<_Options, 'plugins'> & {
	plugins: [..._Plugins${pluginTypes ? `, ${pluginTypes}` : ''}]
}

export default _default
`
}
