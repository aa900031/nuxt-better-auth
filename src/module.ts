import type { ModuleOptions as NitroModuleOptions } from 'nitro-better-auth'
import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { addAuthClient } from './utils/auth-client'
import { addAuthSecret } from './utils/auth-secret'
import { addAuthState } from './utils/auth-state'
import { setupRuntimeConfig } from './utils/runtime-config'
import { addServerModule } from './utils/server-module'
import { addServerOptions } from './utils/server-options'
import { addUserConfig } from './utils/user-config'

export interface ModuleOptions {
	client?: {
		options?: {
			path: string
		}
		state?: {
			enabled?: boolean
		}
		/**
		 * Allowlist of request headers forwarded to auth client requests during SSR.
		 * Replaces the default entirely, so include `cookie` when extending it.
		 *
		 * @default ['cookie', 'authorization']
		 */
		forwardHeaders?: string[]
	}
	server?: NitroModuleOptions
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'nuxt-better-auth',
		configKey: 'betterAuth',
	},
	defaults: {
		client: {
			options: {
				path: 'better-auth/client-options',
			},
			state: {
				enabled: true,
			},
			forwardHeaders: [
				'cookie',
				'authorization',
			],
		},
		server: {
			mountPath: '/api/auth',
			options: {
				path: 'better-auth/server-options',
			},
		},
	},
	async setup(options, nuxt) {
		const resolver = createResolver(import.meta.url)

		nuxt.options.alias['nuxt-better-auth/config'] = resolver.resolve('./runtime/config')

		setupRuntimeConfig(nuxt)
		addAuthClient(resolver)
		addUserConfig(options, nuxt)
		addAuthState(options, resolver)
		addServerOptions(options)
		await addAuthSecret(resolver, nuxt)
		await addServerModule(options, nuxt)
	},
})
