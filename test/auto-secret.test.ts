import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'
import { APP_SECRET } from './fixtures/auto-secret/constants'

// HKDF-SHA256(ikm: APP_SECRET, salt: 'nuxt', info: 'better-auth:secret') as hex.
// Pinned on purpose: a change here silently invalidates every session of
// deployments that rely on the derived secret.
const DERIVED_SECRET = '101e0da458f4f02b78cc8fbf5d8d25eb682f0eca947984b46c6726abc41e081e'

describe('auto secret: derive from NUXT_APP_SECRET', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('./fixtures/auto-secret', import.meta.url)),
		env: {
			NUXT_APP_SECRET: APP_SECRET,
		},
	})

	it('should set BETTER_AUTH_SECRET to the derived value', async () => {
		const data = await $fetch<{ secret: string | null }>('/api/_secret')
		expect(data.secret).toBe(DERIVED_SECRET)
	})

	it('should issue sessions with the derived secret', async () => {
		const data = await $fetch<{ token?: string, user?: { isAnonymous?: boolean } }>(
			'/api/auth/sign-in/anonymous',
			{ method: 'POST', body: {} },
		)
		expect(data.token).toBeTruthy()
		expect(data.user?.isAnonymous).toBe(true)
	})
})
