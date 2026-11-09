// @ts-expect-error the `nuxt/server` subpath only exists on Nuxt >= 4.6, which is the only case where this file is aliased in (see `addAuthSecret` in utils/auth-secret.ts)
import { deriveSecret as _deriveSecret } from 'nuxt/server'

export const deriveSecret: ((purpose: string) => Promise<string>) | undefined = _deriveSecret
