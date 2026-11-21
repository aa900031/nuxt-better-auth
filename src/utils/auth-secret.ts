import type { Resolver } from '@nuxt/kit'
import type { ModuleOptions } from '../module'
import { addServerPlugin, hasNuxtCompatibility, useNuxt } from '@nuxt/kit'
import { isServerEnabled } from './module-options'

export async function addAuthSecret(
	options: ModuleOptions,
	resolver: Resolver,
	nuxt = useNuxt(),
): Promise<void> {
	if (!isServerEnabled(options))
		return

	const canDeriveAppSecret = await hasNuxtCompatibility({ nuxt: '>=4.6.0-0' }, nuxt)
	nuxt.options.alias['#nuxt-better-auth/app-secret']
		= resolver.resolve(`./runtime/server/shims/${canDeriveAppSecret ? 'app-secret' : 'app-secret-unavailable'}`)

	addServerPlugin(resolver.resolve('./runtime/server/plugins/auth-secret'))
}
