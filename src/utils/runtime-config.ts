import type { Nuxt } from '@nuxt/schema'
import { useNuxt } from '@nuxt/kit'
import defu from 'defu'
import { env } from 'std-env'

export function setupRuntimeConfig(
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

	nuxt.options.runtimeConfig.betterAuth = defu(
		nuxt.options.runtimeConfig.betterAuth ?? {},
		{
			baseURL: '',
			basePath: '',
			secret: '',
		},
	)
}
