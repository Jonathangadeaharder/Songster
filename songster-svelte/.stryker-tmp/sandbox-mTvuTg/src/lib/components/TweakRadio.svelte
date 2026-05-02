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
	type Opt = {
		value: string;
		label: string;
	};
	let {
		label,
		value,
		options,
		onchange,
	}: {
		label: string;
		value: string;
		options: (string | Opt)[];
		onchange: (v: string) => void;
	} = $props();
	let opts: Opt[] = $derived(
		options.map(
			stryMutAct_9fa48('266')
				? () => undefined
				: (stryCov_9fa48('266'),
					(o) =>
						(
							stryMutAct_9fa48('269')
								? typeof o !== 'object'
								: stryMutAct_9fa48('268')
									? false
									: stryMutAct_9fa48('267')
										? true
										: (stryCov_9fa48('267', '268', '269'),
											typeof o ===
												(stryMutAct_9fa48('270') ? '' : (stryCov_9fa48('270'), 'object')))
						)
							? o
							: stryMutAct_9fa48('271')
								? {}
								: (stryCov_9fa48('271'),
									{
										value: o,
										label: o,
									}))
		)
	);
	let idx = $derived(
		stryMutAct_9fa48('272')
			? Math.min(
					0,
					opts.findIndex((o) => o.value === value)
				)
			: (stryCov_9fa48('272'),
				Math.max(
					0,
					opts.findIndex(
						stryMutAct_9fa48('273')
							? () => undefined
							: (stryCov_9fa48('273'),
								(o) =>
									stryMutAct_9fa48('276')
										? o.value !== value
										: stryMutAct_9fa48('275')
											? false
											: stryMutAct_9fa48('274')
												? true
												: (stryCov_9fa48('274', '275', '276'), o.value === value))
					)
				))
	);
	let n = $derived(opts.length);
	let dragging = $state(stryMutAct_9fa48('277') ? true : (stryCov_9fa48('277'), false));
	let trackEl: HTMLDivElement | undefined = $state();
	function segAt(clientX: number): string {
		if (stryMutAct_9fa48('278')) {
			{
			}
		} else {
			stryCov_9fa48('278');
			if (
				stryMutAct_9fa48('281')
					? false
					: stryMutAct_9fa48('280')
						? true
						: stryMutAct_9fa48('279')
							? trackEl
							: (stryCov_9fa48('279', '280', '281'), !trackEl)
			)
				return value;
			const r = trackEl.getBoundingClientRect();
			const inner = stryMutAct_9fa48('282') ? r.width + 4 : (stryCov_9fa48('282'), r.width - 4);
			const i = Math.floor(
				stryMutAct_9fa48('283')
					? (clientX - r.left - 2) / inner / n
					: (stryCov_9fa48('283'),
						(stryMutAct_9fa48('284')
							? (clientX - r.left - 2) * inner
							: (stryCov_9fa48('284'),
								(stryMutAct_9fa48('285')
									? clientX - r.left + 2
									: (stryCov_9fa48('285'),
										(stryMutAct_9fa48('286')
											? clientX + r.left
											: (stryCov_9fa48('286'), clientX - r.left)) - 2)) / inner)) * n)
			);
			return opts[
				stryMutAct_9fa48('287')
					? Math.min(0, Math.min(n - 1, i))
					: (stryCov_9fa48('287'),
						Math.max(
							0,
							stryMutAct_9fa48('288')
								? Math.max(n - 1, i)
								: (stryCov_9fa48('288'),
									Math.min(stryMutAct_9fa48('289') ? n + 1 : (stryCov_9fa48('289'), n - 1), i))
						))
			].value;
		}
	}
	function onPointerDown(e: PointerEvent) {
		if (stryMutAct_9fa48('290')) {
			{
			}
		} else {
			stryCov_9fa48('290');
			dragging = stryMutAct_9fa48('291') ? false : (stryCov_9fa48('291'), true);
			const v0 = segAt(e.clientX);
			if (
				stryMutAct_9fa48('294')
					? v0 === value
					: stryMutAct_9fa48('293')
						? false
						: stryMutAct_9fa48('292')
							? true
							: (stryCov_9fa48('292', '293', '294'), v0 !== value)
			)
				onchange(v0);
			const move = (ev: PointerEvent) => {
				if (stryMutAct_9fa48('295')) {
					{
					}
				} else {
					stryCov_9fa48('295');
					const v = segAt(ev.clientX);
					if (
						stryMutAct_9fa48('298')
							? v === value
							: stryMutAct_9fa48('297')
								? false
								: stryMutAct_9fa48('296')
									? true
									: (stryCov_9fa48('296', '297', '298'), v !== value)
					)
						onchange(v);
				}
			};
			const up = () => {
				if (stryMutAct_9fa48('299')) {
					{
					}
				} else {
					stryCov_9fa48('299');
					dragging = stryMutAct_9fa48('300') ? true : (stryCov_9fa48('300'), false);
					window.removeEventListener(
						stryMutAct_9fa48('301') ? '' : (stryCov_9fa48('301'), 'pointermove'),
						move
					);
					window.removeEventListener(
						stryMutAct_9fa48('302') ? '' : (stryCov_9fa48('302'), 'pointerup'),
						up
					);
				}
			};
			window.addEventListener(
				stryMutAct_9fa48('303') ? '' : (stryCov_9fa48('303'), 'pointermove'),
				move
			);
			window.addEventListener(
				stryMutAct_9fa48('304') ? '' : (stryCov_9fa48('304'), 'pointerup'),
				up
			);
		}
	}
</script>

<div class="twk-row">
	<div class="twk-lbl">
		<span>{label}</span>
	</div>
	<div
		bind:this={trackEl}
		role="radiogroup"
		tabindex="0"
		onpointerdown={onPointerDown}
		class="twk-seg"
		class:dragging
	>
		<div
			class="twk-seg-thumb"
			style="left: calc(2px + {idx} * (100% - 4px) / {n}); width: calc((100% - 4px) / {n})"
		></div>
		{#each opts as o}
			<button
				type="button"
				role="radio"
				aria-checked={stryMutAct_9fa48('307')
					? o.value !== value
					: stryMutAct_9fa48('306')
						? false
						: stryMutAct_9fa48('305')
							? true
							: (stryCov_9fa48('305', '306', '307'), o.value === value)}
				onclick={stryMutAct_9fa48('308')
					? () => undefined
					: (stryCov_9fa48('308'), () => onchange(o.value))}
			>
				{o.label}
			</button>
		{/each}
	</div>
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
	.twk-seg {
		position: relative;
		display: flex;
		padding: 2px;
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.06);
		user-select: none;
	}
	.twk-seg-thumb {
		position: absolute;
		top: 2px;
		bottom: 2px;
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
		transition:
			left 0.15s cubic-bezier(0.3, 0.7, 0.4, 1),
			width 0.15s;
	}
	.twk-seg.dragging .twk-seg-thumb {
		transition: none;
	}
	.twk-seg button {
		appearance: none;
		position: relative;
		z-index: 1;
		flex: 1;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		font-weight: 500;
		height: 22px;
		border-radius: 6px;
		cursor: pointer;
		padding: 0;
	}
</style>
