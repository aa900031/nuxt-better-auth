import type { AuthClientResult } from '#build/types/better-auth/client-options'
import { useNuxtApp } from '#imports'

export function useAuthClient(): AuthClientResult {
	const nuxtApp = useNuxtApp()
	if (nuxtApp.$betterAuthClient == null)
		throw new Error('Please setup better-auth first')

	return nuxtApp.$betterAuthClient
}
