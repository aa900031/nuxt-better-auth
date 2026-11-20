import { defineDiagnostics } from 'nostics'

export const diagnostics = /* #__PURE__ */ defineDiagnostics({
	codes: {
		NUXT_BETTER_AUTH_C0001: {
			why: '`client.options.path` is required.',
			fix: 'Set `betterAuth.client.options.path` in `nuxt.config` to your better-auth client options file.',
		},
		NUXT_BETTER_AUTH_C0002: {
			why: (p: { from: string, type: string }) => `Plugin source from ${p.from} must be a string: ${p.type}`,
			fix: 'Pass the plugin as a file path string.',
		},
		NUXT_BETTER_AUTH_C0003: {
			why: (p: { from: string, source: string }) => `Plugin source from ${p.from} must be an absolute path: ${p.source}`,
			fix: 'Resolve the path before passing it, e.g. `fileURLToPath(new URL(\'./plugin\', import.meta.url))`, or declare the source in a layer `nuxt.config` to resolve it against that layer.',
		},
		NUXT_BETTER_AUTH_C0004: {
			why: (p: { from: string, source: string }) => `Plugin source from ${p.from} cannot be resolved: ${p.source}`,
			fix: 'Check that the file exists. Relative sources in a layer config resolve against that layer\'s `srcDir` (client) or `server/` (server) directory.',
		},
	},
})
