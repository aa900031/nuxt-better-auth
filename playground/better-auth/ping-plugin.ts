import type { BetterAuthClientPlugin } from 'better-auth'

export default {
	id: 'ping-client',
	getActions: () => ({
		ping: () => 'pong',
	}),
} satisfies BetterAuthClientPlugin
