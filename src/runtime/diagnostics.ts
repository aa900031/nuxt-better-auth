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
		NUXT_BETTER_AUTH_R1004: {
			why: 'Could not resolve the better-auth baseURL with `betterAuth.server: false`: `runtimeConfig.public.betterAuth.baseURL` is empty and the client options did not return a `baseURL`.',
			fix: 'Set `NUXT_PUBLIC_BETTER_AUTH_BASE_URL` to your better-auth server URL, or return `baseURL` from the client options factory.',
		},
		NUXT_BETTER_AUTH_R1005: {
			why: 'The session cannot be fetched on the server with `betterAuth.server: false`: there is no local better-auth server.',
			fix: 'Fetch the session on the client, e.g. with `useAuthState()`, which fetches it after hydration.',
		},
	},
})
