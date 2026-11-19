import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('nuxt layer', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('./fixtures/layer', import.meta.url)),
		// Overrides never appear in `_layers`, like inline module options or
		// `moduleDependencies`, so this source is not declared by any layer.
		nuxtConfig: {
			betterAuth: {
				server: {
					plugins: [fileURLToPath(new URL('./fixtures/layer/server/better-auth/baz-plugin', import.meta.url))],
				},
			},
		},
	})

	it('should render with client options provided by the layer', async () => {
		const html = await $fetch('/')
		// The `ping` action only exists when the plugin from the layer's
		// client-options is loaded.
		expect(html).contain('Ping: pong')
		expect(html).contain('User: null')
	})

	it('should load client plugins from layer options and the hook', async () => {
		// `foo` comes from the base layer's `client.plugins`, `bar` from
		// `better-auth:plugins:extend`.
		const html = await $fetch('/')
		expect(html).contain('Foo: bar')
		expect(html).contain('Bar: baz')
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

	it('should mount server plugins from layer options, app options, non-layer options and the hook', async () => {
		// `/ping` comes from the base layer's `server.plugins`, `/foo` from the
		// app's `server.plugins`, `/baz` from the override above, `/bar` from
		// `better-auth:plugins:extend`.
		expect(await $fetch<string>('/api/auth/ping')).toBe('pong')
		expect(await $fetch<string>('/api/auth/foo')).toBe('bar')
		expect(await $fetch<string>('/api/auth/baz')).toBe('qux')
		expect(await $fetch<string>('/api/auth/bar')).toBe('baz')
	})
})
