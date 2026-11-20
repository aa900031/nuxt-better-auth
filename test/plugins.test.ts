import { loadNuxt } from '@nuxt/kit'
import { describe, expect, it } from 'vitest'
import { diagnostics } from '../src/diagnostics'
import { setupOptions } from './setup-options'

describe('plugin sources', () => {
	it('should reject relative sources not declared in any layer config', async () => {
		// Without a declaring layer there is no directory to resolve against;
		// silently dropping the source is what this guards against.
		const { rootDir, nuxtConfig } = setupOptions('layer', {
			nuxtConfig: {
				betterAuth: {
					client: {
						plugins: ['better-auth/bar-plugin'],
					},
				},
			},
		})
		await expect(loadNuxt({ cwd: rootDir, overrides: nuxtConfig })).rejects.toSatisfy(diagnostics.NUXT_BETTER_AUTH_C0003.is)
	})
})
