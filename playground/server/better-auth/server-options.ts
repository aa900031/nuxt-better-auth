/* eslint-disable ts/explicit-function-return-type */
import type { BetterAuthOptions } from 'better-auth'
import { anonymous } from 'better-auth/plugins'

export default function () {
	return {
		plugins: [
			anonymous(),
		],
		trustedOrigins: [
			'http://localhost:3000',
		],
	} satisfies BetterAuthOptions
}
