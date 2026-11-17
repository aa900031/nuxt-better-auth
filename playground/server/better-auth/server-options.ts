import { anonymous } from 'better-auth/plugins'
import { defineAuthServerOptions } from 'nuxt-better-auth/config'

export default defineAuthServerOptions(() => ({
	plugins: [
		anonymous(),
	],
}))
