export default defineNuxtConfig({
	extends: ['../basic'],
	runtimeConfig: {
		public: {
			// Override the base fixture so no baseURL source is configured
			siteUrl: '',
		},
	},
})
