import { fileURLToPath } from 'node:url'
import { loadNuxt } from '@nuxt/kit'
import { describe, expect, it } from 'vitest'

describe('plugin sources', () => {
	it('should reject relative sources not declared in any layer config', async () => {
		// Without a declaring layer there is no directory to resolve against;
		// silently dropping the source is what this guards against.
		await expect(loadNuxt({
			cwd: fileURLToPath(new URL('./fixtures/layer', import.meta.url)),
			overrides: {
				betterAuth: {
					client: {
						plugins: ['better-auth/bar-plugin'],
					},
				},
			},
		})).rejects.toThrow('[nuxt-better-auth] Plugin source from `client.plugins` not declared in any layer config must be an absolute path: better-auth/bar-plugin')
	})
})
