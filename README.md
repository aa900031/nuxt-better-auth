# nuxt-better-auth

[![npm version](https://img.shields.io/npm/v/nuxt-better-auth?style=flat&colorA=18181B&colorB=F0DB4F)](https://npmjs.com/package/nuxt-better-auth)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-better-auth?style=flat&colorA=18181B&colorB=F0DB4F)](https://npmjs.com/package/nuxt-better-auth)
[![coverage](https://img.shields.io/codecov/c/gh/aa900031/nuxt-better-auth?logo=codecov&style=flat&colorA=18181B&colorB=F0DB4F)](https://codecov.io/gh/aa900031/nuxt-better-auth)
![coderabbit](https://img.shields.io/coderabbit/prs/github/aa900031/nuxt-better-auth?style=flat&logo=coderabbit&logoColor=FF570A&label=CodeRabbit%20Reviews&colorA=18181B&colorB=F0DB4F)

[![npm peer dependency version - better-auth](https://img.shields.io/npm/dependency-version/nuxt-better-auth/peer/better-auth?style=flat&colorA=18181B&colorB=F0DB4F)](https://www.npmjs.com/package/better-auth)
[![npm peer dependency version - @nuxt/kit](https://img.shields.io/npm/dependency-version/nuxt-better-auth/peer/%40nuxt%2Fkit?style=flat&colorA=18181B&colorB=F0DB4F)](https://www.npmjs.com/package/@nuxt/kit)

## Features

- Flexable use better-auth
- Type safe
- [Nuxt Layers](https://nuxt.com/docs/getting-started/layers) support

## Installation

Add dependencies to your project

```bash [pnpm]
pnpm add nuxt-better-auth better-auth
```

```bash [npm]
npm install nuxt-better-auth better-auth
```

Add module in your `nuxt.config.ts`

```typescript [nuxt.config.ts]
export default defineNuxtConfig({
	modules: ['nuxt-better-auth'],
	betterAuth: {
		// [Optional]
	},
})
```

## Usage

Create sign in / sign out button with useAuthClient

```vue
<script setup lang="ts">
const authClient = useAuthClient()

async function handleSignInClick() {
	await authClient.signIn.anonymous()
}
</script>

<template>
	<button @click="handleSignInClick">
		Sign In
	</button>
</template>
```

Get reactive user / session data with useAuthState

```vue
<script setup lang="ts">
const { session, user } = useAuthState()
</script>

<template>
	User: {{ user }}
	Session: {{ session }}
</template>
```

Get better-auth instance (in server)

```typescript
export default eventHandler((event) => {
	const betterAuth = useBetterAuth(event)
})
```

Instances are created lazily and cached per resolved baseURL, so pass the event inside request handlers to resolve against the request's URL. If you enable [async context](https://nuxt.com/docs/api/nuxt-config#asynccontext), the event is picked up automatically and you can call `useBetterAuth()` without it.

```typescript [nuxt.config.ts]
export default defineNuxtConfig({
	experimental: {
		asyncContext: true,
	},
})
```

## Custom options

Can provide options by file, and use the helpers from `nuxt-better-auth/config` to make it type safe.

### Client options

Create file at nuxt's src dir (default same as root dir), e.g: `better-auth/client-options.ts` or `app/better-auth/client-options.ts` in nuxt 4

```typescript [better-auth/client-options.ts]
import { anonymousClient } from 'better-auth/client/plugins'
import { defineAuthClientOptions } from 'nuxt-better-auth/config'

export default defineAuthClientOptions(() => ({
	plugins: [
		anonymousClient(),
	],
}))
```

The factory receives a context with the resolved `baseURL`:

```typescript [better-auth/client-options.ts]
import { defineAuthClientOptions } from 'nuxt-better-auth/config'

export default defineAuthClientOptions(({ baseURL }) => ({
	// ...
}))
```

### Forwarded headers (SSR)

During SSR, the auth client forwards an allowlist of incoming request headers to auth requests. The default is `['cookie', 'authorization']`, covering cookie sessions and the bearer plugin. Configure it via the module option (the list replaces the default entirely, so include `cookie` when extending it):

```typescript [nuxt.config.ts]
export default defineNuxtConfig({
	betterAuth: {
		client: {
			forwardHeaders: ['cookie', 'authorization', 'x-api-key'],
		},
	},
})
```

### Server options

Create file at nuxt's server dir (default is `server/`), e.g: `server/better-auth/server-options.ts`

```typescript [server/better-auth/server-options.ts]
import { anonymous } from 'better-auth/plugins'
import { defineAuthServerOptions } from 'nuxt-better-auth/config'

export default defineAuthServerOptions(() => ({
	plugins: [
		anonymous(),
	],
}))
```

The factory receives a context with the resolved `basePath` and `baseURL`:

```typescript [server/better-auth/server-options.ts]
import { defineAuthServerOptions } from 'nuxt-better-auth/config'

export default defineAuthServerOptions(({ basePath, baseURL }) => ({
	// ...
}))
```

## Nuxt Layers

Enable the module once in a base [layer](https://nuxt.com/docs/getting-started/layers), and every app extending it gets the whole auth setup:

```typescript [my-layer/nuxt.config.ts]
export default defineNuxtConfig({
	modules: ['nuxt-better-auth'],
})
```

```typescript [nuxt.config.ts]
export default defineNuxtConfig({
	extends: ['./my-layer'],
})
```

The options files are resolved across layers: each layer is searched in priority order — the project first, then extended layers — and the first file found wins.

- Client options: `better-auth/client-options` relative to each layer's src dir
- Server options: `better-auth/server-options` relative to each layer's server dir

So a layer can ship default options (plugins, database adapter, …), and an app overrides them by creating its own file at the same path. Files are not merged — only the one from the highest-priority layer is loaded.

## License

Made with ❤️

Published under the [MIT License](https://github.com/aa900031/nuxt-better-auth/blob/main/LICENSE).
