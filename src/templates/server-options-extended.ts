import { genImport } from 'knitwork'

export function genServerOptionsExtended(
	filepath: string | undefined,
	plugins: string[],
): string {
	const loaderImport = filepath
		? genImport(filepath, '_loader')
		: 'const _loader = (..._args) => ({})'
	const pluginImports = plugins
		.map((path, index) => genImport(path, `_plugin${index}`))
		.join('\n')
	const pluginNames = plugins
		.map((_, index) => `_plugin${index}`)
		.join(', ')

	return /* javascript */`
${loaderImport}
${pluginImports}

export default (...args) => {
	const options = _loader(...args) ?? {}
	return {
		...options,
		plugins: [...(options.plugins ?? [])${pluginNames ? `, ${pluginNames}` : ''}],
	}
}
`
}
