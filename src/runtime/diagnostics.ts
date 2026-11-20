import { createConsoleReporter, defineDiagnostics } from 'nostics'

export const diagnostics = /* #__PURE__ */ defineDiagnostics({
	reporters: [createConsoleReporter({ method: 'error' })],
	codes: {
		NUXT_BETTER_AUTH_R1001: {
			why: '`$betterAuthClient` is not provided: the auth client was used before the `better-auth:auth-client` plugin ran.',
			fix: 'If you call it from a Nuxt plugin, add `dependsOn: [\'better-auth:auth-client\']` to that plugin.',
		},
		NUXT_BETTER_AUTH_R1002: {
			why: '`event.context.betterAuth` is not available: the nitro-better-auth server plugin did not run for this request.',
		},
		NUXT_BETTER_AUTH_R1003: {
			why: 'Could not resolve the better-auth baseURL in production: `runtimeConfig.public.betterAuth.baseURL`, the better-auth server `baseURL` (or `BETTER_AUTH_URL`), and `runtimeConfig.public.siteUrl` are all empty.',
			fix: 'Set one of them, e.g. with `NUXT_PUBLIC_BETTER_AUTH_BASE_URL`, `BETTER_AUTH_URL`, or `NUXT_PUBLIC_SITE_URL`.',
		},
	},
})
