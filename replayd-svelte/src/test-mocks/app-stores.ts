import { writable } from 'svelte/store';

const _navigating = writable(null);
const _updated = writable(false);

export const navigating = _navigating;
export const updated = _updated;

export const page = writable({
	params: {},
	url: new URL('http://localhost:5173'),
	route: { id: '' },
	status: 200,
	error: null,
	data: {},
	form: null,
	state: {},
	navigating: _navigating,
	updated: _updated,
});

export function beforeNavigate(_cb: unknown) {}
export function afterNavigate(_cb: unknown) {}

export function __resetAppStores() {
	_navigating.set(null);
	_updated.set(false);
}
