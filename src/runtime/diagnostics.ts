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
			why: 'Could not resolve the better-auth baseURL in production.',
			fix: 'Set `runtimeConfig.public.betterAuth.baseURL` (`NUXT_PUBLIC_BETTER_AUTH_BASE_URL`), `runtimeConfig.public.siteUrl` (`NUXT_PUBLIC_SITE_URL`), or the `BETTER_AUTH_URL` environment variable.',
		},
	},
})
