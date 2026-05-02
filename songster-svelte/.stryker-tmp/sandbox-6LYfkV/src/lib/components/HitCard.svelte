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
	import type { Song, ArtStyle, FlipStyle, Theme } from '$lib/types';
	let {
		song,
		faceDown = stryMutAct_9fa48('119') ? true : (stryCov_9fa48('119'), false),
		size = stryMutAct_9fa48('120') ? '' : (stryCov_9fa48('120'), 'md'),
		artStyle = stryMutAct_9fa48('121') ? '' : (stryCov_9fa48('121'), 'grooves'),
		flipStyle = stryMutAct_9fa48('122') ? '' : (stryCov_9fa48('122'), 'instant'),
		theme = stryMutAct_9fa48('123') ? '' : (stryCov_9fa48('123'), 'light'),
		correct,
		styleExtra = stryMutAct_9fa48('124') ? 'Stryker was here!' : (stryCov_9fa48('124'), ''),
	}: {
		song: Song;
		faceDown?: boolean;
		size?: 'sm' | 'md';
		artStyle?: ArtStyle;
		flipStyle?: FlipStyle;
		theme?: Theme;
		correct?: boolean;
		styleExtra?: string;
	} = $props();
	let sizeMap = stryMutAct_9fa48('125')
		? {}
		: (stryCov_9fa48('125'),
			{
				sm: stryMutAct_9fa48('126')
					? {}
					: (stryCov_9fa48('126'),
						{
							w: 70,
							h: 96,
						}),
				md: stryMutAct_9fa48('127')
					? {}
					: (stryCov_9fa48('127'),
						{
							w: 100,
							h: 140,
						}),
			});
	let { w, h } = $derived(sizeMap[size]);
</script>

<div
	class="card-outer"
	class:face-down={faceDown}
	class:correct={correct === true}
	class:wrong={correct === false}
	style="width: {w}px; height: {h}px; {styleExtra}"
>
	{#if stryMutAct_9fa48('128') ? faceDown : (stryCov_9fa48('128'), !faceDown)}
		<div class="card-front card-face">
			<div class="card-label">Songster</div>
			<div
				class="card-art"
				class:grooves={artStyle === 'grooves'}
				class:halftone={artStyle === 'halftone'}
				class:solid={artStyle === 'solid'}
				class:inverse={artStyle === 'inverse'}
			>
				{#if stryMutAct_9fa48('131') ? artStyle !== 'grooves' : stryMutAct_9fa48('130') ? false : stryMutAct_9fa48('129') ? true : (stryCov_9fa48('129', '130', '131'), artStyle === (stryMutAct_9fa48('132') ? '' : (stryCov_9fa48('132'), 'grooves')))}
					<svg viewBox="0 0 40 40" style="width: 100%; height: 100%">
						<circle
							cx="20"
							cy="20"
							r="18"
							fill="none"
							stroke="currentColor"
							stroke-width="0.5"
							opacity="0.2"
						/>
						<circle
							cx="20"
							cy="20"
							r="14"
							fill="none"
							stroke="currentColor"
							stroke-width="0.5"
							opacity="0.15"
						/>
						<circle
							cx="20"
							cy="20"
							r="10"
							fill="none"
							stroke="currentColor"
							stroke-width="0.5"
							opacity="0.2"
						/>
						<circle
							cx="20"
							cy="20"
							r="6"
							fill="none"
							stroke="currentColor"
							stroke-width="0.5"
							opacity="0.15"
						/>
						<circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.2" />
					</svg>
				{:else if stryMutAct_9fa48('135') ? artStyle !== 'halftone' : stryMutAct_9fa48('134') ? false : stryMutAct_9fa48('133') ? true : (stryCov_9fa48('133', '134', '135'), artStyle === (stryMutAct_9fa48('136') ? '' : (stryCov_9fa48('136'), 'halftone')))}
					<div class="halftone-dots"></div>
				{:else if stryMutAct_9fa48('139') ? artStyle !== 'solid' : stryMutAct_9fa48('138') ? false : stryMutAct_9fa48('137') ? true : (stryCov_9fa48('137', '138', '139'), artStyle === (stryMutAct_9fa48('140') ? '' : (stryCov_9fa48('140'), 'solid')))}
					<div class="solid-fill"></div>
				{:else}
					<div class="inverse-fill"></div>
				{/if}
			</div>
			<div class="card-info">
				<div class="card-num">
					No. {String(song.num).padStart(
						2,
						stryMutAct_9fa48('141') ? '' : (stryCov_9fa48('141'), '0')
					)}
				</div>
				<div class="card-year">{song.year}</div>
			</div>
			<div class="card-title">{song.title}</div>
			<div class="card-artist">{song.artist}</div>
		</div>
	{:else}
		<div class="card-back card-face">
			<div class="card-label">Songster</div>
			<div class="card-num">
				No. {String(song.num).padStart(
					2,
					stryMutAct_9fa48('142') ? '' : (stryCov_9fa48('142'), '0')
				)}
			</div>
		</div>
	{/if}
</div>

<style>
	.card-outer {
		border: 1.5px solid currentColor;
		border-radius: 6px;
		overflow: hidden;
		position: relative;
		background: var(--bg, transparent);
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	.card-outer.correct {
		box-shadow:
			0 0 0 2px #34c759,
			0 4px 12px rgba(52, 199, 89, 0.3);
	}
	.card-outer.wrong {
		box-shadow:
			0 0 0 2px #ff3b30,
			0 4px 12px rgba(255, 59, 48, 0.3);
	}
	.card-face {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 6px;
		gap: 2px;
		height: 100%;
	}
	.card-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 8px;
		letter-spacing: 3px;
		text-transform: uppercase;
		opacity: 0.5;
	}
	.card-art {
		flex: 1;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.6;
	}
	.halftone-dots {
		width: 100%;
		height: 100%;
		background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
		background-size: 4px 4px;
		opacity: 0.3;
	}
	.solid-fill {
		width: 80%;
		height: 80%;
		background: currentColor;
		opacity: 0.08;
		border-radius: 4px;
	}
	.inverse-fill {
		width: 80%;
		height: 80%;
		border: 2px solid currentColor;
		opacity: 0.2;
		border-radius: 4px;
	}
	.card-info {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	.card-num {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 8px;
		letter-spacing: 1px;
		opacity: 0.5;
	}
	.card-year {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 9px;
		font-weight: 600;
		opacity: 0.8;
	}
	.card-title {
		font-family: 'Playfair Display', serif;
		font-size: 11px;
		font-weight: 700;
		text-align: center;
		line-height: 1.2;
	}
	.card-artist {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 8px;
		letter-spacing: 1px;
		text-transform: uppercase;
		opacity: 0.5;
		text-align: center;
	}
	.card-back.card-face {
		justify-content: center;
	}
</style>
