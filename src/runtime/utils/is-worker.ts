import { provider } from 'std-env'

export function isWorker() {
	switch (provider) {
		case 'cloudflare_pages':
		case 'cloudflare_workers':
			return true
		default:
			return false
	}
}
