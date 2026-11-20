import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'
import { setupOptions } from './setup-options'

describe('use session', async () => {
	await setup(setupOptions('basic'))

	it('should renders with nullable session', async () => {
		// Get response to a server-rendered page with `$fetch`.
		const html = await $fetch('/')
		expect(html).contain('User: null')
		expect(html).contain('Sign In')
	})
})
