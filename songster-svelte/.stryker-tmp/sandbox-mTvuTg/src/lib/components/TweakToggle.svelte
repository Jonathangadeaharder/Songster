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
		value = stryMutAct_9fa48('314') ? true : (stryCov_9fa48('314'), false),
		onchange,
	}: {
		label: string;
		value?: boolean;
		onchange: (v: boolean) => void;
	} = $props();
</script>

<div class="twk-row twk-row-h">
	<div class="twk-lbl"><span>{label}</span></div>
	<button
		type="button"
		class="twk-toggle"
		data-on={value
			? stryMutAct_9fa48('315')
				? ''
				: (stryCov_9fa48('315'), '1')
			: stryMutAct_9fa48('316')
				? ''
				: (stryCov_9fa48('316'), '0')}
		role="switch"
		aria-checked={stryMutAct_9fa48('317')
			? !value
			: (stryCov_9fa48('317'), !(stryMutAct_9fa48('318') ? value : (stryCov_9fa48('318'), !value)))}
		aria-label={label}
		onclick={stryMutAct_9fa48('319')
			? () => undefined
			: (stryCov_9fa48('319'),
				() => onchange(stryMutAct_9fa48('320') ? value : (stryCov_9fa48('320'), !value)))}
		><i></i></button
	>
</div>

<style>
	.twk-row {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.twk-row-h {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}
	.twk-lbl {
		color: rgba(41, 38, 27, 0.72);
	}
	.twk-lbl > :global(span) {
		font-weight: 500;
	}
	.twk-toggle {
		position: relative;
		width: 32px;
		height: 18px;
		border: 0;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.15);
		transition: background 0.15s;
		cursor: pointer;
		padding: 0;
	}
	.twk-toggle[data-on='1'] {
		background: #34c759;
	}
	.twk-toggle i {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
		transition: transform 0.15s;
	}
	.twk-toggle[data-on='1'] i {
		transform: translateX(14px);
	}
</style>
