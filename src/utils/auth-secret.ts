import type { Resolver } from '@nuxt/kit'
import type { ModuleOptions } from '../module'
import { addServerPlugin, hasNuxtCompatibility, useNuxt } from '@nuxt/kit'

export async function addAuthSecret(
	nuxt = useNuxt(),
	options: ModuleOptions,
	resolver: Resolver,
): Promise<void> {
	const canDeriveAppSecret = await hasNuxtCompatibility({ nuxt: '>=4.6.0-0' }, nuxt)
	nuxt.options.alias['#nuxt-better-auth/app-secret']
		= resolver.resolve(`./runtime/server/shims/${canDeriveAppSecret ? 'app-secret' : 'app-secret-unavailable'}`)

	switch (options.server.singleton) {
		case 'app':
			addServerPlugin(resolver.resolve('./runtime/server/plugins/auth-secret'))
			break
		case 'request':
			addServerPlugin(resolver.resolve('./runtime/server/plugins/auth-secret-request'))
			break
	}
}
