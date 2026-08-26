import { defineNuxtPlugin, useRequestHeaders, useRequestURL } from '#app'
import type { AuthClientResult } from '#build/types/better-auth/client-options'
import { createAuthClient } from 'better-auth/client'
import { defu } from 'defu'
import loadClientOptions from '#build/better-auth/client-options.mjs'

export default defineNuxtPlugin({
	name: 'better-auth:auth-client',
	setup: (nuxt) => {
		const baseUrl = resolveUrl()
		const headers = resolveHeaders()

		const client = createAuthClient(
			defu(
				loadClientOptions(),
				{
					baseURL: baseUrl,
					fetchOptions: {
						headers,
					},
				},
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
