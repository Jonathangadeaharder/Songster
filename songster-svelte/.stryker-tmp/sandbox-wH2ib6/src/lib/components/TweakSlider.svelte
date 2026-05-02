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
	let {
		label,
		value = 0,
		min = 0,
		max = 100,
		step = 1,
		unit = stryMutAct_9fa48('309') ? 'Stryker was here!' : (stryCov_9fa48('309'), ''),
		onchange,
	}: {
		label: string;
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		unit?: string;
		onchange: (v: number) => void;
	} = $props();
	function handleInput(e: Event) {
		if (stryMutAct_9fa48('310')) {
			{
			}
		} else {
			stryCov_9fa48('310');
			onchange(Number((e.target as HTMLInputElement).value));
		}
	}
</script>

<div class="twk-row">
	<div class="twk-lbl">
		<span>{label}</span>
		{#if stryMutAct_9fa48('313') ? value == null : stryMutAct_9fa48('312') ? false : stryMutAct_9fa48('311') ? true : (stryCov_9fa48('311', '312', '313'), value != null)}
			<span class="twk-val">{value}{unit}</span>
		{/if}
	</div>
	<input type="range" class="twk-slider" {min} {max} {step} {value} oninput={handleInput} />
</div>

<style>
	.twk-row {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.twk-lbl {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		color: rgba(41, 38, 27, 0.72);
	}
	.twk-lbl > :global(span:first-child) {
		font-weight: 500;
	}
	.twk-val {
		color: rgba(41, 38, 27, 0.5);
		font-variant-numeric: tabular-nums;
	}
	.twk-slider {
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		height: 4px;
		margin: 6px 0;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.12);
		outline: none;
	}
	.twk-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #fff;
		border: 0.5px solid rgba(0, 0, 0, 0.12);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
	.twk-slider::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #fff;
		border: 0.5px solid rgba(0, 0, 0, 0.12);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
</style>
