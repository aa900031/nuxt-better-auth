import type { BetterAuthPlugin } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'

export default {
	id: 'bar',
	endpoints: {
		bar: createAuthEndpoint('/bar', {
			method: 'GET',
		}, async () => 'baz'),
	},
} satisfies BetterAuthPlugin
