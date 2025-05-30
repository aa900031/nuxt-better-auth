import type { BetterAuthResult } from '#build/types/better-auth/server-options'
import loadServerOptions from '#better-auth/server-options.mjs'
import { defineNitroPlugin } from '#imports'
import { betterAuth as createBetterAuth } from 'better-auth'
import { defu } from 'defu'

export default defineNitroPlugin((nitroApp) => {
	let betterAuth: BetterAuthResult | undefined
	Object.defineProperty(nitroApp, '_betterAuth', {
		get: () => {
			if (betterAuth == null) {
				const opts = loadServerOptions()
				betterAuth = createBetterAuth(
					defu({}, opts),
				)
			}
			return betterAuth
		},
	})
})

declare module 'nitropack' {
	interface NitroApp {
		_betterAuth: BetterAuthResult | undefined
	}
}
