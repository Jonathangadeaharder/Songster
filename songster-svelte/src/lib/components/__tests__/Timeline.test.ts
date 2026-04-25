import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Timeline from '$lib/components/Timeline.svelte';
import type { Song } from '$lib/types';

const songs: Song[] = [
	{ id: 's01', num: 1, title: 'Song A', artist: 'Artist A', year: 1970 },
	{ id: 's02', num: 2, title: 'Song B', artist: 'Artist B', year: 1980 },
];

describe('Timeline', () => {
	it('renders slot buttons equal to cards.length + 1', () => {
		const { container } = render(Timeline, { props: { cards: songs } });
		const slots = container.querySelectorAll('button.slot');
		expect(slots).toHaveLength(songs.length + 1);
	});

	it('renders HitCard for each song in timeline', () => {
		const { getByText } = render(Timeline, { props: { cards: songs } });
		expect(getByText('Song A')).toBeInTheDocument();
		expect(getByText('Song B')).toBeInTheDocument();
	});

	it('disables slots when frozen', () => {
		const { container } = render(Timeline, { props: { cards: songs, frozen: true } });
		const slots = container.querySelectorAll('button.slot');
		slots.forEach(s => expect(s).toBeDisabled());
	});

	it('slots have aria-labels', () => {
		const { container } = render(Timeline, { props: { cards: songs } });
		const slots = container.querySelectorAll('button.slot');
		slots.forEach(s => {
			expect(s.getAttribute('aria-label')).toContain('Slot');
		});
	});

	it('renders empty timeline with 1 slot', () => {
		const { container } = render(Timeline, { props: { cards: [] } });
		const slots = container.querySelectorAll('button.slot');
		expect(slots).toHaveLength(1);
	});

	it('invokes onSlotClick with correct index when slot is clicked', async () => {
		const onSlotClick = vi.fn();
		const { container } = render(Timeline, { props: { cards: songs, onSlotClick } });
		const slots = container.querySelectorAll('button.slot');
		await fireEvent.click(slots[2]);
		expect(onSlotClick).toHaveBeenCalledWith(2);
	});
});
