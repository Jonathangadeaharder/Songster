// @ts-nocheck
function stryNS_9fa48() {
	var g =
		(typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis) ||
		new Function('return this')();
	var ns = g.__stryker__ || (g.__stryker__ = {});
	if (
		ns.activeMutant === undefined &&
		g.process &&
		g.process.env &&
		g.process.env.__STRYKER_ACTIVE_MUTANT__
	) {
		ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
	}
	function retrieveNS() {
		return ns;
	}
	stryNS_9fa48 = retrieveNS;
	return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
	var ns = stryNS_9fa48();
	var cov =
		ns.mutantCoverage ||
		(ns.mutantCoverage = {
			static: {},
			perTest: {},
		});
	function cover() {
		var c = cov.static;
		if (ns.currentTestId) {
			c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
		}
		var a = arguments;
		for (var i = 0; i < a.length; i++) {
			c[a[i]] = (c[a[i]] || 0) + 1;
		}
	}
	stryCov_9fa48 = cover;
	cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
	var ns = stryNS_9fa48();
	function isActive(id) {
		if (ns.activeMutant === id) {
			if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
				throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
			}
			return true;
		}
		return false;
	}
	stryMutAct_9fa48 = isActive;
	return isActive(id);
}
import type { DeezerTrackData, MusicProvider, Track } from '$lib/types';
const DEEZER_API = stryMutAct_9fa48('421') ? '' : (stryCov_9fa48('421'), 'https://api.deezer.com');
function parseReleaseYear(data: DeezerTrackData): number | undefined {
	if (stryMutAct_9fa48('422')) {
		{
		}
	} else {
		stryCov_9fa48('422');
		if (
			stryMutAct_9fa48('425')
				? false
				: stryMutAct_9fa48('424')
					? true
					: stryMutAct_9fa48('423')
						? data.release_date
						: (stryCov_9fa48('423', '424', '425'), !data.release_date)
		)
			return undefined;
		const year = parseInt(
			stryMutAct_9fa48('426')
				? data.release_date
				: (stryCov_9fa48('426'), data.release_date.substring(0, 4)),
			10
		);
		return Number.isNaN(year) ? undefined : year;
	}
}
function mapDeezerTrack(data: DeezerTrackData): Track {
	if (stryMutAct_9fa48('427')) {
		{
		}
	} else {
		stryCov_9fa48('427');
		return stryMutAct_9fa48('428')
			? {}
			: (stryCov_9fa48('428'),
				{
					id: stryMutAct_9fa48('429') ? `` : (stryCov_9fa48('429'), `dz-${data.id}`),
					num: data.id,
					title: data.title,
					artist: stryMutAct_9fa48('430')
						? data.artist?.name && ''
						: (stryCov_9fa48('430'),
							(stryMutAct_9fa48('431')
								? data.artist.name
								: (stryCov_9fa48('431'), data.artist?.name)) ??
								(stryMutAct_9fa48('432') ? 'Stryker was here!' : (stryCov_9fa48('432'), ''))),
					year: stryMutAct_9fa48('433')
						? parseReleaseYear(data) && 0
						: (stryCov_9fa48('433'), parseReleaseYear(data) ?? 0),
					deezer_id: data.id,
					preview_url: stryMutAct_9fa48('434')
						? data.preview && ''
						: (stryCov_9fa48('434'),
							data.preview ??
								(stryMutAct_9fa48('435') ? 'Stryker was here!' : (stryCov_9fa48('435'), ''))),
					cover_small: stryMutAct_9fa48('436')
						? data.album?.cover_small && null
						: (stryCov_9fa48('436'),
							(stryMutAct_9fa48('437')
								? data.album.cover_small
								: (stryCov_9fa48('437'), data.album?.cover_small)) ?? null),
					cover_medium: stryMutAct_9fa48('438')
						? data.album?.cover_medium && null
						: (stryCov_9fa48('438'),
							(stryMutAct_9fa48('439')
								? data.album.cover_medium
								: (stryCov_9fa48('439'), data.album?.cover_medium)) ?? null),
					duration: stryMutAct_9fa48('440')
						? data.duration && 30
						: (stryCov_9fa48('440'), data.duration ?? 30),
				});
	}
}
export const deezerProvider: MusicProvider = stryMutAct_9fa48('441')
	? {}
	: (stryCov_9fa48('441'),
		{
			async search(query: string, limit = 10): Promise<Track[]> {
				if (stryMutAct_9fa48('442')) {
					{
					}
				} else {
					stryCov_9fa48('442');
					try {
						if (stryMutAct_9fa48('443')) {
							{
							}
						} else {
							stryCov_9fa48('443');
							const url = stryMutAct_9fa48('444')
								? ``
								: (stryCov_9fa48('444'),
									`${DEEZER_API}/search?q=${encodeURIComponent(query)}&limit=${limit}&output=json`);
							const res = await fetch(url);
							if (
								stryMutAct_9fa48('447')
									? false
									: stryMutAct_9fa48('446')
										? true
										: stryMutAct_9fa48('445')
											? res.ok
											: (stryCov_9fa48('445', '446', '447'), !res.ok)
							)
								return stryMutAct_9fa48('448') ? ['Stryker was here'] : (stryCov_9fa48('448'), []);
							const data = await res.json();
							return (
								stryMutAct_9fa48('449')
									? data.data && []
									: (stryCov_9fa48('449'),
										data.data ??
											(stryMutAct_9fa48('450') ? ['Stryker was here'] : (stryCov_9fa48('450'), [])))
							).map(mapDeezerTrack);
						}
					} catch {
						if (stryMutAct_9fa48('451')) {
							{
							}
						} else {
							stryCov_9fa48('451');
							return stryMutAct_9fa48('452') ? ['Stryker was here'] : (stryCov_9fa48('452'), []);
						}
					}
				}
			},
			async getTrack(deezerId: number): Promise<Track | null> {
				if (stryMutAct_9fa48('453')) {
					{
					}
				} else {
					stryCov_9fa48('453');
					try {
						if (stryMutAct_9fa48('454')) {
							{
							}
						} else {
							stryCov_9fa48('454');
							const url = stryMutAct_9fa48('455')
								? ``
								: (stryCov_9fa48('455'), `${DEEZER_API}/track/${deezerId}`);
							const res = await fetch(url);
							if (
								stryMutAct_9fa48('458')
									? false
									: stryMutAct_9fa48('457')
										? true
										: stryMutAct_9fa48('456')
											? res.ok
											: (stryCov_9fa48('456', '457', '458'), !res.ok)
							)
								return null;
							const data = await res.json();
							return mapDeezerTrack(data);
						}
					} catch {
						if (stryMutAct_9fa48('459')) {
							{
							}
						} else {
							stryCov_9fa48('459');
							return null;
						}
					}
				}
			},
		});
