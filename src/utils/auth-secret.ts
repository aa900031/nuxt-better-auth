import type { Resolver } from '@nuxt/kit'
import { addServerPlugin, hasNuxtCompatibility, useNuxt } from '@nuxt/kit'

export async function addAuthSecret(
	nuxt = useNuxt(),
	resolver: Resolver,
): Promise<void> {
	const canDeriveAppSecret = await hasNuxtCompatibility({ nuxt: '>=4.6.0-0' }, nuxt)
	nuxt.options.alias['#nuxt-better-auth/app-secret']
		= resolver.resolve(`./runtime/server/shims/${canDeriveAppSecret ? 'app-secret' : 'app-secret-unavailable'}`)

	addServerPlugin(resolver.resolve('./runtime/server/plugins/auth-secret'))
}
