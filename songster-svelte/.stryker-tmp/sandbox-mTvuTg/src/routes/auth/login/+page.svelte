<script context="module">
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
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { supabase } from '$lib/supabase';
	let email = $state(stryMutAct_9fa48('1652') ? 'Stryker was here!' : (stryCov_9fa48('1652'), ''));
	let password = $state(
		stryMutAct_9fa48('1653') ? 'Stryker was here!' : (stryCov_9fa48('1653'), '')
	);
	let loading = $state(stryMutAct_9fa48('1654') ? true : (stryCov_9fa48('1654'), false));
	let error = $state(stryMutAct_9fa48('1655') ? 'Stryker was here!' : (stryCov_9fa48('1655'), ''));
	let message = $state(
		stryMutAct_9fa48('1656') ? 'Stryker was here!' : (stryCov_9fa48('1656'), '')
	);

	/** Destination to return to after auth (from route guard redirect). */
	const redirectTo: string = $derived(
		(
			stryMutAct_9fa48('1659')
				? typeof page.url?.searchParams?.get !== 'function'
				: stryMutAct_9fa48('1658')
					? false
					: stryMutAct_9fa48('1657')
						? true
						: (stryCov_9fa48('1657', '1658', '1659'),
							typeof (stryMutAct_9fa48('1661')
								? page.url.searchParams?.get
								: stryMutAct_9fa48('1660')
									? page.url?.searchParams.get
									: (stryCov_9fa48('1660', '1661'), page.url?.searchParams?.get)) ===
								(stryMutAct_9fa48('1662') ? '' : (stryCov_9fa48('1662'), 'function')))
		)
			? (() => {
					if (stryMutAct_9fa48('1663')) {
						{
						}
					} else {
						stryCov_9fa48('1663');
						const raw = stryMutAct_9fa48('1664')
							? page.url.searchParams.get('redirectTo') && '/'
							: (stryCov_9fa48('1664'),
								page.url.searchParams.get(
									stryMutAct_9fa48('1665') ? '' : (stryCov_9fa48('1665'), 'redirectTo')
								) ?? (stryMutAct_9fa48('1666') ? '' : (stryCov_9fa48('1666'), '/')));
						const isInternal = stryMutAct_9fa48('1669')
							? raw.startsWith('/') || !raw.startsWith('//')
							: stryMutAct_9fa48('1668')
								? false
								: stryMutAct_9fa48('1667')
									? true
									: (stryCov_9fa48('1667', '1668', '1669'),
										(stryMutAct_9fa48('1670')
											? raw.endsWith('/')
											: (stryCov_9fa48('1670'),
												raw.startsWith(
													stryMutAct_9fa48('1671') ? '' : (stryCov_9fa48('1671'), '/')
												))) &&
											(stryMutAct_9fa48('1672')
												? raw.startsWith('//')
												: (stryCov_9fa48('1672'),
													!(stryMutAct_9fa48('1673')
														? raw.endsWith('//')
														: (stryCov_9fa48('1673'),
															raw.startsWith(
																stryMutAct_9fa48('1674') ? '' : (stryCov_9fa48('1674'), '//')
															))))));
						return isInternal ? raw : stryMutAct_9fa48('1675') ? '' : (stryCov_9fa48('1675'), '/');
					}
				})()
			: stryMutAct_9fa48('1676')
				? ''
				: (stryCov_9fa48('1676'), '/')
	);
	async function handleLogin() {
		if (stryMutAct_9fa48('1677')) {
			{
			}
		} else {
			stryCov_9fa48('1677');
			loading = stryMutAct_9fa48('1678') ? false : (stryCov_9fa48('1678'), true);
			error = stryMutAct_9fa48('1679') ? 'Stryker was here!' : (stryCov_9fa48('1679'), '');
			message = stryMutAct_9fa48('1680') ? 'Stryker was here!' : (stryCov_9fa48('1680'), '');
			const { error: err } = await supabase.auth.signInWithPassword(
				stryMutAct_9fa48('1681')
					? {}
					: (stryCov_9fa48('1681'),
						{
							email,
							password,
						})
			);
			if (
				stryMutAct_9fa48('1683')
					? false
					: stryMutAct_9fa48('1682')
						? true
						: (stryCov_9fa48('1682', '1683'), err)
			) {
				if (stryMutAct_9fa48('1684')) {
					{
					}
				} else {
					stryCov_9fa48('1684');
					error = err.message;
					loading = stryMutAct_9fa48('1685') ? true : (stryCov_9fa48('1685'), false);
					return;
				}
			}
			window.location.replace(redirectTo);
		}
	}
	async function handleSignup() {
		if (stryMutAct_9fa48('1686')) {
			{
			}
		} else {
			stryCov_9fa48('1686');
			loading = stryMutAct_9fa48('1687') ? false : (stryCov_9fa48('1687'), true);
			error = stryMutAct_9fa48('1688') ? 'Stryker was here!' : (stryCov_9fa48('1688'), '');
			message = stryMutAct_9fa48('1689') ? 'Stryker was here!' : (stryCov_9fa48('1689'), '');
			const { data, error: err } = await supabase.auth.signUp(
				stryMutAct_9fa48('1690')
					? {}
					: (stryCov_9fa48('1690'),
						{
							email,
							password,
						})
			);
			if (
				stryMutAct_9fa48('1692')
					? false
					: stryMutAct_9fa48('1691')
						? true
						: (stryCov_9fa48('1691', '1692'), err)
			) {
				if (stryMutAct_9fa48('1693')) {
					{
					}
				} else {
					stryCov_9fa48('1693');
					error = err.message;
					loading = stryMutAct_9fa48('1694') ? true : (stryCov_9fa48('1694'), false);
					return;
				}
			}
			if (
				stryMutAct_9fa48('1696')
					? false
					: stryMutAct_9fa48('1695')
						? true
						: (stryCov_9fa48('1695', '1696'), data.session)
			) {
				if (stryMutAct_9fa48('1697')) {
					{
					}
				} else {
					stryCov_9fa48('1697');
					window.location.replace(redirectTo);
				}
			} else {
				if (stryMutAct_9fa48('1698')) {
					{
					}
				} else {
					stryCov_9fa48('1698');
					message = stryMutAct_9fa48('1699')
						? ''
						: (stryCov_9fa48('1699'),
							'Check your email to confirm your account before signing in.');
					loading = stryMutAct_9fa48('1700') ? true : (stryCov_9fa48('1700'), false);
				}
			}
		}
	}
	async function handleGuest() {
		if (stryMutAct_9fa48('1701')) {
			{
			}
		} else {
			stryCov_9fa48('1701');
			loading = stryMutAct_9fa48('1702') ? false : (stryCov_9fa48('1702'), true);
			error = stryMutAct_9fa48('1703') ? 'Stryker was here!' : (stryCov_9fa48('1703'), '');
			message = stryMutAct_9fa48('1704') ? 'Stryker was here!' : (stryCov_9fa48('1704'), '');
			const { error: err } = await supabase.auth.signInAnonymously();
			if (
				stryMutAct_9fa48('1706')
					? false
					: stryMutAct_9fa48('1705')
						? true
						: (stryCov_9fa48('1705', '1706'), err)
			) {
				if (stryMutAct_9fa48('1707')) {
					{
					}
				} else {
					stryCov_9fa48('1707');
					error = err.message;
					loading = stryMutAct_9fa48('1708') ? true : (stryCov_9fa48('1708'), false);
					return;
				}
			}
			window.location.replace(redirectTo);
		}
	}
</script>

<div class="login-page">
	<h1>Songster</h1>
	<form
		onsubmit={(e) => {
			if (stryMutAct_9fa48('1709')) {
				{
				}
			} else {
				stryCov_9fa48('1709');
				e.preventDefault();
				handleLogin();
			}
		}}
	>
		<input type="email" bind:value={email} placeholder="Email" required />
		<input type="password" bind:value={password} placeholder="Password" required />
		{#if error}<p class="error" role="alert">{error}</p>{/if}
		{#if message}<p class="message" role="status">{message}</p>{/if}
		<div class="btns">
			<button type="submit" disabled={loading}>Sign In</button>
			<button type="button" onclick={handleSignup} disabled={loading}>Sign Up</button>
		</div>
	</form>
	<button class="guest-btn" type="button" onclick={handleGuest} disabled={loading}>
		Play as Guest
	</button>
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-6, 24px);
		background: var(--bg, #f4efe4);
		color: var(--fg, #0a0a0a);
	}
	h1 {
		font-family: var(--font-serif, 'Playfair Display', serif);
		font-size: var(--text-2xl, 32px);
	}
	form {
		display: flex;
		flex-direction: column;
		gap: var(--space-3, 12px);
		width: 280px;
	}
	input {
		padding: 10px 12px;
		border: 1.5px solid var(--border, rgba(0, 0, 0, 0.2));
		border-radius: var(--radius, 4px);
		font-size: var(--text-base, 14px);
		background: transparent;
		color: inherit;
	}
	.btns {
		display: flex;
		gap: var(--space-2, 8px);
	}
	button {
		flex: 1;
		padding: 10px;
		border: none;
		border-radius: var(--radius, 4px);
		background: var(--fg, #0a0a0a);
		color: var(--bg, #f4efe4);
		cursor: pointer;
		font-family: var(--font-mono, 'IBM Plex Mono', monospace);
		font-size: 11px;
		letter-spacing: 1px;
		text-transform: uppercase;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.guest-btn {
		width: 280px;
		background: transparent;
		border: 1.5px solid var(--fg, #0a0a0a);
		color: var(--fg, #0a0a0a);
	}
	.error {
		color: var(--color-danger, #ff3b30);
		font-size: 13px;
	}
	.message {
		color: var(--color-success, #34c759);
		font-size: 13px;
	}
</style>
