import type { BetterAuthPlugin } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'

export default {
	id: 'baz',
	endpoints: {
		baz: createAuthEndpoint('/baz', {
			method: 'GET',
		}, async () => 'qux'),
	},
} satisfies BetterAuthPlugin
