import { render } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DeckBuilder from '$lib/components/DeckBuilder.svelte';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('DeckBuilder', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('renders search input', () => {
		const { getByLabelText } = render(DeckBuilder, {
			props: { onSelect: vi.fn() },
		});
		expect(getByLabelText('Search songs')).toBeInTheDocument();
	});

	it('renders results list when not loading', () => {
		const { container } = render(DeckBuilder, {
			props: { onSelect: vi.fn() },
		});
		expect(container.querySelector('.results')).toBeInTheDocument();
	});

	it('renders no result items initially', () => {
		const { container } = render(DeckBuilder, {
			props: { onSelect: vi.fn() },
		});
		const items = container.querySelectorAll('.result-item');
		expect(items).toHaveLength(0);
	});

	it('has an input with search placeholder', () => {
		const { getByPlaceholderText } = render(DeckBuilder, {
			props: { onSelect: vi.fn() },
		});
		expect(getByPlaceholderText('Search songs...')).toBeInTheDocument();
	});
});
