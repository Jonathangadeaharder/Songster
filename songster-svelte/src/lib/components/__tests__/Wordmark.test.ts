import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Wordmark from '$lib/components/Wordmark.svelte';

describe('Wordmark', () => {
	it('renders an SVG with "Songster" text', () => {
		const { container } = render(Wordmark);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		const text = container.querySelector('text');
		expect(text?.textContent).toBe('Songster');
	});

	it('applies scale prop to SVG dimensions', () => {
		const { container } = render(Wordmark, { props: { scale: 2 } });
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('style')).toContain('width: 400px');
		expect(svg?.getAttribute('style')).toContain('height: 48px');
	});

	it('defaults to scale 1', () => {
		const { container } = render(Wordmark);
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('style')).toContain('width: 200px');
	});
});
