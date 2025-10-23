import type { AuthClientOptions } from '#build/types/better-auth/client-options'
import type { Ref } from '#imports'
import type { BetterFetchError, createAuthClient, InferSessionFromClient, InferUserFromClient } from 'better-auth/client'
import { getCurrentScope, onScopeDispose, toRef, unref, useAsyncData, useAuthClient, useRequestHeaders } from '#imports'

export interface AuthState {
	session: Ref<InferSessionFromClient<AuthClientOptions> | null>
	user: Ref<InferUserFromClient<AuthClientOptions> | null>
	error: Ref<BetterFetchError | null>
	isFetching: Ref<boolean>
}

export function useAuthState(): AuthState & Promise<AuthState> {
	const client = useAuthClient() as ReturnType<typeof createAuthClient>
	const headers = import.meta.server ? useRequestHeaders() : undefined
	const asyncData = useAsyncData(
		'better-auth:session',
		async () => {
			const { data, error } = await client.getSession({
				fetchOptions: {
					headers,
				},
			})
			if (error != null)
				throw error

			// eslint-disable-next-line ts/no-use-before-define
			return data ?? DEFAULT_STATE
		},
		{
			default: () => null,
			dedupe: 'defer',
		},
	)
	if (import.meta.client) {
		const unsubscribe = client.$store.atoms.$sessionSignal.subscribe(() => asyncData.refresh())
		getCurrentScope() && onScopeDispose(unsubscribe)
	}

	const extraData = {
		session: toRef(() => unref(asyncData.data)?.session),
		user: toRef(() => unref(asyncData.data)?.user),
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
