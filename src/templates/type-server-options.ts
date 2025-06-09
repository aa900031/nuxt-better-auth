import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from '../module'
import { dirname, join, relative } from 'pathe'
import { resolveServerFilePath } from '../utils/user-config'

export async function genTypeServerOptions(
	filename: string,
	options: ModuleOptions,
	nuxt: Nuxt,
): Promise<string> {
	const targetPath = await resolveServerFilePath(options.server.options!.path, nuxt)
	if (!targetPath)
		return /* typescript */``

	const relativePath = relative(dirname(join(nuxt.options.buildDir, filename)), targetPath)

	return /* typescript */`
import { betterAuth } from 'better-auth'
import ServerOptionsLoader from '${relativePath}'

type RawOptions = ReturnType<typeof ServerOptionsLoader>

export type BetterAuthResult = ReturnType<typeof betterAuth<RawOptions>>

`
}
