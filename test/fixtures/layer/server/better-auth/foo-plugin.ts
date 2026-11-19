import type { BetterAuthPlugin } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'

export default {
	id: 'foo',
	endpoints: {
		foo: createAuthEndpoint('/foo', {
			method: 'GET',
		}, async () => 'bar'),
	},
} satisfies BetterAuthPlugin
