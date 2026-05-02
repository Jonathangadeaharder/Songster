// @ts-nocheck
import { defineConfig } from '@stryker-mutator/core';

export default defineConfig({
	packageManager: 'pnpm',
	plugins: ['@stryker-mutator/vitest-runner'],
	testRunner: 'vitest',
	vitest: {
		configFile: 'vitest.config.ts',
	},
	coverageAnalysis: 'perTest',
	mutate: [
		'src/lib/stores/game.ts',
		'src/lib/songs.ts',
		'src/lib/audio.ts',
		'src/lib/utils.ts',
		'src/lib/stores/tweaks.ts',
	],
	reporters: ['progress', 'clear-text', 'html'],
	dryRunTimeoutMinutes: 10,
	thresholds: {
		high: 80,
		low: 60,
		break: 60,
	},
	timeoutMS: 120000,
	concurrency: 2,
});
