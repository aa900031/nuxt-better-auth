import { genImport } from 'knitwork'
import { genPluginEntries, genPluginImports } from './plugins'

export function genServerOptionsExtended(
	filepath: string | undefined,
	plugins: string[],
): string {
	const loaderImport = filepath
		? genImport(filepath, '_loader')
		: 'const _loader = (..._args) => ({})'

	return /* javascript */`
${loaderImport}
${genPluginImports(plugins)}

export default (...args) => {
	const options = _loader(...args) ?? {}
	return {
		...options,
		plugins: [...(options.plugins ?? [])${genPluginEntries(plugins)}],
	}
}
`
}
