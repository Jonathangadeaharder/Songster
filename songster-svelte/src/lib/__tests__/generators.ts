import fc, { type Arbitrary } from 'fast-check';
import type { Song, Player, GameState, Phase, Screen } from '$lib/types';
import type { Room } from '$lib/room';

// --- Primitive generators ---

export function songId(): Arbitrary<string> {
	return fc.string({ minLength: 3, maxLength: 5 }).map((s) => `s${s}`);
}

export function year(): Arbitrary<number> {
	return fc.integer({ min: 1900, max: 2030 });
}

export function songTitle(): Arbitrary<string> {
	return fc.oneof(
		fc.constantFrom(
			'Bohemian Rhapsody',
			'Thriller',
			'Imagine',
			'Yesterday',
			'Wonderwall',
			'Respect',
			'Dreams',
			'Piano Man'
		),
		fc.string({ minLength: 1, maxLength: 50 })
	);
}

export function artistName(): Arbitrary<string> {
	return fc.oneof(
		fc.constantFrom('Queen', 'The Beatles', 'Adele', 'Nirvana', 'Oasis', 'Daft Punk'),
		fc.string({ minLength: 1, maxLength: 30 })
	);
}

// --- Domain generators ---

export function song(): Arbitrary<Song> {
	return fc.record({
		id: songId(),
		num: fc.integer({ min: 1, max: 100 }),
		title: songTitle(),
		artist: artistName(),
		year: year(),
	});
}

export function sortedSongDeck(n: number): Arbitrary<Song[]> {
	return fc
		.array(song(), { minLength: n, maxLength: n })
		.map((songs) => [...songs].sort((a, b) => a.year - b.year));
}

export function player(): Arbitrary<Player> {
	return fc.record({
		id: fc.uuid(),
		name: fc.string({ minLength: 1, maxLength: 20 }),
		avatar: fc.constantFrom('Y', 'M', 'J', 'K', 'A', 'B', 'C', 'D'),
		timeline: fc.array(song(), { minLength: 0, maxLength: 10 }),
		tokens: fc.integer({ min: 0, max: 5 }),
	});
}

export function phase(): Arbitrary<Phase> {
	return fc.constantFrom('draw', 'listen', 'place', 'reveal', 'challenge');
}

export function screen(): Arbitrary<Screen> {
	return fc.constantFrom('lobby', 'play', 'win');
}

export function gameState(): Arbitrary<GameState> {
	return fc.record({
		screen: screen(),
		round: fc.integer({ min: 1, max: 50 }),
		players: fc.array(player(), { minLength: 1, maxLength: 6 }),
		drawPile: fc.array(song(), { minLength: 0, maxLength: 30 }),
		activeCard: fc.option(song(), { nil: null }),
		activePlayerId: fc.uuid(),
		phase: phase(),
		hoverSlot: fc.option(fc.integer({ min: 0, max: 10 }), { nil: null }),
		placedSlot: fc.option(fc.integer({ min: 0, max: 10 }), { nil: null }),
		placedResult: fc.option(fc.boolean(), { nil: null }),
		interceptor: fc.option(fc.uuid(), { nil: null }),
		winner: fc.option(player(), { nil: null }),
		dragging: fc.boolean(),
	});
}

// --- Room generators ---

export function roomStatus(): Arbitrary<Room['status']> {
	return fc.constantFrom('waiting', 'playing', 'finished');
}

export function room(): Arbitrary<Room> {
	return fc.record({
		id: fc.uuid(),
		code: fc.string({ minLength: 6, maxLength: 6 }).map((s) => s.toUpperCase()),
		host_id: fc.uuid(),
		status: roomStatus(),
		winner_player_id: fc.option(fc.uuid(), { nil: null }),
		created_at: fc
			.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
			.filter((d) => !isNaN(d.getTime()))
			.map((d) => d.toISOString()),
		started_at: fc.oneof(
			fc.constant(null),
			fc
				.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
				.filter((d) => !isNaN(d.getTime()))
				.map((d) => d.toISOString())
		),
	});
}
