import type { BetterAuthResult } from '#build/types/better-auth/server-options'
import type { H3Event } from 'h3'
import loadServerOptions from '#better-auth/server-options.mjs'
import { defineNitroPlugin } from '#imports'
import { betterAuth as createBetterAuth } from 'better-auth'
import { defu } from 'defu'
import { isWorkerd } from 'std-env'

export default defineNitroPlugin((nitroApp) => {
	if (isWorkerd) {
		const instances = new WeakMap<H3Event, BetterAuthResult>()
		nitroApp.hooks.hook('request', (event) => {
			Object.defineProperty(event.context, 'betterAuth', {
				get: () => {
					const instance = instances.get(event)
					if (instance)
						return instance

					const opts = loadServerOptions()
					const betterAuth = createBetterAuth(
						defu({}, opts),
					)
					instances.set(event, betterAuth)

					return betterAuth
				},
			})
		})
	}
	else {
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
	}
})

declare module 'nitropack' {
	interface NitroApp {
		_betterAuth: BetterAuthResult | undefined
	}
}

declare module 'h3' {
	interface H3EventContext {
		betterAuth: BetterAuthResult | undefined
	}
}
