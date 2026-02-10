import type { Nuxt } from '@nuxt/schema'
import type { Plugin } from 'vite'
import { existsSync } from 'node:fs'
import { addTemplate, addVitePlugin, resolvePath, useNuxt } from '@nuxt/kit'
import { genImport } from 'knitwork'
import { relative } from 'pathe'

export function addUserConfig(
	filenames: {
		src: string
		build: string
	},
	nuxt = useNuxt(),
): void {
	addTemplate({
		filename: filenames.build,
		getContents: ({ nuxt }) => genConfigLoaderContent(filenames, nuxt),
	})

	if (nuxt.options.dev) {
		addVitePlugin(
			createHmrPlugin(filenames.build, filenames.src),
		)
	}
}

async function genConfigLoaderContent(
	filenames: {
		src: string
		build: string
	},
	nuxt: Nuxt,
): Promise<string> {
	const filepath = await resolveFilePath(filenames.src, nuxt)

	if (filepath == null) {
		return /* javascript */`
export default () => {}
`
	}

	const relativeFilepath = relative(nuxt.options.buildDir, filepath)

	let hmr = ''
	if (nuxt.options.dev) {
		hmr = /* javascript */`
if (import.meta.hot) {
  import.meta.hot.accept('${relativeFilepath}', async (mod) => {
    loader = mod.default
    import.meta.hot.send('hmr-user-config:${filenames.src}')
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

export async function resolveFilePath(
	path: string,
	nuxt: Nuxt,
): Promise<string | undefined> {
	const absolutePath = await resolvePath(
		path,
		{
			cwd: nuxt.options.srcDir,
		},
	)
	if (!existsSync(absolutePath))
		return undefined

	return absolutePath
}

function createHmrPlugin(
	filenameForBuild: string,
	filenameForSrc: string,
): Plugin {
	return {
		name: `hmr-user-config:${filenameForBuild}`,
		configureServer(server) {
			server.ws.on(`hmr-user-config:${filenameForSrc}`, () => {
				server.ws.send({ type: 'full-reload' })
			})
		},
	}
}
