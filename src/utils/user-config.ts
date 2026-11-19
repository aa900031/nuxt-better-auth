import type { Nuxt } from '@nuxt/schema'
import type { Plugin } from 'vite'
import type { ModuleOptions } from '../module'
import type { PluginSources } from './plugins'
import { addTemplate, addTypeTemplate, addVitePlugin, findPath, getLayerDirectories, useNuxt } from '@nuxt/kit'
import { isAbsolute } from 'pathe'
import { genClientOptions } from '../templates/client-options'
import { genTypeClientOptions } from '../templates/type-client-options'

const BUILD_FILENAME = 'better-auth/client-options.mjs'
const TYPE_FILENAME = 'types/better-auth/client-options.d.ts'

export async function addUserConfig(
	options: ModuleOptions,
	plugins: Promise<PluginSources>,
	nuxt = useNuxt(),
): Promise<void> {
	const src = options.client?.options?.path
	if (!src) {
		throw new Error('[nuxt-better-auth] `client.options.path` is required.')
	}

	const clientPath = await resolveFilePath('app', src, nuxt)

	addTemplate({
		filename: BUILD_FILENAME,
		getContents: async ({ nuxt }) =>
			genClientOptions(src, clientPath, (await plugins).client, nuxt),
	})

	addTypeTemplate({
		filename: TYPE_FILENAME,
		getContents: async ({ nuxt }) =>
			genTypeClientOptions(TYPE_FILENAME, clientPath, (await plugins).client, nuxt),
		write: true,
	}, {
		nuxt: true,
	})

	if (nuxt.options.dev) {
		addVitePlugin(
			createHmrPlugin(BUILD_FILENAME, src),
		)
	}
}

export async function resolveFilePath(
	kind: 'app' | 'server',
	path: string,
	nuxt: Nuxt,
): Promise<string | undefined> {
	const cwds = isAbsolute(path)
		? kind === 'app' ? [nuxt.options.appDir] : [nuxt.options.serverDir]
		: getLayerDirectories(nuxt).map(dirs => dirs[kind])

	for (const cwd of cwds) {
		const found = await findPath(path, { cwd })
		if (found != null)
			return found
	}

	return undefined
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
