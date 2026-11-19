import { genImport } from 'knitwork'

export function genServerOptionsExtended(
	filepath: string | undefined,
	plugins: string[],
): string {
	const loaderImport = filepath
		? genImport(filepath, '_loader')
		: 'const _loader = (..._args: unknown[]) => ({})'
	const pluginImports = plugins
		.map((path, index) => genImport(path, `_plugin${index}`))
		.join('\n')
	const pluginNames = plugins
		.map((_, index) => `_plugin${index}`)
		.join(', ')

	return /* typescript */`
${loaderImport}
${pluginImports}

type _Options = ReturnType<typeof _loader>
type _Plugins = _Options extends { plugins: infer P extends readonly unknown[] } ? P : []

export default (...args: Parameters<typeof _loader>) => {
	const options = _loader(...args) as _Options & { plugins?: readonly unknown[] }
	const basePlugins = (options.plugins ?? []) as _Plugins

	return {
		...options,
		plugins: [...basePlugins${pluginNames ? `, ${pluginNames}` : ''}],
	}
}
`
}
