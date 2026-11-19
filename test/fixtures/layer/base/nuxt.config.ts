import NuxtBetterAuth from '../../../../src/module'

export default defineNuxtConfig({
	modules: [
		NuxtBetterAuth,
	],
	betterAuth: {
		client: {
			plugins: ['better-auth/foo-plugin'],
		},
		server: {
			plugins: ['better-auth/ping-plugin'],
		},
	},
})
