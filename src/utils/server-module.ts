import type { ModuleOptions } from '../module'
import { useNuxt } from '@nuxt/kit'
import { resolveFilePath } from './user-config'

export async function addServerModule(
	options: ModuleOptions,
	nuxt = useNuxt(),
): Promise<void> {
	nuxt.options.build.transpile ??= []
	nuxt.options.build.transpile.push('nitro-better-auth')

	nuxt.options.nitro.modules ??= []
	nuxt.options.nitro.modules.push('nitro-better-auth')

	const serverOptions = options.server ??= {}
	const pathFromServer = serverOptions.options?.path
	if (pathFromServer != null) {
		const resolvedServerOptionsPath = await resolveFilePath(pathFromServer, nuxt, 'server')
		if (resolvedServerOptionsPath != null) {
			serverOptions.options ??= { path: resolvedServerOptionsPath }
			serverOptions.options.path = resolvedServerOptionsPath
		}
	}

	nuxt.options.nitro.betterAuth = serverOptions
}
