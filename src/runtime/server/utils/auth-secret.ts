import type { NitroRuntimeConfig } from 'nitropack/types'
import process from 'node:process'
import { useRuntimeConfig } from 'nitropack/runtime'
import { env } from 'std-env'
import { deriveSecret } from '#nuxt-better-auth/app-secret'

const PURPOSE = 'better-auth:secret'

export async function deriveAuthSecret(): Promise<void> {
	const runtimeConfig = useRuntimeConfig()

	if (deriveSecret == null || !canDeriveAuthSecret() || hasExplicitAuthSecret(runtimeConfig))
		return

	try {
		const secret = await deriveSecret(PURPOSE)
		process.env.BETTER_AUTH_SECRET = secret
	}
	catch (error) {
		console.warn('[nuxt-better-auth] Could not derive the better-auth secret from NUXT_APP_SECRET. Set NUXT_APP_SECRET (at least 32 characters), or set the secret explicitly with NUXT_BETTER_AUTH_SECRET or BETTER_AUTH_SECRET.', error)
	}
}

function getConfiguredSecretFromRuntime(runtimeConfig: NitroRuntimeConfig): string | undefined {
	const value = runtimeConfig.betterAuth?.secret
	if (typeof value === 'string' && value)
		return value
}

function hasExplicitAuthSecret(runtimeConfig: NitroRuntimeConfig): boolean {
	return !!(
		getConfiguredSecretFromRuntime(runtimeConfig)
		|| env.BETTER_AUTH_SECRET
		|| env.BETTER_AUTH_SECRETS
		|| env.AUTH_SECRET
	)
}

function canDeriveAuthSecret(): boolean {
	if (!deriveSecret)
		return false
	return !(import.meta.dev && env.NUXT_APP_SECRET_GENERATED === '1')
}
