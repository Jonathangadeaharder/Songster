import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Vinyl from '$lib/components/Vinyl.svelte';

describe('Vinyl', () => {
	it('renders an SVG with vinyl circles', () => {
		const { container } = render(Vinyl);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		const circles = container.querySelectorAll('circle');
		expect(circles.length).toBeGreaterThan(0);
	});

	it('renders the label text', () => {
		const { getByText } = render(Vinyl, { props: { label: 'NOW SPINNING' } });
		expect(getByText('NOW SPINNING')).toBeInTheDocument();
	});

	it('renders the subLabel text', () => {
		const { getByText } = render(Vinyl, { props: { subLabel: '33⅓ RPM' } });
		expect(getByText('33⅓ RPM')).toBeInTheDocument();
	});

	it('applies spinning class when spinning prop is true', () => {
		const { container } = render(Vinyl, { props: { spinning: true } });
		const svg = container.querySelector('svg');
		expect(svg?.classList.contains('spinning')).toBe(true);
	});

	it('does not spin by default', () => {
		const { container } = render(Vinyl);
		const svg = container.querySelector('svg');
		expect(svg?.classList.contains('spinning')).toBe(false);
	});

	it('applies custom size', () => {
		const { container } = render(Vinyl, { props: { size: 100 } });
		const wrap = container.querySelector('.vinyl-wrap');
		expect(wrap?.getAttribute('style')).toContain('width: 100px');
		expect(wrap?.getAttribute('style')).toContain('height: 100px');
	});
});
