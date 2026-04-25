<script lang="ts">
	import { page } from '$app/state';
	import Chrome from '$lib/components/Chrome.svelte';
	import PlayerChip from '$lib/components/PlayerChip.svelte';
	import HitCard from '$lib/components/HitCard.svelte';
	import Vinyl from '$lib/components/Vinyl.svelte';
	import Waveform from '$lib/components/Waveform.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import { game } from '$lib/stores/game';
	import { tweaks } from '$lib/stores/tweaks';
	import { colors } from '$lib/utils';
	import type { Player } from '$lib/types';
	import { untrack } from 'svelte';
	import TweaksPanel from '$lib/components/Tweaks.svelte';
	import TweakSection from '$lib/components/TweakSection.svelte';
	import TweakRadio from '$lib/components/TweakRadio.svelte';
	import TweakSlider from '$lib/components/TweakSlider.svelte';
	import TweakToggle from '$lib/components/TweakToggle.svelte';

	let code: string = $derived(page.params.code ?? '');
	let t = $derived($tweaks);
	let { primary, paper } = $derived(colors(t.theme));

	const { round, drawPile, players, activeCard, activePlayerId, phase, placedSlot, placedResult, interceptor, screen: screenStore, dragging } = game;

	let activePlayer: Player | undefined = $derived($players.find((p: Player) => p.id === $activePlayerId));
	let me: Player = $derived($players.find((p: Player) => p.id === 'p1')!);
	let myTurnAndPlacing = $derived($phase === 'place' && $activePlayerId === 'p1');

	$effect(() => {
		if ($screenStore === 'lobby') {
			$screenStore;
			untrack(() => game.startGame());
		}
	});

	$effect(() => {
		$activePlayerId;
		untrack(() => {
			if ($phase === 'draw' && $activePlayerId !== 'p1') {
				game.runAiTurn();
			}
		});
	});

	let dragSlot = $state<number | null>(null);

	function onCardDragStart(e: DragEvent) {
		if (!myTurnAndPlacing) { e.preventDefault(); return; }
		e.dataTransfer!.setData('text/plain', 'active-card');
		e.dataTransfer!.effectAllowed = 'move';
		game.dragging.set(true);
	}

	function onCardDragEnd() {
		game.dragging.set(false);
		dragSlot = null;
	}

	function onSlotDragOver(e: DragEvent, i: number) {
		e.preventDefault();
		e.dataTransfer!.dropEffect = 'move';
		dragSlot = i;
	}

	function onSlotDragLeave(_e: DragEvent, i: number) {
		if (dragSlot === i) dragSlot = null;
	}

	function onSlotDrop(e: DragEvent, i: number) {
		e.preventDefault();
		dragSlot = null;
		game.dragging.set(false);
		game.onPlace(i);
	}

	function onPlay() {
		game.onPlay();
	}

	function onNextTurn() {
		game.onNextTurn();
	}

	function onChallenge() {
		game.onChallenge();
	}
</script>

<div class="page">
	<Chrome theme={t.theme} title="Game · {code} · Songster">
		{#snippet right()}
			<div class="turn-label">
				<span style="opacity: 0.6">TURN</span>
				<span>{activePlayer?.name}</span>
			</div>
		{/snippet}

		{#snippet children()}
			<div class="player-rail">
				{#each $players as player}
					<PlayerChip {player} active={player.id === $activePlayerId} theme={t.theme} />
				{/each}
			</div>

			<div class="vinyl-section">
				<Vinyl
					size={190}
					spinning={$phase === 'listen' || $phase === 'place'}
					label={$phase === 'listen' || $phase === 'place' ? 'NOW SPINNING' : $phase === 'reveal' ? ($placedResult ? 'CORRECT' : 'DISCARD') : 'STANDBY'}
					subLabel={$phase === 'reveal' && $activeCard ? `${$activeCard.year} · ${$activeCard.artist}` : '33⅓ RPM'}
					intensity={t.animIntensity}
				/>

				<Waveform bars={42} height={32} playing={$phase === 'listen' || $phase === 'place'} intensity={t.animIntensity} />

				<div class="phase-label">
					{#if $phase === 'draw'}
						{activePlayer?.name}'s draw — tap the record
					{:else if $phase === 'listen'}
						Listening · 0:30 preview
					{:else if $phase === 'place'}
						{$activePlayerId === 'p1' ? 'Drag the card onto your timeline' : `${activePlayer?.name} is placing…`}
					{:else if $phase === 'reveal'}
						{$placedResult ? 'Correct placement' : 'Wrong — card discarded'}
					{:else if $phase === 'challenge'}
						{$players.find((p: Player) => p.id === $interceptor)?.name} challenged!
					{/if}
				</div>
			</div>

			<div class="card-area">
				{#if $activeCard && ($phase === 'draw' || $phase === 'listen' || $phase === 'place' || $phase === 'challenge')}
					<div
						class="card-wrapper"
						draggable={myTurnAndPlacing ? 'true' : undefined}
						ondragstart={onCardDragStart}
						ondragend={onCardDragEnd}
						style="cursor: {myTurnAndPlacing ? 'grab' : ($phase === 'draw' && $activePlayerId === 'p1' ? 'pointer' : 'default')}; opacity: {$dragging ? 0.3 : 1}"
					>
						<button
							onclick={$phase === 'draw' && $activePlayerId === 'p1' ? onPlay : undefined}
							style="background: none; border: none; padding: 0; pointer-events: {myTurnAndPlacing ? 'none' : 'auto'}"
						>
							<HitCard
								song={$activeCard}
								faceDown={true}
								size="md"
								artStyle={t.artStyle}
								flipStyle={t.flipStyle}
								theme={t.theme}
							/>
						</button>
					</div>
				{:else if $phase === 'reveal' && $activeCard}
					<HitCard
						song={$activeCard}
						faceDown={false}
						size="md"
						artStyle={t.artStyle}
						flipStyle={t.flipStyle}
						theme={t.theme}
						correct={$placedResult}
					/>
				{/if}
			</div>

			{#if t.interceptionEnabled && ($phase === 'place' || $phase === 'challenge') && $activePlayerId !== 'p1'}
				<div class="challenge-bar">
					<div>
						<div class="challenge-label">Challenge</div>
						<div class="challenge-text">Think they're wrong? Spend a token.</div>
					</div>
					<button
						class="intercept-btn"
						onclick={onChallenge}
						disabled={me.tokens <= 0}
						style="opacity: {me.tokens > 0 ? 1 : 0.35}; cursor: {me.tokens > 0 ? 'pointer' : 'default'}"
					>
						◈ {me.tokens} · Intercept
					</button>
				</div>
			{/if}

			<div class="timeline-section">
				<div class="timeline-header">
					<div class="timeline-label">Your Timeline</div>
					<div class="timeline-count">
						{me.timeline.length}<span style="opacity: 0.4">/10</span>
					</div>
				</div>

				<Timeline
					cards={me.timeline}
					density={t.density}
					artStyle={t.artStyle}
					theme={t.theme}
					frozen={!myTurnAndPlacing}
					draggingActive={myTurnAndPlacing}
					hoverSlot={dragSlot}
					highlightSlot={$phase === 'reveal' && $placedResult && $activePlayerId === 'p1' ? $placedSlot : null}
					wrongSlot={$phase === 'reveal' && !$placedResult && $activePlayerId === 'p1' ? $placedSlot : null}
					onSlotClick={myTurnAndPlacing ? (i: number) => game.onPlace(i) : undefined}
					onSlotDragOver={myTurnAndPlacing ? (_e: DragEvent, i: number) => onSlotDragOver(_e, i) : undefined}
					onSlotDragLeave={myTurnAndPlacing ? (_e: DragEvent, i: number) => onSlotDragLeave(_e, i) : undefined}
					onSlotDrop={myTurnAndPlacing ? (_e: DragEvent, i: number) => onSlotDrop(_e, i) : undefined}
				/>

				{#if $phase === 'reveal'}
					<div class="next-btn-wrap">
						<button class="next-btn" style="background: {primary}; color: {paper}" onclick={onNextTurn}>
							Side B · Next Turn →
						</button>
					</div>
				{:else}
					<div style="height: 16px"></div>
				{/if}
			</div>
		{/snippet}
	</Chrome>

	<TweaksPanel title="Tweaks · Songster">
		<TweakSection label="Theme" />
		<TweakRadio label="Mode" value={t.theme} options={[{ value: 'light', label: 'Paper' }, { value: 'dark', label: 'After-hours' }]} onchange={(v) => tweaks.set('theme', v)} />
		<TweakRadio label="Card Art" value={t.artStyle} options={[{ value: 'grooves', label: 'Grooves' }, { value: 'halftone', label: 'Halftone' }, { value: 'solid', label: 'Solid' }, { value: 'inverse', label: 'Inverse' }]} onchange={(v) => tweaks.set('artStyle', v)} />

		<TweakSection label="Motion" />
		<TweakRadio label="Flip" value={t.flipStyle} options={[{ value: 'flip', label: '3D' }, { value: 'slide', label: 'Slide' }, { value: 'fade', label: 'Fade' }, { value: 'instant', label: 'Cut' }]} onchange={(v) => tweaks.set('flipStyle', v)} />
		<TweakSlider label="Anim intensity" value={t.animIntensity} min={0.3} max={2.5} step={0.1} onchange={(v) => tweaks.set('animIntensity', v)} />

		<TweakSection label="Timeline" />
		<TweakRadio label="Density" value={t.density} options={[{ value: 'compact', label: 'Tight' }, { value: 'regular', label: 'Reg' }, { value: 'comfy', label: 'Airy' }]} onchange={(v) => tweaks.set('density', v)} />

		<TweakSection label="Rules" />
		<TweakToggle label="Interception tokens" value={t.interceptionEnabled} onchange={(v) => tweaks.set('interceptionEnabled', v)} />
	</TweaksPanel>
</div>

<style>
	.page {
		min-height: 100vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}
	.turn-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		letter-spacing: 2px;
		display: flex;
		gap: 8px;
	}
	.player-rail {
		display: flex;
		gap: 10px;
		padding: 10px 16px 12px;
		border-bottom: 0.5px solid var(--primary, #0a0a0a);
	}
	.vinyl-section {
		padding: 20px 16px 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.phase-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		letter-spacing: 3px;
		opacity: 0.7;
		text-transform: uppercase;
		text-align: center;
	}
	.card-area {
		display: flex;
		justify-content: center;
		padding: 0 0 6px;
		min-height: 148px;
	}
	.card-wrapper {
		display: inline-block;
	}
	.challenge-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 16px;
		background: rgba(128, 128, 128, 0.06);
		margin: 0 16px;
		border-radius: 6px;
	}
	.challenge-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 1px;
	}
	.challenge-text {
		font-size: 10px;
		opacity: 0.5;
	}
	.intercept-btn {
		background: none;
		border: 1.5px solid currentColor;
		padding: 6px 12px;
		border-radius: 4px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		letter-spacing: 1px;
		cursor: pointer;
	}
	.timeline-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
	.timeline-header {
		padding: 0 18px 2px;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.timeline-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 9px;
		letter-spacing: 3px;
		opacity: 0.65;
		text-transform: uppercase;
	}
	.timeline-count {
		font-family: 'Playfair Display', serif;
		font-style: italic;
		font-size: 18px;
		font-weight: 700;
	}
	.next-btn-wrap {
		padding: 4px 16px 16px;
	}
	.next-btn {
		width: 100%;
		padding: 14px;
		border: none;
		border-radius: 4px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 4px;
		text-transform: uppercase;
		font-weight: 600;
		cursor: pointer;
	}
</style>
