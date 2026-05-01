import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: number;
	message: string;
	type: ToastType;
	duration: number;
}

let nextId = 0;

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	return {
		subscribe,
		show(message: string, type: ToastType = 'info', duration = 3000) {
			const id = nextId++;
			update((toasts) => [...toasts, { id, message, type, duration }]);
			if (duration > 0) {
				setTimeout(() => this.dismiss(id), duration);
			}
			return id;
		},
		success(message: string, duration?: number) {
			return this.show(message, 'success', duration);
		},
		error(message: string, duration?: number) {
			return this.show(message, 'error', duration ?? 5000);
		},
		info(message: string, duration?: number) {
			return this.show(message, 'info', duration);
		},
		dismiss(id: number) {
			update((toasts) => toasts.filter((t) => t.id !== id));
		},
	};
}

export const toasts = createToastStore();
