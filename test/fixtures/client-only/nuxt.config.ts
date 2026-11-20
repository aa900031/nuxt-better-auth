export default defineNuxtConfig({
	betterAuth: {
		server: false,
	},
	runtimeConfig: {
		public: {
			betterAuth: {
				baseURL: 'http://auth.invalid',
			},
		},
	},
})
