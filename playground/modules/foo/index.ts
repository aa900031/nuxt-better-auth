import type {} from 'nuxt-better-auth'
import { createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
	meta: {
		name: 'playground-foo',
	},
	setup(_options, nuxt) {
		const resolver = createResolver(import.meta.url)

		nuxt.hook('better-auth:plugins:extend', (plugins) => {
			plugins.server.push(resolver.resolve('./runtime/plugin'))
			plugins.client.push(resolver.resolve('./runtime/client-plugin'))
		})
	},
})
