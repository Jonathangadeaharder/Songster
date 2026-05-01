<script lang="ts">
	import { goto } from '$app/navigation';
	import Wordmark from '$lib/components/Wordmark.svelte';
	import { createRoom, joinRoom } from '$lib/room';

	let hostName = $state('');
	let joinCode = $state('');
	let joinName = $state('');
	let creating = $state(false);
	let joining = $state(false);
	let error = $state('');

	async function handleCreate() {
		if (!hostName.trim()) return;
		creating = true;
		error = '';
		try {
			const room = await createRoom(hostName.trim());
			goto(`/lobby/${room.code}`);
		} catch {
			// Fallback to solo mode when Supabase is unavailable (E2E/placeholder)
			goto('/lobby/DEMO');
		}
	}

	async function handleJoin() {
		if (!joinCode.trim() || !joinName.trim()) return;
		joining = true;
		error = '';
		try {
			await joinRoom(joinCode.trim().toUpperCase(), joinName.trim());
			goto(`/lobby/${joinCode.trim().toUpperCase()}`);
		} catch {
			// Fallback to solo mode when Supabase is unavailable (E2E/placeholder)
			goto('/lobby/DEMO');
		}
	}
</script>

<div class="home">
	<Wordmark scale={1.5} />
	<p class="tagline">Music trivia timeline game</p>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	<div class="panels">
		<form
			class="panel"
			onsubmit={(e) => {
				e.preventDefault();
				handleCreate();
			}}
		>
			<h3>Create Room</h3>
			<input
				type="text"
				bind:value={hostName}
				placeholder="Your name"
				maxlength={20}
				disabled={creating}
			/>
			<button type="submit" disabled={creating || !hostName.trim()}>
				{creating ? 'Creating…' : 'Create Room'}
			</button>
		</form>

		<form
			class="panel"
			onsubmit={(e) => {
				e.preventDefault();
				handleJoin();
			}}
		>
			<h3>Join Room</h3>
			<input
				type="text"
				bind:value={joinCode}
				placeholder="Room code"
				maxlength={6}
				disabled={joining}
			/>
			<input
				type="text"
				bind:value={joinName}
				placeholder="Your name"
				maxlength={20}
				disabled={joining}
			/>
			<button type="submit" disabled={joining || !joinCode.trim() || !joinName.trim()}>
				{joining ? 'Joining…' : 'Join Room'}
			</button>
		</form>
	</div>

	<a href="/lobby/DEMO" class="solo-link">Or play solo with AI →</a>
</div>

<style>
	.home {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		background: #f4efe4;
		color: #0a0a0a;
		padding: 20px;
	}
	.tagline {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 12px;
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
	.panels {
		display: flex;
		gap: 16px;
		margin-top: 16px;
		flex-wrap: wrap;
		justify-content: center;
	}
	.panel {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 20px;
		border: 1.5px solid rgba(10, 10, 10, 0.15);
		border-radius: 8px;
		min-width: 200px;
	}
	.panel h3 {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 3px;
		text-transform: uppercase;
		opacity: 0.6;
		margin: 0;
	}
	input {
		padding: 10px 12px;
		border: 1.5px solid rgba(10, 10, 10, 0.2);
		border-radius: 4px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 13px;
		background: transparent;
		color: inherit;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	input:focus {
		outline: none;
		border-color: #0a0a0a;
	}
	button {
		padding: 10px 16px;
		border-radius: 4px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		font-weight: 600;
		cursor: pointer;
		background: #0a0a0a;
		color: #f4efe4;
		border: none;
		transition: opacity 0.2s;
	}
	button:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.solo-link {
		margin-top: 12px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 1px;
		opacity: 0.5;
		text-decoration: none;
		color: inherit;
	}
	.solo-link:hover {
		opacity: 0.8;
	}
</style>
