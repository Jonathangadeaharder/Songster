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

{@render children()}
