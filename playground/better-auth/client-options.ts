import { anonymousClient } from 'better-auth/client/plugins'
import { defineAuthClientOptions } from 'nuxt-better-auth/config'

export default defineAuthClientOptions(() => ({
	plugins: [
		anonymousClient(),
	],
}))
