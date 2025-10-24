import type { AuthClientResult } from '#build/types/better-auth/client-options'
import clientOptionsFromUser from '#build/better-auth/client-options.mjs'
import { defineNuxtPlugin, useRequestHeaders, useRequestURL } from '#imports'
import { createAuthClient } from 'better-auth/client'
import { defu } from 'defu'

export default defineNuxtPlugin({
	name: 'better-auth:auth-client',
	enforce: 'pre',
	setup: (nuxt) => {
		const baseUrl = resolveUrl()
		const headers = resolveHeaders()

		const client = createAuthClient(
			defu(
				{
					baseURL: baseUrl,
					fetchOptions: {
						headers,
					},
				},
				clientOptionsFromUser(),
			),
		)

		nuxt.provide('betterAuthClient', client)
	},
})

const IGNORE_LIST = [
	'host',
]

function resolveHeaders(): Record<string, any> | undefined {
	if (import.meta.client)
		return undefined

	const cloned = { ...useRequestHeaders() }

	for (const key of IGNORE_LIST) {
		delete cloned[key]
	}

	return cloned
}

function resolveUrl(): string {
	const url = useRequestURL()
	return url.origin
}

declare module '#app' {
	interface NuxtApp {
		$betterAuthClient: AuthClientResult | undefined
	}
}
