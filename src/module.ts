import type { HookResult } from '@nuxt/schema'
import type { ModuleOptions as NitroModuleOptions } from 'nitro-better-auth'
import type { PluginSources } from './utils/plugins'
import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { addAuthClient } from './utils/auth-client'
import { addAuthSecret } from './utils/auth-secret'
import { addAuthState } from './utils/auth-state'
import { addModuleOptions } from './utils/module-options'
import { resolvePlugins } from './utils/plugins'
import { setupRuntimeConfig } from './utils/runtime-config'
import { addServerModule } from './utils/server-module'
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
		plugins?: string[]
	}
	server?:
		& NitroModuleOptions
		& {
			plugins?: string[]
		}
}

export type { PluginSources }

declare module '@nuxt/schema' {
	interface NuxtHooks {
		'better-auth:plugins:extend': (
			plugins: PluginSources,
		) => HookResult
	}
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'nuxt-better-auth',
		configKey: 'betterAuth',
		compatibility: {
			nuxt: '^3.19.3 || ^4.1.0',
		},
	},
	defaults: {
		client: {
			options: {
				path: 'better-auth/client-options',
			},
			state: {
				enabled: true,
			},
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
		const plugins = resolvePlugins(options, nuxt)

		nuxt.options.alias['nuxt-better-auth/config'] = resolver.resolve('./runtime/config')

		setupRuntimeConfig(nuxt)
		addModuleOptions(options)

		addAuthClient(resolver)
		addAuthState(options, resolver)

		await addAuthSecret(resolver, nuxt)
		addUserConfig(options, plugins, nuxt)
		addServerModule(options, plugins, nuxt)
	},
})
