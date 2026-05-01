import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import DeckBuilder from '$lib/components/DeckBuilder.svelte';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('DeckBuilder', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('renders search input', async () => {
		render(DeckBuilder, { props: { onSelect: vi.fn() } });
		expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
	});

	it('shows search results after typing', async () => {
		render(DeckBuilder, { props: { onSelect: vi.fn() } });
		const input = screen.getByPlaceholderText(/search/i);
		await fireEvent.input(input, { target: { value: 'test' } });
		await new Promise((r) => setTimeout(r, 350));
		expect(await screen.findByText('Bohemian Rhapsody')).toBeInTheDocument();
	});

	it('calls onSelect when add button clicked', async () => {
		const onSelect = vi.fn();
		render(DeckBuilder, { props: { onSelect } });
		const input = screen.getByPlaceholderText(/search/i);
		await fireEvent.input(input, { target: { value: 'test' } });
		await new Promise((r) => setTimeout(r, 350));
		const addBtn = await screen.findByRole('button', { name: /add/i });
		await fireEvent.click(addBtn);
		expect(onSelect).toHaveBeenCalled();
	});
});
