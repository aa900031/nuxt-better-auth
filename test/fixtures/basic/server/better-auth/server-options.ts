import type { BetterAuthOptions } from 'better-auth'
import { anonymous } from 'better-auth/plugins'

export default function () {
	return {
		secret: 'test-1234',
		plugins: [
			anonymous(),
		],
	} satisfies BetterAuthOptions
}
