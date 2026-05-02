// @ts-nocheck
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import DeezerAttribution from '$lib/components/DeezerAttribution.svelte';

describe('DeezerAttribution', () => {
	it('renders link when trackUrl is provided', () => {
		const { container } = render(DeezerAttribution, {
			props: { trackUrl: 'https://deezer.com/track/123' },
		});
		const link = container.querySelector('a');
		expect(link).toBeInTheDocument();
		expect(link?.getAttribute('href')).toBe('https://deezer.com/track/123');
		expect(link?.getAttribute('target')).toBe('_blank');
		expect(link?.textContent).toContain('Powered by Deezer');
	});

	it('renders span when trackUrl is empty', () => {
		const { container } = render(DeezerAttribution, {
			props: { trackUrl: '' },
		});
		expect(container.querySelector('a')).not.toBeInTheDocument();
		const span = container.querySelector('span');
		expect(span).toBeInTheDocument();
		expect(span?.textContent).toContain('Powered by Deezer');
	});

	it('renders span when trackUrl is undefined', () => {
		const { container } = render(DeezerAttribution);
		expect(container.querySelector('a')).not.toBeInTheDocument();
		expect(container.querySelector('span')).toBeInTheDocument();
	});
});
