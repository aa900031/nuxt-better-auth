import NuxtBetterAuth from '../../../src/module'

export default defineNuxtConfig({
	modules: [
		NuxtBetterAuth,
	],
	runtimeConfig: {
		public: {
			siteUrl: 'http://localhost:3000',
		},
	},
})
