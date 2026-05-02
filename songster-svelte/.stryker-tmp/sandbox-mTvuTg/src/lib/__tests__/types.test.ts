// @ts-nocheck
import { describe, expect, it } from 'vitest';
import type { MusicProvider, Track } from '$lib/types';

describe('Track type', () => {
	it('has required Track fields', () => {
		const track: Track = {
			id: 's01',
			num: 1,
			title: 'Test Song',
			artist: 'Test Artist',
			year: 2020,
			deezer_id: 12345,
			preview_url: 'https://example.com/preview.mp3',
			cover_small: 'https://example.com/cover-small.jpg',
			cover_medium: 'https://example.com/cover-medium.jpg',
			duration: 30,
		};
		expect(track.deezer_id).toBe(12345);
		expect(track.preview_url).toBe('https://example.com/preview.mp3');
	});
});

describe('MusicProvider interface', () => {
	it('can be implemented', async () => {
		const provider: MusicProvider = {
			search: async (_q: string, _limit?: number) => [],
			getTrack: async (_id: number) => null,
		};
		expect(await provider.search('test')).toEqual([]);
		expect(await provider.getTrack(1)).toBeNull();
	});
});
