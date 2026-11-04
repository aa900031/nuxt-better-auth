import type { BetterAuthClientOptions } from 'better-auth'

export { defineAuthOptions as defineAuthServerOptions } from 'nitro-better-auth/config'
export type { AuthOptionsFactory as AuthServerOptionsFactory, ServerOptionsContext } from 'nitro-better-auth/config'

export interface ClientOptionsContext {
	/** The resolved auth base URL: the site origin, joined with `app.baseURL` and `mountPath` when they differ from better-auth's defaults. */
	baseURL: string
}

export type AuthClientOptionsFactory<
	T extends BetterAuthClientOptions | undefined = BetterAuthClientOptions | undefined,
> = (context: ClientOptionsContext) => T

export function defineAuthClientOptions<
	const T extends BetterAuthClientOptions | undefined,
>(
	factory: AuthClientOptionsFactory<T>,
): typeof factory {
	return factory
}
