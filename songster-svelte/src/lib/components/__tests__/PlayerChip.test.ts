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
});
