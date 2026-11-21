export default defineNuxtConfig({
	betterAuth: {
		server: false,
	},
	hooks: {
		'better-auth:plugins:extend': (plugins) => {
			// Ignored with `server: false`; resolving it would fail the build.
			plugins.server.push('missing-server-plugin')
		},
	},
	runtimeConfig: {
		public: {
			betterAuth: {
				baseURL: 'http://auth.invalid',
			},
		},
	},
})
