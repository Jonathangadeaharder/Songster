import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deezerProvider } from '$lib/provider/deezer';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('deezerProvider.search', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('returns Track[] from Deezer search response', async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					data: [
						{
							id: 12345,
							title: 'Test Song',
							artist: { name: 'Test Artist' },
							album: {
								title: 'Test Album',
								cover_small: 'cs.jpg',
								cover_medium: 'cm.jpg',
							},
							preview: 'https://example.com/preview.mp3',
							duration: 30,
						},
					],
				}),
		});

		const results = await deezerProvider.search('test query', 5);

		expect(results).toHaveLength(1);
		expect(results[0].deezer_id).toBe(12345);
		expect(results[0].title).toBe('Test Song');
		expect(results[0].artist).toBe('Test Artist');
		expect(results[0].preview_url).toBe('https://example.com/preview.mp3');
	});

	it('returns empty array on empty results', async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ data: [] }),
		});
		const results = await deezerProvider.search('xyz');
		expect(results).toEqual([]);
	});

	it('returns empty array on network error', async () => {
		mockFetch.mockRejectedValue(new Error('network'));
		const results = await deezerProvider.search('test');
		expect(results).toEqual([]);
	});
});

describe('deezerProvider.getTrack', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('returns Track for valid deezer id', async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					id: 12345,
					title: 'Test Song',
					artist: { name: 'Test Artist' },
					album: {
						title: 'Test Album',
						cover_small: 'cs.jpg',
						cover_medium: 'cm.jpg',
					},
					preview: 'https://example.com/preview.mp3',
					duration: 30,
				}),
		});

		const track = await deezerProvider.getTrack(12345);
		expect(track).not.toBeNull();
		expect(track?.deezer_id).toBe(12345);
	});

	it('returns null on 404', async () => {
		mockFetch.mockResolvedValue({ ok: false, status: 404 });
		const track = await deezerProvider.getTrack(99999);
		expect(track).toBeNull();
	});

	it('returns null on network error', async () => {
		mockFetch.mockRejectedValue(new Error('network'));
		const track = await deezerProvider.getTrack(1);
		expect(track).toBeNull();
	});

	it('handles missing optional fields', async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					id: 12345,
					title: 'Test Song',
					artist: { name: 'Test Artist' },
					preview: undefined,
					duration: undefined,
				}),
		});

		const track = await deezerProvider.getTrack(12345);
		expect(track).not.toBeNull();
		expect(track?.preview_url).toBe('');
		expect(track?.duration).toBe(30);
		expect(track?.cover_small).toBeNull();
	});
});

describe('deezerProvider.search edge cases', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('handles missing data array', async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({}),
		});
		const results = await deezerProvider.search('test');
		expect(results).toEqual([]);
	});
});
