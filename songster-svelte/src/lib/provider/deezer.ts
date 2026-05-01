import type { MusicProvider, Track } from '$lib/types';

const DEEZER_API = 'https://api.deezer.com';

function mapDeezerTrack(data: Record<string, unknown>): Track {
	return {
		id: `dz-${data.id}`,
		num: data.id,
		title: data.title,
		artist: data.artist?.name ?? '',
		year: new Date().getFullYear(),
		deezer_id: data.id,
		preview_url: data.preview ?? '',
		cover_small: data.album?.cover_small ?? null,
		cover_medium: data.album?.cover_medium ?? null,
		duration: data.duration ?? 30,
	};
}

export const deezerProvider: MusicProvider = {
	async search(query: string, limit = 10): Promise<Track[]> {
		try {
			const url = `${DEEZER_API}/search?q=${encodeURIComponent(query)}&limit=${limit}&output=json`;
			const res = await fetch(url);
			if (!res.ok) return [];
			const data = await res.json();
			return (data.data ?? []).map(mapDeezerTrack);
		} catch {
			return [];
		}
	},

	async getTrack(deezerId: number): Promise<Track | null> {
		try {
			const url = `${DEEZER_API}/track/${deezerId}`;
			const res = await fetch(url);
			if (!res.ok) return null;
			const data = await res.json();
			return mapDeezerTrack(data);
		} catch {
			return null;
		}
	},
};
