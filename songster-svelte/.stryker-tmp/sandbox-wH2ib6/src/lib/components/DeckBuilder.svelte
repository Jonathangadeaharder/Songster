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
	import type { Track } from '$lib/types';
	let {
		onSelect,
	}: {
		onSelect: (track: Track) => void;
	} = $props();
	let query = $state(stryMutAct_9fa48('95') ? 'Stryker was here!' : (stryCov_9fa48('95'), ''));
	let results = $state<Track[]>(
		stryMutAct_9fa48('96') ? ['Stryker was here'] : (stryCov_9fa48('96'), [])
	);
	let debounceTimer: ReturnType<typeof setTimeout> | null = $state(null);
	let loading = $state(stryMutAct_9fa48('97') ? true : (stryCov_9fa48('97'), false));
	async function search() {
		if (stryMutAct_9fa48('98')) {
			{
			}
		} else {
			stryCov_9fa48('98');
			if (
				stryMutAct_9fa48('101')
					? false
					: stryMutAct_9fa48('100')
						? true
						: stryMutAct_9fa48('99')
							? query.trim()
							: (stryCov_9fa48('99', '100', '101'),
								!(stryMutAct_9fa48('102') ? query : (stryCov_9fa48('102'), query.trim())))
			) {
				if (stryMutAct_9fa48('103')) {
					{
					}
				} else {
					stryCov_9fa48('103');
					results = stryMutAct_9fa48('104') ? ['Stryker was here'] : (stryCov_9fa48('104'), []);
					return;
				}
			}
			loading = stryMutAct_9fa48('105') ? false : (stryCov_9fa48('105'), true);
			try {
				if (stryMutAct_9fa48('106')) {
					{
					}
				} else {
					stryCov_9fa48('106');
					const res = await fetch(
						stryMutAct_9fa48('107')
							? ``
							: (stryCov_9fa48('107'), `/api/track/search?q=${encodeURIComponent(query)}&limit=10`)
					);
					if (
						stryMutAct_9fa48('109')
							? false
							: stryMutAct_9fa48('108')
								? true
								: (stryCov_9fa48('108', '109'), res.ok)
					) {
						if (stryMutAct_9fa48('110')) {
							{
							}
						} else {
							stryCov_9fa48('110');
							results = await res.json();
						}
					}
				}
			} finally {
				if (stryMutAct_9fa48('111')) {
					{
					}
				} else {
					stryCov_9fa48('111');
					loading = stryMutAct_9fa48('112') ? true : (stryCov_9fa48('112'), false);
				}
			}
		}
	}
	function onInput() {
		if (stryMutAct_9fa48('113')) {
			{
			}
		} else {
			stryCov_9fa48('113');
			if (
				stryMutAct_9fa48('115')
					? false
					: stryMutAct_9fa48('114')
						? true
						: (stryCov_9fa48('114', '115'), debounceTimer)
			)
				clearTimeout(debounceTimer);
			debounceTimer = setTimeout(
				stryMutAct_9fa48('116') ? () => undefined : (stryCov_9fa48('116'), () => search()),
				300
			);
		}
	}
</script>

<div class="deck-builder">
	<input
		type="text"
		placeholder="Search songs..."
		bind:value={query}
		oninput={onInput}
		aria-label="Search songs"
	/>
	{#if loading}
		<p>Loading...</p>
	{:else}
		<ul class="results">
			{#each results as track}
				<li class="result-item">
					<span>{track.title}</span>
					<span>{track.artist}</span>
					<span>{track.year}</span>
					<button
						onclick={stryMutAct_9fa48('117')
							? () => undefined
							: (stryCov_9fa48('117'), () => onSelect(track))}>Add</button
					>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.deck-builder {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	input {
		padding: 8px;
		border-radius: 4px;
		border: 1px solid #ccc;
	}
	.results {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.result-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px;
	}
	button {
		padding: 4px 8px;
		cursor: pointer;
	}
</style>
