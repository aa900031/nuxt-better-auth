import { addImports, addPlugin, addServerHandler, addServerImports, addServerPlugin, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { genTypeClientOptions } from './templates/type-client-options'
import { genTypeServerOptions } from './templates/type-server-options'
import { addServerUserConfig, addUserConfig } from './utils/user-config'

export interface ModuleOptions {
	client: {
		options: {
			path: string
		}
		state: {
			enabled: boolean
		}
	}
	server: {
		handlerPath: string
		options: {
			path: string
		}
	}
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
			src: options.client.options.path,
			build: 'better-auth/client-options.mjs',
		}, nuxt)
		addTypeTemplate({
			filename: 'types/better-auth/client-options.d.ts',
			getContents: () =>
				genTypeClientOptions('types/better-auth/client-options.d.ts', options, nuxt),
		}, {
			nuxt: true,
		})

		if (options.client.state.enabled) {
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

		addServerPlugin(
			resolver.resolve('./runtime/server/plugins/auth'),
		)
		addServerImports([
			{
				name: 'useBetterAuth',
				from: resolver.resolve('./runtime/server/utils/better-auth'),
			},
		])
		addServerHandler({
			route: options.server.handlerPath,
			handler: resolver.resolve('./runtime/server/api/auth'),
		})
		addServerUserConfig({
			src: options.server.options.path,
			internal: '#better-auth/server-options.mjs',
		}, nuxt)
		addTypeTemplate({
			filename: 'types/better-auth/server-options.d.ts',
			getContents: () =>
				genTypeServerOptions('types/better-auth/server-options.d.ts', options, nuxt),
		}, {
			nitro: true,
		})
	},
})
