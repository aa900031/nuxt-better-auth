import { defineNitroPlugin } from 'nitropack/runtime'
import { deriveAuthSecret } from '../utils/auth-secret'

export default defineNitroPlugin((nitroApp) => {
	let ready: Promise<void> | undefined = deriveAuthSecret()
	nitroApp.hooks.hook('request', async () => {
		ready ||= deriveAuthSecret()
		await ready
	})
})
