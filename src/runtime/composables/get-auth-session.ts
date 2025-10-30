import type { AuthClientOptions } from '#build/types/better-auth/client-options'
import type { betterAuth as createBetterAuth } from 'better-auth'
import type { createAuthClient, InferSessionFromClient, InferUserFromClient } from 'better-auth/client'
import { useNuxtApp, useRequestEvent } from '#imports'

export function useGetAuthSession(): () => Promise<
	| {
		session: InferSessionFromClient<AuthClientOptions>
		user: InferUserFromClient<AuthClientOptions>
	}
	| null
> {
	const event = useRequestEvent()
	const nuxtApp = useNuxtApp()

	return import.meta.server
		? async () => {
			const betterAuth = event?.context.betterAuth as ReturnType<typeof createBetterAuth> | undefined
			if (!betterAuth)
				throw new Error('Please setup better-auth first')
			const data = await betterAuth.api.getSession({
				headers: event?.headers ?? {},
			})
			return data
		}
		: async () => {
			const authClient = nuxtApp.$betterAuthClient as (ReturnType<typeof createAuthClient> | undefined)
			if (!authClient)
				throw new Error('Please setup better-auth first')
			const { data, error } = await authClient.getSession()
			if (error)
				throw error
			return data
		}
}
