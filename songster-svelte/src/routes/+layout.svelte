<script lang="ts">
	import '$lib/tokens.css';
	import type { Snippet } from 'svelte';
	import { tweaks } from '$lib/stores/tweaks';
	import Toast from '$lib/components/Toast.svelte';
	import { initAuth } from '$lib/stores/auth';
	import AuthBar from '$lib/components/AuthBar.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	$effect(() => {
		initAuth(data.session);
	});

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
<Toast />

<style>
	.auth-bar-wrapper {
		position: fixed;
		top: 10px;
		right: 16px;
		z-index: 100;
	}
	:global(.skip-link) {
		position: absolute;
		top: -40px;
		left: 0;
		background: #0a0a0a;
		color: #f4efe4;
		padding: 8px 16px;
		z-index: 10001;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 12px;
		letter-spacing: 1px;
		text-decoration: none;
		transition: top 0.2s;
	}
	:global(.skip-link:focus) {
		top: 0;
	}
	:global(:focus-visible) {
		outline: 2px solid var(--color-accent, #c8a96e);
		outline-offset: 2px;
	}
	:global(button:focus-visible, a:focus-visible, input:focus-visible) {
		outline: 2px solid var(--color-accent, #c8a96e);
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.skip-link) {
			transition: none;
		}
	}
</style>
