import type { ModuleOptions } from '../module'
import { addTemplate } from '@nuxt/kit'
import { genServerOptions } from '../templates/server-options'

const BUILD_FILENAME = 'better-auth/server-options.mjs'

export function addServerOptions(
	options: ModuleOptions,
): void {
	const mountPath = options.server?.mountPath
	const forwardHeaders = options.client?.forwardHeaders

	addTemplate({
		filename: BUILD_FILENAME,
		getContents: () => genServerOptions(mountPath, forwardHeaders),
		write: true,
	})
}
