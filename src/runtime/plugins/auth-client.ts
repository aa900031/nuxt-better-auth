import type { Auth, BetterAuthClientOptions } from 'better-auth'
import type { H3Event } from 'h3'
import type { Ref } from 'vue'
import type { NuxtApp } from '#app'
import type { AuthClientResult } from '#build/types/better-auth/client-options'
import type { ClientOptionsContext } from '../config'
import { createAuthClient } from 'better-auth/client'
import { env } from 'std-env'
import { joinURL } from 'ufo'
import { defineNuxtPlugin, useRequestHeaders, useRequestURL, useState } from '#app'
import loadClientOptions from '#build/better-auth/client-options.mjs'
import { forwardHeaders, hasServer, mountPath } from '#build/better-auth/module-options.mjs'
import { useRuntimeConfig } from '#imports'
import { diagnostics } from '../diagnostics'

interface PublicServerConfig {
	baseURL?: string
	basePath?: string
}

export default defineNuxtPlugin({
	name: 'better-auth:auth-client',
	setup: (nuxt) => {
		const publicServerConfig = useState<PublicServerConfig | null>('better-auth:public-server-config', () => null)
		const runtimeConfig = useRuntimeConfig()
		const requestURL = useRequestURL()
		const requestHeaders = useRequestHeaders(forwardHeaders)

		let client: AuthClientResult | undefined
		nuxt.provide(
			'betterAuthClient',
			() => client ??= createClient(nuxt, publicServerConfig, runtimeConfig, requestURL, requestHeaders),
		)
	},
})

function createClient(
	nuxt: NuxtApp,
	serverConfig: Ref<PublicServerConfig | null>,
	runtimeConfig: ReturnType<typeof useRuntimeConfig>,
	requestURL: URL,
	requestHeaders: Record<string, string | undefined>,
): AuthClientResult {
	if (import.meta.server && serverConfig.value == null) {
		const config = readServerConfig(nuxt.ssrContext?.event)
		if (config)
			serverConfig.value = config
	}

	const baseUrl = resolveUrl(serverConfig.value, runtimeConfig, requestURL)
	const context: ClientOptionsContext = { baseURL: baseUrl }
	const options = (loadClientOptions(context) ?? {}) as BetterAuthClientOptions

	if (!options.baseURL) {
		if (!baseUrl)
			throw diagnostics.NUXT_BETTER_AUTH_R1004()
		options.baseURL = baseUrl
	}
	if (Object.keys(requestHeaders).length) {
		if (!options.fetchOptions) {
			options.fetchOptions = {
				headers: requestHeaders,
			}
		}
		else if (!options.fetchOptions.headers) {
			options.fetchOptions.headers = requestHeaders
		}
	}

	return createAuthClient(options) as AuthClientResult
}

function readServerConfig(event: H3Event | undefined): PublicServerConfig | null {
	if (event == null)
		return null

	const betterAuth = event.context.betterAuth as (Auth | undefined)
	if (betterAuth == null)
		return null

	return {
		baseURL: (
			typeof betterAuth.options.baseURL === 'string'
				? betterAuth.options.baseURL
				: typeof betterAuth.options.baseURL === 'object' && betterAuth.options.baseURL
					? betterAuth.options.baseURL.fallback
					: undefined
		)
		|| env.BETTER_AUTH_URL
		|| undefined,
		basePath: typeof betterAuth.options.basePath === 'string'
			? betterAuth.options.basePath
			: undefined,
	}
}

function resolveUrl(
	serverConfig: PublicServerConfig | null,
	runtimeConfig: ReturnType<typeof useRuntimeConfig>,
	requestURL: URL,
): string | undefined {
	const publicConfig = runtimeConfig.public.betterAuth
	if (!hasServer) {
		return publicConfig.baseURL
			? joinURL(publicConfig.baseURL, publicConfig.basePath)
			: undefined
	}
	const siteUrl = runtimeConfig.public.siteUrl
	const baseURL = publicConfig.baseURL
		|| serverConfig?.baseURL
		|| (typeof siteUrl === 'string' ? siteUrl : '')
	const basePath = publicConfig.basePath
		|| serverConfig?.basePath
		|| joinURL(runtimeConfig.app.baseURL || '/', mountPath)

	let origin: string
	if (baseURL) {
		origin = new URL(baseURL).origin
	}
	else if (import.meta.dev || import.meta.client) {
		origin = requestURL.origin
	}
	else {
		throw diagnostics.NUXT_BETTER_AUTH_R1003()
	}
	return joinURL(origin, basePath)
}

declare module '#app' {
	interface NuxtApp {
		$betterAuthClient: (() => AuthClientResult) | undefined
	}
}
