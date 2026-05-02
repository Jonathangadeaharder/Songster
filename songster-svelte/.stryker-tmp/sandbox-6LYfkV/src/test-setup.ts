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
import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { handlers } from './test-mocks/handlers';
Object.defineProperty(
	window,
	stryMutAct_9fa48('2241') ? '' : (stryCov_9fa48('2241'), 'matchMedia'),
	stryMutAct_9fa48('2242')
		? {}
		: (stryCov_9fa48('2242'),
			{
				writable: stryMutAct_9fa48('2243') ? false : (stryCov_9fa48('2243'), true),
				value: vi.fn().mockImplementation(
					stryMutAct_9fa48('2244')
						? () => undefined
						: (stryCov_9fa48('2244'),
							(query: string) =>
								stryMutAct_9fa48('2245')
									? {}
									: (stryCov_9fa48('2245'),
										{
											matches: stryMutAct_9fa48('2246') ? true : (stryCov_9fa48('2246'), false),
											media: query,
											onchange: null,
											addEventListener: vi.fn(),
											removeEventListener: vi.fn(),
											dispatchEvent: vi.fn(),
										}))
				),
			})
);
const server = setupServer(...handlers);
beforeAll(
	stryMutAct_9fa48('2247') ? () => undefined : (stryCov_9fa48('2247'), () => server.listen())
);
afterEach(
	stryMutAct_9fa48('2248') ? () => undefined : (stryCov_9fa48('2248'), () => server.resetHandlers())
);
afterAll(
	stryMutAct_9fa48('2249') ? () => undefined : (stryCov_9fa48('2249'), () => server.close())
);
