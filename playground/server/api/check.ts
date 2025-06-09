export default eventHandler(async (event) => {
	const betterAuth = useBetterAuth()
	const session = await betterAuth.api.getSession({
		headers: event.headers,
	})
	return {
		data: session?.user ?? null,
	}
})
