import { defineNuxtPlugin, useAuthClient, useRequestEvent } from '#imports'
import { fetchSession } from '../utils/fetch-session'

export default defineNuxtPlugin({
	name: 'better-auth:auth-state--server',
	enforce: 'pre',
	dependsOn: [
		'better-auth:auth-client',
	],
	setup: async (nuxtApp) => {
		if (!import.meta.server)
			return

		nuxtApp.payload.isCached = Boolean(useRequestEvent()?.context.cache)
		if (nuxtApp.payload.serverRendered && !nuxtApp.payload.prerenderedAt && !nuxtApp.payload.isCached) {
			const authClient = useAuthClient()
			await fetchSession(authClient)
		}
	},
})
