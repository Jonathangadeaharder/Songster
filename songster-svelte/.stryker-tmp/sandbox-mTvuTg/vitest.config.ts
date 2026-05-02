// @ts-nocheck
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		conditions: ['browser'],
		alias: {
			'$app/environment': path.resolve('./src/test-mocks/app-environment.ts'),
			'$app/state': path.resolve('./src/test-mocks/app-state.ts'),
			'$app/navigation': path.resolve('./src/test-mocks/app-navigation.ts'),
			'$app/stores': path.resolve('./src/test-mocks/app-stores.ts'),
		},
	},
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'jsdom',
		globals: true,
		setupFiles: ['src/test-setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'clover'],
			include: [
				'src/lib/stores/game.ts',
				'src/lib/stores/tweaks.ts',
				'src/lib/audio.ts',
				'src/lib/songs.ts',
				'src/lib/utils.ts',
				'src/lib/provider/deezer.ts',
				'src/lib/room.ts',
			],
			thresholds: {
				statements: 90,
				branches: 80,
				functions: 90,
				lines: 90,
			},
		},
	},
	ssr: {
		noExternal: ['svelte', '@sveltejs/kit', '@testing-library/svelte'],
	},
});
