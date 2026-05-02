import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { song, player, gameState, sortedSongDeck } from './generators';
import { validatePlacement, findCorrectSlot, shuffled, buildDrawPile } from '$lib/songs';
import type { Song } from '$lib/types';

describe('PBT smoke test — generators produce valid data', () => {
	it('song() always has required fields', () => {
		fc.assert(
			fc.property(song(), (s) => {
				expect(typeof s.id).toBe('string');
				expect(s.id.length).toBeGreaterThan(0);
				expect(typeof s.num).toBe('number');
				expect(typeof s.title).toBe('string');
				expect(typeof s.artist).toBe('string');
				expect(typeof s.year).toBe('number');
				expect(s.year).toBeGreaterThanOrEqual(1900);
				expect(s.year).toBeLessThanOrEqual(2030);
			})
		);
	});

	it('player() always has valid timeline and tokens', () => {
		fc.assert(
			fc.property(player(), (p) => {
				expect(typeof p.id).toBe('string');
				expect(Array.isArray(p.timeline)).toBe(true);
				expect(p.timeline.length).toBeLessThanOrEqual(10);
				expect(p.tokens).toBeGreaterThanOrEqual(0);
				expect(p.tokens).toBeLessThanOrEqual(5);
			})
		);
	});

	it('gameState() always has valid structure', () => {
		fc.assert(
			fc.property(gameState(), (gs) => {
				expect(['lobby', 'play', 'win']).toContain(gs.screen);
				expect(['draw', 'listen', 'place', 'reveal', 'challenge']).toContain(gs.phase);
				expect(gs.round).toBeGreaterThanOrEqual(1);
				expect(Array.isArray(gs.players)).toBe(true);
				expect(gs.players.length).toBeGreaterThanOrEqual(1);
				expect(Array.isArray(gs.drawPile)).toBe(true);
			})
		);
	});

	it('sortedSongDeck(n) returns exactly n songs sorted by year', () => {
		fc.assert(
			fc.property(
				fc.integer({ min: 1, max: 20 }).chain((n) => fc.tuple(fc.constant(n), sortedSongDeck(n))),
				([n, deck]) => {
					expect(deck.length).toBe(n);
					for (let i = 1; i < deck.length; i++) {
						expect(deck[i].year).toBeGreaterThanOrEqual(deck[i - 1].year);
					}
				}
			)
		);
	});
});

describe('PBT smoke test — game logic invariants', () => {
	it('shuffled() preserves all elements', () => {
		fc.assert(
			fc.property(fc.array(fc.integer()), (arr) => {
				const result = shuffled(arr);
				expect(result.length).toBe(arr.length);
				expect(result.sort()).toEqual(arr.sort());
			})
		);
	});

	it('validatePlacement returns true for correct slot from findCorrectSlot', () => {
		fc.assert(
			fc.property(
				fc.array(song(), { minLength: 0, maxLength: 8 }),
				song(),
				(timelineSongs, card) => {
					const sorted = [...timelineSongs].sort((a, b) => a.year - b.year);
					const slot = findCorrectSlot(sorted, card);
					expect(validatePlacement(sorted, card, slot)).toBe(true);
				}
			)
		);
	});

	it('findCorrectSlot always returns a valid index', () => {
		fc.assert(
			fc.property(
				fc.array(song(), { minLength: 0, maxLength: 8 }),
				song(),
				(timelineSongs, card) => {
					const sorted = [...timelineSongs].sort((a, b) => a.year - b.year);
					const slot = findCorrectSlot(sorted, card);
					expect(slot).toBeGreaterThanOrEqual(0);
					expect(slot).toBeLessThanOrEqual(sorted.length);
				}
			)
		);
	});

	it('buildDrawPile returns songs not in any player timeline', () => {
		fc.assert(
			fc.property(fc.array(player(), { minLength: 1, maxLength: 4 }), (players) => {
				const pile = buildDrawPile(players);
				const usedIds = new Set(players.flatMap((p) => p.timeline.map((s) => s.id)));
				for (const song of pile) {
					expect(usedIds.has(song.id)).toBe(false);
				}
			})
		);
	});
});
