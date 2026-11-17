/* eslint-disable ts/explicit-function-return-type */
import type { BetterAuthOptions } from 'better-auth'
import { memoryAdapter } from 'better-auth/adapters/memory'
import { anonymous } from 'better-auth/plugins'

// No `secret` here: this fixture exercises deriving it from NUXT_APP_SECRET.
export default function () {
	return {
		database: memoryAdapter({}),
		plugins: [
			anonymous(),
		],
		trustedOrigins: [
			'*',
		],
	} satisfies BetterAuthOptions
}
