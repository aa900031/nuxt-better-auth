import type { LayerDirectories } from '@nuxt/kit'
import type { ModuleOptions } from '../module'
import { findPath, getLayerDirectories, useNuxt } from '@nuxt/kit'
import { isAbsolute } from 'pathe'

export interface PluginSources {
	server: string[]
	client: string[]
}

export function resolvePlugins(
	nuxt = useNuxt(),
): Promise<PluginSources> {
	return new Promise((resolve) => {
		nuxt.hook('modules:done', async () => {
			const pluginsFromOptions = await resolveOptionPlugins(nuxt)
			const pluginsFromHook = await resolveHookPlugins(nuxt)
			const registered: PluginSources = {
				client: [
					...pluginsFromOptions.client,
					...pluginsFromHook.client,
				],
				server: [
					...pluginsFromOptions.server,
					...pluginsFromHook.server,
				],
			}
			resolve(registered)
		})
	})
}

async function resolveHookPlugins(
	nuxt = useNuxt(),
): Promise<PluginSources> {
	const registered: PluginSources = {
		server: [],
		client: [],
	}

	await nuxt.callHook('better-auth:plugins:extend', registered)

	return {
		server: await resolveSourcesFromHook(registered.server),
		client: await resolveSourcesFromHook(registered.client),
	}
}

async function resolveOptionPlugins(
	nuxt = useNuxt(),
): Promise<PluginSources> {
	const resolved: PluginSources = {
		server: [],
		client: [],
	}

	const directories = getLayerDirectories(nuxt)
	for (let i = 0; i < directories.length; i++) {
		const directory = directories[i]
		const options = nuxt.options._layers[i]?.config.betterAuth as ModuleOptions | undefined
		if (!directory || !options)
			continue
		resolved.server.push(...await resolveSourcesFromOptions(options.server?.plugins ?? [], directory))
		resolved.client.push(...await resolveSourcesFromOptions(options.client?.plugins ?? [], directory))
	}
	return resolved
}

async function resolveSourcesFromHook(
	sources: string[],
): Promise<string[]> {
	const result: string[] = []
	for (const source of sources) {
		assertSourceIsString(source, '`better-auth:plugins:extend`')
		if (!isAbsolute(source))
			throw new Error(`[nuxt-better-auth] Plugin source from \`better-auth:plugins:extend\` must be an absolute path: ${source}`)

		const absolutePath = await findPath(source)
		if (absolutePath == null)
			throw new Error(`[nuxt-better-auth] Cannot resolve plugin source \`${source}\` from \`better-auth:plugins:extend\`.`)

		result.push(absolutePath)
	}
	return result
}

async function resolveSourcesFromOptions(
	sources: string[],
	directory: LayerDirectories,
): Promise<string[]> {
	const result: string[] = []
	for (const source of sources) {
		assertSourceIsString(source, `\`plugins\` in \`${directory.root}\``)
		const absolutePath = await findPath(source, { cwd: directory.root })
		if (absolutePath == null)
			throw new Error(`[nuxt-better-auth] Cannot resolve plugin source \`${source}\` from \`${directory.root}\`.`)

		result.push(absolutePath)
	}
	return result
}

function assertSourceIsString(
	source: unknown,
	from: string,
): asserts source is string {
	if (typeof source !== 'string')
		throw new TypeError(`[nuxt-better-auth] Plugin source from ${from} must be a string, got ${typeof source}.`)
}
