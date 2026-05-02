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
let params: Record<string, string> = {};
let url = new URL(stryMutAct_9fa48('2211') ? '' : (stryCov_9fa48('2211'), 'http://localhost:5173'));
let routeId = stryMutAct_9fa48('2212') ? 'Stryker was here!' : (stryCov_9fa48('2212'), '');
export function __setPageState(p: Record<string, string>, u?: URL, r?: string) {
	if (stryMutAct_9fa48('2213')) {
		{
		}
	} else {
		stryCov_9fa48('2213');
		params = p;
		if (
			stryMutAct_9fa48('2215')
				? false
				: stryMutAct_9fa48('2214')
					? true
					: (stryCov_9fa48('2214', '2215'), u)
		)
			url = u;
		if (
			stryMutAct_9fa48('2218')
				? r === undefined
				: stryMutAct_9fa48('2217')
					? false
					: stryMutAct_9fa48('2216')
						? true
						: (stryCov_9fa48('2216', '2217', '2218'), r !== undefined)
		)
			routeId = r;
	}
}
export const page = stryMutAct_9fa48('2219')
	? {}
	: (stryCov_9fa48('2219'),
		{
			get params() {
				if (stryMutAct_9fa48('2220')) {
					{
					}
				} else {
					stryCov_9fa48('2220');
					return params;
				}
			},
			get url() {
				if (stryMutAct_9fa48('2221')) {
					{
					}
				} else {
					stryCov_9fa48('2221');
					return url;
				}
			},
			get route() {
				if (stryMutAct_9fa48('2222')) {
					{
					}
				} else {
					stryCov_9fa48('2222');
					return stryMutAct_9fa48('2223')
						? {}
						: (stryCov_9fa48('2223'),
							{
								id: routeId,
							});
				}
			},
			status: 200,
			error: null,
			data: {},
			form: null,
			state: {},
			navigate: () => {},
		});
