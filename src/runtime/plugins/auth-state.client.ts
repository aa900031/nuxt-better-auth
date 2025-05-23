import { defineNuxtPlugin, useAuthClient } from '#imports'
import { fetchSession } from '../utils/fetch-session'

export default defineNuxtPlugin({
	name: 'better-auth:auth-state--client',
	dependsOn: [
		'better-auth:auth-client',
	],
	setup: async (nuxtApp) => {
		if (!import.meta.client)
			return

		const authClient = useAuthClient()
		authClient.$store.listen('$sessionSignal', async () => {
			await fetchSession(authClient)
		})

		if (!nuxtApp.payload.serverRendered) {
			await fetchSession(authClient)
		}
		else if (Boolean(nuxtApp.payload.prerenderedAt) || Boolean(nuxtApp.payload.isCached)) {
			nuxtApp.hook('app:mounted', async () => {
				await fetchSession(authClient)
			})
		}
	},
})
