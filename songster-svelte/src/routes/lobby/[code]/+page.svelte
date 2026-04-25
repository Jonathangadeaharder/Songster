<script lang="ts">
	import { page } from '$app/state';
	import Chrome from '$lib/components/Chrome.svelte';
	import PlayerChip from '$lib/components/PlayerChip.svelte';
	import { game } from '$lib/stores/game';
	import type { Player } from '$lib/types';

	let code: string = $derived(page.params.code ?? '');
	let { players } = game;
	let started = $state(false);

	function handleStart() {
		game.startGame();
		started = true;
	}
</script>

{#if !started}
	<Chrome title="LOBBY · {code}">
		{#snippet children()}
			<div class="lobby">
				<h2>Room {code}</h2>
				<p class="sub">Waiting for players…</p>
				<div class="player-list">
					{#each $players as player}
						<PlayerChip {player} active={player.id === 'p1'} />
					{/each}
				</div>
				<button class="start-btn" onclick={handleStart}>Start Game</button>
			</div>
		{/snippet}
	</Chrome>
{/if}

{#if started}
	<script>
		window.location.href = `/game/${code}`;
	</script>
{/if}

<style>
	.lobby {
		flex: 1; display: flex; flex-direction: column;
		align-items: center; padding: 24px 16px; gap: 16px;
	}
	h2 { font-family: 'Playfair Display', serif; font-size: 24px; }
	.sub {
		font-family: 'IBM Plex Mono', monospace; font-size: 10px;
		letter-spacing: 2px; text-transform: uppercase; opacity: 0.5;
	}
	.player-list { display: flex; flex-direction: column; gap: 8px; width: 100%; }
	.start-btn {
		margin-top: auto; width: 100%; padding: 14px;
		background: #0a0a0a; color: #f4efe4; border: none; border-radius: 4px;
		font-family: 'IBM Plex Mono', monospace; font-size: 11px;
		letter-spacing: 4px; text-transform: uppercase; font-weight: 600;
		cursor: pointer;
	}
</style>
