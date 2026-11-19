/* eslint-disable ts/explicit-function-return-type */
import type { BetterAuthClientOptions, BetterAuthClientPlugin } from 'better-auth'

const pingPlugin = {
	id: 'ping',
	getActions: () => ({
		ping: () => 'pong',
	}),
} satisfies BetterAuthClientPlugin

export default function () {
	return {
		plugins: [
			pingPlugin,
		],
	} satisfies BetterAuthClientOptions
}
