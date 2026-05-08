import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
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

	it('clamps animation-duration when intensity is very low', () => {
		const { container } = render(Vinyl, {
			props: { spinning: true, intensity: 0.01 },
		});
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('style')).toContain('animation-duration: 20s');
	});

	it('computes animation-duration from intensity', () => {
		const { container } = render(Vinyl, {
			props: { spinning: true, intensity: 2 },
		});
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('style')).toContain('animation-duration: 1s');
	});

	it('renders with default size', () => {
		const { container } = render(Vinyl);
		const wrap = container.querySelector('.vinyl-wrap');
		expect(wrap?.getAttribute('style')).toContain('width: 190px');
		expect(wrap?.getAttribute('style')).toContain('height: 190px');
	});

	it('renders SVG circles', () => {
		const { container } = render(Vinyl);
		const circles = container.querySelectorAll('circle');
		expect(circles.length).toBeGreaterThanOrEqual(5);
	});

	it('renders label and subLabel text', () => {
		const { getByText } = render(Vinyl, {
			props: { label: 'MY LABEL', subLabel: '45 RPM' },
		});
		expect(getByText('MY LABEL')).toBeInTheDocument();
		expect(getByText('45 RPM')).toBeInTheDocument();
	});

	it('computes animation-duration with default intensity', () => {
		const { container } = render(Vinyl, {
			props: { spinning: true },
		});
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('style')).toContain('animation-duration: 2s');
	});

	it('applies safeIntensity clamp for intensity=0', () => {
		const { container } = render(Vinyl, {
			props: { spinning: true, intensity: 0 },
		});
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('style')).toContain('animation-duration: 20s');
	});

	it('does not apply spinning class when spinning is false', () => {
		const { container } = render(Vinyl, {
			props: { spinning: false, size: 120 },
		});
		const svg = container.querySelector('svg');
		expect(svg?.classList.contains('spinning')).toBe(false);
		const wrap = container.querySelector('.vinyl-wrap');
		expect(wrap?.getAttribute('style')).toContain('width: 120px');
	});

	it('renders SVG text elements for label and subLabel', () => {
		const { container } = render(Vinyl, {
			props: { label: 'ALBUM', subLabel: 'RPM' },
		});
		const texts = container.querySelectorAll('svg text');
		expect(texts.length).toBe(2);
	});
});
