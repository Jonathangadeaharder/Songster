<script lang="ts">
	let { bars = 42, height = 32, playing = false, intensity = 1 }: {
		bars?: number; height?: number; playing?: boolean; intensity?: number;
	} = $props();
</script>

<div class="waveform" style="height: {height}px">
	{#each Array(bars) as _, i}
		<div
			class="bar"
			style="height: {playing ? (Math.sin(i * 0.5) * 0.5 + 0.5) * 100 : 20}%; transition-duration: {200 / intensity}ms; animation-duration: {600 / intensity}ms"
			class:playing
		></div>
	{/each}
</div>

<style>
	.waveform {
		display: flex; align-items: flex-end; gap: 2px;
		padding: 0 8px;
	}
	.bar {
		flex: 1; background: currentColor; opacity: 0.2;
		border-radius: 1px; min-height: 2px; transition: height 200ms ease;
	}
	.playing { opacity: 0.6; }
</style>
