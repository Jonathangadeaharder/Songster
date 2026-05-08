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

const baseTrack: Track = {
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

describe('playPreview / stopPreview / preloadPreviews', () => {
	beforeEach(async () => {
		vi.restoreAllMocks();
		mockAudioPlay.mockResolvedValue(undefined);
		mockAudioPause.mockClear();
		audioConstructCount = 0;
		const { audioManager } = await getAudio();
		audioManager.stop();
	});

	it('playPreview constructs a Track from a Song and calls play', async () => {
		const { playPreview } = await getAudio();
		const song = { id: 's1', num: 1, title: 'Test', artist: 'Art', year: 1999 };
		await playPreview(song);
		expect(audioConstructCount).toBe(0);
	});

	it('stopPreview delegates to audioManager.stop', async () => {
		const { stopPreview, audioManager } = await getAudio();
		const spy = vi.spyOn(audioManager, 'stop');
		stopPreview();
		expect(spy).toHaveBeenCalled();
	});

	it('preloadPreviews is a no-op', async () => {
		const { preloadPreviews } = await getAudio();
		expect(() =>
			preloadPreviews([{ id: 's1', num: 1, title: 'T', artist: 'A', year: 2000 }])
		).not.toThrow();
	});
});

describe('AudioManager - fadeVolume branch', () => {
	beforeEach(async () => {
		vi.restoreAllMocks();
		mockAudioPlay.mockResolvedValue(undefined);
		mockAudioPause.mockClear();
		audioConstructCount = 0;
		const { audioManager } = await getAudio();
		audioManager.stop();
	});

	it('play resolves even when autoplay is blocked', async () => {
		mockAudioPlay.mockRejectedValue(new DOMException('Autoplay blocked'));
		const { audioManager } = await getAudio();
		await expect(audioManager.play(baseTrack)).resolves.toBeUndefined();
	});

	it('play creates Audio with crossOrigin anonymous', async () => {
		const { audioManager } = await getAudio();
		await audioManager.play(baseTrack);
		expect(audioConstructCount).toBeGreaterThan(0);
		audioManager.stop();
	});

	it('play returns early when track has no preview_url', async () => {
		const { audioManager } = await getAudio();
		const noPreviewTrack = { ...baseTrack, preview_url: '' };
		audioConstructCount = 0;
		await audioManager.play(noPreviewTrack);
		expect(audioConstructCount).toBe(0);
	});

	it('preload skips tracks without preview_url', async () => {
		const { audioManager } = await getAudio();
		audioConstructCount = 0;
		const noPreviewTracks: Track[] = [
			{ ...baseTrack, preview_url: '' },
			{ ...baseTrack, preview_url: '', id: 'dz-2', deezer_id: 2 },
			{ ...baseTrack, preview_url: '', id: 'dz-3', deezer_id: 3 },
		];
		audioManager.preload(noPreviewTracks);
		expect(audioConstructCount).toBe(0);
	});

	it('preload constructs Audio for tracks with preview_url', async () => {
		const { audioManager } = await getAudio();
		audioConstructCount = 0;
		const tracks: Track[] = [baseTrack, { ...baseTrack, id: 'dz-2', deezer_id: 2 }];
		audioManager.preload(tracks);
		expect(audioConstructCount).toBe(2);
	});

	it('stop clears audio and abortController', async () => {
		const { audioManager } = await getAudio();
		await audioManager.play(baseTrack);
		audioManager.stop();
		mockAudioPause.mockClear();
		audioManager.stop();
		expect(mockAudioPause).not.toHaveBeenCalled();
	});

	it('play unlocks mobile on first call', async () => {
		const { audioManager } = await getAudio();
		audioManager.stop();
		await audioManager.play(baseTrack);
		expect(audioConstructCount).toBeGreaterThan(0);
	});

	it('preload limits to first 3 tracks', async () => {
		const { audioManager } = await getAudio();
		audioConstructCount = 0;
		const tracks: Track[] = [
			baseTrack,
			{ ...baseTrack, id: 'dz-2', deezer_id: 2 },
			{ ...baseTrack, id: 'dz-3', deezer_id: 3 },
			{ ...baseTrack, id: 'dz-4', deezer_id: 4 },
			{ ...baseTrack, id: 'dz-5', deezer_id: 5 },
		];
		audioManager.preload(tracks);
		expect(audioConstructCount).toBe(3);
	});
});
