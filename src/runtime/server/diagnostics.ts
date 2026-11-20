import { createConsoleReporter, defineDiagnostics } from 'nostics'

export const diagnostics = /* #__PURE__ */ defineDiagnostics({
	reporters: [createConsoleReporter()],
	codes: {
		NUXT_BETTER_AUTH_R2001: {
			why: 'Could not derive the better-auth secret from `NUXT_APP_SECRET`.',
			fix: 'Set `NUXT_APP_SECRET` (at least 32 characters), or set the secret explicitly with `NUXT_BETTER_AUTH_SECRET` or `BETTER_AUTH_SECRET`.',
		},
	},
})
