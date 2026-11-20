import type { NitroRuntimeConfig } from 'nitropack/types'
import process from 'node:process'
import { useRuntimeConfig } from 'nitropack/runtime'
import { env } from 'std-env'
import { deriveSecret } from '#nuxt-better-auth/app-secret'
import { diagnostics } from '../diagnostics'

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
		diagnostics.NUXT_BETTER_AUTH_R2001({ cause: error })
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
