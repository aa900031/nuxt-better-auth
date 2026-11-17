import { defineNitroPlugin } from 'nitropack/runtime'
import { deriveAuthSecret } from '../utils/auth-secret'

export default defineNitroPlugin((nitroApp) => {
	const ready = deriveAuthSecret()
	nitroApp.hooks.hook('request', async () => {
		await ready
	})
})
