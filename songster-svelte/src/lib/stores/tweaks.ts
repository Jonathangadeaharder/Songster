import { writable } from 'svelte/store';
import type { Tweaks } from '$lib/types';

const TWEAK_DEFAULTS: Tweaks = {
	theme: 'light',
	artStyle: 'grooves',
	flipStyle: 'flip',
	density: 'regular',
	animIntensity: 1,
	interceptionEnabled: true,
};

function createTweaksStore() {
	let initial = TWEAK_DEFAULTS;
	try {
		const raw = localStorage.getItem('songster.tweaks');
		if (raw) initial = { ...TWEAK_DEFAULTS, ...JSON.parse(raw) };
	} catch { /* ignore */ }

	const { subscribe, set, update } = writable<Tweaks>(initial);

	return {
		subscribe,
		set(key: string, val: unknown) {
			update(prev => {
				const next = { ...prev, [key]: val } as Tweaks;
				try { localStorage.setItem('songster.tweaks', JSON.stringify(next)); } catch { /* ignore */ }
				return next;
			});
		},
	};
}

export const tweaks = createTweaksStore();
