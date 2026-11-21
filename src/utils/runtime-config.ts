import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from '../module'
import { useNuxt } from '@nuxt/kit'
import defu from 'defu'
import { env } from 'std-env'
import { isServerEnabled } from './module-options'

export function setupRuntimeConfig(
	options: ModuleOptions,
	nuxt: Nuxt = useNuxt(),
): void {
	nuxt.options.runtimeConfig.public ||= {} as any
	nuxt.options.runtimeConfig.public.siteUrl ||= env.NUXT_PUBLIC_SITE_URL || ''
	nuxt.options.runtimeConfig.public.betterAuth = defu(
		nuxt.options.runtimeConfig.public.betterAuth ?? {},
		{
			baseURL: '',
			basePath: '',
		},
	)

	if (!isServerEnabled(options))
		return

	nuxt.options.runtimeConfig.betterAuth = defu(
		nuxt.options.runtimeConfig.betterAuth ?? {},
		{
			baseURL: '',
			basePath: '',
			secret: '',
		},
	)
}
