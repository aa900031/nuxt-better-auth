import type { BetterFetchError } from 'better-auth/client'
import type { Ref } from '#imports'
import type { AuthSessionData } from './get-auth-session'
import { useAsyncData, useNuxtApp, useRequestEvent } from '#app'
import { hasServer } from '#build/better-auth/module-options.mjs'
import { getCurrentScope, onScopeDispose, toRef, unref, useAuthClient, useGetAuthSession } from '#imports'

export interface AuthState {
	session: Readonly<Ref<AuthSessionData['session'] | null>>
	user: Readonly<Ref<AuthSessionData['user'] | null>>
	error: Ref<BetterFetchError | null>
	isFetching: Ref<boolean>
}

const DEFAULT_STATE = Object.freeze({
	session: null,
	user: null,
})

export function useAuthState(): AuthState & Promise<AuthState> {
	const event = useRequestEvent()
	const nuxtApp = useNuxtApp()
	const getSession = useGetAuthSession()
	const asyncData = useAsyncData(
		'better-auth:session',
		async () => {
			if (
				!import.meta.server
				|| (nuxtApp.payload.serverRendered && !nuxtApp.payload.prerenderedAt && !event?.context.cache)
			) {
				return (await getSession()) ?? DEFAULT_STATE
			}
		},
		{
			default: () => DEFAULT_STATE,
			dedupe: 'defer',
			server: hasServer,
		},
	)
	if (import.meta.client) {
		const client = useAuthClient()
		const unsubscribe = client.$store.atoms.$sessionSignal?.subscribe(() => asyncData.refresh())
		if (unsubscribe && getCurrentScope())
			onScopeDispose(unsubscribe)
	}

	const extraData = {
		session: toRef(() => unref(asyncData.data)?.session ?? null),
		user: toRef(() => unref(asyncData.data)?.user ?? null),
		error: asyncData.error,
		isFetching: asyncData.pending,
	}

	const result = Object.assign(
		Promise.resolve(asyncData).then(() => extraData),
		extraData,
	)

	return result as AuthState & Promise<AuthState>
}
