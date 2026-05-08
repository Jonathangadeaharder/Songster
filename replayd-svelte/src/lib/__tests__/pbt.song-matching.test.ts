import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { song } from './generators';
import { validatePlacement, findCorrectSlot } from '$lib/songs';
import type { Song } from '$lib/types';

function isSortedByYear(songs: Song[]): boolean {
	for (let i = 1; i < songs.length; i++) {
		if (songs[i - 1].year > songs[i].year) return false;
	}
	return true;
}

function sortedTimeline(min: number, max: number) {
	return fc
		.array(song(), { minLength: min, maxLength: max })
		.map((songs) => [...songs].sort((a, b) => a.year - b.year));
}

function timelineWithCard(min: number, max: number) {
	return sortedTimeline(min, max).chain((timeline) =>
		fc.tuple(fc.constant(timeline), song(), fc.integer({ min: 0, max: timeline.length }))
	);
}

function timelineWithCardNoSlot(min: number, max: number) {
	return sortedTimeline(min, max).chain((timeline) => fc.tuple(fc.constant(timeline), song()));
}

describe('Song matching PBT', () => {
	describe('Property 1: Case-insensitive title comparison', () => {
		it('toLowerCase is idempotent', () => {
			fc.assert(
				fc.property(song(), (s) => {
					const once = s.title.toLowerCase();
					const twice = once.toLowerCase();
					expect(twice).toBe(once);
				}),
				{ numRuns: 1000 }
			);
		});
	});

	describe('Property 2: Placement validation consistency', () => {
		it('valid placement keeps timeline sorted by year', () => {
			fc.assert(
				fc.property(timelineWithCard(1, 15), (args) => {
					const [timeline, card, slot] = args;
					if (!validatePlacement(timeline, card, slot)) return true;
					const result = [...timeline.slice(0, slot), card, ...timeline.slice(slot)];
					return isSortedByYear(result);
				}),
				{ numRuns: 1000 }
			);
		});
	});

	describe('Property 3: findCorrectSlot always in range', () => {
		it('returned slot is in [0, timeline.length]', () => {
			fc.assert(
				fc.property(timelineWithCardNoSlot(1, 15), (args) => {
					const [timeline, card] = args;
					const slot = findCorrectSlot(timeline, card);
					expect(slot).toBeGreaterThanOrEqual(0);
					expect(slot).toBeLessThanOrEqual(timeline.length);
				}),
				{ numRuns: 1000 }
			);
		});
	});

	describe('Property 4: Placement at correct slot always valid', () => {
		it('validatePlacement(timeline, card, findCorrectSlot(timeline, card)) is always true', () => {
			fc.assert(
				fc.property(timelineWithCardNoSlot(1, 15), (args) => {
					const [timeline, card] = args;
					const slot = findCorrectSlot(timeline, card);
					expect(validatePlacement(timeline, card, slot)).toBe(true);
				}),
				{ numRuns: 1000 }
			);
		});
	});

	describe('Property 5: Empty timeline accepts any card at slot 0', () => {
		it('placing a card in an empty timeline succeeds at slot 0', () => {
			fc.assert(
				fc.property(song(), (card) => {
					expect(validatePlacement([], card, 0)).toBe(true);
				}),
				{ numRuns: 1000 }
			);
		});
	});
});
