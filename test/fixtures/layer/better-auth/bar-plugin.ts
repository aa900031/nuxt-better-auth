import type { BetterAuthClientPlugin } from 'better-auth'

export default {
	id: 'bar',
	getActions: () => ({
		bar: () => 'baz',
	}),
} satisfies BetterAuthClientPlugin
