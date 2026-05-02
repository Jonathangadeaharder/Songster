<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Chrome from '$lib/components/Chrome.svelte';
	import Wordmark from '$lib/components/Wordmark.svelte';
	import Rematch from '$lib/components/Rematch.svelte';
	import { game } from '$lib/stores/game';
	import { getRoomByCode } from '$lib/room';
	import { supabase } from '$lib/supabase';

	let code: string = $derived(page.params.code ?? '');
	let { winner } = game;
	let isHost = $state(false);

	onMount(async () => {
		const room = await getRoomByCode(code);
		if (!room) return;
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) isHost = room.host_id === user.id;
	});
</script>

<Chrome title="RESULTS · {code}">
	{#snippet children()}
		<div class="results">
			<Wordmark scale={2} />
			<div class="winner">
				<div class="winner-label">Winner</div>
				<div class="winner-name">{$winner?.name ?? 'Nobody'}</div>
			</div>
			<Rematch roomCode={code} {isHost} />
			<button
				class="replay-btn"
				onclick={() => {
					game.onReplay();
					goto('/');
				}}>Back to Lobby</button
			>
		</div>
	{/snippet}
</Chrome>

<style>
	.results {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 24px;
	}
	.winner {
		text-align: center;
	}
	.winner-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		letter-spacing: 3px;
		text-transform: uppercase;
		opacity: 0.5;
	}
	.winner-name {
		font-family: 'Playfair Display', serif;
		font-size: 36px;
		font-weight: 700;
		font-style: italic;
	}
	.replay-btn {
		padding: 12px 24px;
		background: #0a0a0a;
		color: #f4efe4;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
	}
</style>
