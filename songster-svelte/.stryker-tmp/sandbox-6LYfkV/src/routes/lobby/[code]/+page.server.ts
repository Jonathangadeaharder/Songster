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
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Route guard: the lobby requires a session (anon or authenticated).
 * Unauthenticated visitors are redirected to login.
 */
export const load: PageServerLoad = async ({ locals, params }) => {
	if (stryMutAct_9fa48('2081')) {
		{
		}
	} else {
		stryCov_9fa48('2081');
		const { session } = await locals.safeGetSession();
		if (
			stryMutAct_9fa48('2084')
				? false
				: stryMutAct_9fa48('2083')
					? true
					: stryMutAct_9fa48('2082')
						? session
						: (stryCov_9fa48('2082', '2083', '2084'), !session)
		) {
			if (stryMutAct_9fa48('2085')) {
				{
				}
			} else {
				stryCov_9fa48('2085');
				const redirectTo = encodeURIComponent(
					stryMutAct_9fa48('2086') ? `` : (stryCov_9fa48('2086'), `/lobby/${params.code}`)
				);
				throw redirect(
					303,
					stryMutAct_9fa48('2087')
						? ``
						: (stryCov_9fa48('2087'), `/auth/login?redirectTo=${redirectTo}`)
				);
			}
		}
		return stryMutAct_9fa48('2088')
			? {}
			: (stryCov_9fa48('2088'),
				{
					code: params.code,
				});
	}
};
