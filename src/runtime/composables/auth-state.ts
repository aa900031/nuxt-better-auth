import type { AuthClientOptions } from '#build/types/better-auth/client-options'
import type { Ref } from '#imports'
import type { betterAuth as createBetterAuth } from 'better-auth'
import type { BetterFetchError, createAuthClient, InferSessionFromClient, InferUserFromClient } from 'better-auth/client'
import { getCurrentScope, onScopeDispose, toRef, unref, useAsyncData, useAuthClient, useNuxtApp, useRequestEvent } from '#imports'

export interface AuthState {
	session: Ref<InferSessionFromClient<AuthClientOptions> | null>
	user: Ref<InferUserFromClient<AuthClientOptions> | null>
	error: Ref<BetterFetchError | null>
	isFetching: Ref<boolean>
}

export function useAuthState(): AuthState & Promise<AuthState> {
	const getSession = setupGetSession()
	const asyncData = useAsyncData(
		'better-auth:session',
		async () => {
			const data = await getSession()
			// eslint-disable-next-line ts/no-use-before-define
			return data ?? DEFAULT_STATE
		},
		{
			// eslint-disable-next-line ts/no-use-before-define
			default: () => DEFAULT_STATE,
			dedupe: 'defer',
		},
	)
	if (import.meta.client) {
		const client = useAuthClient()
		const unsubscribe = client.$store.atoms.$sessionSignal.subscribe(() => asyncData.refresh())
		getCurrentScope() && onScopeDispose(unsubscribe)
	}

	const extraData = {
		session: toRef(() => unref(asyncData.data).session),
		user: toRef(() => unref(asyncData.data).user),
		error: asyncData.error,
		isFetching: asyncData.pending,
	}

	const result = Promise.resolve(asyncData).then(() => extraData)
	Object.assign(result, extraData)

	return result as AuthState & Promise<AuthState>
}

const DEFAULT_STATE = Object.freeze({
	session: null,
	user: null,
})

function setupGetSession() {
	const event = useRequestEvent()
	const nuxtApp = useNuxtApp()

	return import.meta.server
		? () => {
				const betterAuth = event?.context.betterAuth as ReturnType<typeof createBetterAuth> | undefined
				if (!betterAuth)
					throw new Error('Please setup better-auth first')
				return betterAuth.api.getSession({
					headers: event?.headers ?? {},
				})
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
