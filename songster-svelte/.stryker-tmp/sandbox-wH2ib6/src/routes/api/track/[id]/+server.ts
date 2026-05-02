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
import { error, json } from '@sveltejs/kit';
import type { DeezerTrackData, Track } from '$lib/types';
import type { RequestHandler } from './$types';
const DEEZER_API = stryMutAct_9fa48('1498')
	? ''
	: (stryCov_9fa48('1498'), 'https://api.deezer.com');
function parseReleaseYear(data: DeezerTrackData): number | undefined {
	if (stryMutAct_9fa48('1499')) {
		{
		}
	} else {
		stryCov_9fa48('1499');
		if (
			stryMutAct_9fa48('1502')
				? false
				: stryMutAct_9fa48('1501')
					? true
					: stryMutAct_9fa48('1500')
						? data.release_date
						: (stryCov_9fa48('1500', '1501', '1502'), !data.release_date)
		)
			return undefined;
		const year = parseInt(
			stryMutAct_9fa48('1503')
				? data.release_date
				: (stryCov_9fa48('1503'), data.release_date.substring(0, 4)),
			10
		);
		return Number.isNaN(year) ? undefined : year;
	}
}
function mapDeezerTrack(data: DeezerTrackData): Track {
	if (stryMutAct_9fa48('1504')) {
		{
		}
	} else {
		stryCov_9fa48('1504');
		return stryMutAct_9fa48('1505')
			? {}
			: (stryCov_9fa48('1505'),
				{
					id: stryMutAct_9fa48('1506') ? `` : (stryCov_9fa48('1506'), `dz-${data.id}`),
					num: data.id,
					title: data.title,
					artist: stryMutAct_9fa48('1507')
						? data.artist?.name && ''
						: (stryCov_9fa48('1507'),
							(stryMutAct_9fa48('1508')
								? data.artist.name
								: (stryCov_9fa48('1508'), data.artist?.name)) ??
								(stryMutAct_9fa48('1509') ? 'Stryker was here!' : (stryCov_9fa48('1509'), ''))),
					year: stryMutAct_9fa48('1510')
						? parseReleaseYear(data) && 0
						: (stryCov_9fa48('1510'), parseReleaseYear(data) ?? 0),
					deezer_id: data.id,
					preview_url: stryMutAct_9fa48('1511')
						? data.preview && ''
						: (stryCov_9fa48('1511'),
							data.preview ??
								(stryMutAct_9fa48('1512') ? 'Stryker was here!' : (stryCov_9fa48('1512'), ''))),
					cover_small: stryMutAct_9fa48('1513')
						? data.album?.cover_small && null
						: (stryCov_9fa48('1513'),
							(stryMutAct_9fa48('1514')
								? data.album.cover_small
								: (stryCov_9fa48('1514'), data.album?.cover_small)) ?? null),
					cover_medium: stryMutAct_9fa48('1515')
						? data.album?.cover_medium && null
						: (stryCov_9fa48('1515'),
							(stryMutAct_9fa48('1516')
								? data.album.cover_medium
								: (stryCov_9fa48('1516'), data.album?.cover_medium)) ?? null),
					duration: stryMutAct_9fa48('1517')
						? data.duration && 30
						: (stryCov_9fa48('1517'), data.duration ?? 30),
				});
	}
}
export const GET: RequestHandler = async ({ params }) => {
	if (stryMutAct_9fa48('1518')) {
		{
		}
	} else {
		stryCov_9fa48('1518');
		const deezerId = parseInt(params.id, 10);
		if (
			stryMutAct_9fa48('1520')
				? false
				: stryMutAct_9fa48('1519')
					? true
					: (stryCov_9fa48('1519', '1520'), Number.isNaN(deezerId))
		) {
			if (stryMutAct_9fa48('1521')) {
				{
				}
			} else {
				stryCov_9fa48('1521');
				throw error(
					400,
					stryMutAct_9fa48('1522') ? '' : (stryCov_9fa48('1522'), 'Invalid track ID')
				);
			}
		}
		try {
			if (stryMutAct_9fa48('1523')) {
				{
				}
			} else {
				stryCov_9fa48('1523');
				const res = await fetch(
					stryMutAct_9fa48('1524') ? `` : (stryCov_9fa48('1524'), `${DEEZER_API}/track/${deezerId}`)
				);
				if (
					stryMutAct_9fa48('1527')
						? res.status !== 404
						: stryMutAct_9fa48('1526')
							? false
							: stryMutAct_9fa48('1525')
								? true
								: (stryCov_9fa48('1525', '1526', '1527'), res.status === 404)
				) {
					if (stryMutAct_9fa48('1528')) {
						{
						}
					} else {
						stryCov_9fa48('1528');
						throw error(
							404,
							stryMutAct_9fa48('1529') ? '' : (stryCov_9fa48('1529'), 'Track not found')
						);
					}
				}
				if (
					stryMutAct_9fa48('1532')
						? res.status !== 429
						: stryMutAct_9fa48('1531')
							? false
							: stryMutAct_9fa48('1530')
								? true
								: (stryCov_9fa48('1530', '1531', '1532'), res.status === 429)
				) {
					if (stryMutAct_9fa48('1533')) {
						{
						}
					} else {
						stryCov_9fa48('1533');
						throw error(
							503,
							stryMutAct_9fa48('1534') ? '' : (stryCov_9fa48('1534'), 'Music provider rate limited')
						);
					}
				}
				if (
					stryMutAct_9fa48('1537')
						? false
						: stryMutAct_9fa48('1536')
							? true
							: stryMutAct_9fa48('1535')
								? res.ok
								: (stryCov_9fa48('1535', '1536', '1537'), !res.ok)
				) {
					if (stryMutAct_9fa48('1538')) {
						{
						}
					} else {
						stryCov_9fa48('1538');
						throw error(
							502,
							stryMutAct_9fa48('1539') ? '' : (stryCov_9fa48('1539'), 'Music provider unavailable')
						);
					}
				}
				const data = await res.json();
				const track = mapDeezerTrack(data);
				return json(track);
			}
		} catch (e) {
			if (stryMutAct_9fa48('1540')) {
				{
				}
			} else {
				stryCov_9fa48('1540');
				if (
					stryMutAct_9fa48('1543')
						? (e && typeof e === 'object') || 'status' in e
						: stryMutAct_9fa48('1542')
							? false
							: stryMutAct_9fa48('1541')
								? true
								: (stryCov_9fa48('1541', '1542', '1543'),
									(stryMutAct_9fa48('1545')
										? e || typeof e === 'object'
										: stryMutAct_9fa48('1544')
											? true
											: (stryCov_9fa48('1544', '1545'),
												e &&
													(stryMutAct_9fa48('1547')
														? typeof e !== 'object'
														: stryMutAct_9fa48('1546')
															? true
															: (stryCov_9fa48('1546', '1547'),
																typeof e ===
																	(stryMutAct_9fa48('1548')
																		? ''
																		: (stryCov_9fa48('1548'), 'object')))))) &&
										(stryMutAct_9fa48('1549') ? '' : (stryCov_9fa48('1549'), 'status')) in e)
				)
					throw e;
				throw error(
					502,
					stryMutAct_9fa48('1550') ? '' : (stryCov_9fa48('1550'), 'Music provider unavailable')
				);
			}
		}
	}
};
