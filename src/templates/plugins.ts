import { genImport } from 'knitwork'

function pluginName(index: number): string {
	return `_plugin${index}`
}

export function genPluginImports(
	plugins: string[],
	toSpecifier: (path: string) => string = path => path,
): string {
	return plugins
		.map((path, index) => genImport(toSpecifier(path), pluginName(index)))
		.join('\n')
}

/** Entries to append after a leading spread, each prefixed with `, `. */
export function genPluginEntries(
	plugins: string[],
	toEntry: (name: string) => string = name => name,
): string {
	return plugins
		.map((_, index) => `, ${toEntry(pluginName(index))}`)
		.join('')
}
