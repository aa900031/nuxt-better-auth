export function genServerOptions(
	mountPath: string | undefined,
	forwardHeaders: string[] | undefined,
): string {
	return /* typescript */`
export const mountPath = ${mountPath ? JSON.stringify(mountPath) : undefined}
export const forwardHeaders = ${forwardHeaders ? JSON.stringify(forwardHeaders) : undefined}
`
}
