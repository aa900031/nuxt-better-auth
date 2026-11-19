import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('nuxt layer', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('./fixtures/layer', import.meta.url)),
	})

	it('should render with client options provided by the layer', async () => {
		const html = await $fetch('/')
		// The `ping` action only exists when the plugin from the layer's
		// client-options is loaded.
		expect(html).contain('Ping: pong')
		expect(html).contain('User: null')
	})

	it('should load server options provided by the layer', async () => {
		// Only works when the anonymous plugin from the layer's
		// server-options is mounted.
		const data = await $fetch<{ token?: string, user?: { isAnonymous?: boolean } }>(
			'/api/auth/sign-in/anonymous',
			{ method: 'POST', body: {} },
		)
		expect(data.token).toBeTruthy()
		expect(data.user?.isAnonymous).toBe(true)
	})
})
