export default defineNuxtConfig({
	modules: ['../src/module'],
	devtools: { enabled: true },
	betterAuth: {
		server: {
			singleton: 'app',
		},
	},
})
