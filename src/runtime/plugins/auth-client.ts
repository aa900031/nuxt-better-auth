import type { AuthClientResult } from '#build/types/better-auth/client-options'
import clientOptionsFromUser from '#build/better-auth/client-options.mjs'
import { defineNuxtPlugin, useRequestHeaders, useRequestURL } from '#imports'
import { createAuthClient } from 'better-auth/client'
import { defu } from 'defu'

export default defineNuxtPlugin({
	name: 'better-auth:auth-client',
	enforce: 'pre',
	setup: () => {
		const url = useRequestURL()
		const headers = import.meta.server ? useRequestHeaders() : undefined

		const client = createAuthClient(
			defu(
				{
					baseURL: `${url.origin}/api/auth`,
					fetchOptions: {
						headers,
					},
				},
				clientOptionsFromUser(),
			),
		)

		return {
			provide: {
				betterAuthClient: client,
			},
		}
	},
})

declare module '#app' {
	interface NuxtApp {
		$betterAuthClient: AuthClientResult | undefined
	}
}
