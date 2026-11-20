import type { ModuleOptions } from '../module'
import { addTemplate } from '@nuxt/kit'
import { genModuleOptions } from '../templates/module-options'

const BUILD_FILENAME = 'better-auth/module-options.mjs'

export function addModuleOptions(
	options: ModuleOptions,
): void {
	const hasServer = isServerEnabled(options)
	const mountPath = hasServer ? options.server?.mountPath : undefined
	const forwardHeaders = options.client?.forwardHeaders
		?? (hasServer ? ['cookie', 'authorization'] : [])

	addTemplate({
		filename: BUILD_FILENAME,
		getContents: () =>
			genModuleOptions(hasServer, mountPath, forwardHeaders),
		write: true,
		dependsOn: [],
	})
}

export function isServerEnabled(
	options: ModuleOptions,
): options is ModuleOptions & { server?: Exclude<ModuleOptions['server'], false> } {
	return options.server !== false
}
