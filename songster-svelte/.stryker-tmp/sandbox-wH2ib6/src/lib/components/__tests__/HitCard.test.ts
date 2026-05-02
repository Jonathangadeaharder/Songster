// @ts-nocheck
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import HitCard from '$lib/components/HitCard.svelte';
import type { Song } from '$lib/types';

const mockSong: Song = {
	id: 's01',
	num: 1,
	title: 'Bohemian Rhapsody',
	artist: 'Queen',
	year: 1975,
};

describe('HitCard', () => {
	it('renders song title when face up', () => {
		const { getByText } = render(HitCard, {
			props: { song: mockSong, faceDown: false },
		});
		expect(getByText('Bohemian Rhapsody')).toBeInTheDocument();
	});

	it('renders artist when face up', () => {
		const { getByText } = render(HitCard, {
			props: { song: mockSong, faceDown: false },
		});
		expect(getByText('Queen')).toBeInTheDocument();
	});

	it('renders year when face up', () => {
		const { getByText } = render(HitCard, {
			props: { song: mockSong, faceDown: false },
		});
		expect(getByText('1975')).toBeInTheDocument();
	});

	it('renders card number', () => {
		const { getByText } = render(HitCard, {
			props: { song: mockSong, faceDown: false },
		});
		expect(getByText('No. 01')).toBeInTheDocument();
	});

	it('hides title/artist when face down', () => {
		const { queryByText } = render(HitCard, {
			props: { song: mockSong, faceDown: true },
		});
		expect(queryByText('Bohemian Rhapsody')).not.toBeInTheDocument();
		expect(queryByText('Queen')).not.toBeInTheDocument();
	});

	it('applies correct class for correct placement', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, faceDown: false, correct: true },
		});
		const outer = container.querySelector('.card-outer');
		expect(outer?.classList.contains('correct')).toBe(true);
	});

	it('applies wrong class for incorrect placement', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, faceDown: false, correct: false },
		});
		const outer = container.querySelector('.card-outer');
		expect(outer?.classList.contains('wrong')).toBe(true);
	});

	it('renders "Songster" label', () => {
		const { getAllByText } = render(HitCard, {
			props: { song: mockSong, faceDown: false },
		});
		expect(getAllByText('Songster').length).toBeGreaterThan(0);
	});

	it('renders halftone-dots when artStyle is halftone', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, artStyle: 'halftone' },
		});
		expect(container.querySelector('.halftone-dots')).toBeInTheDocument();
	});

	it('renders solid-fill when artStyle is solid', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, artStyle: 'solid' },
		});
		expect(container.querySelector('.solid-fill')).toBeInTheDocument();
	});

	it('renders inverse-fill when artStyle is inverse', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, artStyle: 'inverse' },
		});
		expect(container.querySelector('.inverse-fill')).toBeInTheDocument();
	});

	it('renders with sm size using 70px width', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, size: 'sm' },
		});
		const outer = container.querySelector('.card-outer');
		expect(outer?.getAttribute('style')).toContain('width: 70px');
	});

	it('renders card-back with number when faceDown', () => {
		const { container, getByText } = render(HitCard, {
			props: { song: mockSong, faceDown: true },
		});
		expect(container.querySelector('.card-back')).toBeInTheDocument();
		expect(getByText('No. 01')).toBeInTheDocument();
	});

	it('does not apply correct or wrong class when correct is undefined', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong },
		});
		const outer = container.querySelector('.card-outer');
		expect(outer?.classList.contains('correct')).toBe(false);
		expect(outer?.classList.contains('wrong')).toBe(false);
	});

	it('renders md size by default with 100px width', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong },
		});
		const outer = container.querySelector('.card-outer');
		expect(outer?.getAttribute('style')).toContain('width: 100px');
	});

	it('renders grooves art style by default', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong },
		});
		expect(container.querySelector('.grooves')).toBeInTheDocument();
	});

	it('renders card-back with minimal info when faceDown', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, faceDown: true },
		});
		expect(container.querySelector('.card-back')).toBeInTheDocument();
		expect(container.querySelector('.card-front')).not.toBeInTheDocument();
	});

	it('renders with styleExtra applied', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, styleExtra: 'border-radius: 12px' },
		});
		const outer = container.querySelector('.card-outer');
		expect(outer?.getAttribute('style')).toContain('border-radius: 12px');
	});

	it('renders faceDown card with sm size', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, faceDown: true, size: 'sm' },
		});
		const outer = container.querySelector('.card-outer');
		expect(outer?.getAttribute('style')).toContain('width: 70px');
		expect(outer?.classList.contains('face-down')).toBe(true);
	});

	it('neither correct nor wrong class when correct is undefined', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, correct: undefined },
		});
		const outer = container.querySelector('.card-outer');
		expect(outer?.classList.contains('correct')).toBe(false);
		expect(outer?.classList.contains('wrong')).toBe(false);
	});

	it('applies wrong class with faceDown', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, faceDown: true, correct: false },
		});
		const outer = container.querySelector('.card-outer');
		expect(outer?.classList.contains('wrong')).toBe(true);
	});

	it('applies correct class with faceDown', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, faceDown: true, correct: true },
		});
		const outer = container.querySelector('.card-outer');
		expect(outer?.classList.contains('correct')).toBe(true);
	});

	it('applies both faceDown and correct classes simultaneously', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, faceDown: true, correct: true },
		});
		const outer = container.querySelector('.card-outer');
		expect(outer?.classList.contains('face-down')).toBe(true);
		expect(outer?.classList.contains('correct')).toBe(true);
	});

	it('renders sm size card-back when faceDown', () => {
		const { container } = render(HitCard, {
			props: { song: mockSong, faceDown: true, size: 'sm', correct: false },
		});
		const outer = container.querySelector('.card-outer');
		expect(outer?.getAttribute('style')).toContain('width: 70px');
		expect(outer?.classList.contains('wrong')).toBe(true);
	});
});
