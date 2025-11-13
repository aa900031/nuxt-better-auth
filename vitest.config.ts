import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		exclude: [
			...defaultExclude,
			'playground/**',
		],
		coverage: {
			enabled: true,
			provider: 'istanbul',
			exclude: [
				...coverageConfigDefaults.exclude,
				'playground/**',
			],
		},
		outputFile: {
			junit: './reports/junit.xml',
		},
	},
})
