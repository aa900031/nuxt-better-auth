import type { BetterAuthClientPlugin } from 'better-auth'

export default {
	id: 'foo-client',
	getActions: () => ({
		foo: () => 'bar',
	}),
} satisfies BetterAuthClientPlugin
