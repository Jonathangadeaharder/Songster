import { writable } from 'svelte/store';

export const page = writable({
	params: {},
	url: new URL('http://localhost:5173'),
	route: { id: '' },
	status: 200,
	error: null,
	data: {},
	form: null,
	state: {},
	navigating: null,
	updated: writable(false),
});

export const navigating = writable(null);
export const updated = writable(false);

export function beforeNavigate(_cb: unknown) {}
export function afterNavigate(_cb: unknown) {}
