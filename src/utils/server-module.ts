import type { ModuleOptions } from '../module'
import type { PluginSources } from './plugins'
import { addTemplate, useNuxt } from '@nuxt/kit'
import { genServerOptionsExtended } from '../templates/server-options-extended'
import { resolveFilePath } from './user-config'

const EXTENDED_FILENAME = 'better-auth/server-options.extended.ts'

export function addServerModule(
	options: ModuleOptions,
	plugins: Promise<PluginSources>,
	nuxt = useNuxt(),
): void {
	nuxt.options.build.transpile ??= []
	nuxt.options.build.transpile.push('nitro-better-auth')

	nuxt.options.nitro.modules ??= []
	nuxt.options.nitro.modules.push('nitro-better-auth')

	const { plugins: _plugins, ...serverOptions } = options.server ?? {}

	const pathFromServer = serverOptions.options?.path

	const template = addTemplate({
		filename: EXTENDED_FILENAME,
		getContents: async ({ nuxt }) => genServerOptionsExtended(
			pathFromServer != null ? await resolveFilePath('server', pathFromServer, nuxt) : undefined,
			(await plugins).server,
		),
		write: true,
	})

	nuxt.options.nitro.betterAuth = {
		...serverOptions,
		options: { ...serverOptions.options, path: template.dst },
	}
}
