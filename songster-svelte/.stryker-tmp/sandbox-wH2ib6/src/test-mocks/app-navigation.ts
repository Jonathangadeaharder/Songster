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
export function goto(_url: string, _opts?: Record<string, unknown>) {}
export function invalidate(_url?: string) {}
export function invalidateAll() {}
export function preloadData(_url: string) {
	if (stryMutAct_9fa48('2208')) {
		{
		}
	} else {
		stryCov_9fa48('2208');
		return Promise.resolve(
			stryMutAct_9fa48('2209')
				? {}
				: (stryCov_9fa48('2209'),
					{
						type: 'loaded' as const,
						status: 200,
						data: {},
					})
		);
	}
}
export function preloadCode(_url: string) {
	if (stryMutAct_9fa48('2210')) {
		{
		}
	} else {
		stryCov_9fa48('2210');
		return Promise.resolve();
	}
}
export function pushState(_url: string, _state: Record<string, unknown>) {}
export function replaceState(_url: string, _state: Record<string, unknown>) {}
export function beforeNavigate(_cb: unknown) {}
export function afterNavigate(_cb: unknown) {}
