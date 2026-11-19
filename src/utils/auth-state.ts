import type { Resolver } from '@nuxt/kit'
import type { ModuleOptions } from '../module'
import { addImports } from '@nuxt/kit'

export function addAuthState(
	options: ModuleOptions,
	resolver: Resolver,
): void {
	if (!options.client?.state?.enabled) {
		return
	}

	addImports([
		{
			name: 'useAuthState',
			from: resolver.resolve('./runtime/composables/auth-state'),
		},
		{
			name: 'useGetAuthSession',
			from: resolver.resolve('./runtime/composables/get-auth-session'),
		},
	])
}
