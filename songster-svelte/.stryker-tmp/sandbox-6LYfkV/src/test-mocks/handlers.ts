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
import { HttpResponse, http } from 'msw';
import searchFixture from '../test-fixtures/deezer-search-response.json';
import trackFixture from '../test-fixtures/deezer-track-response.json';
export const handlers = stryMutAct_9fa48('2231')
	? []
	: (stryCov_9fa48('2231'),
		[
			http.get(stryMutAct_9fa48('2232') ? '' : (stryCov_9fa48('2232'), '/api/track/search'), () => {
				if (stryMutAct_9fa48('2233')) {
					{
					}
				} else {
					stryCov_9fa48('2233');
					return HttpResponse.json(
						searchFixture.data.map(
							stryMutAct_9fa48('2234')
								? () => undefined
								: (stryCov_9fa48('2234'),
									(d: any) =>
										stryMutAct_9fa48('2235')
											? {}
											: (stryCov_9fa48('2235'),
												{
													id: stryMutAct_9fa48('2236') ? `` : (stryCov_9fa48('2236'), `dz-${d.id}`),
													num: d.id,
													title: d.title,
													artist: d.artist.name,
													year: 1975,
													deezer_id: d.id,
													preview_url: d.preview,
													cover_small: d.album.cover_small,
													cover_medium: d.album.cover_medium,
													duration: d.duration,
												}))
						)
					);
				}
			}),
			http.get(
				stryMutAct_9fa48('2237') ? '' : (stryCov_9fa48('2237'), '/api/track/:id'),
				({ params }) => {
					if (stryMutAct_9fa48('2238')) {
						{
						}
					} else {
						stryCov_9fa48('2238');
						return HttpResponse.json(
							stryMutAct_9fa48('2239')
								? {}
								: (stryCov_9fa48('2239'),
									{
										id: stryMutAct_9fa48('2240') ? `` : (stryCov_9fa48('2240'), `dz-${params.id}`),
										num: Number(params.id),
										title: trackFixture.title,
										artist: trackFixture.artist.name,
										year: 1975,
										deezer_id: Number(params.id),
										preview_url: trackFixture.preview,
										cover_small: trackFixture.album.cover_small,
										cover_medium: trackFixture.album.cover_medium,
										duration: trackFixture.duration,
									})
						);
					}
				}
			),
		]);
