<script lang="ts">
	import '$lib/tokens.css';
	import type { Snippet } from 'svelte';
	import { tweaks } from '$lib/stores/tweaks';

	let { children }: { children: Snippet } = $props();

	// Sync theme token to <html data-theme> so CSS custom properties apply
	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', $tweaks.theme);
		}
	});
</script>

<nav class="nav">
	<a href="/" class="nav-link">Home</a>
	<a href="/history" class="nav-link">History</a>
	<a href="/leaderboard" class="nav-link">Leaderboard</a>
</nav>

{@render children()}

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		gap: 16px;
		padding: 8px 16px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		letter-spacing: 1px;
		z-index: 100;
		background: var(--paper, #f4efe4);
		border-bottom: 0.5px solid var(--primary, #0a0a0a);
	}
	.nav-link {
		text-decoration: none;
		color: var(--primary, #0a0a0a);
		opacity: 0.6;
		transition: opacity 0.15s;
	}
	.nav-link:hover {
		opacity: 1;
	}
</style>
