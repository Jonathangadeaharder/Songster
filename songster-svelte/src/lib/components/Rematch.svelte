<script lang="ts">
	import { goto } from '$app/navigation';
	import { createRematch } from '$lib/room';

	interface Props {
		roomCode: string;
		isHost: boolean;
	}

	let { roomCode, isHost }: Props = $props();
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function handleRematch() {
		if (!isHost || loading) return;
		loading = true;
		error = null;

		try {
			const newRoom = await createRematch(roomCode);
			goto(`/game/${newRoom.code}`);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to create rematch';
			loading = false;
		}
	}
</script>

<div class="rematch">
	{#if isHost}
		<button class="rematch-btn" onclick={handleRematch} disabled={loading}>
			{loading ? 'Creating...' : 'Play Again'}
		</button>
	{:else}
		<div class="waiting">Waiting for host to start rematch...</div>
	{/if}

	{#if error}
		<div class="error">{error}</div>
	{/if}
</div>

<style>
	.rematch {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.rematch-btn {
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
	.rematch-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.waiting {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		letter-spacing: 1px;
		opacity: 0.6;
	}
	.error {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		color: #c00;
	}
</style>
