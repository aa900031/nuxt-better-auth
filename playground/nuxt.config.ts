export default defineNuxtConfig({
	modules: [
		// 'nuxt-better-auth',
		'../src',
	],
	devtools: { enabled: true },
	betterAuth: {
		server: {
			singleton: 'app',
		},
	},
})
