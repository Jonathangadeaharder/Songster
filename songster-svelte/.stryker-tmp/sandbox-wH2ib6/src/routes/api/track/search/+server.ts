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
const DEEZER_API = stryMutAct_9fa48('1551')
	? ''
	: (stryCov_9fa48('1551'), 'https://api.deezer.com');
const cache = new Map<
	string,
	{
		data: Track[];
		expires: number;
	}
>();
const CACHE_TTL = stryMutAct_9fa48('1552')
	? (5 * 60) / 1000
	: (stryCov_9fa48('1552'),
		(stryMutAct_9fa48('1553') ? 5 / 60 : (stryCov_9fa48('1553'), 5 * 60)) * 1000); // 5 minutes
const MAX_CACHE_SIZE = 100;
function parseReleaseYear(data: DeezerTrackData): number | undefined {
	if (stryMutAct_9fa48('1554')) {
		{
		}
	} else {
		stryCov_9fa48('1554');
		if (
			stryMutAct_9fa48('1557')
				? false
				: stryMutAct_9fa48('1556')
					? true
					: stryMutAct_9fa48('1555')
						? data.release_date
						: (stryCov_9fa48('1555', '1556', '1557'), !data.release_date)
		)
			return undefined;
		const year = parseInt(
			stryMutAct_9fa48('1558')
				? data.release_date
				: (stryCov_9fa48('1558'), data.release_date.substring(0, 4)),
			10
		);
		return Number.isNaN(year) ? undefined : year;
	}
}
function mapDeezerTrack(data: DeezerTrackData): Track {
	if (stryMutAct_9fa48('1559')) {
		{
		}
	} else {
		stryCov_9fa48('1559');
		return stryMutAct_9fa48('1560')
			? {}
			: (stryCov_9fa48('1560'),
				{
					id: stryMutAct_9fa48('1561') ? `` : (stryCov_9fa48('1561'), `dz-${data.id}`),
					num: data.id,
					title: data.title,
					artist: stryMutAct_9fa48('1562')
						? data.artist?.name && ''
						: (stryCov_9fa48('1562'),
							(stryMutAct_9fa48('1563')
								? data.artist.name
								: (stryCov_9fa48('1563'), data.artist?.name)) ??
								(stryMutAct_9fa48('1564') ? 'Stryker was here!' : (stryCov_9fa48('1564'), ''))),
					year: stryMutAct_9fa48('1565')
						? parseReleaseYear(data) && 0
						: (stryCov_9fa48('1565'), parseReleaseYear(data) ?? 0),
					deezer_id: data.id,
					preview_url: stryMutAct_9fa48('1566')
						? data.preview && ''
						: (stryCov_9fa48('1566'),
							data.preview ??
								(stryMutAct_9fa48('1567') ? 'Stryker was here!' : (stryCov_9fa48('1567'), ''))),
					cover_small: stryMutAct_9fa48('1568')
						? data.album?.cover_small && null
						: (stryCov_9fa48('1568'),
							(stryMutAct_9fa48('1569')
								? data.album.cover_small
								: (stryCov_9fa48('1569'), data.album?.cover_small)) ?? null),
					cover_medium: stryMutAct_9fa48('1570')
						? data.album?.cover_medium && null
						: (stryCov_9fa48('1570'),
							(stryMutAct_9fa48('1571')
								? data.album.cover_medium
								: (stryCov_9fa48('1571'), data.album?.cover_medium)) ?? null),
					duration: stryMutAct_9fa48('1572')
						? data.duration && 30
						: (stryCov_9fa48('1572'), data.duration ?? 30),
				});
	}
}
function getCached(key: string): Track[] | undefined {
	if (stryMutAct_9fa48('1573')) {
		{
		}
	} else {
		stryCov_9fa48('1573');
		const entry = cache.get(key);
		if (
			stryMutAct_9fa48('1576')
				? entry || entry.expires > Date.now()
				: stryMutAct_9fa48('1575')
					? false
					: stryMutAct_9fa48('1574')
						? true
						: (stryCov_9fa48('1574', '1575', '1576'),
							entry &&
								(stryMutAct_9fa48('1579')
									? entry.expires <= Date.now()
									: stryMutAct_9fa48('1578')
										? entry.expires >= Date.now()
										: stryMutAct_9fa48('1577')
											? true
											: (stryCov_9fa48('1577', '1578', '1579'), entry.expires > Date.now())))
		)
			return entry.data;
		if (
			stryMutAct_9fa48('1581')
				? false
				: stryMutAct_9fa48('1580')
					? true
					: (stryCov_9fa48('1580', '1581'), entry)
		)
			cache.delete(key);
		return undefined;
	}
}
function setCached(key: string, data: Track[]): void {
	if (stryMutAct_9fa48('1582')) {
		{
		}
	} else {
		stryCov_9fa48('1582');
		if (
			stryMutAct_9fa48('1586')
				? cache.size < MAX_CACHE_SIZE
				: stryMutAct_9fa48('1585')
					? cache.size > MAX_CACHE_SIZE
					: stryMutAct_9fa48('1584')
						? false
						: stryMutAct_9fa48('1583')
							? true
							: (stryCov_9fa48('1583', '1584', '1585', '1586'), cache.size >= MAX_CACHE_SIZE)
		) {
			if (stryMutAct_9fa48('1587')) {
				{
				}
			} else {
				stryCov_9fa48('1587');
				const oldest = cache.keys().next().value;
				if (
					stryMutAct_9fa48('1590')
						? oldest === undefined
						: stryMutAct_9fa48('1589')
							? false
							: stryMutAct_9fa48('1588')
								? true
								: (stryCov_9fa48('1588', '1589', '1590'), oldest !== undefined)
				)
					cache.delete(oldest);
			}
		}
		cache.set(
			key,
			stryMutAct_9fa48('1591')
				? {}
				: (stryCov_9fa48('1591'),
					{
						data,
						expires: stryMutAct_9fa48('1592')
							? Date.now() - CACHE_TTL
							: (stryCov_9fa48('1592'), Date.now() + CACHE_TTL),
					})
		);
	}
}
export const GET: RequestHandler = async ({ url }) => {
	if (stryMutAct_9fa48('1593')) {
		{
		}
	} else {
		stryCov_9fa48('1593');
		const query = url.searchParams.get(
			stryMutAct_9fa48('1594') ? '' : (stryCov_9fa48('1594'), 'q')
		);
		let limit = parseInt(
			stryMutAct_9fa48('1595')
				? url.searchParams.get('limit') && '10'
				: (stryCov_9fa48('1595'),
					url.searchParams.get(stryMutAct_9fa48('1596') ? '' : (stryCov_9fa48('1596'), 'limit')) ??
						(stryMutAct_9fa48('1597') ? '' : (stryCov_9fa48('1597'), '10'))),
			10
		);
		if (
			stryMutAct_9fa48('1600')
				? Number.isNaN(limit) && limit <= 0
				: stryMutAct_9fa48('1599')
					? false
					: stryMutAct_9fa48('1598')
						? true
						: (stryCov_9fa48('1598', '1599', '1600'),
							Number.isNaN(limit) ||
								(stryMutAct_9fa48('1603')
									? limit > 0
									: stryMutAct_9fa48('1602')
										? limit < 0
										: stryMutAct_9fa48('1601')
											? false
											: (stryCov_9fa48('1601', '1602', '1603'), limit <= 0)))
		) {
			if (stryMutAct_9fa48('1604')) {
				{
				}
			} else {
				stryCov_9fa48('1604');
				limit = 10;
			}
		}
		limit = stryMutAct_9fa48('1605')
			? Math.max(limit, 50)
			: (stryCov_9fa48('1605'), Math.min(limit, 50));
		if (
			stryMutAct_9fa48('1608')
				? false
				: stryMutAct_9fa48('1607')
					? true
					: stryMutAct_9fa48('1606')
						? query
						: (stryCov_9fa48('1606', '1607', '1608'), !query)
		) {
			if (stryMutAct_9fa48('1609')) {
				{
				}
			} else {
				stryCov_9fa48('1609');
				throw error(
					400,
					stryMutAct_9fa48('1610') ? '' : (stryCov_9fa48('1610'), 'Missing query parameter: q')
				);
			}
		}
		const cacheKey = stryMutAct_9fa48('1611') ? `` : (stryCov_9fa48('1611'), `${query}:${limit}`);
		const cached = getCached(cacheKey);
		if (
			stryMutAct_9fa48('1613')
				? false
				: stryMutAct_9fa48('1612')
					? true
					: (stryCov_9fa48('1612', '1613'), cached)
		)
			return json(cached);
		try {
			if (stryMutAct_9fa48('1614')) {
				{
				}
			} else {
				stryCov_9fa48('1614');
				const deezerUrl = stryMutAct_9fa48('1615')
					? ``
					: (stryCov_9fa48('1615'),
						`${DEEZER_API}/search?q=${encodeURIComponent(query)}&limit=${limit}&output=json`);
				const res = await fetch(deezerUrl);
				if (
					stryMutAct_9fa48('1618')
						? res.status !== 429
						: stryMutAct_9fa48('1617')
							? false
							: stryMutAct_9fa48('1616')
								? true
								: (stryCov_9fa48('1616', '1617', '1618'), res.status === 429)
				) {
					if (stryMutAct_9fa48('1619')) {
						{
						}
					} else {
						stryCov_9fa48('1619');
						const retryAfter = stryMutAct_9fa48('1620')
							? res.headers.get('Retry-After') && '60'
							: (stryCov_9fa48('1620'),
								res.headers.get(
									stryMutAct_9fa48('1621') ? '' : (stryCov_9fa48('1621'), 'Retry-After')
								) ?? (stryMutAct_9fa48('1622') ? '' : (stryCov_9fa48('1622'), '60')));
						return new Response(
							JSON.stringify(
								stryMutAct_9fa48('1623')
									? {}
									: (stryCov_9fa48('1623'),
										{
											message: stryMutAct_9fa48('1624')
												? ''
												: (stryCov_9fa48('1624'), 'Rate limited by music provider'),
										})
							),
							stryMutAct_9fa48('1625')
								? {}
								: (stryCov_9fa48('1625'),
									{
										status: 503,
										headers: stryMutAct_9fa48('1626')
											? {}
											: (stryCov_9fa48('1626'),
												{
													'Content-Type': stryMutAct_9fa48('1627')
														? ''
														: (stryCov_9fa48('1627'), 'application/json'),
													'Retry-After': retryAfter,
												}),
									})
						);
					}
				}
				if (
					stryMutAct_9fa48('1630')
						? false
						: stryMutAct_9fa48('1629')
							? true
							: stryMutAct_9fa48('1628')
								? res.ok
								: (stryCov_9fa48('1628', '1629', '1630'), !res.ok)
				) {
					if (stryMutAct_9fa48('1631')) {
						{
						}
					} else {
						stryCov_9fa48('1631');
						throw error(
							502,
							stryMutAct_9fa48('1632') ? '' : (stryCov_9fa48('1632'), 'Music provider unavailable')
						);
					}
				}
				const data = await res.json();
				const tracks: Track[] = (
					stryMutAct_9fa48('1633')
						? data.data && []
						: (stryCov_9fa48('1633'),
							data.data ??
								(stryMutAct_9fa48('1634') ? ['Stryker was here'] : (stryCov_9fa48('1634'), [])))
				).map(mapDeezerTrack);
				setCached(cacheKey, tracks);
				return json(tracks);
			}
		} catch (e) {
			if (stryMutAct_9fa48('1635')) {
				{
				}
			} else {
				stryCov_9fa48('1635');
				if (
					stryMutAct_9fa48('1638')
						? (e && typeof e === 'object') || 'status' in e
						: stryMutAct_9fa48('1637')
							? false
							: stryMutAct_9fa48('1636')
								? true
								: (stryCov_9fa48('1636', '1637', '1638'),
									(stryMutAct_9fa48('1640')
										? e || typeof e === 'object'
										: stryMutAct_9fa48('1639')
											? true
											: (stryCov_9fa48('1639', '1640'),
												e &&
													(stryMutAct_9fa48('1642')
														? typeof e !== 'object'
														: stryMutAct_9fa48('1641')
															? true
															: (stryCov_9fa48('1641', '1642'),
																typeof e ===
																	(stryMutAct_9fa48('1643')
																		? ''
																		: (stryCov_9fa48('1643'), 'object')))))) &&
										(stryMutAct_9fa48('1644') ? '' : (stryCov_9fa48('1644'), 'status')) in e)
				)
					throw e;
				throw error(
					502,
					stryMutAct_9fa48('1645') ? '' : (stryCov_9fa48('1645'), 'Music provider unavailable')
				);
			}
		}
	}
};
