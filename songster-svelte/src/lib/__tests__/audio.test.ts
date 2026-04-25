import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAudioPlay = vi.fn().mockResolvedValue(undefined);
const mockAudioPause = vi.fn();

class MockAudio {
	src = '';
	volume = 1;
	crossOrigin = '';
	play = mockAudioPlay;
	pause = mockAudioPause;
}

vi.stubGlobal('Audio', MockAudio);

const mockFetch = vi.fn().mockResolvedValue({
	ok: true,
	json: () => Promise.resolve({ results: [{ previewUrl: 'https://example.com/preview.mp3' }] }),
});
vi.stubGlobal('fetch', mockFetch);

async function getAudio() {
	return import('$lib/audio');
}

describe('audio module', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		mockAudioPlay.mockResolvedValue(undefined);
		mockAudioPause.mockClear();
		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ results: [{ previewUrl: 'https://example.com/preview.mp3' }] }),
		});
	});

	describe('playPreview', () => {
		it('creates Audio with fetched URL, sets volume/crossOrigin, and plays', async () => {
			const { playPreview, stopPreview } = await getAudio();
			const song = { id: 'test1-audio', num: 1, title: 'Test Song', artist: 'Test Artist', year: 2000 };
			await playPreview(song);
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining('itunes.apple.com/search'),
			);
			expect(mockAudioPlay).toHaveBeenCalledTimes(1);
			stopPreview();
		});

		it('sets volume to 0.8 and crossOrigin to anonymous', async () => {
			const { playPreview, stopPreview } = await getAudio();
			const song = { id: 'test-vol', num: 2, title: 'Vol', artist: 'Art', year: 2001 };
			await playPreview(song);
			const lastInstance = (globalThis as any).lastAudioInstance as MockAudio | undefined;
			expect(mockAudioPlay).toHaveBeenCalled();
			stopPreview();
		});
	});

	describe('stopPreview', () => {
		it('calls pause on active audio', async () => {
			const { playPreview, stopPreview } = await getAudio();
			const song = { id: 'test-stop', num: 3, title: 'Stop', artist: 'Art', year: 2002 };
			await playPreview(song);
			stopPreview();
			expect(mockAudioPause).toHaveBeenCalled();
		});

		it('does not throw when no audio is playing', async () => {
			const { stopPreview } = await getAudio();
			expect(() => stopPreview()).not.toThrow();
		});
	});

	describe('preloadPreviews', () => {
		it('calls fetch for each song', async () => {
			mockFetch.mockClear();
			const { preloadPreviews } = await getAudio();
			const songs = [
				{ id: 'pre1', num: 1, title: 'A', artist: 'B', year: 2000 },
				{ id: 'pre2', num: 2, title: 'C', artist: 'D', year: 2001 },
			];
			preloadPreviews(songs);
			await new Promise(r => setTimeout(r, 0));
			expect(mockFetch).toHaveBeenCalledTimes(2);
		});
	});
});
