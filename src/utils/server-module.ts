import type { ModuleOptions } from '../module'
import type { PluginSources } from './plugins'
import { addTemplate, useNuxt } from '@nuxt/kit'
import { genServerOptionsExtended } from '../templates/server-options-extended'
import { genTypeServerOptionsExtended } from '../templates/type-server-options-extended'
import { isServerEnabled } from './module-options'
import { resolveFilePath } from './user-config'

const BUILD_FILENAME = 'better-auth/server-options.extended.js'
const TYPE_FILENAME = 'better-auth/server-options.extended.d.ts'

export function addServerModule(
	options: ModuleOptions,
	plugins: Promise<PluginSources>,
	nuxt = useNuxt(),
): void {
	if (!isServerEnabled(options))
		return

	nuxt.options.build.transpile ??= []
	nuxt.options.build.transpile.push('nitro-better-auth')

	nuxt.options.nitro.modules ??= []
	nuxt.options.nitro.modules.push('nitro-better-auth')

	const { plugins: _plugins, ...serverOptions } = options.server ?? {}

	const pathFromServer = serverOptions.options?.path

	const template = addTemplate({
		filename: BUILD_FILENAME,
		getContents: async ({ nuxt }) => genServerOptionsExtended(
			pathFromServer != null ? await resolveFilePath('server', pathFromServer, nuxt) : undefined,
			(await plugins).server,
		),
		write: true,
		dependsOn: [],
	})

	addTemplate({
		filename: TYPE_FILENAME,
		getContents: async ({ nuxt }) => genTypeServerOptionsExtended(
			TYPE_FILENAME,
			pathFromServer != null ? await resolveFilePath('server', pathFromServer, nuxt) : undefined,
			(await plugins).server,
			nuxt,
		),
		write: true,
		dependsOn: [],
	})

	nuxt.options.nitro.externals ??= {}
	nuxt.options.nitro.externals.inline ??= []
	nuxt.options.nitro.externals.inline.push(template.dst)

	nuxt.options.nitro.betterAuth = {
		...serverOptions,
		options: { ...serverOptions.options, path: template.dst },
	}
}
