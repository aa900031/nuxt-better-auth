import type { BetterFetchError, ClientOptions, InferSessionFromClient, InferUserFromClient } from 'better-auth/client'
import { ref, useState } from '#imports'

export function useAuthState() {
	const session = useState<InferSessionFromClient<ClientOptions> | null>('auth:session', () => null)
	const user = useState<InferUserFromClient<ClientOptions> | null>('auth:user', () => null)
	const error = useState<BetterFetchError | null>('auth:error', () => null)
	const isFetching = import.meta.server ? ref(false) : useState('auth:isFetching', () => false)

	return {
		session,
		user,
		error,
		isFetching,
	}
}
