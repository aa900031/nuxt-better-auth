import type { AuthClientResult } from '#build/types/better-auth/client-options'
import { useNuxtApp } from '#app'
import { diagnostics } from '../diagnostics'

export function useAuthClient(): AuthClientResult {
	const nuxtApp = useNuxtApp()
	if (nuxtApp.$betterAuthClient == null)
		throw diagnostics.NUXT_BETTER_AUTH_R1001()

	return nuxtApp.$betterAuthClient()
}
