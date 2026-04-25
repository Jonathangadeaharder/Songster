import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

describe('tweaks store', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.resetModules();
	});

	it('exports default values', async () => {
		const { tweaks } = await import('$lib/stores/tweaks');
		const val = get(tweaks);
		expect(val.theme).toBe('light');
		expect(val.artStyle).toBe('grooves');
		expect(val.flipStyle).toBe('flip');
		expect(val.density).toBe('regular');
		expect(val.animIntensity).toBe(1);
		expect(val.interceptionEnabled).toBe(true);
	});

	it('set() updates a single key', async () => {
		const { tweaks } = await import('$lib/stores/tweaks');
		tweaks.set('theme', 'dark');
		expect(get(tweaks).theme).toBe('dark');
		expect(get(tweaks).artStyle).toBe('grooves');
	});

	it('set() persists to localStorage', async () => {
		const { tweaks } = await import('$lib/stores/tweaks');
		tweaks.set('density', 'comfy');
		const raw = localStorage.getItem('songster.tweaks');
		expect(raw).toBeTruthy();
		const parsed = JSON.parse(raw!);
		expect(parsed.density).toBe('comfy');
	});

	it('loads persisted values on initialization', async () => {
		localStorage.setItem('songster.tweaks', JSON.stringify({
			theme: 'dark',
			animIntensity: 2.0,
		}));
		const { tweaks } = await import('$lib/stores/tweaks');
		const val = get(tweaks);
		expect(val.theme).toBe('dark');
		expect(val.animIntensity).toBe(2.0);
		expect(val.artStyle).toBe('grooves');
	});

	it('handles corrupted localStorage gracefully', async () => {
		localStorage.setItem('songster.tweaks', 'not-json{{{');
		const { tweaks } = await import('$lib/stores/tweaks');
		const val = get(tweaks);
		expect(val.theme).toBe('light');
	});

	it('set() is type-safe for numeric values', async () => {
		const { tweaks } = await import('$lib/stores/tweaks');
		tweaks.set('animIntensity', 1.5);
		expect(get(tweaks).animIntensity).toBe(1.5);
	});

	it('set() is type-safe for boolean values', async () => {
		const { tweaks } = await import('$lib/stores/tweaks');
		tweaks.set('interceptionEnabled', false);
		expect(get(tweaks).interceptionEnabled).toBe(false);
	});

	it('handles localStorage.getItem throwing during init', async () => {
		const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new DOMException('Security error');
		});
		try {
			const { tweaks } = await import('$lib/stores/tweaks');
			const val = get(tweaks);
			expect(val.theme).toBe('light');
			expect(val.artStyle).toBe('grooves');
		} finally {
			spy.mockRestore();
		}
	});

	it('handles localStorage.setItem throwing during set()', async () => {
		const { tweaks } = await import('$lib/stores/tweaks');
		const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new DOMException('Quota exceeded');
		});
		expect(() => tweaks.set('theme', 'dark')).not.toThrow();
		expect(get(tweaks).theme).toBe('dark');
		spy.mockRestore();
	});
});
