import { describe, it, expect } from 'vitest';
import {
	SONG_DECK,
	shuffled,
	seededPlayers,
	buildDrawPile,
	validatePlacement,
	findCorrectSlot,
	trackToSong,
} from '$lib/songs';
import type { Song, Track } from '$lib/types';

describe('SONG_DECK', () => {
	it('has 30 songs', () => {
		expect(SONG_DECK).toHaveLength(30);
	});

	it('every song has required fields', () => {
		for (const s of SONG_DECK) {
			expect(s).toHaveProperty('id');
			expect(s).toHaveProperty('num');
			expect(s).toHaveProperty('title');
			expect(s).toHaveProperty('artist');
			expect(s).toHaveProperty('year');
			expect(typeof s.year).toBe('number');
			expect(s.year).toBeGreaterThan(1900);
		}
	});

	it('has unique ids', () => {
		const ids = new Set(SONG_DECK.map((s) => s.id));
		expect(ids.size).toBe(SONG_DECK.length);
	});
});

describe('shuffled', () => {
	it('returns an array of the same length', () => {
		const result = shuffled([1, 2, 3, 4, 5]);
		expect(result).toHaveLength(5);
	});

	it('contains the same elements', () => {
		const input = [1, 2, 3, 4, 5];
		const result = shuffled(input);
		expect([...result].sort()).toEqual([...input].sort());
	});

	it('does not mutate the original array', () => {
		const input = [1, 2, 3, 4, 5];
		const copy = [...input];
		shuffled(input);
		expect(input).toEqual(copy);
	});

	it('can shuffle an empty array', () => {
		expect(shuffled([])).toEqual([]);
	});
});

describe('seededPlayers', () => {
	it('returns 4 players', () => {
		const players = seededPlayers();
		expect(players).toHaveLength(4);
	});

	it('each player has 1 starting song in timeline', () => {
		const players = seededPlayers();
		for (const p of players) {
			expect(p.timeline).toHaveLength(1);
		}
	});

	it('starting songs are unique across players', () => {
		const players = seededPlayers();
		const ids = players.flatMap((p) => p.timeline.map((s) => s.id));
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('each player has 3 tokens', () => {
		const players = seededPlayers();
		for (const p of players) {
			expect(p.tokens).toBe(3);
		}
	});

	it('player ids are p1-p4', () => {
		const players = seededPlayers();
		expect(players.map((p) => p.id)).toEqual(['p1', 'p2', 'p3', 'p4']);
	});
});

describe('buildDrawPile', () => {
	it('excludes songs already in player timelines', () => {
		const players = seededPlayers();
		const pile = buildDrawPile(players);
		const used = new Set(players.flatMap((p) => p.timeline.map((s) => s.id)));
		for (const s of pile) {
			expect(used.has(s.id)).toBe(false);
		}
	});

	it('returns 26 cards when 4 are used (30 - 4)', () => {
		const players = seededPlayers();
		const pile = buildDrawPile(players);
		expect(pile).toHaveLength(26);
	});
});

describe('validatePlacement', () => {
	const card1980: Song = { id: 'x1', num: 99, title: 'Test', artist: 'Test', year: 1980 };
	const card1970: Song = { id: 'x2', num: 98, title: 'Test', artist: 'Test', year: 1970 };
	const card1990: Song = { id: 'x3', num: 97, title: 'Test', artist: 'Test', year: 1990 };

	it('accepts placement at beginning when card year <= first song', () => {
		const timeline: Song[] = [{ id: 'a', num: 1, title: 'A', artist: 'X', year: 1985 }];
		expect(validatePlacement(timeline, card1970, 0)).toBe(true);
	});

	it('accepts placement at end when card year >= last song', () => {
		const timeline: Song[] = [{ id: 'a', num: 1, title: 'A', artist: 'X', year: 1975 }];
		expect(validatePlacement(timeline, card1990, 1)).toBe(true);
	});

	it('accepts placement between two songs in correct order', () => {
		const timeline: Song[] = [
			{ id: 'a', num: 1, title: 'A', artist: 'X', year: 1970 },
			{ id: 'b', num: 2, title: 'B', artist: 'X', year: 1990 },
		];
		expect(validatePlacement(timeline, card1980, 1)).toBe(true);
	});

	it('rejects placement when card year is before previous song', () => {
		const timeline: Song[] = [{ id: 'a', num: 1, title: 'A', artist: 'X', year: 1990 }];
		expect(validatePlacement(timeline, card1970, 1)).toBe(false);
	});

	it('rejects placement when card year is after next song', () => {
		const timeline: Song[] = [{ id: 'a', num: 1, title: 'A', artist: 'X', year: 1970 }];
		expect(validatePlacement(timeline, card1990, 0)).toBe(false);
	});

	it('accepts placement in empty timeline at slot 0', () => {
		expect(validatePlacement([], card1980, 0)).toBe(true);
	});

	it('handles equal years correctly — same year can go after', () => {
		const timeline: Song[] = [{ id: 'a', num: 1, title: 'A', artist: 'X', year: 1980 }];
		expect(validatePlacement(timeline, card1980, 1)).toBe(true);
	});

	it('handles equal years correctly — same year can go before', () => {
		const timeline: Song[] = [{ id: 'a', num: 1, title: 'A', artist: 'X', year: 1980 }];
		expect(validatePlacement(timeline, card1980, 0)).toBe(true);
	});
});

describe('findCorrectSlot', () => {
	it('returns 0 for empty timeline', () => {
		const card: Song = { id: 'x', num: 1, title: 'X', artist: 'Y', year: 1980 };
		expect(findCorrectSlot([], card)).toBe(0);
	});

	it('returns first valid position', () => {
		const timeline: Song[] = [
			{ id: 'a', num: 1, title: 'A', artist: 'X', year: 1970 },
			{ id: 'b', num: 2, title: 'B', artist: 'X', year: 1990 },
		];
		const card: Song = { id: 'x', num: 99, title: 'X', artist: 'Y', year: 1980 };
		expect(findCorrectSlot(timeline, card)).toBe(1);
	});

	it('returns 0 when card is oldest', () => {
		const timeline: Song[] = [{ id: 'a', num: 1, title: 'A', artist: 'X', year: 1980 }];
		const card: Song = { id: 'x', num: 99, title: 'X', artist: 'Y', year: 1970 };
		expect(findCorrectSlot(timeline, card)).toBe(0);
	});

	it('returns length when card is newest', () => {
		const timeline: Song[] = [{ id: 'a', num: 1, title: 'A', artist: 'X', year: 1980 }];
		const card: Song = { id: 'x', num: 99, title: 'X', artist: 'Y', year: 1990 };
		expect(findCorrectSlot(timeline, card)).toBe(1);
	});

	it('returns first valid slot for unsorted timeline with overlapping years', () => {
		const timeline: Song[] = [
			{ id: 'a', num: 1, title: 'A', artist: 'X', year: 1990 },
			{ id: 'b', num: 2, title: 'B', artist: 'X', year: 1970 },
		];
		const card: Song = { id: 'x', num: 99, title: 'X', artist: 'Y', year: 1980 };
		expect(findCorrectSlot(timeline, card)).toBe(0);
	});
});

describe('trackToSong', () => {
	it('converts Track to Song', () => {
		const track: Track = {
			id: 'dz-123',
			num: 123,
			title: 'Song',
			artist: 'Artist',
			year: 2020,
			deezer_id: 123,
			preview_url: 'url',
			cover_small: null,
			cover_medium: null,
			duration: 30,
		};
		const song = trackToSong(track);
		expect(song.id).toBe(track.id);
		expect(song.num).toBe(track.num);
		expect(song.title).toBe(track.title);
		expect(song.artist).toBe(track.artist);
		expect(song.year).toBe(track.year);
		expect(song).not.toHaveProperty('preview_url');
	});
});
