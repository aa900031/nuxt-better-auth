import type { TestOptions } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import NuxtBetterAuth from '../src/module'

// The module is registered here instead of in each fixture's `nuxt.config`:
// c12 loads `nuxt.config` through jiti, which would instantiate a second copy
// of the module and its diagnostics, so `diagnostics.*.is` would not match.
export function setupOptions(
	fixture: string,
	options: Partial<TestOptions> = {},
): Partial<TestOptions> {
	return {
		...options,
		rootDir: fileURLToPath(new URL(`./fixtures/${fixture}`, import.meta.url)),
		nuxtConfig: {
			...options.nuxtConfig,
			modules: [NuxtBetterAuth],
		},
	}
}
