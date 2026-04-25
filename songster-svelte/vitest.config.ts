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
	},
	ssr: {
		noExternal: ['svelte', '@sveltejs/kit', '@testing-library/svelte'],
	},
});
