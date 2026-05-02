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
	let {
		title = stryMutAct_9fa48('321') ? '' : (stryCov_9fa48('321'), 'Tweaks'),
		children,
	}: {
		title?: string;
		children: Snippet;
	} = $props();
	let open = $state(stryMutAct_9fa48('322') ? true : (stryCov_9fa48('322'), false));
	let panelEl: HTMLDivElement | undefined = $state();
	let offsetX = $state(16);
	let offsetY = $state(16);
	const PAD = 16;
	function clampToViewport() {
		if (stryMutAct_9fa48('323')) {
			{
			}
		} else {
			stryCov_9fa48('323');
			if (
				stryMutAct_9fa48('326')
					? false
					: stryMutAct_9fa48('325')
						? true
						: stryMutAct_9fa48('324')
							? panelEl
							: (stryCov_9fa48('324', '325', '326'), !panelEl)
			)
				return;
			const w = panelEl.offsetWidth,
				h = panelEl.offsetHeight;
			const maxRight = stryMutAct_9fa48('327')
				? Math.min(PAD, window.innerWidth - w - PAD)
				: (stryCov_9fa48('327'),
					Math.max(
						PAD,
						stryMutAct_9fa48('328')
							? window.innerWidth - w + PAD
							: (stryCov_9fa48('328'),
								(stryMutAct_9fa48('329')
									? window.innerWidth + w
									: (stryCov_9fa48('329'), window.innerWidth - w)) - PAD)
					));
			const maxBottom = stryMutAct_9fa48('330')
				? Math.min(PAD, window.innerHeight - h - PAD)
				: (stryCov_9fa48('330'),
					Math.max(
						PAD,
						stryMutAct_9fa48('331')
							? window.innerHeight - h + PAD
							: (stryCov_9fa48('331'),
								(stryMutAct_9fa48('332')
									? window.innerHeight + h
									: (stryCov_9fa48('332'), window.innerHeight - h)) - PAD)
					));
			offsetX = stryMutAct_9fa48('333')
				? Math.max(maxRight, Math.max(PAD, offsetX))
				: (stryCov_9fa48('333'),
					Math.min(
						maxRight,
						stryMutAct_9fa48('334')
							? Math.min(PAD, offsetX)
							: (stryCov_9fa48('334'), Math.max(PAD, offsetX))
					));
			offsetY = stryMutAct_9fa48('335')
				? Math.max(maxBottom, Math.max(PAD, offsetY))
				: (stryCov_9fa48('335'),
					Math.min(
						maxBottom,
						stryMutAct_9fa48('336')
							? Math.min(PAD, offsetY)
							: (stryCov_9fa48('336'), Math.max(PAD, offsetY))
					));
		}
	}
	function onDragStart(e: MouseEvent) {
		if (stryMutAct_9fa48('337')) {
			{
			}
		} else {
			stryCov_9fa48('337');
			if (
				stryMutAct_9fa48('340')
					? false
					: stryMutAct_9fa48('339')
						? true
						: stryMutAct_9fa48('338')
							? panelEl
							: (stryCov_9fa48('338', '339', '340'), !panelEl)
			)
				return;
			const r = panelEl.getBoundingClientRect();
			const sx = e.clientX,
				sy = e.clientY;
			const startRight = stryMutAct_9fa48('341')
				? window.innerWidth + r.right
				: (stryCov_9fa48('341'), window.innerWidth - r.right);
			const startBottom = stryMutAct_9fa48('342')
				? window.innerHeight + r.bottom
				: (stryCov_9fa48('342'), window.innerHeight - r.bottom);
			const move = (ev: MouseEvent) => {
				if (stryMutAct_9fa48('343')) {
					{
					}
				} else {
					stryCov_9fa48('343');
					offsetX = stryMutAct_9fa48('344')
						? startRight + (ev.clientX - sx)
						: (stryCov_9fa48('344'),
							startRight -
								(stryMutAct_9fa48('345')
									? ev.clientX + sx
									: (stryCov_9fa48('345'), ev.clientX - sx)));
					offsetY = stryMutAct_9fa48('346')
						? startBottom + (ev.clientY - sy)
						: (stryCov_9fa48('346'),
							startBottom -
								(stryMutAct_9fa48('347')
									? ev.clientY + sy
									: (stryCov_9fa48('347'), ev.clientY - sy)));
					clampToViewport();
				}
			};
			const up = () => {
				if (stryMutAct_9fa48('348')) {
					{
					}
				} else {
					stryCov_9fa48('348');
					window.removeEventListener(
						stryMutAct_9fa48('349') ? '' : (stryCov_9fa48('349'), 'mousemove'),
						move
					);
					window.removeEventListener(
						stryMutAct_9fa48('350') ? '' : (stryCov_9fa48('350'), 'mouseup'),
						up
					);
				}
			};
			window.addEventListener(
				stryMutAct_9fa48('351') ? '' : (stryCov_9fa48('351'), 'mousemove'),
				move
			);
			window.addEventListener(stryMutAct_9fa48('352') ? '' : (stryCov_9fa48('352'), 'mouseup'), up);
		}
	}
	$effect(() => {
		if (stryMutAct_9fa48('353')) {
			{
			}
		} else {
			stryCov_9fa48('353');
			if (
				stryMutAct_9fa48('356')
					? false
					: stryMutAct_9fa48('355')
						? true
						: stryMutAct_9fa48('354')
							? open
							: (stryCov_9fa48('354', '355', '356'), !open)
			)
				return;
			clampToViewport();
			const ro = new ResizeObserver(clampToViewport);
			ro.observe(document.documentElement);
			return stryMutAct_9fa48('357')
				? () => undefined
				: (stryCov_9fa48('357'), () => ro.disconnect());
		}
	});
</script>

{#if stryMutAct_9fa48('358') ? open : (stryCov_9fa48('358'), !open)}
	<button
		class="twk-toggleopen"
		onclick={stryMutAct_9fa48('359')
			? () => undefined
			: (stryCov_9fa48('359'),
				() => (open = stryMutAct_9fa48('360') ? false : (stryCov_9fa48('360'), true)))}
		>⚙ Tweaks</button
	>
{:else}
	<div class="twk-panel" bind:this={panelEl} style="right: {offsetX}px; bottom: {offsetY}px">
		<div
			class="twk-hd"
			role="toolbar"
			tabindex="0"
			aria-label="Drag to move tweaks panel"
			onmousedown={onDragStart}
		>
			<b>{title}</b>
			<button
				class="twk-x"
				aria-label="Close tweaks"
				onmousedown={stryMutAct_9fa48('361')
					? () => undefined
					: (stryCov_9fa48('361'), (e) => e.stopPropagation())}
				onclick={stryMutAct_9fa48('362')
					? () => undefined
					: (stryCov_9fa48('362'),
						() => (open = stryMutAct_9fa48('363') ? true : (stryCov_9fa48('363'), false)))}
				>✕</button
			>
		</div>
		<div class="twk-body">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.twk-panel {
		position: fixed;
		right: 16px;
		bottom: 16px;
		z-index: 9999;
		width: 280px;
		max-height: calc(100vh - 32px);
		display: flex;
		flex-direction: column;
		background: rgba(250, 249, 247, 0.78);
		color: #29261b;
		-webkit-backdrop-filter: blur(24px) saturate(160%);
		backdrop-filter: blur(24px) saturate(160%);
		border: 0.5px solid rgba(255, 255, 255, 0.6);
		border-radius: 14px;
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.5) inset,
			0 12px 40px rgba(0, 0, 0, 0.18);
		font:
			11.5px/1.4 ui-sans-serif,
			system-ui,
			-apple-system,
			sans-serif;
		overflow: hidden;
	}
	.twk-toggleopen {
		position: fixed;
		right: 16px;
		bottom: 16px;
		z-index: 9998;
		appearance: none;
		border: 0;
		height: 36px;
		padding: 0 14px;
		border-radius: 10px;
		background: rgba(10, 10, 10, 0.85);
		color: #f4efe4;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	}
	.twk-hd {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 8px 10px 14px;
		cursor: move;
		user-select: none;
	}
	.twk-hd b {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.01em;
	}
	.twk-x {
		appearance: none;
		border: 0;
		background: transparent;
		color: rgba(41, 38, 27, 0.55);
		width: 22px;
		height: 22px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 13px;
		line-height: 1;
	}
	.twk-x:hover {
		background: rgba(0, 0, 0, 0.06);
		color: #29261b;
	}
	.twk-body {
		padding: 2px 14px 14px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		overflow-y: auto;
		overflow-x: hidden;
		min-height: 0;
		scrollbar-width: thin;
		scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
	}
	.twk-body::-webkit-scrollbar {
		width: 8px;
	}
	.twk-body::-webkit-scrollbar-track {
		background: transparent;
		margin: 2px;
	}
	.twk-body::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.15);
		border-radius: 4px;
		border: 2px solid transparent;
		background-clip: content-box;
	}
</style>
