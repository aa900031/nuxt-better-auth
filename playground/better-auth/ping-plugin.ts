import type { BetterAuthClientPlugin } from 'better-auth'

export default {
	id: 'ping',
	getActions: () => ({
		ping: () => 'pong',
	}),
} satisfies BetterAuthClientPlugin
