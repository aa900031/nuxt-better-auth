import { fileURLToPath } from 'node:url'
import { loadNuxt } from '@nuxt/kit'
import { describe, expect, it } from 'vitest'
import { diagnostics } from '../src/diagnostics'
import { setupOptions } from './setup-options'

describe('plugin sources', () => {
	it('should reject non-string sources', async () => {
		const { rootDir, nuxtConfig } = setupOptions('layer', {
			nuxtConfig: {
				betterAuth: {
					client: {
						// @ts-expect-error a JS config can pass anything
						plugins: [42],
					},
				},
			},
		})
		await expect(loadNuxt({ cwd: rootDir, overrides: nuxtConfig })).rejects.toSatisfy(diagnostics.NUXT_BETTER_AUTH_C0002.is)
	})

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

	it('should reject sources that do not exist', async () => {
		const { rootDir, nuxtConfig } = setupOptions('layer', {
			nuxtConfig: {
				betterAuth: {
					client: {
						plugins: [fileURLToPath(new URL('./fixtures/layer/better-auth/missing-plugin', import.meta.url))],
					},
				},
			},
		})
		await expect(loadNuxt({ cwd: rootDir, overrides: nuxtConfig })).rejects.toSatisfy(diagnostics.NUXT_BETTER_AUTH_C0004.is)
	})
})
