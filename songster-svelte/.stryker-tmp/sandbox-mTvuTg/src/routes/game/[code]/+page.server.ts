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
 * Route guard: a game session requires an authenticated or anonymous user.
 * If no session exists at all (not even anon), redirect to login.
 * The client-side store will handle room validation.
 */
export const load: PageServerLoad = async ({ locals, params }) => {
	if (stryMutAct_9fa48('1710')) {
		{
		}
	} else {
		stryCov_9fa48('1710');
		const { session } = await locals.safeGetSession();
		if (
			stryMutAct_9fa48('1713')
				? false
				: stryMutAct_9fa48('1712')
					? true
					: stryMutAct_9fa48('1711')
						? session
						: (stryCov_9fa48('1711', '1712', '1713'), !session)
		) {
			if (stryMutAct_9fa48('1714')) {
				{
				}
			} else {
				stryCov_9fa48('1714');
				// Preserve destination so auth/callback can redirect back
				const redirectTo = encodeURIComponent(
					stryMutAct_9fa48('1715') ? `` : (stryCov_9fa48('1715'), `/game/${params.code}`)
				);
				throw redirect(
					303,
					stryMutAct_9fa48('1716')
						? ``
						: (stryCov_9fa48('1716'), `/auth/login?redirectTo=${redirectTo}`)
				);
			}
		}
		return stryMutAct_9fa48('1717')
			? {}
			: (stryCov_9fa48('1717'),
				{
					code: params.code,
				});
	}
};
