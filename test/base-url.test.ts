import { fileURLToPath } from 'node:url'
import { fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('baseURL resolution', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('./fixtures/no-base-url', import.meta.url)),
	})

	it('should fail SSR in production when no baseURL source is configured', async () => {
		const res = await fetch('/')
		expect(res.status).toBe(500)
	})
})
