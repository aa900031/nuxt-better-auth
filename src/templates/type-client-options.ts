import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from '../module'
import { genImport } from 'knitwork'
import { dirname, join, relative } from 'pathe'
import { resolveFilePath } from '../utils/user-config'

export async function genTypeClientOptions(
	filename: string,
	options: ModuleOptions,
	nuxt: Nuxt,
): Promise<string> {
	const targetPath = await resolveFilePath(options.client.options.path, nuxt)
	if (!targetPath)
		return /* typescript */``

	const relativePath = relative(dirname(join(nuxt.options.buildDir, filename)), targetPath)

	return /* typescript */`
${genImport('better-auth/client', ['createAuthClient'])}
${genImport(relativePath, 'ClientOptionsLoader')}

type RawOptions = ReturnType<typeof ClientOptionsLoader>

export type AuthClientResult = ReturnType<typeof createAuthClient<RawOptions>>

`
}
