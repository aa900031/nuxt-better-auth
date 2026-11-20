export default eventHandler(async (event) => {
	const betterAuth = useBetterAuth(event)
	const foo = await betterAuth.api.foo()
	const ping = await betterAuth.api.ping()
	return {
		foo,
		ping,
	}
})
