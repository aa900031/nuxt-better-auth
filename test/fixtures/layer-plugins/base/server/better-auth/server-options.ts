/* eslint-disable ts/explicit-function-return-type */
import type { BetterAuthOptions } from 'better-auth'
import { memoryAdapter } from 'better-auth/adapters/memory'

export default function () {
	return {
		secret: 'test-1234',
		database: memoryAdapter({}),
		trustedOrigins: [
			'*',
		],
	} satisfies BetterAuthOptions
}
