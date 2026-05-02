// @ts-nocheck
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('tweaks store - SSR branches', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.resetModules();
	});

	it('skips localStorage when window is undefined during init', async () => {
		const origWindow = globalThis.window;
		const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

		try {
			Object.defineProperty(globalThis, 'window', {
				value: undefined,
				writable: true,
				configurable: true,
			});

			const { tweaks } = await import('$lib/stores/tweaks');
			const val = get(tweaks);
			expect(val.theme).toBe('light');
			expect(val.artStyle).toBe('grooves');
			expect(getItemSpy).not.toHaveBeenCalled();
		} finally {
			globalThis.window = origWindow;
		}
	});

	it('skips localStorage.setItem when window is undefined during set()', async () => {
		const origWindow = globalThis.window;
		const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
		try {
			Object.defineProperty(globalThis, 'window', {
				value: undefined,
				writable: true,
				configurable: true,
			});

			const { tweaks } = await import('$lib/stores/tweaks');
			tweaks.set('theme', 'dark');
			expect(get(tweaks).theme).toBe('dark');
			expect(setItemSpy).not.toHaveBeenCalled();
		} finally {
			globalThis.window = origWindow;
		}
	});
});
