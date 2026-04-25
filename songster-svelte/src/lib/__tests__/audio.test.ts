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

async function getAudio() {
	return import('$lib/audio');
}

describe('audio module', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		mockAudioPlay.mockResolvedValue(undefined);
	});

	describe('playPreview', () => {
		it('does not throw when called with a valid song', async () => {
			const { playPreview, stopPreview } = await getAudio();
			const song = { id: 'test1-audio', num: 1, title: 'Test Song', artist: 'Test Artist', year: 2000 };
			await expect(playPreview(song)).resolves.toBeUndefined();
			stopPreview();
		});
	});

	describe('stopPreview', () => {
		it('does not throw when no audio is playing', async () => {
			const { stopPreview } = await getAudio();
			expect(() => stopPreview()).not.toThrow();
		});
	});

	describe('preloadPreviews', () => {
		it('does not throw when called with a list of songs', async () => {
			const { preloadPreviews } = await getAudio();
			const songs = [
				{ id: 'pre1', num: 1, title: 'A', artist: 'B', year: 2000 },
				{ id: 'pre2', num: 2, title: 'C', artist: 'D', year: 2001 },
			];
			expect(() => preloadPreviews(songs)).not.toThrow();
		});
	});
});
