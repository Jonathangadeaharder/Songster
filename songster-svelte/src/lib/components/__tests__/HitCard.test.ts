import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import HitCard from '$lib/components/HitCard.svelte';
import type { Song } from '$lib/types';

const mockSong: Song = { id: 's01', num: 1, title: 'Bohemian Rhapsody', artist: 'Queen', year: 1975 };

describe('HitCard', () => {
	it('renders song title when face up', () => {
		const { getByText } = render(HitCard, { props: { song: mockSong, faceDown: false } });
		expect(getByText('Bohemian Rhapsody')).toBeInTheDocument();
	});

	it('renders artist when face up', () => {
		const { getByText } = render(HitCard, { props: { song: mockSong, faceDown: false } });
		expect(getByText('Queen')).toBeInTheDocument();
	});

	it('renders year when face up', () => {
		const { getByText } = render(HitCard, { props: { song: mockSong, faceDown: false } });
		expect(getByText('1975')).toBeInTheDocument();
	});

	it('renders card number', () => {
		const { getByText } = render(HitCard, { props: { song: mockSong, faceDown: false } });
		expect(getByText('No. 01')).toBeInTheDocument();
	});

	it('hides title/artist when face down', () => {
		const { queryByText } = render(HitCard, { props: { song: mockSong, faceDown: true } });
		expect(queryByText('Bohemian Rhapsody')).not.toBeInTheDocument();
		expect(queryByText('Queen')).not.toBeInTheDocument();
	});

	it('applies correct class for correct placement', () => {
		const { container } = render(HitCard, { props: { song: mockSong, faceDown: false, correct: true } });
		const outer = container.querySelector('.card-outer');
		expect(outer?.classList.contains('correct')).toBe(true);
	});

	it('applies wrong class for incorrect placement', () => {
		const { container } = render(HitCard, { props: { song: mockSong, faceDown: false, correct: false } });
		const outer = container.querySelector('.card-outer');
		expect(outer?.classList.contains('wrong')).toBe(true);
	});

	it('renders "Songster" label', () => {
		const { getAllByText } = render(HitCard, { props: { song: mockSong, faceDown: false } });
		expect(getAllByText('Songster').length).toBeGreaterThan(0);
	});
});
