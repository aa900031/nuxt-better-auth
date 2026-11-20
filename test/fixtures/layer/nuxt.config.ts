import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
	extends: ['./base'],
	runtimeConfig: {
		public: {
			siteUrl: 'http://localhost:3000',
		},
	},
	betterAuth: {
		server: {
			plugins: ['better-auth/foo-plugin'],
		},
	},
	hooks: {
		'better-auth:plugins:extend': (plugins) => {
			plugins.client.push(
				fileURLToPath(new URL('./better-auth/bar-plugin', import.meta.url)),
			)
			plugins.server.push(
				fileURLToPath(new URL('./server/better-auth/bar-plugin', import.meta.url)),
			)
		},
	},
})
