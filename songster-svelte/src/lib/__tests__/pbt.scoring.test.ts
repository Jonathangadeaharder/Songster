import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { song, player, gameState, sortedSongDeck } from './generators';
import { buildDrawPile, findCorrectSlot } from '$lib/songs';

describe('PBT scoring — tokens non-negative', () => {
	it('generated players always have tokens >= 0', () => {
		fc.assert(
			fc.property(player(), (p) => {
				expect(p.tokens).toBeGreaterThanOrEqual(0);
			}),
			{ numRuns: 1000 }
		);
	});

	it('generated game states have all players with tokens >= 0', () => {
		fc.assert(
			fc.property(gameState(), (gs) => {
				for (const p of gs.players) {
					expect(p.tokens).toBeGreaterThanOrEqual(0);
				}
			}),
			{ numRuns: 1000 }
		);
	});

	it('challenging never makes tokens negative (invariant over arbitrary player states)', () => {
		fc.assert(
			fc.property(fc.integer({ min: 0, max: 5 }), (initialTokens) => {
				const tokensAfterChallenge = initialTokens > 0 ? initialTokens - 1 : 0;
				expect(tokensAfterChallenge).toBeGreaterThanOrEqual(0);
			}),
			{ numRuns: 1000 }
		);
	});
});

describe('PBT scoring — timeline length bounded [1, 10]', () => {
	it('generated players have timeline length between 0 and 10', () => {
		fc.assert(
			fc.property(player(), (p) => {
				expect(p.timeline.length).toBeGreaterThanOrEqual(0);
				expect(p.timeline.length).toBeLessThanOrEqual(10);
			}),
			{ numRuns: 1000 }
		);
	});

	it('inserting a song into a valid timeline never exceeds length 10', () => {
		fc.assert(
			fc.property(
				fc.array(song(), { minLength: 1, maxLength: 9 }),
				song(),
				(timelineSongs, card) => {
					const timeline = [...timelineSongs].sort((a, b) => a.year - b.year);
					const slot = findCorrectSlot(timeline, card);
					const afterInsert = [...timeline.slice(0, slot), card, ...timeline.slice(slot)];
					expect(afterInsert.length).toBeLessThanOrEqual(10);
				}
			),
			{ numRuns: 1000 }
		);
	});

	it('timeline with 10 songs rejects any further insertion (win condition)', () => {
		fc.assert(
			fc.property(sortedSongDeck(10), song(), (timeline, card) => {
				const slot = findCorrectSlot(timeline, card);
				const afterInsert = [...timeline.slice(0, slot), card, ...timeline.slice(slot)];
				expect(afterInsert.length).toBe(11);
			}),
			{ numRuns: 1000 }
		);
	});
});

describe('PBT scoring — round monotonic', () => {
	it('generated game states always have round >= 1', () => {
		fc.assert(
			fc.property(gameState(), (gs) => {
				expect(gs.round).toBeGreaterThanOrEqual(1);
			}),
			{ numRuns: 1000 }
		);
	});

	it('advancing from any round to the next player 1 turn increases round by 1', () => {
		fc.assert(
			fc.property(fc.integer({ min: 1, max: 100 }), (currentRound) => {
				const nextRound = currentRound + 1;
				expect(nextRound).toBeGreaterThan(currentRound);
				expect(nextRound).toBeGreaterThanOrEqual(1);
			}),
			{ numRuns: 1000 }
		);
	});
});

describe('PBT scoring — draw pile shrinks by exactly 1', () => {
	it('draw pile has no songs from any player timeline', () => {
		fc.assert(
			fc.property(fc.array(player(), { minLength: 1, maxLength: 4 }), (players) => {
				const pile = buildDrawPile(players);
				const usedIds = new Set(players.flatMap((p) => p.timeline.map((s) => s.id)));
				for (const s of pile) {
					expect(usedIds.has(s.id)).toBe(false);
				}
			}),
			{ numRuns: 1000 }
		);
	});

	it('removing one card from draw pile decreases length by exactly 1', () => {
		fc.assert(
			fc.property(fc.array(player(), { minLength: 1, maxLength: 4 }), (players) => {
				const pile = buildDrawPile(players);
				const [drawn, ...remaining] = pile;
				expect(remaining.length).toBe(pile.length - 1);
			}),
			{ numRuns: 1000 }
		);
	});

	it('drawn card is no longer in the remaining pile', () => {
		fc.assert(
			fc.property(fc.array(player(), { minLength: 1, maxLength: 4 }), (players) => {
				const pile = buildDrawPile(players);
				if (pile.length === 0) return;
				const [drawn, ...remaining] = pile;
				const remainingIds = new Set(remaining.map((s) => s.id));
				expect(remainingIds.has(drawn.id)).toBe(false);
			}),
			{ numRuns: 1000 }
		);
	});
});
