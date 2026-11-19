import type { Nuxt } from '@nuxt/schema'
import { genImport, genString } from 'knitwork'
import { relative } from 'pathe'

export function genClientOptions(
	src: string,
	filepath: string | undefined,
	plugins: string[],
	nuxt: Nuxt,
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

	let hmr = ''
	if (filepath && nuxt.options.dev) {
		hmr = /* javascript */`
if (import.meta.hot) {
  import.meta.hot.accept(${genString(relative(nuxt.options.buildDir, filepath))}, async (mod) => {
    loader = mod.default
    import.meta.hot.send(${genString(`hmr-user-config:${src}`)})
  })
}
`
	}

	return /* javascript */`
${loaderImport}
${pluginImports}

let loader = _loader

/** client **/
${hmr}
/** client-end **/

export default (...args) => {
	const options = loader(...args) ?? {}
	return {
		...options,
		plugins: [...(options.plugins ?? [])${pluginNames ? `, ${pluginNames}` : ''}],
	}
}
`
}
