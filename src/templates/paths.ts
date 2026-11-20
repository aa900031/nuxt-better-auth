import { relative } from 'pathe'
import { isRelative } from 'ufo'

export function relativeWithDot(from: string, to: string): string {
	const path = relative(from, to)
	return isRelative(path) ? path : `./${path}`
}
