import type { Nuxt } from '@nuxt/schema'
import { genImport } from 'knitwork'
import { dirname, join, relative } from 'pathe'

export function genTypeClientOptions(
	filename: string,
	targetPath: string | undefined,
	nuxt: Nuxt,
): string {
	if (!targetPath) {
		return /* typescript */`
${genImport('better-auth/client', ['createAuthClient'])}

export type AuthClientOptions = {}

export type AuthClientResult = ReturnType<typeof createAuthClient<AuthClientOptions>>

`
	}

	const relativePath = relative(dirname(join(nuxt.options.buildDir, filename)), targetPath)

	return /* typescript */`
${genImport('better-auth/client', ['createAuthClient'])}
${genImport(relativePath, 'ClientOptionsLoader')}

export type AuthClientOptions = ReturnType<typeof ClientOptionsLoader>

export type AuthClientResult = ReturnType<typeof createAuthClient<AuthClientOptions>>

`
}
