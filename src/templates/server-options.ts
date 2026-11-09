import type { ModuleOptions } from '../module'
import { addTemplate } from '@nuxt/kit'

export function addServerOptions(
	options: ModuleOptions,
): void {
	addTemplate({
		filename: 'better-auth/server-options.mjs',
		getContents: () => getContents(options),
		write: true,
	})
}

function getContents(
	options: ModuleOptions,
): string {
	return /* typescript */`
export const mountPath = ${JSON.stringify(options.server.mountPath)}
`
}
