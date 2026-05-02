import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { gameState, phase, player, screen, song } from './generators';

const VALID_PHASES = ['draw', 'listen', 'place', 'reveal', 'challenge'] as const;
const VALID_SCREENS = ['lobby', 'play', 'win'] as const;

describe('PBT type-validation — Song shape', () => {
	it('generated songs always have string id, number num, string title, string artist, number year', () => {
		fc.assert(
			fc.property(song(), (s) => {
				expect(typeof s.id).toBe('string');
				expect(s.id.length).toBeGreaterThan(0);
				expect(typeof s.num).toBe('number');
				expect(Number.isFinite(s.num)).toBe(true);
				expect(typeof s.title).toBe('string');
				expect(typeof s.artist).toBe('string');
				expect(typeof s.year).toBe('number');
				expect(Number.isFinite(s.year)).toBe(true);
			}),
			{ numRuns: 1000 }
		);
	});
});

describe('PBT type-validation — Player shape', () => {
	it('generated players always have string id, string name, array timeline, number tokens >= 0', () => {
		fc.assert(
			fc.property(player(), (p) => {
				expect(typeof p.id).toBe('string');
				expect(p.id.length).toBeGreaterThan(0);
				expect(typeof p.name).toBe('string');
				expect(typeof p.avatar).toBe('string');
				expect(Array.isArray(p.timeline)).toBe(true);
				expect(typeof p.tokens).toBe('number');
				expect(p.tokens).toBeGreaterThanOrEqual(0);
				expect(Number.isFinite(p.tokens)).toBe(true);
			}),
			{ numRuns: 1000 }
		);
	});
});

describe('PBT type-validation — GameState shape', () => {
	it('generated game states always have valid screen, phase, and structural integrity', () => {
		fc.assert(
			fc.property(gameState(), (gs) => {
				// screen is valid
				expect(VALID_SCREENS).toContain(gs.screen);
				// phase is valid
				expect(VALID_PHASES).toContain(gs.phase);
				// round is a positive integer
				expect(typeof gs.round).toBe('number');
				expect(gs.round).toBeGreaterThanOrEqual(1);
				expect(Number.isInteger(gs.round)).toBe(true);
				// players is a non-empty array
				expect(Array.isArray(gs.players)).toBe(true);
				expect(gs.players.length).toBeGreaterThanOrEqual(1);
				// drawPile is an array
				expect(Array.isArray(gs.drawPile)).toBe(true);
				// activeCard is Song or null
				if (gs.activeCard !== null) {
					expect(typeof gs.activeCard.id).toBe('string');
					expect(typeof gs.activeCard.year).toBe('number');
				}
				// activePlayerId is string
				expect(typeof gs.activePlayerId).toBe('string');
				// nullable fields
				expect(gs.hoverSlot === null || typeof gs.hoverSlot === 'number').toBe(true);
				expect(gs.placedSlot === null || typeof gs.placedSlot === 'number').toBe(true);
				expect(gs.placedResult === null || typeof gs.placedResult === 'boolean').toBe(true);
				expect(gs.interceptor === null || typeof gs.interceptor === 'string').toBe(true);
				// winner is Player or null
				if (gs.winner !== null) {
					expect(typeof gs.winner.id).toBe('string');
					expect(Array.isArray(gs.winner.timeline)).toBe(true);
				}
				expect(typeof gs.dragging).toBe('boolean');
			}),
			{ numRuns: 1000 }
		);
	});
});

describe('PBT type-validation — Phase/Screen exhaustive', () => {
	it('generated phases are always one of the 5 valid values', () => {
		fc.assert(
			fc.property(phase(), (p) => {
				expect(VALID_PHASES).toContain(p);
			}),
			{ numRuns: 1000 }
		);
	});

	it('generated screens are always one of the 3 valid values', () => {
		fc.assert(
			fc.property(screen(), (s) => {
				expect(VALID_SCREENS).toContain(s);
			}),
			{ numRuns: 1000 }
		);
	});
});

describe('PBT type-validation — Timeline invariant', () => {
	it('player timelines never exceed 10 songs', () => {
		fc.assert(
			fc.property(player(), (p) => {
				expect(p.timeline.length).toBeLessThanOrEqual(10);
				// every element in timeline is a valid Song
				for (const s of p.timeline) {
					expect(typeof s.id).toBe('string');
					expect(typeof s.num).toBe('number');
					expect(typeof s.title).toBe('string');
					expect(typeof s.artist).toBe('string');
					expect(typeof s.year).toBe('number');
				}
			}),
			{ numRuns: 1000 }
		);
	});
});
