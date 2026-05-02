import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Track } from '$lib/types';

const mockAudioPlay = vi.fn().mockResolvedValue(undefined);
const mockAudioPause = vi.fn();
let audioConstructCount = 0;

class MockAudio {
	src = '';
	volume = 1;
	crossOrigin = '';
	play = mockAudioPlay;
	pause = mockAudioPause;
	preload = 'auto';
	constructor() {
		audioConstructCount++;
	}
}

vi.stubGlobal('Audio', MockAudio);

async function getAudio() {
	return import('$lib/audio');
}

describe('AudioManager', () => {
	beforeEach(async () => {
		vi.restoreAllMocks();
		mockAudioPlay.mockResolvedValue(undefined);
		mockAudioPause.mockClear();
		audioConstructCount = 0;
		const { audioManager } = await getAudio();
		audioManager.stop();
	});

	it('plays track with preview_url', async () => {
		const { audioManager } = await getAudio();
		const track: Track = {
			id: 'dz-1',
			num: 1,
			title: 'Song',
			artist: 'Artist',
			year: 2020,
			deezer_id: 1,
			preview_url: 'https://example.com/preview.mp3',
			cover_small: null,
			cover_medium: null,
			duration: 30,
		};
		await audioManager.play(track);
		expect(mockAudioPlay).toHaveBeenCalledTimes(1);
		audioManager.stop();
	});

	it('does not play when no preview_url', async () => {
		const { audioManager } = await getAudio();
		const track: Track = {
			id: 'dz-1',
			num: 1,
			title: 'Song',
			artist: 'Artist',
			year: 2020,
			deezer_id: 1,
			preview_url: '',
			cover_small: null,
			cover_medium: null,
			duration: 30,
		};
		await audioManager.play(track);
		expect(audioConstructCount).toBe(0);
	});

	it('stops active audio', async () => {
		const { audioManager } = await getAudio();
		const track: Track = {
			id: 'dz-1',
			num: 1,
			title: 'Song',
			artist: 'Artist',
			year: 2020,
			deezer_id: 1,
			preview_url: 'https://example.com/preview.mp3',
			cover_small: null,
			cover_medium: null,
			duration: 30,
		};
		await audioManager.play(track);
		audioManager.stop();
		expect(mockAudioPause).toHaveBeenCalled();
	});

	it('preloads tracks', async () => {
		const { audioManager } = await getAudio();
		const tracks: Track[] = [
			{
				id: 'dz-1',
				num: 1,
				title: 'A',
				artist: 'B',
				year: 2020,
				deezer_id: 1,
				preview_url: 'url1',
				cover_small: null,
				cover_medium: null,
				duration: 30,
			},
			{
				id: 'dz-2',
				num: 2,
				title: 'C',
				artist: 'D',
				year: 2021,
				deezer_id: 2,
				preview_url: 'url2',
				cover_small: null,
				cover_medium: null,
				duration: 30,
			},
		];
		expect(() => audioManager.preload(tracks)).not.toThrow();
	});

	it('aborts previous play when new track requested', async () => {
		const { audioManager } = await getAudio();
		const track1: Track = {
			id: 'dz-1',
			num: 1,
			title: 'Song1',
			artist: 'Artist',
			year: 2020,
			deezer_id: 1,
			preview_url: 'https://example.com/1.mp3',
			cover_small: null,
			cover_medium: null,
			duration: 30,
		};
		const track2: Track = {
			id: 'dz-2',
			num: 2,
			title: 'Song2',
			artist: 'Artist',
			year: 2020,
			deezer_id: 2,
			preview_url: 'https://example.com/2.mp3',
			cover_small: null,
			cover_medium: null,
			duration: 30,
		};
		const p1 = audioManager.play(track1);
		const p2 = audioManager.play(track2);
		await Promise.all([p1, p2]);
		expect(mockAudioPlay).toHaveBeenCalled();
	});

	it('handles autoplay policy gracefully', async () => {
		mockAudioPlay.mockRejectedValue(new Error('Autoplay blocked'));
		const { audioManager } = await getAudio();
		const track: Track = {
			id: 'dz-1',
			num: 1,
			title: 'Song',
			artist: 'Artist',
			year: 2020,
			deezer_id: 1,
			preview_url: 'https://example.com/preview.mp3',
			cover_small: null,
			cover_medium: null,
			duration: 30,
		};
		await expect(audioManager.play(track)).resolves.toBeUndefined();
	});

	it('returns early when signal is already aborted', async () => {
		const originalAbortController = globalThis.AbortController;
		let abortControllerInstance: { signal: { aborted: boolean }; abort: () => void } | null = null;

		vi.stubGlobal(
			'AbortController',
			class {
				signal = { aborted: true };
				abort() {
					this.signal.aborted = true;
				}
				constructor() {
					abortControllerInstance = this;
				}
			}
		);

		const { audioManager } = await getAudio();
		const track: Track = {
			id: 'dz-1',
			num: 1,
			title: 'Song',
			artist: 'Artist',
			year: 2020,
			deezer_id: 1,
			preview_url: 'https://example.com/preview.mp3',
			cover_small: null,
			cover_medium: null,
			duration: 30,
		};
		await audioManager.play(track);
		expect(audioConstructCount).toBe(0);

		vi.stubGlobal('AbortController', originalAbortController);
	});
});
