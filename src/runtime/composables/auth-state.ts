import type { AuthClientOptions } from '#build/types/better-auth/client-options'
import type { Ref } from '#imports'
import type { BetterFetchError, InferSessionFromClient, InferUserFromClient } from 'better-auth/client'
import { getCurrentScope, onScopeDispose, toRef, unref, useAsyncData, useAuthClient, useGetAuthSession } from '#imports'

export interface AuthState {
	session: Ref<InferSessionFromClient<AuthClientOptions> | null>
	user: Ref<InferUserFromClient<AuthClientOptions> | null>
	error: Ref<BetterFetchError | null>
	isFetching: Ref<boolean>
}

const DEFAULT_STATE = Object.freeze({
	session: null,
	user: null,
})

export function useAuthState(): AuthState & Promise<AuthState> {
	const getSession = useGetAuthSession()
	const asyncData = useAsyncData(
		'better-auth:session',
		async () => (await getSession()) ?? DEFAULT_STATE,
		{
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
		session: toRef(() => unref(asyncData.data)?.session ?? null),
		user: toRef(() => unref(asyncData.data)?.user ?? null),
		error: asyncData.error,
		isFetching: asyncData.pending,
	}

	const result = Promise.resolve(asyncData).then(() => extraData)
	Object.assign(result, extraData)

	return result as AuthState & Promise<AuthState>
}
