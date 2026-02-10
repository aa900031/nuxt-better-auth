/* eslint-disable ts/explicit-function-return-type */
import type { BetterAuthClientOptions } from 'better-auth'
import { anonymousClient } from 'better-auth/client/plugins'

export default function () {
	return {
		plugins: [
			anonymousClient(),
		],
	} satisfies BetterAuthClientOptions
}
