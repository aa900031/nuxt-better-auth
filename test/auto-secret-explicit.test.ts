import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'
import { APP_SECRET, EXPLICIT_SECRET } from './fixtures/auto-secret/constants'
import { setupOptions } from './setup-options'

describe('auto secret: explicit secret has priority', async () => {
	await setup(setupOptions('auto-secret', {
		env: {
			NUXT_APP_SECRET: APP_SECRET,
			BETTER_AUTH_SECRET: EXPLICIT_SECRET,
		},
	}))

	it('should not overwrite an explicit BETTER_AUTH_SECRET', async () => {
		const data = await $fetch<{ secret: string | null }>('/api/_secret')
		expect(data.secret).toBe(EXPLICIT_SECRET)
	})
})
