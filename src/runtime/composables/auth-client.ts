import { useNuxtApp } from '#imports'

export function useAuthClient() {
	const nuxtApp = useNuxtApp()
	return nuxtApp.$betterAuthClient
}
