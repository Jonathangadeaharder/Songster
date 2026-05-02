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
import { createServerClient } from '@supabase/ssr';
import type { Session } from '@supabase/supabase-js';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
const isPlaceholder = stryMutAct_9fa48('2')
	? PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ||
		PUBLIC_SUPABASE_ANON_KEY === 'placeholder-anon-key'
	: stryMutAct_9fa48('1')
		? false
		: stryMutAct_9fa48('0')
			? true
			: (stryCov_9fa48('0', '1', '2'),
				(stryMutAct_9fa48('4')
					? PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
					: stryMutAct_9fa48('3')
						? true
						: (stryCov_9fa48('3', '4'),
							PUBLIC_SUPABASE_URL ===
								(stryMutAct_9fa48('5')
									? ''
									: (stryCov_9fa48('5'), 'https://placeholder.supabase.co')))) &&
					(stryMutAct_9fa48('7')
						? PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-anon-key'
						: stryMutAct_9fa48('6')
							? true
							: (stryCov_9fa48('6', '7'),
								PUBLIC_SUPABASE_ANON_KEY ===
									(stryMutAct_9fa48('8') ? '' : (stryCov_9fa48('8'), 'placeholder-anon-key')))));
export const handle: Handle = async ({ event, resolve }) => {
	if (stryMutAct_9fa48('9')) {
		{
		}
	} else {
		stryCov_9fa48('9');
		if (
			stryMutAct_9fa48('11')
				? false
				: stryMutAct_9fa48('10')
					? true
					: (stryCov_9fa48('10', '11'), isPlaceholder)
		) {
			if (stryMutAct_9fa48('12')) {
				{
				}
			} else {
				stryCov_9fa48('12');
				// CI / E2E mode: skip real Supabase auth and provide a dummy session so
				// server-side route guards pass without redirecting to /auth/login.
				event.locals.supabase = createServerClient(
					PUBLIC_SUPABASE_URL,
					PUBLIC_SUPABASE_ANON_KEY,
					stryMutAct_9fa48('13')
						? {}
						: (stryCov_9fa48('13'),
							{
								cookies: stryMutAct_9fa48('14')
									? {}
									: (stryCov_9fa48('14'),
										{
											getAll: stryMutAct_9fa48('15')
												? () => undefined
												: (stryCov_9fa48('15'), () => event.cookies.getAll()),
											setAll: (
												cookies: {
													name: string;
													value: string;
													options: Record<string, unknown>;
												}[]
											) => {
												if (stryMutAct_9fa48('16')) {
													{
													}
												} else {
													stryCov_9fa48('16');
													for (const { name, value, options } of cookies) {
														if (stryMutAct_9fa48('17')) {
															{
															}
														} else {
															stryCov_9fa48('17');
															event.cookies.set(
																name,
																value,
																stryMutAct_9fa48('18')
																	? {}
																	: (stryCov_9fa48('18'),
																		{
																			...options,
																			path: stryMutAct_9fa48('19')
																				? ''
																				: (stryCov_9fa48('19'), '/'),
																		})
															);
														}
													}
												}
											},
										}),
							})
				);
				event.locals.safeGetSession = stryMutAct_9fa48('20')
					? () => undefined
					: (stryCov_9fa48('20'),
						async () =>
							stryMutAct_9fa48('21')
								? {}
								: (stryCov_9fa48('21'),
									{
										session: {
											user: {
												id: '00000000-0000-0000-0000-000000000000',
											},
											access_token: 'placeholder',
											refresh_token: '',
											expires_in: 3600,
											token_type: 'bearer',
										} as unknown as Session,
									}));
				return resolve(
					event,
					stryMutAct_9fa48('22')
						? {}
						: (stryCov_9fa48('22'),
							{
								filterSerializedResponseHeaders: stryMutAct_9fa48('23')
									? () => undefined
									: (stryCov_9fa48('23'),
										(name) =>
											stryMutAct_9fa48('26')
												? name !== 'content-range'
												: stryMutAct_9fa48('25')
													? false
													: stryMutAct_9fa48('24')
														? true
														: (stryCov_9fa48('24', '25', '26'),
															name ===
																(stryMutAct_9fa48('27')
																	? ''
																	: (stryCov_9fa48('27'), 'content-range')))),
							})
				);
			}
		}
		event.locals.supabase = createServerClient(
			PUBLIC_SUPABASE_URL,
			PUBLIC_SUPABASE_ANON_KEY,
			stryMutAct_9fa48('28')
				? {}
				: (stryCov_9fa48('28'),
					{
						cookies: stryMutAct_9fa48('29')
							? {}
							: (stryCov_9fa48('29'),
								{
									getAll: stryMutAct_9fa48('30')
										? () => undefined
										: (stryCov_9fa48('30'), () => event.cookies.getAll()),
									setAll: (
										cookies: {
											name: string;
											value: string;
											options: Record<string, unknown>;
										}[]
									) => {
										if (stryMutAct_9fa48('31')) {
											{
											}
										} else {
											stryCov_9fa48('31');
											for (const { name, value, options } of cookies) {
												if (stryMutAct_9fa48('32')) {
													{
													}
												} else {
													stryCov_9fa48('32');
													event.cookies.set(
														name,
														value,
														stryMutAct_9fa48('33')
															? {}
															: (stryCov_9fa48('33'),
																{
																	...options,
																	path: stryMutAct_9fa48('34') ? '' : (stryCov_9fa48('34'), '/'),
																})
													);
												}
											}
										}
									},
								}),
					})
		);
		event.locals.safeGetSession = async () => {
			if (stryMutAct_9fa48('35')) {
				{
				}
			} else {
				stryCov_9fa48('35');
				const {
					data: { user },
				} = await event.locals.supabase.auth.getUser();
				if (
					stryMutAct_9fa48('38')
						? false
						: stryMutAct_9fa48('37')
							? true
							: stryMutAct_9fa48('36')
								? user
								: (stryCov_9fa48('36', '37', '38'), !user)
				)
					return stryMutAct_9fa48('39')
						? {}
						: (stryCov_9fa48('39'),
							{
								session: null,
							});
				const {
					data: { session },
				} = await event.locals.supabase.auth.getSession();
				return stryMutAct_9fa48('40')
					? {}
					: (stryCov_9fa48('40'),
						{
							session,
						});
			}
		};
		return resolve(
			event,
			stryMutAct_9fa48('41')
				? {}
				: (stryCov_9fa48('41'),
					{
						filterSerializedResponseHeaders: stryMutAct_9fa48('42')
							? () => undefined
							: (stryCov_9fa48('42'),
								(name) =>
									stryMutAct_9fa48('45')
										? name !== 'content-range'
										: stryMutAct_9fa48('44')
											? false
											: stryMutAct_9fa48('43')
												? true
												: (stryCov_9fa48('43', '44', '45'),
													name ===
														(stryMutAct_9fa48('46')
															? ''
															: (stryCov_9fa48('46'), 'content-range')))),
					})
		);
	}
};
