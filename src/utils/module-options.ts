import type { ModuleOptions } from '../module'
import { addTemplate } from '@nuxt/kit'
import { genModuleOptions } from '../templates/module-options'

const BUILD_FILENAME = 'better-auth/module-options.mjs'

export function addModuleOptions(
	options: ModuleOptions,
): void {
	const mountPath = options.server?.mountPath
	const forwardHeaders = options.client?.forwardHeaders ?? ['cookie', 'authorization']

	addTemplate({
		filename: BUILD_FILENAME,
		getContents: () => genModuleOptions(mountPath, forwardHeaders),
		write: true,
		dependsOn: [],
	})
}
