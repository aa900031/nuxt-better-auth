export default defineNuxtConfig({
	modules: [
		'nuxt-better-auth',
	],
	devtools: { enabled: true },
	betterAuth: {
		server: {
			singleton: 'app',
		},
	},
})
