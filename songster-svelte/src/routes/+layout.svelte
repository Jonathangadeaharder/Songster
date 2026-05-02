<script lang="ts">
	import '$lib/tokens.css';
	import type { Snippet } from 'svelte';
	import { tweaks } from '$lib/stores/tweaks';
	import AuthBar from '$lib/components/AuthBar.svelte';

	let { children }: { children: Snippet } = $props();

	// Sync theme token to <html data-theme> so CSS custom properties apply
	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', $tweaks.theme);
		}
	});
</script>

<div class="auth-bar-wrapper">
	<AuthBar />
</div>

{@render children()}

<style>
	.auth-bar-wrapper {
		position: fixed;
		top: 10px;
		right: 16px;
		z-index: 100;
	}
</style>
