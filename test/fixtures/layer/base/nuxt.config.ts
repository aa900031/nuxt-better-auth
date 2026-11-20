export default defineNuxtConfig({
	betterAuth: {
		client: {
			plugins: ['better-auth/foo-plugin'],
		},
		server: {
			plugins: ['better-auth/ping-plugin'],
		},
	},
})
