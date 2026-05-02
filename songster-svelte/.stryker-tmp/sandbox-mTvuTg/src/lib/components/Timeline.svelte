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
	import type { Song, ArtStyle, Theme, Density } from '$lib/types';
	import { colors } from '$lib/utils';
	import HitCard from './HitCard.svelte';
	let {
		cards,
		density = 'regular' as Density,
		artStyle = 'grooves' as ArtStyle,
		theme = 'light' as Theme,
		frozen = stryMutAct_9fa48('146') ? true : (stryCov_9fa48('146'), false),
		draggingActive = stryMutAct_9fa48('147') ? true : (stryCov_9fa48('147'), false),
		hoverSlot = null as number | null,
		highlightSlot = null as number | null,
		wrongSlot = null as number | null,
		onSlotClick,
		onSlotDragOver,
		onSlotDragLeave,
		onSlotDrop,
	}: {
		cards: Song[];
		density?: Density;
		artStyle?: ArtStyle;
		theme?: Theme;
		frozen?: boolean;
		draggingActive?: boolean;
		hoverSlot?: number | null;
		highlightSlot?: number | null;
		wrongSlot?: number | null;
		onSlotClick?: (index: number) => void;
		onSlotDragOver?: (e: DragEvent, index: number) => void;
		onSlotDragLeave?: (e: DragEvent, index: number) => void;
		onSlotDrop?: (e: DragEvent, index: number) => void;
	} = $props();
	let { primary } = $derived(colors(theme));
	function slotAriaLabel(i: number): string {
		if (stryMutAct_9fa48('148')) {
			{
			}
		} else {
			stryCov_9fa48('148');
			if (
				stryMutAct_9fa48('151')
					? highlightSlot !== i
					: stryMutAct_9fa48('150')
						? false
						: stryMutAct_9fa48('149')
							? true
							: (stryCov_9fa48('149', '150', '151'), highlightSlot === i)
			)
				return stryMutAct_9fa48('152')
					? ``
					: (stryCov_9fa48('152'), `Slot ${i}, correct placement`);
			if (
				stryMutAct_9fa48('155')
					? wrongSlot !== i
					: stryMutAct_9fa48('154')
						? false
						: stryMutAct_9fa48('153')
							? true
							: (stryCov_9fa48('153', '154', '155'), wrongSlot === i)
			)
				return stryMutAct_9fa48('156') ? `` : (stryCov_9fa48('156'), `Slot ${i}, wrong placement`);
			if (
				stryMutAct_9fa48('159')
					? hoverSlot !== i
					: stryMutAct_9fa48('158')
						? false
						: stryMutAct_9fa48('157')
							? true
							: (stryCov_9fa48('157', '158', '159'), hoverSlot === i)
			)
				return stryMutAct_9fa48('160') ? `` : (stryCov_9fa48('160'), `Slot ${i}, drop target`);
			return stryMutAct_9fa48('161') ? `` : (stryCov_9fa48('161'), `Slot ${i}`);
		}
	}
	let cardSize = $derived(
		(
			stryMutAct_9fa48('164')
				? density !== 'compact'
				: stryMutAct_9fa48('163')
					? false
					: stryMutAct_9fa48('162')
						? true
						: (stryCov_9fa48('162', '163', '164'),
							density === (stryMutAct_9fa48('165') ? '' : (stryCov_9fa48('165'), 'compact')))
		)
			? stryMutAct_9fa48('166')
				? {}
				: (stryCov_9fa48('166'),
					{
						w: 52,
						h: 72,
					})
			: (
						stryMutAct_9fa48('169')
							? density !== 'comfy'
							: stryMutAct_9fa48('168')
								? false
								: stryMutAct_9fa48('167')
									? true
									: (stryCov_9fa48('167', '168', '169'),
										density === (stryMutAct_9fa48('170') ? '' : (stryCov_9fa48('170'), 'comfy')))
				  )
				? stryMutAct_9fa48('171')
					? {}
					: (stryCov_9fa48('171'),
						{
							w: 90,
							h: 120,
						})
				: stryMutAct_9fa48('172')
					? {}
					: (stryCov_9fa48('172'),
						{
							w: 70,
							h: 96,
						})
	);
	let slotW = $derived(
		(
			stryMutAct_9fa48('175')
				? density !== 'compact'
				: stryMutAct_9fa48('174')
					? false
					: stryMutAct_9fa48('173')
						? true
						: (stryCov_9fa48('173', '174', '175'),
							density === (stryMutAct_9fa48('176') ? '' : (stryCov_9fa48('176'), 'compact')))
		)
			? 20
			: (
						stryMutAct_9fa48('179')
							? density !== 'comfy'
							: stryMutAct_9fa48('178')
								? false
								: stryMutAct_9fa48('177')
									? true
									: (stryCov_9fa48('177', '178', '179'),
										density === (stryMutAct_9fa48('180') ? '' : (stryCov_9fa48('180'), 'comfy')))
				  )
				? 32
				: 26
	);
	let slots = $derived(
		stryMutAct_9fa48('181') ? cards.length - 1 : (stryCov_9fa48('181'), cards.length + 1)
	);
</script>

<div class="timeline-scroll">
	<div
		class="tl-scroll-inner"
		style="height: {stryMutAct_9fa48('182')
			? cardSize.h - 20
			: (stryCov_9fa48('182'), cardSize.h + 20)}px"
	>
		{#each stryMutAct_9fa48("183") ? Array() : (stryCov_9fa48("183"), Array(slots) as _, i}
			<button
				class="slot"
				aria-label={slotAriaLabel(i)}
				disabled={stryMutAct_9fa48('186')
					? frozen && !onSlotClick && !onSlotDrop
					: stryMutAct_9fa48('185')
						? false
						: stryMutAct_9fa48('184')
							? true
							: (stryCov_9fa48('184', '185', '186'),
								frozen ||
									(stryMutAct_9fa48('188')
										? !onSlotClick || !onSlotDrop
										: stryMutAct_9fa48('187')
											? false
											: (stryCov_9fa48('187', '188'),
												(stryMutAct_9fa48('189')
													? onSlotClick
													: (stryCov_9fa48('189'), !onSlotClick)) &&
													(stryMutAct_9fa48('190')
														? onSlotDrop
														: (stryCov_9fa48('190'), !onSlotDrop)))))}
				onclick={onSlotClick
					? stryMutAct_9fa48('191')
						? () => undefined
						: (stryCov_9fa48('191'), () => onSlotClick(i))
					: undefined}
				ondragover={onSlotDragOver
					? stryMutAct_9fa48('192')
						? () => undefined
						: (stryCov_9fa48('192'), (e) => onSlotDragOver(e, i))
					: undefined}
				ondragleave={onSlotDragLeave
					? stryMutAct_9fa48('193')
						? () => undefined
						: (stryCov_9fa48('193'), (e) => onSlotDragLeave(e, i))
					: undefined}
				ondrop={onSlotDrop
					? stryMutAct_9fa48('194')
						? () => undefined
						: (stryCov_9fa48('194'), (e) => onSlotDrop(e, i))
					: undefined}
				style="width: {(
					stryMutAct_9fa48('197')
						? (highlightSlot === i || wrongSlot === i) && hoverSlot === i
						: stryMutAct_9fa48('196')
							? false
							: stryMutAct_9fa48('195')
								? true
								: (stryCov_9fa48('195', '196', '197'),
									(stryMutAct_9fa48('199')
										? highlightSlot === i && wrongSlot === i
										: stryMutAct_9fa48('198')
											? false
											: (stryCov_9fa48('198', '199'),
												(stryMutAct_9fa48('201')
													? highlightSlot !== i
													: stryMutAct_9fa48('200')
														? false
														: (stryCov_9fa48('200', '201'), highlightSlot === i)) ||
													(stryMutAct_9fa48('203')
														? wrongSlot !== i
														: stryMutAct_9fa48('202')
															? false
															: (stryCov_9fa48('202', '203'), wrongSlot === i)))) ||
										(stryMutAct_9fa48('205')
											? hoverSlot !== i
											: stryMutAct_9fa48('204')
												? false
												: (stryCov_9fa48('204', '205'), hoverSlot === i)))
				)
					? stryMutAct_9fa48('206')
						? cardSize.w - 6
						: (stryCov_9fa48('206'), cardSize.w + 6)
					: draggingActive
						? stryMutAct_9fa48('207')
							? slotW - 8
							: (stryCov_9fa48('207'), slotW + 8)
						: slotW}px; height: {cardSize.h}px"
			>
				<div
					class="slot-inner"
					style="width: {(
						stryMutAct_9fa48('210')
							? (highlightSlot === i || wrongSlot === i) && hoverSlot === i
							: stryMutAct_9fa48('209')
								? false
								: stryMutAct_9fa48('208')
									? true
									: (stryCov_9fa48('208', '209', '210'),
										(stryMutAct_9fa48('212')
											? highlightSlot === i && wrongSlot === i
											: stryMutAct_9fa48('211')
												? false
												: (stryCov_9fa48('211', '212'),
													(stryMutAct_9fa48('214')
														? highlightSlot !== i
														: stryMutAct_9fa48('213')
															? false
															: (stryCov_9fa48('213', '214'), highlightSlot === i)) ||
														(stryMutAct_9fa48('216')
															? wrongSlot !== i
															: stryMutAct_9fa48('215')
																? false
																: (stryCov_9fa48('215', '216'), wrongSlot === i)))) ||
											(stryMutAct_9fa48('218')
												? hoverSlot !== i
												: stryMutAct_9fa48('217')
													? false
													: (stryCov_9fa48('217', '218'), hoverSlot === i)))
					)
						? cardSize.w
						: stryMutAct_9fa48('219')
							? Math.min(slotW - 8, 10)
							: (stryCov_9fa48('219'),
								Math.max(
									stryMutAct_9fa48('220') ? slotW + 8 : (stryCov_9fa48('220'), slotW - 8),
									10
								))}px; height: {stryMutAct_9fa48('221')
						? cardSize.h + 8
						: (stryCov_9fa48('221'), cardSize.h - 8)}px; border: 1.5px {(
						stryMutAct_9fa48('224')
							? hoverSlot === i && highlightSlot === i
							: stryMutAct_9fa48('223')
								? false
								: stryMutAct_9fa48('222')
									? true
									: (stryCov_9fa48('222', '223', '224'),
										(stryMutAct_9fa48('226')
											? hoverSlot !== i
											: stryMutAct_9fa48('225')
												? false
												: (stryCov_9fa48('225', '226'), hoverSlot === i)) ||
											(stryMutAct_9fa48('228')
												? highlightSlot !== i
												: stryMutAct_9fa48('227')
													? false
													: (stryCov_9fa48('227', '228'), highlightSlot === i)))
					)
						? stryMutAct_9fa48('229')
							? ''
							: (stryCov_9fa48('229'), 'solid')
						: stryMutAct_9fa48('230')
							? ''
							: (stryCov_9fa48('230'), 'dashed')} {(
						stryMutAct_9fa48('233')
							? wrongSlot !== i
							: stryMutAct_9fa48('232')
								? false
								: stryMutAct_9fa48('231')
									? true
									: (stryCov_9fa48('231', '232', '233'), wrongSlot === i)
					)
						? stryMutAct_9fa48('234')
							? ''
							: (stryCov_9fa48('234'), '#0a0a0a')
						: primary}; background: {(
						stryMutAct_9fa48('237')
							? highlightSlot !== i
							: stryMutAct_9fa48('236')
								? false
								: stryMutAct_9fa48('235')
									? true
									: (stryCov_9fa48('235', '236', '237'), highlightSlot === i)
					)
						? primary
						: (
									stryMutAct_9fa48('240')
										? hoverSlot !== i
										: stryMutAct_9fa48('239')
											? false
											: stryMutAct_9fa48('238')
												? true
												: (stryCov_9fa48('238', '239', '240'), hoverSlot === i)
							  )
							? stryMutAct_9fa48('241')
								? ''
								: (stryCov_9fa48('241'), 'rgba(10,10,10,0.06)')
							: stryMutAct_9fa48('242')
								? ''
								: (stryCov_9fa48('242'), 'transparent')}; opacity: {(
						stryMutAct_9fa48('245')
							? (highlightSlot === i || wrongSlot === i) && hoverSlot === i
							: stryMutAct_9fa48('244')
								? false
								: stryMutAct_9fa48('243')
									? true
									: (stryCov_9fa48('243', '244', '245'),
										(stryMutAct_9fa48('247')
											? highlightSlot === i && wrongSlot === i
											: stryMutAct_9fa48('246')
												? false
												: (stryCov_9fa48('246', '247'),
													(stryMutAct_9fa48('249')
														? highlightSlot !== i
														: stryMutAct_9fa48('248')
															? false
															: (stryCov_9fa48('248', '249'), highlightSlot === i)) ||
														(stryMutAct_9fa48('251')
															? wrongSlot !== i
															: stryMutAct_9fa48('250')
																? false
																: (stryCov_9fa48('250', '251'), wrongSlot === i)))) ||
											(stryMutAct_9fa48('253')
												? hoverSlot !== i
												: stryMutAct_9fa48('252')
													? false
													: (stryCov_9fa48('252', '253'), hoverSlot === i)))
					)
						? 1
						: frozen
							? 0.15
							: draggingActive
								? 0.7
								: 0.4}"
				>
					{#if stryMutAct_9fa48('256') ? hoverSlot !== i : stryMutAct_9fa48('255') ? false : stryMutAct_9fa48('254') ? true : (stryCov_9fa48('254', '255', '256'), hoverSlot === i)}
						<span style="opacity: 0.6">DROP</span>
					{:else if stryMutAct_9fa48('259') ? wrongSlot !== i : stryMutAct_9fa48('258') ? false : stryMutAct_9fa48('257') ? true : (stryCov_9fa48('257', '258', '259'), wrongSlot === i)}
						<span style="opacity: 0.9">✕</span>
					{/if}
				</div>
			</button>
			{#if stryMutAct_9fa48('263') ? i >= cards.length : stryMutAct_9fa48('262') ? i <= cards.length : stryMutAct_9fa48('261') ? false : stryMutAct_9fa48('260') ? true : (stryCov_9fa48('260', '261', '262', '263'), i < cards.length)}
				<div style="flex-shrink: 0">
					<HitCard
						song={cards[i]}
						faceDown={stryMutAct_9fa48('264') ? true : (stryCov_9fa48('264'), false)}
						size="sm"
						{artStyle}
						flipStyle="instant"
						{theme}
						styleExtra="width: {cardSize.w}px; height: {cardSize.h}px"
					/>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.timeline-scroll {
		width: 100%;
		overflow-x: auto;
		overflow-y: visible;
		-webkit-overflow-scrolling: touch;
		padding: 12px 16px 16px;
		scrollbar-width: none;
	}
	.tl-scroll-inner {
		display: flex;
		align-items: center;
		gap: 0;
		min-width: max-content;
	}
	.slot {
		flex-shrink: 0;
		transition: width 220ms cubic-bezier(0.7, 0.1, 0.3, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}
	.slot:disabled {
		cursor: default;
	}
	.slot-inner {
		border-radius: 4px;
		transition: all 200ms ease;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 9px;
		letter-spacing: 2px;
		text-transform: uppercase;
	}
</style>
