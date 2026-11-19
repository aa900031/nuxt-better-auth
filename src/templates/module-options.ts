import { genArrayFromRaw, genString } from 'knitwork'

export function genModuleOptions(
	mountPath: string | undefined,
	forwardHeaders: string[] | undefined,
): string {
	return /* typescript */`
export const mountPath = ${mountPath ? genString(mountPath) : undefined}
export const forwardHeaders = ${forwardHeaders ? genArrayFromRaw(forwardHeaders, undefined, { preserveTypes: true }) : undefined}
`
}
