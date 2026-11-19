import type { Nuxt } from '@nuxt/schema'
import { genImport, genString } from 'knitwork'
import { relative } from 'pathe'

export function genClientOptions(
	src: string,
	filepath: string | undefined,
	plugins: string[],
	nuxt: Nuxt,
): string {
	const pluginImports = plugins
		.map((path, index) => genImport(path, `_plugin${index}`))
		.join('\n')
	const pluginNames = plugins
		.map((_, index) => `_plugin${index}`)
		.join(', ')

	if (filepath == null) {
		if (plugins.length === 0) {
			return /* javascript */`
export default (..._args) => {}
`
		}

		return /* javascript */`
${pluginImports}

export default (..._args) => ({
	plugins: [${pluginNames}],
})
`
	}

	const relativeFilepath = relative(nuxt.options.buildDir, filepath)

	let hmr = ''
	if (nuxt.options.dev) {
		hmr = /* javascript */`
if (import.meta.hot) {
  import.meta.hot.accept(${genString(relativeFilepath)}, async (mod) => {
    loader = mod.default
    import.meta.hot.send(${genString(`hmr-user-config:${src}`)})
  })
}
`
	}

	const exported = plugins.length === 0
		? /* javascript */`
export default loader
`
		: /* javascript */`
export default (...args) => {
	const options = loader(...args) ?? {}
	return {
		...options,
		plugins: [...(options.plugins ?? []), ${pluginNames}],
	}
}
`

	return /* javascript */`
${genImport(filepath, '_loader')}
${pluginImports}

let loader = _loader

/** client **/
${hmr}
/** client-end **/
${exported}
`
}
