import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$lib/audio', () => ({
	playPreview: vi.fn(() => Promise.resolve()),
	stopPreview: vi.fn(),
	preloadPreviews: vi.fn(),
}));

import { get } from 'svelte/store';
import { game } from '$lib/stores/game';
import { findCorrectSlot } from '$lib/songs';

describe('game store — initial state', () => {
	it('starts in lobby screen', () => {
		expect(get(game.screen)).toBe('lobby');
	});

	it('starts at round 1', () => {
		expect(get(game.round)).toBe(1);
	});

	it('has 4 players', () => {
		expect(get(game.players)).toHaveLength(4);
	});

	it('active player is p1', () => {
		expect(get(game.activePlayerId)).toBe('p1');
	});

	it('phase is draw', () => {
		expect(get(game.phase)).toBe('draw');
	});

	it('no active card initially', () => {
		expect(get(game.activeCard)).toBeNull();
	});

	it('no winner initially', () => {
		expect(get(game.winner)).toBeNull();
	});
});

describe('game.startGame', () => {
	beforeEach(() => {
		game.onReplay();
	});

	it('transitions from lobby to play', () => {
		expect(get(game.screen)).toBe('lobby');
		game.startGame();
		expect(get(game.screen)).toBe('play');
	});

	it('draws a card when starting', () => {
		game.startGame();
		expect(get(game.activeCard)).not.toBeNull();
	});

	it('sets phase to draw', () => {
		game.startGame();
		expect(get(game.phase)).toBe('draw');
	});

	it('is idempotent — calling twice does nothing', () => {
		game.startGame();
		const card = get(game.activeCard);
		game.startGame();
		expect(get(game.activeCard)).toEqual(card);
	});
});

describe('game.onPlay', () => {
	beforeEach(() => {
		game.onReplay();
		game.startGame();
	});

	it('transitions phase to listen', () => {
		game.onPlay();
		expect(get(game.phase)).toBe('listen');
	});

	it('transitions to place after timer', () => {
		vi.useFakeTimers();
		game.onPlay();
		vi.advanceTimersByTime(1500);
		expect(get(game.phase)).toBe('place');
		vi.useRealTimers();
	});
});

describe('game.onPlace', () => {
	beforeEach(() => {
		game.onReplay();
		game.startGame();
	});

	it('rejects placement when not in place phase', () => {
		game.onPlace(0);
		expect(get(game.phase)).toBe('draw');
	});

	it('sets phase to reveal after placement', () => {
		const card = get(game.activeCard)!;
		vi.useFakeTimers();
		game.onPlay();
		vi.advanceTimersByTime(1500);
		vi.useRealTimers();
		game.onPlace(0);
		expect(get(game.phase)).toBe('reveal');
	});

	it('records placedSlot', () => {
		const card = get(game.activeCard)!;
		vi.useFakeTimers();
		game.onPlay();
		vi.advanceTimersByTime(1500);
		vi.useRealTimers();
		game.onPlace(0);
		expect(get(game.placedSlot)).toBe(0);
	});

	it('adds card to timeline on correct placement', () => {
		const card = get(game.activeCard)!;
		const me = get(game.players).find(p => p.id === 'p1')!;
		const correctSlot = findCorrectSlot(me.timeline, card);

		vi.useFakeTimers();
		game.onPlay();
		vi.advanceTimersByTime(1500);

		game.onPlace(correctSlot);
		expect(get(game.placedResult)).toBe(true);
		const after = get(game.players).find(p => p.id === 'p1')!;
		expect(after.timeline.length).toBe(me.timeline.length + 1);
		expect(after.timeline).toContainEqual(card);
		vi.useRealTimers();
	});
});

describe('game.onNextTurn', () => {
	beforeEach(() => {
		game.onReplay();
		game.startGame();
	});

	it('cycles to next player', () => {
		const current = get(game.activePlayerId);
		game.onNextTurn();
		expect(get(game.activePlayerId)).not.toBe(current);
	});

	it('draws next card', () => {
		const before = get(game.activeCard);
		game.onNextTurn();
		expect(get(game.activeCard)).not.toEqual(before);
	});

	it('increments round when wrapping back to p1', () => {
		const players = get(game.players);
		for (let i = 0; i < players.length - 1; i++) {
			game.onNextTurn();
		}
		const roundBefore = get(game.round);
		game.onNextTurn();
		expect(get(game.round)).toBe(roundBefore + 1);
	});
});

describe('game.onReplay', () => {
	it('resets all state back to lobby', () => {
		game.startGame();
		game.onReplay();
		expect(get(game.screen)).toBe('lobby');
		expect(get(game.round)).toBe(1);
		expect(get(game.activeCard)).toBeNull();
		expect(get(game.winner)).toBeNull();
		expect(get(game.phase)).toBe('draw');
	});
});

describe('game.onChallenge', () => {
	beforeEach(() => {
		game.onReplay();
		game.startGame();
	});

	it('is blocked during draw phase', () => {
		const tokensBefore = get(game.players).find(p => p.id === 'p1')!.tokens;
		game.onChallenge();
		const tokensAfter = get(game.players).find(p => p.id === 'p1')!.tokens;
		expect(tokensAfter).toBe(tokensBefore);
		expect(get(game.phase)).toBe('draw');
	});

	it('is blocked when activePlayerId is p1', () => {
		vi.useFakeTimers();
		game.onPlay();
		vi.advanceTimersByTime(1500);
		expect(get(game.phase)).toBe('place');
		const tokensBefore = get(game.players).find(p => p.id === 'p1')!.tokens;
		game.onChallenge();
		const tokensAfter = get(game.players).find(p => p.id === 'p1')!.tokens;
		expect(tokensAfter).toBe(tokensBefore);
		vi.useRealTimers();
	});
});

describe('game.runAiTurn', () => {
	beforeEach(() => {
		game.onReplay();
		game.startGame();
	});

	it('returns undefined when screen is not play', () => {
		game.onReplay();
		expect(game.runAiTurn()).toBeUndefined();
	});

	it('returns undefined when active player is p1', () => {
		expect(game.runAiTurn()).toBeUndefined();
	});

	it('returns a cleanup function when AI should act', () => {
		vi.useFakeTimers();
		game.onNextTurn();
		const cleanup = game.runAiTurn();
		expect(cleanup).toBeTypeOf('function');
		cleanup?.();
		vi.useRealTimers();
	});

	it('AI turn progresses through phases', () => {
		vi.useFakeTimers();
		game.onNextTurn();
		game.runAiTurn();
		vi.advanceTimersByTime(800);
		expect(get(game.phase)).toBe('listen');
		vi.advanceTimersByTime(1200);
		expect(get(game.phase)).toBe('place');
		vi.advanceTimersByTime(1500);
		expect(get(game.phase)).toBe('reveal');
		vi.useRealTimers();
	});

	it('cleanup function cancels pending timers', () => {
		vi.useFakeTimers();
		game.onNextTurn();
		const cleanup = game.runAiTurn();
		cleanup?.();
		vi.advanceTimersByTime(4000);
		expect(get(game.phase)).not.toBe('reveal');
		vi.useRealTimers();
	});
});
