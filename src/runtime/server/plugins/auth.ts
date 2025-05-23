import loadServerOptions from '#better-auth/server-options.mjs'
import { defineNitroPlugin } from '#imports'
import { betterAuth } from 'better-auth'
import { defu } from 'defu'
import { isWorker } from '../../utils/is-worker'

export default defineNitroPlugin((nitroApp) => {
	if (isWorker()) {
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
