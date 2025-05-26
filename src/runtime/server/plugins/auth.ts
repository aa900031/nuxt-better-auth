import type { BetterAuthResult } from '#build/types/better-auth/server-options'
import loadServerOptions from '#better-auth/server-options.mjs'
import { defineNitroPlugin } from '#imports'
import { betterAuth } from 'better-auth'
import { defu } from 'defu'
import { isWorkerd } from 'std-env'

export default defineNitroPlugin((nitroApp) => {
	if (isWorkerd) {
		nitroApp.hooks.hook('request', (event) => {
			const opts = loadServerOptions()
			event.context.betterAuth = betterAuth(
				defu({}, opts),
			)
		})
	}
	else {
		const opts = loadServerOptions()
		nitroApp._betterAuth = betterAuth(
			defu({}, opts),
		)
	}
})

declare module 'nitropack' {
	interface NitroApp {
		_betterAuth: BetterAuthResult | undefined
	}
}
