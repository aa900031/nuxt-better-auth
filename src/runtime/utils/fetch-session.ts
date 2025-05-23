import type { ClientOptions, InferSessionFromClient, InferUserFromClient } from 'better-auth'
import type { createAuthClient } from 'better-auth/client'
import { ref, useRequestHeaders, useState } from '#imports'

export async function fetchSession(
	client: ReturnType<typeof createAuthClient>,
) {
	const session = useState<InferSessionFromClient<ClientOptions> | null>('auth:session', () => null)
	const user = useState<InferUserFromClient<ClientOptions> | null>('auth:user', () => null)
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
	isFetching.value = false
	return resp?.data
}
