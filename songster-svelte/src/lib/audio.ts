import type { Song } from '$lib/types';

const previewUrls = new Map<string, string | null>();
const inflight = new Map<string, Promise<string | null>>();

async function fetchPreviewUrl(song: Song): Promise<string | null> {
	if (previewUrls.has(song.id)) return previewUrls.get(song.id) ?? null;
	const existing = inflight.get(song.id);
	if (existing) return existing;

	const term = encodeURIComponent(`${song.artist} ${song.title}`);
	const url = `https://itunes.apple.com/search?term=${term}&limit=1&media=music&entity=song`;
	const promise = fetch(url)
		.then(r => r.ok ? r.json() : Promise.reject(new Error(`iTunes ${r.status}`)))
		.then((data: { results: Array<{ previewUrl?: string }> }) => {
			const u = data.results?.[0]?.previewUrl ?? null;
			previewUrls.set(song.id, u);
			return u;
		})
		.catch(() => {
			inflight.delete(song.id);
			return null;
		})
		.finally(() => inflight.delete(song.id));
	inflight.set(song.id, promise);
	return promise;
}

let audio: HTMLAudioElement | null = null;

export async function playPreview(song: Song): Promise<void> {
	const url = await fetchPreviewUrl(song);
	stopPreview();
	if (!url) return;
	audio = new Audio(url);
	audio.crossOrigin = 'anonymous';
	audio.volume = 0.8;
	try {
		await audio.play();
	} catch {
		/* autoplay block */
	}
}

export function stopPreview(): void {
	if (audio) {
		audio.pause();
		audio.src = '';
		audio = null;
	}
}

export function preloadPreviews(songs: Song[]): void {
	songs.forEach(s => { void fetchPreviewUrl(s); });
}
