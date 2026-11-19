import NuxtBetterAuth from '../../../../src/module'

export default defineNuxtConfig({
	modules: [
		NuxtBetterAuth,
	],
	betterAuth: {
		client: {
			plugins: ['./better-auth/anonymous-client-plugin'],
		},
		server: {
			plugins: ['./server/better-auth/anonymous-plugin'],
		},
	},
})
