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
	import type { Snippet } from 'svelte';
	import type { Theme } from '$lib/types';
	import { colors } from '$lib/utils';
	let {
		theme = 'light' as Theme,
		title = stryMutAct_9fa48('94') ? 'Stryker was here!' : (stryCov_9fa48('94'), ''),
		right,
		children,
	}: {
		theme?: Theme;
		title?: string;
		right?: Snippet;
		children: Snippet;
	} = $props();
	const c = $derived(colors(theme));
</script>

<div class="shell" style="background: {c.paper}; color: {c.primary}">
	{#if title}
		<div class="chrome-bar">
			<div class="chrome-title">{title}</div>
			{#if right}
				{@render right()}
			{/if}
		</div>
	{/if}
	<div class="chrome-body">
		{@render children()}
	</div>
</div>

<style>
	.shell {
		width: 100%;
		max-width: 420px;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		border-radius: 0;
		overflow: hidden;
	}
	.chrome-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 16px;
		border-bottom: 0.5px solid rgba(128, 128, 128, 0.2);
	}
	.chrome-title {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		letter-spacing: 2px;
		opacity: 0.5;
	}
	.chrome-body {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
