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
import { writable } from 'svelte/store';
import type { Tweaks } from '$lib/types';
const TWEAK_DEFAULTS: Tweaks = stryMutAct_9fa48('1392')
	? {}
	: (stryCov_9fa48('1392'),
		{
			theme: stryMutAct_9fa48('1393') ? '' : (stryCov_9fa48('1393'), 'light'),
			artStyle: stryMutAct_9fa48('1394') ? '' : (stryCov_9fa48('1394'), 'grooves'),
			flipStyle: stryMutAct_9fa48('1395') ? '' : (stryCov_9fa48('1395'), 'flip'),
			density: stryMutAct_9fa48('1396') ? '' : (stryCov_9fa48('1396'), 'regular'),
			animIntensity: 1,
			interceptionEnabled: stryMutAct_9fa48('1397') ? false : (stryCov_9fa48('1397'), true),
		});
function createTweaksStore() {
	if (stryMutAct_9fa48('1398')) {
		{
		}
	} else {
		stryCov_9fa48('1398');
		let initial = TWEAK_DEFAULTS;
		if (
			stryMutAct_9fa48('1401')
				? typeof window === 'undefined'
				: stryMutAct_9fa48('1400')
					? false
					: stryMutAct_9fa48('1399')
						? true
						: (stryCov_9fa48('1399', '1400', '1401'),
							typeof window !==
								(stryMutAct_9fa48('1402') ? '' : (stryCov_9fa48('1402'), 'undefined')))
		) {
			if (stryMutAct_9fa48('1403')) {
				{
				}
			} else {
				stryCov_9fa48('1403');
				try {
					if (stryMutAct_9fa48('1404')) {
						{
						}
					} else {
						stryCov_9fa48('1404');
						const raw = localStorage.getItem(
							stryMutAct_9fa48('1405') ? '' : (stryCov_9fa48('1405'), 'songster.tweaks')
						);
						if (
							stryMutAct_9fa48('1407')
								? false
								: stryMutAct_9fa48('1406')
									? true
									: (stryCov_9fa48('1406', '1407'), raw)
						)
							initial = stryMutAct_9fa48('1408')
								? {}
								: (stryCov_9fa48('1408'),
									{
										...TWEAK_DEFAULTS,
										...JSON.parse(raw),
									});
					}
				} catch {
					/* ignore */
				}
			}
		}
		const { subscribe, update } = writable<Tweaks>(initial);
		return stryMutAct_9fa48('1409')
			? {}
			: (stryCov_9fa48('1409'),
				{
					subscribe,
					set<K extends keyof Tweaks>(key: K, val: Tweaks[K]) {
						if (stryMutAct_9fa48('1410')) {
							{
							}
						} else {
							stryCov_9fa48('1410');
							update((prev) => {
								if (stryMutAct_9fa48('1411')) {
									{
									}
								} else {
									stryCov_9fa48('1411');
									const next = stryMutAct_9fa48('1412')
										? {}
										: (stryCov_9fa48('1412'),
											{
												...prev,
												[key]: val,
											});
									if (
										stryMutAct_9fa48('1415')
											? typeof window === 'undefined'
											: stryMutAct_9fa48('1414')
												? false
												: stryMutAct_9fa48('1413')
													? true
													: (stryCov_9fa48('1413', '1414', '1415'),
														typeof window !==
															(stryMutAct_9fa48('1416')
																? ''
																: (stryCov_9fa48('1416'), 'undefined')))
									) {
										if (stryMutAct_9fa48('1417')) {
											{
											}
										} else {
											stryCov_9fa48('1417');
											try {
												if (stryMutAct_9fa48('1418')) {
													{
													}
												} else {
													stryCov_9fa48('1418');
													localStorage.setItem(
														stryMutAct_9fa48('1419')
															? ''
															: (stryCov_9fa48('1419'), 'songster.tweaks'),
														JSON.stringify(next)
													);
												}
											} catch {
												/* ignore */
											}
										}
									}
									return next;
								}
							});
						}
					},
				});
	}
}
export const tweaks = createTweaksStore();
