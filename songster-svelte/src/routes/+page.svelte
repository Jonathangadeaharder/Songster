<script lang="ts">
	import Wordmark from '$lib/components/Wordmark.svelte';
</script>

<div class="home">
	<Wordmark scale={1.5} />
	<p class="tagline">Music trivia timeline game</p>
	<div class="actions">
		<a href="/lobby/DEMO" class="btn">Create Room</a>
		<a href="/lobby/DEMO" class="btn secondary">Join Room</a>
	</div>
</div>

<style>
	.home {
		min-height: 100vh; display: flex; flex-direction: column;
		align-items: center; justify-content: center; gap: 16px;
		background: #f4efe4; color: #0a0a0a;
	}
	.tagline {
		font-family: 'IBM Plex Mono', monospace; font-size: 12px;
		letter-spacing: 2px; text-transform: uppercase; opacity: 0.5;
	}
	.actions { display: flex; gap: 12px; margin-top: 16px; }
	.btn {
		padding: 12px 24px; border-radius: 4px;
		font-family: 'IBM Plex Mono', monospace; font-size: 11px;
		letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
		text-decoration: none; cursor: pointer;
		background: #0a0a0a; color: #f4efe4; border: none;
	}
	.secondary {
		background: transparent; color: #0a0a0a;
		border: 1.5px solid #0a0a0a;
	}
</style>
