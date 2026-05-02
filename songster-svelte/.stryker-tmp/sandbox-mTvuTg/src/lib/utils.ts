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
import type { Theme } from './types';
export function colors(theme: Theme) {
	if (stryMutAct_9fa48('1420')) {
		{
		}
	} else {
		stryCov_9fa48('1420');
		const isDark = stryMutAct_9fa48('1423')
			? theme !== 'dark'
			: stryMutAct_9fa48('1422')
				? false
				: stryMutAct_9fa48('1421')
					? true
					: (stryCov_9fa48('1421', '1422', '1423'),
						theme === (stryMutAct_9fa48('1424') ? '' : (stryCov_9fa48('1424'), 'dark')));
		return stryMutAct_9fa48('1425')
			? {}
			: (stryCov_9fa48('1425'),
				{
					primary: isDark
						? stryMutAct_9fa48('1426')
							? ''
							: (stryCov_9fa48('1426'), '#f4efe4')
						: stryMutAct_9fa48('1427')
							? ''
							: (stryCov_9fa48('1427'), '#0a0a0a'),
					paper: isDark
						? stryMutAct_9fa48('1428')
							? ''
							: (stryCov_9fa48('1428'), '#0a0a0a')
						: stryMutAct_9fa48('1429')
							? ''
							: (stryCov_9fa48('1429'), '#f4efe4'),
					muted: isDark
						? stryMutAct_9fa48('1430')
							? ''
							: (stryCov_9fa48('1430'), 'rgba(244,239,228,0.4)')
						: stryMutAct_9fa48('1431')
							? ''
							: (stryCov_9fa48('1431'), 'rgba(10,10,10,0.4)'),
				});
	}
}
