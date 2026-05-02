<script context="module">
	function stryNS_9fa48() {
		var g =
			(typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis) ||
			new Function('return this')();
		var ns = g.__stryker__ || (g.__stryker__ = {});
		if (
			ns.activeMutant === undefined &&
			g.process &&
			g.process.env &&
			g.process.env.__STRYKER_ACTIVE_MUTANT__
		) {
			ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
		}
		function retrieveNS() {
			return ns;
		}
		stryNS_9fa48 = retrieveNS;
		return retrieveNS();
	}
	stryNS_9fa48();
	function stryCov_9fa48() {
		var ns = stryNS_9fa48();
		var cov =
			ns.mutantCoverage ||
			(ns.mutantCoverage = {
				static: {},
				perTest: {},
			});
		function cover() {
			var c = cov.static;
			if (ns.currentTestId) {
				c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
			}
			var a = arguments;
			for (var i = 0; i < a.length; i++) {
				c[a[i]] = (c[a[i]] || 0) + 1;
			}
		}
		stryCov_9fa48 = cover;
		cover.apply(null, arguments);
	}
	function stryMutAct_9fa48(id) {
		var ns = stryNS_9fa48();
		function isActive(id) {
			if (ns.activeMutant === id) {
				if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
					throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
				}
				return true;
			}
			return false;
		}
		stryMutAct_9fa48 = isActive;
		return isActive(id);
	}
</script>

<script lang="ts">
	let {
		bars = 42,
		height = 32,
		playing = stryMutAct_9fa48('369') ? true : (stryCov_9fa48('369'), false),
		intensity = 1,
		audioElement = null as HTMLAudioElement | null,
	}: {
		bars?: number;
		height?: number;
		playing?: boolean;
		intensity?: number;
		audioElement?: HTMLAudioElement | null;
	} = $props();
	let canvas: HTMLCanvasElement | null = $state(null);
	let ctx: CanvasRenderingContext2D | null = $state(null);
	let analyser: AnalyserNode | null = $state(null);
	let animationId: number | null = $state(null);
	let reducedMotion = $state(stryMutAct_9fa48('370') ? true : (stryCov_9fa48('370'), false));
	$effect(() => {
		if (stryMutAct_9fa48('371')) {
			{
			}
		} else {
			stryCov_9fa48('371');
			reducedMotion = window.matchMedia(
				stryMutAct_9fa48('372') ? '' : (stryCov_9fa48('372'), '(prefers-reduced-motion: reduce)')
			).matches;
		}
	});
	$effect(() => {
		if (stryMutAct_9fa48('373')) {
			{
			}
		} else {
			stryCov_9fa48('373');
			if (
				stryMutAct_9fa48('376')
					? (playing && audioElement) || !reducedMotion
					: stryMutAct_9fa48('375')
						? false
						: stryMutAct_9fa48('374')
							? true
							: (stryCov_9fa48('374', '375', '376'),
								(stryMutAct_9fa48('378')
									? playing || audioElement
									: stryMutAct_9fa48('377')
										? true
										: (stryCov_9fa48('377', '378'), playing && audioElement)) &&
									(stryMutAct_9fa48('379')
										? reducedMotion
										: (stryCov_9fa48('379'), !reducedMotion)))
			) {
				if (stryMutAct_9fa48('380')) {
					{
					}
				} else {
					stryCov_9fa48('380');
					setupAnalyser();
				}
			} else {
				if (stryMutAct_9fa48('381')) {
					{
					}
				} else {
					stryCov_9fa48('381');
					stopAnimation();
				}
			}
		}
	});
	function setupAnalyser() {
		if (stryMutAct_9fa48('382')) {
			{
			}
		} else {
			stryCov_9fa48('382');
			if (
				stryMutAct_9fa48('385')
					? !audioElement && !canvas
					: stryMutAct_9fa48('384')
						? false
						: stryMutAct_9fa48('383')
							? true
							: (stryCov_9fa48('383', '384', '385'),
								(stryMutAct_9fa48('386') ? audioElement : (stryCov_9fa48('386'), !audioElement)) ||
									(stryMutAct_9fa48('387') ? canvas : (stryCov_9fa48('387'), !canvas)))
			)
				return;
			const audioCtx = new AudioContext();
			const source = audioCtx.createMediaElementSource(audioElement);
			analyser = audioCtx.createAnalyser();
			analyser.fftSize = 64;
			source.connect(analyser);
			analyser.connect(audioCtx.destination);
			ctx = canvas.getContext(stryMutAct_9fa48('388') ? '' : (stryCov_9fa48('388'), '2d'));
			draw();
		}
	}
	function draw() {
		if (stryMutAct_9fa48('389')) {
			{
			}
		} else {
			stryCov_9fa48('389');
			if (
				stryMutAct_9fa48('392')
					? (!analyser || !ctx) && !canvas
					: stryMutAct_9fa48('391')
						? false
						: stryMutAct_9fa48('390')
							? true
							: (stryCov_9fa48('390', '391', '392'),
								(stryMutAct_9fa48('394')
									? !analyser && !ctx
									: stryMutAct_9fa48('393')
										? false
										: (stryCov_9fa48('393', '394'),
											(stryMutAct_9fa48('395') ? analyser : (stryCov_9fa48('395'), !analyser)) ||
												(stryMutAct_9fa48('396') ? ctx : (stryCov_9fa48('396'), !ctx)))) ||
									(stryMutAct_9fa48('397') ? canvas : (stryCov_9fa48('397'), !canvas)))
			)
				return;
			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			analyser.getByteFrequencyData(dataArray);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const barWidth = stryMutAct_9fa48('398')
				? canvas.width * bars
				: (stryCov_9fa48('398'), canvas.width / bars);
			for (
				let i = 0;
				stryMutAct_9fa48('401')
					? i >= bars
					: stryMutAct_9fa48('400')
						? i <= bars
						: stryMutAct_9fa48('399')
							? false
							: (stryCov_9fa48('399', '400', '401'), i < bars);
				stryMutAct_9fa48('402') ? i-- : (stryCov_9fa48('402'), i++)
			) {
				if (stryMutAct_9fa48('403')) {
					{
					}
				} else {
					stryCov_9fa48('403');
					const value =
						dataArray[
							stryMutAct_9fa48('404') ? i * bufferLength : (stryCov_9fa48('404'), i % bufferLength)
						];
					const barHeight = stryMutAct_9fa48('405')
						? value / 255 / canvas.height
						: (stryCov_9fa48('405'),
							(stryMutAct_9fa48('406') ? value * 255 : (stryCov_9fa48('406'), value / 255)) *
								canvas.height);
					ctx.fillStyle = stryMutAct_9fa48('407')
						? ``
						: (stryCov_9fa48('407'),
							`rgba(100, 100, 100, ${stryMutAct_9fa48('408') ? 0.2 - (value / 255) * 0.6 : (stryCov_9fa48('408'), 0.2 + (stryMutAct_9fa48('409') ? value / 255 / 0.6 : (stryCov_9fa48('409'), (stryMutAct_9fa48('410') ? value * 255 : (stryCov_9fa48('410'), value / 255)) * 0.6)))})`);
					ctx.fillRect(
						stryMutAct_9fa48('411') ? i / barWidth : (stryCov_9fa48('411'), i * barWidth),
						stryMutAct_9fa48('412')
							? canvas.height + barHeight
							: (stryCov_9fa48('412'), canvas.height - barHeight),
						stryMutAct_9fa48('413') ? barWidth + 1 : (stryCov_9fa48('413'), barWidth - 1),
						barHeight
					);
				}
			}
			animationId = requestAnimationFrame(draw);
		}
	}
	function stopAnimation() {
		if (stryMutAct_9fa48('414')) {
			{
			}
		} else {
			stryCov_9fa48('414');
			if (
				stryMutAct_9fa48('416')
					? false
					: stryMutAct_9fa48('415')
						? true
						: (stryCov_9fa48('415', '416'), animationId)
			) {
				if (stryMutAct_9fa48('417')) {
					{
					}
				} else {
					stryCov_9fa48('417');
					cancelAnimationFrame(animationId);
					animationId = null;
				}
			}
		}
	}
</script>

<canvas
	bind:this={canvas}
	width={stryMutAct_9fa48('418') ? bars / 4 : (stryCov_9fa48('418'), bars * 4)}
	{height}
	class:reduced={reducedMotion}
></canvas>

<style>
	canvas {
		display: block;
		width: 100%;
	}
	.reduced {
		opacity: 0.4;
	}
</style>
