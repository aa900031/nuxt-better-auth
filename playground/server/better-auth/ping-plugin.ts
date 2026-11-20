import type { BetterAuthPlugin } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'

export default {
	id: 'ping',
	endpoints: {
		ping: createAuthEndpoint('/ping', {
			method: 'GET',
		}, async () => 'pong'),
	},
} satisfies BetterAuthPlugin
