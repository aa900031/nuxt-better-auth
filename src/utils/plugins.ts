import type { ModuleOptions } from '../module'
import { findPath, getLayerDirectories, useNuxt } from '@nuxt/kit'
import { isAbsolute } from 'pathe'
import { diagnostics } from '../diagnostics'
import { isServerEnabled } from './module-options'

export interface PluginSources {
	server: string[]
	client: string[]
}

export function resolvePlugins(
	options: ModuleOptions,
	nuxt = useNuxt(),
): Promise<PluginSources> {
	return new Promise((resolve) => {
		nuxt.hook('modules:done', async () => {
			const pluginsFromOptions = await resolveOptionPlugins(options, nuxt)
			const pluginsFromHook = await resolveHookPlugins(options, nuxt)
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
	options: ModuleOptions,
	nuxt = useNuxt(),
): Promise<PluginSources> {
	const serverEnabled = isServerEnabled(options)
	const registered: PluginSources = {
		server: [],
		client: [],
	}

	await nuxt.callHook('better-auth:plugins:extend', registered)

	return {
		server: serverEnabled
			? await resolveAbsoluteSources(registered.server, '`plugins.server` from `better-auth:plugins:extend`')
			: [],
		client: await resolveAbsoluteSources(registered.client, '`plugins.client` from `better-auth:plugins:extend`'),
	}
}

async function resolveOptionPlugins(
	options: ModuleOptions,
	nuxt = useNuxt(),
): Promise<PluginSources> {
	const serverEnabled = isServerEnabled(options)
	const resolved: PluginSources = {
		server: [],
		client: [],
	}
	const undeclared: PluginSources = {
		server: [...serverEnabled ? options.server?.plugins ?? [] : []],
		client: [...options.client?.plugins ?? []],
	}

	for (const [index, directory] of getLayerDirectories(nuxt).entries()) {
		const layerOptions = nuxt.options._layers[index]?.config.betterAuth as ModuleOptions | undefined
		if (!layerOptions)
			continue
		const server = serverEnabled && isServerEnabled(layerOptions)
			? layerOptions.server?.plugins ?? []
			: []
		const client = layerOptions.client?.plugins ?? []
		resolved.server.push(...await resolveLayerSources(server, `\`server.plugins\` in \`${directory.root}\``, directory.server))
		resolved.client.push(...await resolveLayerSources(client, `\`client.plugins\` in \`${directory.root}\``, directory.app))
		removeDeclared(undeclared.server, server)
		removeDeclared(undeclared.client, client)
	}

	resolved.server.push(...await resolveAbsoluteSources(undeclared.server, '`server.plugins` not declared in any layer config'))
	resolved.client.push(...await resolveAbsoluteSources(undeclared.client, '`client.plugins` not declared in any layer config'))
	return resolved
}

function removeDeclared(
	merged: string[],
	declared: string[],
): void {
	for (const source of declared) {
		const index = merged.indexOf(source)
		if (index !== -1)
			merged.splice(index, 1)
	}
}

async function resolveAbsoluteSources(
	sources: string[],
	from: string,
): Promise<string[]> {
	const result: string[] = []
	for (const source of sources) {
		assertSourceIsString(source, from)
		if (!isAbsolute(source))
			throw diagnostics.NUXT_BETTER_AUTH_C0003({ from, source })

		const absolutePath = await findPath(source)
		if (absolutePath == null)
			throw diagnostics.NUXT_BETTER_AUTH_C0004({ from, source })

		result.push(absolutePath)
	}
	return result
}

async function resolveLayerSources(
	sources: string[],
	from: string,
	cwd: string,
): Promise<string[]> {
	const result: string[] = []
	for (const source of sources) {
		assertSourceIsString(source, from)
		const absolutePath = await findPath(source, { cwd })
		if (absolutePath == null)
			throw diagnostics.NUXT_BETTER_AUTH_C0004({ from, source })

		result.push(absolutePath)
	}
	return result
}

function assertSourceIsString(
	source: unknown,
	from: string,
): asserts source is string {
	if (typeof source !== 'string')
		throw diagnostics.NUXT_BETTER_AUTH_C0002({ from, type: typeof source })
}
