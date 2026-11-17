// Test-only endpoint: exposes the resolved secret so the suite can pin the derivation.
import process from 'node:process'

export default eventHandler(() => ({
	secret: process.env.BETTER_AUTH_SECRET ?? null,
}))
