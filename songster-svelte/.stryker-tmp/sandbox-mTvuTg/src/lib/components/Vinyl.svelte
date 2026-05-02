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
		size = 190,
		spinning = stryMutAct_9fa48('364') ? true : (stryCov_9fa48('364'), false),
		label = stryMutAct_9fa48('365') ? '' : (stryCov_9fa48('365'), 'SONGSTER'),
		subLabel = stryMutAct_9fa48('366') ? '' : (stryCov_9fa48('366'), '33⅓ RPM'),
		intensity = 1,
	}: {
		size?: number;
		spinning?: boolean;
		label?: string;
		subLabel?: string;
		intensity?: number;
	} = $props();
	let safeIntensity = $derived(
		stryMutAct_9fa48('367')
			? Math.min(0.1, intensity)
			: (stryCov_9fa48('367'), Math.max(0.1, intensity))
	);
</script>

<div class="vinyl-wrap" style="width: {size}px; height: {size}px">
	<svg
		viewBox="0 0 200 200"
		class:spinning
		style="animation-duration: {stryMutAct_9fa48('368')
			? 2 * safeIntensity
			: (stryCov_9fa48('368'), 2 / safeIntensity)}s"
	>
		<circle cx="100" cy="100" r="98" fill="currentColor" opacity="0.05" />
		<circle
			cx="100"
			cy="100"
			r="80"
			fill="none"
			stroke="currentColor"
			stroke-width="0.3"
			opacity="0.15"
		/>
		<circle
			cx="100"
			cy="100"
			r="65"
			fill="none"
			stroke="currentColor"
			stroke-width="0.3"
			opacity="0.1"
		/>
		<circle
			cx="100"
			cy="100"
			r="50"
			fill="none"
			stroke="currentColor"
			stroke-width="0.3"
			opacity="0.15"
		/>
		<circle cx="100" cy="100" r="30" fill="currentColor" opacity="0.08" />
		<circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.3" />
		<text
			x="100"
			y="90"
			text-anchor="middle"
			font-family="'IBM Plex Mono', monospace"
			font-size="8"
			letter-spacing="3"
			fill="currentColor"
			opacity="0.7">{label}</text
		>
		<text
			x="100"
			y="104"
			text-anchor="middle"
			font-family="'IBM Plex Mono', monospace"
			font-size="6"
			letter-spacing="2"
			fill="currentColor"
			opacity="0.4">{subLabel}</text
		>
	</svg>
</div>

<style>
	.vinyl-wrap {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	svg {
		width: 100%;
		height: 100%;
	}
	.spinning {
		animation: spin linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
