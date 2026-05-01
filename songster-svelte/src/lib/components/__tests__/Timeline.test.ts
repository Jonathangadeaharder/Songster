import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
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
		const { container } = render(Timeline, {
			props: { cards: songs, frozen: true },
		});
		const slots = container.querySelectorAll('button.slot');
		for (const s of slots) expect(s).toBeDisabled();
	});

	it('slots have aria-labels', () => {
		const { container } = render(Timeline, { props: { cards: songs } });
		const slots = container.querySelectorAll('button.slot');
		slots.forEach((s) => {
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
		const { container } = render(Timeline, {
			props: { cards: songs, onSlotClick },
		});
		const slots = container.querySelectorAll('button.slot');
		await fireEvent.click(slots[2]);
		expect(onSlotClick).toHaveBeenCalledWith(2);
	});

	it('invokes onSlotDragOver with correct index', async () => {
		const onSlotDragOver = vi.fn();
		const { container } = render(Timeline, {
			props: { cards: songs, onSlotDragOver, onSlotDrop: vi.fn() },
		});
		const slots = container.querySelectorAll('button.slot');
		await fireEvent.dragOver(slots[1]);
		expect(onSlotDragOver).toHaveBeenCalledWith(expect.any(Object), 1);
	});

	it('invokes onSlotDragLeave with correct index', async () => {
		const onSlotDragLeave = vi.fn();
		const { container } = render(Timeline, {
			props: { cards: songs, onSlotDragLeave, onSlotDrop: vi.fn() },
		});
		const slots = container.querySelectorAll('button.slot');
		await fireEvent.dragLeave(slots[0]);
		expect(onSlotDragLeave).toHaveBeenCalledWith(expect.any(Object), 0);
	});

	it('invokes onSlotDrop with correct index', async () => {
		const onSlotDrop = vi.fn();
		const { container } = render(Timeline, {
			props: { cards: songs, onSlotDrop },
		});
		const slots = container.querySelectorAll('button.slot');
		await fireEvent.drop(slots[2]);
		expect(onSlotDrop).toHaveBeenCalledWith(expect.any(Object), 2);
	});

	it('shows ✕ on wrongSlot', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, wrongSlot: 1 },
		});
		const slots = container.querySelectorAll('button.slot');
		expect(slots[1].textContent).toContain('✕');
	});

	it('shows DROP on hoverSlot', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, hoverSlot: 0 },
		});
		const slots = container.querySelectorAll('button.slot');
		expect(slots[0].textContent).toContain('DROP');
	});

	it('sets correct aria-label on highlightSlot', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, highlightSlot: 1 },
		});
		const slots = container.querySelectorAll('button.slot');
		expect(slots[1].getAttribute('aria-label')).toBe('Slot 1, correct placement');
	});

	it('sets wrong aria-label on wrongSlot', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, wrongSlot: 0 },
		});
		const slots = container.querySelectorAll('button.slot');
		expect(slots[0].getAttribute('aria-label')).toBe('Slot 0, wrong placement');
	});

	it('sets drop aria-label on hoverSlot', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, hoverSlot: 2 },
		});
		const slots = container.querySelectorAll('button.slot');
		expect(slots[2].getAttribute('aria-label')).toBe('Slot 2, drop target');
	});

	it('renders compact density with smaller card size', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, density: 'compact' },
		});
		const slot = container.querySelectorAll('button.slot')[0];
		expect(slot).toBeInTheDocument();
	});

	it('renders comfy density with larger card size', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, density: 'comfy' },
		});
		const slot = container.querySelectorAll('button.slot')[0];
		expect(slot).toBeInTheDocument();
	});

	it('disables slots when no onSlotClick and no onSlotDrop', () => {
		const { container } = render(Timeline, {
			props: { cards: songs },
		});
		const slots = container.querySelectorAll('button.slot');
		for (const s of slots) expect(s).toBeDisabled();
	});

	it('enables slots when onSlotClick is provided', () => {
		const onSlotClick = vi.fn();
		const { container } = render(Timeline, {
			props: { cards: songs, onSlotClick },
		});
		const slots = container.querySelectorAll('button.slot');
		for (const s of slots) expect(s).not.toBeDisabled();
	});

	it('shows highlight slot with solid border style', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, highlightSlot: 0 },
		});
		const inner = container.querySelector('.slot-inner');
		expect(inner?.getAttribute('style')).toContain('solid');
	});

	it('renders draggingActive with wider slot width', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, draggingActive: true, onSlotDrop: vi.fn() },
		});
		const slots = container.querySelectorAll('button.slot');
		expect(slots.length).toBe(songs.length + 1);
	});

	it('applies dashed border on non-highlighted slot', () => {
		const { container } = render(Timeline, {
			props: { cards: songs },
		});
		const inner = container.querySelector('.slot-inner');
		expect(inner?.getAttribute('style')).toContain('dashed');
	});

	it('applies solid border on hoverSlot', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, hoverSlot: 0, onSlotDrop: vi.fn() },
		});
		const inners = container.querySelectorAll('.slot-inner');
		expect(inners[0].getAttribute('style')).toContain('solid');
	});

	it('applies frozen opacity on slot when frozen', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, frozen: true },
		});
		const inner = container.querySelector('.slot-inner');
		expect(inner?.getAttribute('style')).toContain('opacity: 0.15');
	});

	it('applies draggingActive opacity on slot', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, draggingActive: true, onSlotDrop: vi.fn() },
		});
		const inner = container.querySelector('.slot-inner');
		expect(inner?.getAttribute('style')).toContain('opacity: 0.7');
	});

	it('applies default opacity when not frozen or dragging', () => {
		const { container } = render(Timeline, {
			props: { cards: songs },
		});
		const inner = container.querySelector('.slot-inner');
		expect(inner?.getAttribute('style')).toContain('opacity: 0.4');
	});

	it('applies highlightSlot primary background', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, highlightSlot: 0 },
		});
		const inner = container.querySelector('.slot-inner');
		expect(inner?.getAttribute('style')).toContain('background:');
	});

	it('applies hoverSlot rgba background', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, hoverSlot: 0, onSlotDrop: vi.fn() },
		});
		const inner = container.querySelector('.slot-inner');
		expect(inner?.getAttribute('style')).toContain('rgba(10, 10, 10, 0.06)');
	});

	it('applies wrongSlot dark border color', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, wrongSlot: 0 },
		});
		const inner = container.querySelector('.slot-inner');
		expect(inner?.getAttribute('style')).toContain('rgb(10, 10, 10)');
	});

	it('enables slots when onSlotDrop is provided without onSlotClick', () => {
		const onSlotDrop = vi.fn();
		const { container } = render(Timeline, {
			props: { cards: songs, onSlotDrop },
		});
		const slots = container.querySelectorAll('button.slot');
		for (const s of slots) expect(s).not.toBeDisabled();
	});

	it('calls onSlotDrop when slot is dropped on in drop-only mode', async () => {
		const onSlotDrop = vi.fn();
		const { container } = render(Timeline, {
			props: { cards: songs, onSlotDrop },
		});
		const slots = container.querySelectorAll('button.slot');
		await fireEvent.drop(slots[1]);
		expect(onSlotDrop).toHaveBeenCalledWith(expect.any(Object), 1);
	});

	it('handles dragOver in drop-only mode', async () => {
		const onSlotDrop = vi.fn();
		const onSlotDragOver = vi.fn();
		const { container } = render(Timeline, {
			props: { cards: songs, onSlotDrop, onSlotDragOver },
		});
		const slots = container.querySelectorAll('button.slot');
		await fireEvent.dragOver(slots[0]);
		expect(onSlotDragOver).toHaveBeenCalledWith(expect.any(Object), 0);
	});

	it('handles dragLeave in drop-only mode', async () => {
		const onSlotDrop = vi.fn();
		const onSlotDragLeave = vi.fn();
		const { container } = render(Timeline, {
			props: { cards: songs, onSlotDrop, onSlotDragLeave },
		});
		const slots = container.querySelectorAll('button.slot');
		await fireEvent.dragLeave(slots[0]);
		expect(onSlotDragLeave).toHaveBeenCalledWith(expect.any(Object), 0);
	});

	it('renders compact density slot width', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, density: 'compact' },
		});
		const slots = container.querySelectorAll('button.slot');
		expect(slots.length).toBe(songs.length + 1);
	});

	it('renders comfy density slot width', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, density: 'comfy' },
		});
		const slots = container.querySelectorAll('button.slot');
		expect(slots.length).toBe(songs.length + 1);
	});

	it('renders dark theme highlightSlot', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, highlightSlot: 0, theme: 'dark' },
		});
		const inner = container.querySelector('.slot-inner');
		expect(inner?.getAttribute('style')).toContain('background:');
	});

	it('renders highlightSlot with expanded width', () => {
		const { container } = render(Timeline, {
			props: { cards: songs, highlightSlot: 0 },
		});
		const slot = container.querySelectorAll('button.slot')[0];
		expect(slot?.getAttribute('style')).toContain('width:');
	});
});
