// @ts-nocheck
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import DeezerAttribution from '$lib/components/DeezerAttribution.svelte';

describe('DeezerAttribution', () => {
	it('renders Powered by Deezer link', () => {
		render(DeezerAttribution);
		expect(screen.getByText(/powered by deezer/i)).toBeInTheDocument();
	});

	it('links to Deezer when trackUrl provided', () => {
		render(DeezerAttribution, {
			props: { trackUrl: 'https://deezer.com/track/123' },
		});
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', 'https://deezer.com/track/123');
	});
});
