import type { Resolver } from '@nuxt/kit'
import { addImports, addPlugin } from '@nuxt/kit'

export function addAuthClient(
	resolver: Resolver,
): void {
	addImports([
		{
			name: 'useAuthClient',
			from: resolver.resolve('./runtime/composables/auth-client'),
		},
	])
	addPlugin(
		resolver.resolve('./runtime/plugins/auth-client'),
	)
}
