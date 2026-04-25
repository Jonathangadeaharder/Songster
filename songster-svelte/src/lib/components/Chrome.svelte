<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Theme } from '$lib/types';
	let { theme = 'light' as Theme, title = '', right, children }: {
		theme?: Theme; title?: string; right?: Snippet; children: Snippet;
	} = $props();
</script>

<div class="shell" style="background: {theme === 'dark' ? '#0a0a0a' : '#f4efe4'}; color: {theme === 'dark' ? '#f4efe4' : '#0a0a0a'}">
	{#if title}
		<div class="chrome-bar">
			<div class="chrome-title">{title}</div>
			{#if right}
				{@render right()}
			{/if}
		</div>
	{/if}
	<div class="chrome-body">
		{@render children()}
	</div>
</div>

<style>
	.shell {
		width: 100%; max-width: 420px; min-height: 100vh;
		display: flex; flex-direction: column;
		border-radius: 0; overflow: hidden;
	}
	.chrome-bar {
		display: flex; justify-content: space-between; align-items: center;
		padding: 10px 16px; border-bottom: 0.5px solid rgba(128,128,128,0.2);
	}
	.chrome-title {
		font-family: 'IBM Plex Mono', monospace; font-size: 10px;
		letter-spacing: 2px; opacity: 0.5;
	}
	.chrome-body { flex: 1; display: flex; flex-direction: column; }
</style>
