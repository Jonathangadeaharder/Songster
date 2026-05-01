<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Chrome from '$lib/components/Chrome.svelte';
	import PlayerChip from '$lib/components/PlayerChip.svelte';
	import { remoteGame } from '$lib/stores/game-remote';
	import { game } from '$lib/stores/game';
	import { getRoomByCode, getRoomPlayers, getCurrentPlayer } from '$lib/room';
	import type { Player } from '$lib/types';

	let code: string = $derived(page.params.code ?? '');
	let isDemo = $derived(code === 'DEMO');
	let starting = $state(false);
	let roomId = $state('');
	let error = $state('');

	let { connected, players: remotePlayers, isHost, myPlayerId } = remoteGame;
	let { players: localPlayers } = game;

	onMount(() => {
		if (isDemo) return;

		let cancelled = false;

		(async () => {
			try {
				const room = await getRoomByCode(code);
				if (cancelled) return;
				if (!room) {
					error = 'Room not found';
					return;
				}
				if (room.status !== 'waiting') {
					goto(`/game/${code}`);
					return;
				}
				roomId = room.id;

				const playerInfo = await getCurrentPlayer();
				if (cancelled) return;
				if (!playerInfo) {
					error = 'Not in this room';
					return;
				}

				await remoteGame.connectRemoteGame({
					roomCode: code,
					roomId: room.id,
					myPlayerId: playerInfo.playerId,
					isHost: room.host_id === playerInfo.userId,
				});
			} catch (e) {
				if (!cancelled) error = e instanceof Error ? e.message : 'Failed to load room';
			}
		})();

		return () => {
			cancelled = true;
			remoteGame.disconnectRemoteGame();
		};
	});

	async function handleStart() {
		if (isDemo) {
			game.startGame();
			goto(`/game/${code}`);
			return;
		}

		starting = true;
		try {
			await remoteGame.startGame();
			goto(`/game/${code}`);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to start';
			starting = false;
		}
	}
</script>

<Chrome title="LOBBY · {code}">
	{#snippet children()}
		<div class="lobby">
			{#if isDemo}
				<h2>Solo Game</h2>
				<p class="sub">AI opponents ready</p>
				<div class="player-list">
					{#each $localPlayers as player}
						<PlayerChip {player} active={player.id === 'p1'} />
					{/each}
				</div>
			{:else}
				<h2>Room {code}</h2>
				<p class="sub">Waiting for players…</p>
				{#if error}
					<p class="error">{error}</p>
				{/if}
				<div class="player-list">
					{#each $remotePlayers as player}
						<PlayerChip {player} active={player.id === $myPlayerId} />
					{/each}
				</div>
			{/if}
			<button
				class="start-btn"
				onclick={handleStart}
				disabled={(!isDemo && (!$isHost || $remotePlayers.length < 1)) || starting}
			>
				{starting ? 'Starting…' : 'Start Game'}
			</button>
		</div>
	{/snippet}
</Chrome>

<style>
	.lobby {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 24px 16px;
		gap: 16px;
	}
	h2 {
		font-family: 'Playfair Display', serif;
		font-size: 24px;
	}
	.sub {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		letter-spacing: 2px;
		text-transform: uppercase;
		opacity: 0.5;
	}
	.error {
		color: #c0392b;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 1px;
	}
	.player-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
	}
	.start-btn {
		margin-top: auto;
		width: 100%;
		padding: 14px;
		background: #0a0a0a;
		color: #f4efe4;
		border: none;
		border-radius: 4px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 4px;
		text-transform: uppercase;
		font-weight: 600;
		cursor: pointer;
	}
	.start-btn:disabled {
		opacity: 0.4;
		cursor: default;
	}
</style>
