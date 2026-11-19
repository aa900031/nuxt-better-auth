import type { BetterAuthClientPlugin } from 'better-auth'

export default {
	id: 'foo',
	getActions: () => ({
		foo: () => 'bar',
	}),
} satisfies BetterAuthClientPlugin
