export default defineNuxtConfig({
	modules: [
		// 'nuxt-better-auth',
		'../src',
	],
	devtools: { enabled: true },
	betterAuth: {
		client: {
			plugins: ['./better-auth/ping-plugin'],
		},
		server: {
			plugins: ['./server/better-auth/ping-plugin'],
		},
	},
})
