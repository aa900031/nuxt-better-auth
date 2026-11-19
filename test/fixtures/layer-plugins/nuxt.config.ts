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
			plugins: ['./server/better-auth/foo-plugin'],
		},
	},
	hooks: {
		'better-auth:plugins:extend': (plugins) => {
			plugins.server.push(
				fileURLToPath(new URL('./server/better-auth/username-plugin', import.meta.url)),
			)
		},
	},
})
