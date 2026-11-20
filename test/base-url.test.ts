import { fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'
import { setupOptions } from './setup-options'

describe('baseURL resolution', async () => {
	await setup(setupOptions('no-base-url'))

	it('should fail SSR in production when no baseURL source is configured', async () => {
		const res = await fetch('/')
		expect(res.status).toBe(500)
	})
})
