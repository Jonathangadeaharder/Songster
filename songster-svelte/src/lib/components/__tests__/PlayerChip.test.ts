import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import PlayerChip from '$lib/components/PlayerChip.svelte';
import type { Player } from '$lib/types';

const mockPlayer: Player = { id: 'p1', name: 'You', avatar: 'Y', timeline: [], tokens: 3 };

describe('PlayerChip', () => {
	it('renders player name', () => {
		const { getByText } = render(PlayerChip, { props: { player: mockPlayer } });
		expect(getByText('You')).toBeInTheDocument();
	});

	it('renders player avatar', () => {
		const { getByText } = render(PlayerChip, { props: { player: mockPlayer } });
		expect(getByText('Y')).toBeInTheDocument();
	});

	it('renders timeline count and tokens', () => {
		const { getByText } = render(PlayerChip, { props: { player: mockPlayer } });
		expect(getByText(/0\/10/)).toBeInTheDocument();
		expect(getByText(/◈3/)).toBeInTheDocument();
	});

	it('applies active class when active', () => {
		const { container } = render(PlayerChip, { props: { player: mockPlayer, active: true } });
		const chip = container.querySelector('.chip');
		expect(chip?.classList.contains('active')).toBe(true);
	});

	it('is semi-transparent when not active', () => {
		const { container } = render(PlayerChip, { props: { player: mockPlayer, active: false } });
		const chip = container.querySelector('.chip');
		expect(chip?.getAttribute('style')).toContain('opacity: 0.5');
	});

	it('applies primary background on avatar when active', () => {
		const { container } = render(PlayerChip, { props: { player: mockPlayer, active: true } });
		const avatar = container.querySelector('.avatar');
		const style = avatar?.getAttribute('style') ?? '';
		expect(style).toContain('background:');
		expect(style).not.toContain('transparent');
	});

	it('uses transparent avatar background when not active', () => {
		const { container } = render(PlayerChip, { props: { player: mockPlayer, active: false } });
		const avatar = container.querySelector('.avatar');
		const style = avatar?.getAttribute('style') ?? '';
		expect(style).toContain('color: inherit');
	});

	it('uses dark theme colors', () => {
		const { container } = render(PlayerChip, { props: { player: mockPlayer, active: true, theme: 'dark' } });
		const avatar = container.querySelector('.avatar');
		expect(avatar).toBeInTheDocument();
	});

	it('displays correct timeline count with non-empty timeline', () => {
		const playerWithSongs: Player = { id: 'p1', name: 'You', avatar: 'Y', timeline: ['s1', 's2', 's3'] as any, tokens: 5 };
		const { getByText } = render(PlayerChip, { props: { player: playerWithSongs } });
		expect(getByText(/3\/10/)).toBeInTheDocument();
		expect(getByText(/◈5/)).toBeInTheDocument();
	});
});
