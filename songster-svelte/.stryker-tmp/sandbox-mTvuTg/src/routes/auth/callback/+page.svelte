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
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	onMount(async () => {
		if (stryMutAct_9fa48('1646')) {
			{
			}
		} else {
			stryCov_9fa48('1646');
			const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
			if (
				stryMutAct_9fa48('1648')
					? false
					: stryMutAct_9fa48('1647')
						? true
						: (stryCov_9fa48('1647', '1648'), error)
			) {
				if (stryMutAct_9fa48('1649')) {
					{
					}
				} else {
					stryCov_9fa48('1649');
					window.location.replace(
						stryMutAct_9fa48('1650') ? '' : (stryCov_9fa48('1650'), '/auth/login')
					);
					return;
				}
			}
			window.location.replace(stryMutAct_9fa48('1651') ? '' : (stryCov_9fa48('1651'), '/'));
		}
	});
</script>

<p>Redirecting...</p>
