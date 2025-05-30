import type { ClientOptions } from 'better-auth'
import { anonymousClient } from 'better-auth/client/plugins'

export default function () {
	return {
		plugins: [
			anonymousClient(),
		],
	} satisfies ClientOptions
}
