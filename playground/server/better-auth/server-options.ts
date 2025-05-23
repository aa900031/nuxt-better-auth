import type { BetterAuthOptions } from 'better-auth'
import { anonymous } from 'better-auth/plugins'

export default function () {
	return {
		plugins: [
			anonymous(),
		],
	} satisfies BetterAuthOptions
}
