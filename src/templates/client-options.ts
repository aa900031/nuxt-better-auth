import type { Nuxt } from '@nuxt/schema'
import { genImport } from 'knitwork'
import { relative } from 'pathe'

export function genClientOptions(
	src: string,
	filepath: string | undefined,
	nuxt: Nuxt,
): string {
	if (filepath == null) {
		return /* javascript */`
export default (..._args) => {}
`
	}

	const relativeFilepath = relative(nuxt.options.buildDir, filepath)

	let hmr = ''
	if (nuxt.options.dev) {
		hmr = /* javascript */`
if (import.meta.hot) {
  import.meta.hot.accept('${relativeFilepath}', async (mod) => {
    loader = mod.default
    import.meta.hot.send('hmr-user-config:${src}')
  })
}
`
	}

	return /* javascript */`
${genImport(filepath, '_loader')}

let loader = _loader

/** client **/
${hmr}
/** client-end **/

export default loader
`
}
