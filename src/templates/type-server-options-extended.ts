import type { Nuxt } from '@nuxt/schema'
import { genImport } from 'knitwork'
import { dirname, join } from 'pathe'
import { relativeWithDot } from './paths'
import { genPluginEntries, genPluginImports } from './plugins'

export function genTypeServerOptionsExtended(
	filename: string,
	filepath: string | undefined,
	plugins: string[],
	nuxt: Nuxt,
): string {
	const outputDir = dirname(join(nuxt.options.buildDir, filename))

	const loaderImport = filepath
		? genImport(relativeWithDot(outputDir, filepath), '_loader')
		: 'declare const _loader: (..._args: unknown[]) => {}'

	return /* typescript */`
${loaderImport}
${genPluginImports(plugins, path => relativeWithDot(outputDir, path))}

type _Options = NonNullable<ReturnType<typeof _loader>>
type _Plugins = _Options extends { plugins: infer P extends readonly unknown[] } ? P : []

declare const _default: (...args: Parameters<typeof _loader>) => Omit<_Options, 'plugins'> & {
	plugins: [..._Plugins${genPluginEntries(plugins, name => `typeof ${name}`)}]
}

export default _default
`
}
