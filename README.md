# nuxt-better-auth

[![npm version](https://img.shields.io/npm/v/nuxt-better-auth?style=flat&colorA=18181B&colorB=F0DB4F)](https://npmjs.com/package/nuxt-better-auth)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-better-auth?style=flat&colorA=18181B&colorB=F0DB4F)](https://npmjs.com/package/nuxt-better-auth)
[![coverage](https://img.shields.io/codecov/c/gh/aa900031/nuxt-better-auth?logo=codecov&style=flat&colorA=18181B&colorB=F0DB4F)](https://codecov.io/gh/aa900031/nuxt-better-auth)
![coderabbit](https://img.shields.io/coderabbit/prs/github/aa900031/nuxt-better-auth?style=flat&logo=coderabbit&logoColor=FF570A&label=CodeRabbit%20Reviews&colorA=18181B&colorB=F0DB4F)

[![npm peer dependency version - better-auth](https://img.shields.io/npm/dependency-version/nuxt-better-auth/peer/better-auth?style=flat&colorA=18181B&colorB=F0DB4F)](https://www.npmjs.com/package/better-auth)

# Features

- Flexable use better-auth
- Type safe

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

> [!TIP]
> When you are using Postgresql as database with Hyperdrive in Cloudflare Worker, you should setup server singleton by request.

```typescript [nuxt.config.ts]
export default defineNuxtConfig({
	modules: ['nuxt-better-auth'],
	// Setup server singleton by request
	betterAuth: {
		server: {
			singleton: 'request',
		},
	},
	// [Optional] Enable async context: https://nitro.build/guide/utils#async-context-experimental
	nitro: {
		experimental: {
			asyncContext: true,
		},
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
export default eventHandler(() => {
	const betterAuth = useBetterAuth()
})
```

If use singleton for request, please put event to `useBetterAuth`, or used asyncContext first then you don't need that anymore.

```typescript
export default eventHandler(async (event) => {
	const betterAuth = useBetterAuth(event)
})
```

## Custom options

Can provide options by file, and with some magic to make it type safe.

### Client options

Create file at nuxt's src dir (default same as root dir), e.g: `better-auth/client-options.ts` or `app/better-auth/client-options.ts` in nuxt 4

```typescript [better-auth/client-options.ts]
import type { ClientOptions } from 'better-auth'
import { anonymousClient } from 'better-auth/client/plugins'

export default () => ({
	plugins: [
		anonymousClient(),
	],
} satisfies ClientOptions)
```

### Server options

Create file at nuxt's server dir (default is `server/`), e.g: `server/better-auth/server-options.ts`

```typescript [server/better-auth/server-options.ts]
import type { BetterAuthOptions } from 'better-auth'
import { anonymous } from 'better-auth/plugins'

export default () => ({
	plugins: [
		anonymous(),
	],
} satisfies BetterAuthOptions)
```

## License

Made with ❤️

Published under the [MIT License](https://github.com/aa900031/nuxt-better-auth/blob/main/LICENSE).
