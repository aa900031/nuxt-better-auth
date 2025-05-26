import type { BetterAuthResult } from '#build/types/better-auth/server-options'
import { useEvent, useNitroApp } from '#imports'
import { isWorkerd } from 'std-env'

export function useBetterAuth(): BetterAuthResult {
	if (isWorkerd) {
		const event = useEvent()
		if (event.context.betterAuth == null)
			throw new Error('No better-auth provide from context')
		return event.context.betterAuth
	}
	else {
		const nitroApp = useNitroApp()
		if (nitroApp._betterAuth == null)
			throw new Error('No better-auth provide from context')

		return nitroApp._betterAuth
	}
}
