export default eventHandler({
	onRequest: [
		AuthenticateMiddleware,
	],
	handler: async (event) => {
		const { user } = event.context.auth!
		return {
			data: user ?? null,
		}
	},
})
