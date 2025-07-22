import type { ModuleOptions as NitroModuleOptions } from 'nitro-better-auth'
import { addImports, addPlugin, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import defu from 'defu'
import { genTypeClientOptions } from './templates/type-client-options'
import { addUserConfig } from './utils/user-config'

export interface ModuleOptions {
	client: {
		options?: {
			path: string
		}
		state?: {
			enabled?: boolean
		}
	}
	server: NitroModuleOptions
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
		},
		server: {
			singleton: 'app',
			options: {
				path: 'better-auth/server-options',
			},
			handlerPath: '/api/auth/**',
		},
	},
	setup(options, nuxt) {
		const resolver = createResolver(import.meta.url)

		addImports([
			{
				name: 'useAuthClient',
				from: resolver.resolve('./runtime/composables/auth-client'),
			},
		])
		addPlugin(
			resolver.resolve('./runtime/plugins/auth-client'),
		)
		addUserConfig({
			src: options.client.options!.path,
			build: 'better-auth/client-options.mjs',
		}, nuxt)
		addTypeTemplate({
			filename: 'types/better-auth/client-options.d.ts',
			getContents: () =>
				genTypeClientOptions('types/better-auth/client-options.d.ts', options, nuxt),
			write: true,
		}, {
			nuxt: true,
		})

		if (options.client.state!.enabled) {
			addImports([
				{
					name: 'useAuthState',
					from: resolver.resolve('./runtime/composables/auth-state'),
				},
			])
			addPlugin(
				resolver.resolve('./runtime/plugins/auth-state.client'),
			)
			addPlugin(
				resolver.resolve('./runtime/plugins/auth-state.server'),
			)
		}

		nuxt.hooks.hook('nitro:config', (config) => {
			config.modules ??= []
			config.modules?.push('nitro-better-auth')
			config.betterAuth = defu({}, options.server)
		})
	},
})
