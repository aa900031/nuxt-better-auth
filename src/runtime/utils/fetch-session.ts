import type { BetterFetchError, ClientOptions, createAuthClient, InferSessionFromClient, InferUserFromClient } from 'better-auth/client'
import { ref, useRequestHeaders, useState } from '#imports'

export async function fetchSession(
	client: ReturnType<typeof createAuthClient>,
) {
	const session = useState<InferSessionFromClient<ClientOptions> | null>('auth:session', () => null)
	const user = useState<InferUserFromClient<ClientOptions> | null>('auth:user', () => null)
	const error = useState<BetterFetchError | null>('auth:error', () => null)
	const isFetching = import.meta.server ? ref(false) : useState('auth:isFetching', () => false)
	const headers = import.meta.server ? useRequestHeaders() : undefined

	if (isFetching.value)
		return

	isFetching.value = true
	const resp = await client.getSession({
		fetchOptions: {
			headers,
		},
	})
	session.value = resp?.data?.session || null
	user.value = resp?.data?.user || null
	error.value = (resp?.error as any) || null
	isFetching.value = false
	return resp?.data
}
