import { fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'
import { setupOptions } from './setup-options'

describe('server: false', async () => {
	await setup(setupOptions('client-only'))

	it('should render without fetching the session on the server', async () => {
		// `useAsyncData` captures a failed SSR fetch into `error` instead of failing the render,
		// and a hydrated error stops the client from fetching the session again.
		const res = await fetch('/')
		expect(res.status).toBe(200)
		const html = await res.text()
		expect(html).contain('User: null')
		expect(html).not.contain('Session error')
	})

	it('should not mount the better-auth server', async () => {
		// Without the better-auth handler, the request falls through to the Nuxt renderer.
		const res = await fetch('/api/auth/get-session')
		expect(res.headers.get('content-type')).contain('text/html')
	})
})
