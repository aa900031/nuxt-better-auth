import { useEvent, useNitroApp } from '#imports'
import { isWorker } from '../../utils/is-worker'

export function useBetterAuth() {
	if (isWorker()) {
		const event = useEvent()
		if (event.context.betterAuth == null)
			throw new Error('No better auth provide from context')
		return event.context.betterAuth
	}
	else {
		const nitroApp = useNitroApp()
		if (nitroApp._betterAuth == null)
			throw new Error('No better auth provide from context')

		return nitroApp._betterAuth
	}
}
