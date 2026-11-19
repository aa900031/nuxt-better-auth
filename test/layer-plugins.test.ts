import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('nuxt layer plugins', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('./fixtures/layer-plugins', import.meta.url)),
	})

	it('should render with client plugins contributed by the layer', async () => {
		const html = await $fetch('/')
		expect(html).contain('User: null')
		expect(html).contain('Sign In')
	})

	it('should mount server plugins contributed by layer options', async () => {
		// Only works when the anonymous plugin contributed via
		// `server.plugins` in the base layer is mounted.
		const data = await $fetch<{ token?: string, user?: { isAnonymous?: boolean } }>(
			'/api/auth/sign-in/anonymous',
			{ method: 'POST', body: {} },
		)
		expect(data.token).toBeTruthy()
		expect(data.user?.isAnonymous).toBe(true)
	})

	it('should merge server plugins from app options with layer options', async () => {
		// The anonymous plugin comes from the base layer's `server.plugins`
		// (asserted above); the foo plugin comes from the app's own
		// `server.plugins`. Both mounting proves the lists are merged.
		const data = await $fetch<string>('/api/auth/foo')
		expect(data).toBe('bar')
	})

	it('should mount server plugins contributed via the hook', async () => {
		// The route only exists when the username plugin pushed through
		// `better-auth:plugins:extend` is mounted; a mounted plugin rejects
		// the bogus credentials instead of returning 404.
		const status = await $fetch('/api/auth/sign-in/username', {
			method: 'POST',
			body: { username: 'nobody', password: 'wrong-password' },
		})
			.then(() => 200)
			.catch(error => error.response?.status ?? error.statusCode)

		expect(status).not.toBe(404)
	})
})
