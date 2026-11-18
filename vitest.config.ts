import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		exclude: [
			...defaultExclude,
			'playground/**',
		],
		coverage: {
			provider: 'istanbul',
			reportsDirectory: './.vitest/coverage',
			exclude: [
				...coverageConfigDefaults.exclude,
				'playground/**',
			],
		},
	},
})
