// @ts-nocheck
import { render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Waveform from '$lib/components/Waveform.svelte';

beforeEach(() => {
	vi.stubGlobal('requestAnimationFrame', (_cb: (time: number) => void) => 1);
	vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('Waveform', () => {
	it('renders a canvas element', () => {
		const { container } = render(Waveform);
		expect(container.querySelector('canvas')).toBeInTheDocument();
	});

	it('renders with default bars count (width=168)', () => {
		const { container } = render(Waveform);
		const canvas = container.querySelector('canvas');
		expect(canvas?.getAttribute('width')).toBe('168');
	});

	it('renders with custom bars count', () => {
		const { container } = render(Waveform, {
			props: { bars: 20 },
		});
		const canvas = container.querySelector('canvas');
		expect(canvas?.getAttribute('width')).toBe('80');
	});

	it('renders with custom height', () => {
		const { container } = render(Waveform, {
			props: { height: 48 },
		});
		const canvas = container.querySelector('canvas');
		expect(canvas?.getAttribute('height')).toBe('48');
	});

	it('does not crash when playing but no audioElement', () => {
		const { container } = render(Waveform, {
			props: { playing: true, audioElement: null },
		});
		expect(container.querySelector('canvas')).toBeInTheDocument();
	});

	it('applies reduced class when prefers-reduced-motion', () => {
		const original = window.matchMedia;
		window.matchMedia = vi.fn().mockImplementation((q: string) => ({
			matches: q === '(prefers-reduced-motion: reduce)',
			media: q,
			onchange: null,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));
		const { container } = render(Waveform, {
			props: { playing: false },
		});
		const canvas = container.querySelector('canvas');
		expect(canvas?.classList.contains('reduced')).toBe(true);
		window.matchMedia = original;
	});

	it('does not apply reduced class when motion is OK', () => {
		const { container } = render(Waveform, {
			props: { playing: false },
		});
		const canvas = container.querySelector('canvas');
		expect(canvas?.classList.contains('reduced')).toBe(false);
	});

	it('renders with playing=false and no audio (default state)', () => {
		const { container } = render(Waveform, {
			props: { playing: false, audioElement: null },
		});
		expect(container.querySelector('canvas')).toBeInTheDocument();
	});

	it('computes width from bars prop', () => {
		const { container } = render(Waveform, {
			props: { bars: 10 },
		});
		const canvas = container.querySelector('canvas');
		expect(canvas?.getAttribute('width')).toBe('40');
	});

	it('uses default height of 32', () => {
		const { container } = render(Waveform);
		const canvas = container.querySelector('canvas');
		expect(canvas?.getAttribute('height')).toBe('32');
	});
});
