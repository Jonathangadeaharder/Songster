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

	it('invokes onSlotDragOver with correct index', async () => {
		const onSlotDragOver = vi.fn();
		const { container } = render(Timeline, { props: { cards: songs, onSlotDragOver } });
		const slots = container.querySelectorAll('button.slot');
		await fireEvent.dragOver(slots[1]);
		expect(onSlotDragOver).toHaveBeenCalledWith(expect.any(Object), 1);
	});

	it('invokes onSlotDragLeave with correct index', async () => {
		const onSlotDragLeave = vi.fn();
		const { container } = render(Timeline, { props: { cards: songs, onSlotDragLeave } });
		const slots = container.querySelectorAll('button.slot');
		await fireEvent.dragLeave(slots[0]);
		expect(onSlotDragLeave).toHaveBeenCalledWith(expect.any(Object), 0);
	});

	it('invokes onSlotDrop with correct index', async () => {
		const onSlotDrop = vi.fn();
		const { container } = render(Timeline, { props: { cards: songs, onSlotDrop } });
		const slots = container.querySelectorAll('button.slot');
		await fireEvent.drop(slots[2]);
		expect(onSlotDrop).toHaveBeenCalledWith(expect.any(Object), 2);
	});

	it('shows ✕ on wrongSlot', () => {
		const { container } = render(Timeline, { props: { cards: songs, wrongSlot: 1 } });
		const slots = container.querySelectorAll('button.slot');
		expect(slots[1].textContent).toContain('✕');
	});

	it('shows DROP on hoverSlot', () => {
		const { container } = render(Timeline, { props: { cards: songs, hoverSlot: 0 } });
		const slots = container.querySelectorAll('button.slot');
		expect(slots[0].textContent).toContain('DROP');
	});

	it('sets correct aria-label on highlightSlot', () => {
		const { container } = render(Timeline, { props: { cards: songs, highlightSlot: 1 } });
		const slots = container.querySelectorAll('button.slot');
		expect(slots[1].getAttribute('aria-label')).toBe('Slot 1, correct placement');
	});
});
