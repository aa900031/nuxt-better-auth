import type { betterAuth as createBetterAuth } from 'better-auth'
import type { InferSessionFromClient, InferUserFromClient } from 'better-auth/client'
import type { AuthClientOptions, AuthClientResult } from '#build/types/better-auth/client-options'
import { useNuxtApp, useRequestEvent } from '#app'

type AuthSessionData
	= | {
		session: InferSessionFromClient<AuthClientOptions>
		user: InferUserFromClient<AuthClientOptions>
	}
	| null

export function useGetAuthSession(): () => Promise<AuthSessionData> {
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
			return data as AuthSessionData
		}
		: async () => {
			const getAuthClient = nuxtApp.$betterAuthClient as ((() => AuthClientResult) | undefined)
			if (!getAuthClient)
				throw new Error('Please setup better-auth first')
			const { data, error } = await getAuthClient().getSession()
			if (error)
				throw error
			return data
		}
}
