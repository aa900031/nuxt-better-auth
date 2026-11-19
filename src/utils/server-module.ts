import type { ModuleOptions } from '../module'
import type { PluginSources } from './plugins'
import { addTemplate, useNuxt } from '@nuxt/kit'
import { genServerOptionsExtended } from '../templates/server-options-extended'
import { resolveFilePath } from './user-config'

const EXTENDED_FILENAME = 'better-auth/server-options.extended.ts'

export async function addServerModule(
	options: ModuleOptions,
	plugins: Promise<PluginSources>,
	nuxt = useNuxt(),
): Promise<void> {
	nuxt.options.build.transpile ??= []
	nuxt.options.build.transpile.push('nitro-better-auth')

	nuxt.options.nitro.modules ??= []
	nuxt.options.nitro.modules.push('nitro-better-auth')

	const { plugins: _plugins, ...serverOptions } = options.server ?? {}

	const pathFromServer = serverOptions.options?.path
	const resolvedPath = pathFromServer != null
		? await resolveFilePath('server', pathFromServer, nuxt)
		: undefined

	const template = addTemplate({
		filename: EXTENDED_FILENAME,
		getContents: async () =>
			genServerOptionsExtended(resolvedPath, (await plugins).server),
		write: true,
	})

	serverOptions.options ??= { path: template.dst }
	serverOptions.options.path = template.dst

	nuxt.options.nitro.betterAuth = serverOptions
}
