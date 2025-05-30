import type { BetterAuthResult } from '#build/types/better-auth/server-options'
import { useEvent } from '#imports'

export function useBetterAuth(): BetterAuthResult {
	const event = useEvent()
	if (event.context.betterAuth == null)
		throw new Error('No better-auth provide from context')
	return event.context.betterAuth
}
