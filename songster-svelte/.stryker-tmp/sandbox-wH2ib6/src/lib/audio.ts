// @ts-nocheck
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
import type { Song, Track } from '$lib/types';
class AudioManager {
	private audio: HTMLAudioElement | null = null;
	private abortController: AbortController | null = null;
	private mobileUnlocked = stryMutAct_9fa48('47') ? true : (stryCov_9fa48('47'), false);
	private unlockMobile(): void {
		if (stryMutAct_9fa48('48')) {
			{
			}
		} else {
			stryCov_9fa48('48');
			if (
				stryMutAct_9fa48('50')
					? false
					: stryMutAct_9fa48('49')
						? true
						: (stryCov_9fa48('49', '50'), this.mobileUnlocked)
			)
				return;
			this.mobileUnlocked = stryMutAct_9fa48('51') ? false : (stryCov_9fa48('51'), true);
		}
	}
	async play(track: Track): Promise<void> {
		if (stryMutAct_9fa48('52')) {
			{
			}
		} else {
			stryCov_9fa48('52');
			this.stop();
			if (
				stryMutAct_9fa48('55')
					? false
					: stryMutAct_9fa48('54')
						? true
						: stryMutAct_9fa48('53')
							? track.preview_url
							: (stryCov_9fa48('53', '54', '55'), !track.preview_url)
			)
				return;
			this.unlockMobile();
			this.abortController = new AbortController();
			const { signal } = this.abortController;

			/* c8 ignore next */
			if (
				stryMutAct_9fa48('57')
					? false
					: stryMutAct_9fa48('56')
						? true
						: (stryCov_9fa48('56', '57'), signal.aborted)
			)
				return;
			this.audio = new Audio(track.preview_url);
			this.audio.crossOrigin = stryMutAct_9fa48('58') ? '' : (stryCov_9fa48('58'), 'anonymous');
			this.audio.volume = 0;
			try {
				if (stryMutAct_9fa48('59')) {
					{
					}
				} else {
					stryCov_9fa48('59');
					await this.audio.play();
					await this.fadeVolume(this.audio, 0.8, 200);
				}
			} catch {
				/* autoplay block or abort */
			}
		}
	}
	stop(): void {
		if (stryMutAct_9fa48('60')) {
			{
			}
		} else {
			stryCov_9fa48('60');
			if (
				stryMutAct_9fa48('62')
					? false
					: stryMutAct_9fa48('61')
						? true
						: (stryCov_9fa48('61', '62'), this.abortController)
			) {
				if (stryMutAct_9fa48('63')) {
					{
					}
				} else {
					stryCov_9fa48('63');
					this.abortController.abort();
					this.abortController = null;
				}
			}
			if (
				stryMutAct_9fa48('65')
					? false
					: stryMutAct_9fa48('64')
						? true
						: (stryCov_9fa48('64', '65'), this.audio)
			) {
				if (stryMutAct_9fa48('66')) {
					{
					}
				} else {
					stryCov_9fa48('66');
					this.audio.pause();
					this.audio.src = stryMutAct_9fa48('67') ? 'Stryker was here!' : (stryCov_9fa48('67'), '');
					this.audio = null;
				}
			}
		}
	}
	preload(tracks: Track[]): void {
		if (stryMutAct_9fa48('68')) {
			{
			}
		} else {
			stryCov_9fa48('68');
			const toPreload = stryMutAct_9fa48('69') ? tracks : (stryCov_9fa48('69'), tracks.slice(0, 3));
			for (const track of toPreload) {
				if (stryMutAct_9fa48('70')) {
					{
					}
				} else {
					stryCov_9fa48('70');
					if (
						stryMutAct_9fa48('73')
							? false
							: stryMutAct_9fa48('72')
								? true
								: stryMutAct_9fa48('71')
									? track.preview_url
									: (stryCov_9fa48('71', '72', '73'), !track.preview_url)
					)
						continue;
					const a = new Audio(track.preview_url);
					a.preload = stryMutAct_9fa48('74') ? '' : (stryCov_9fa48('74'), 'auto');
				}
			}
		}
	}
	private fadeVolume(audio: HTMLAudioElement, target: number, duration: number): Promise<void> {
		if (stryMutAct_9fa48('75')) {
			{
			}
		} else {
			stryCov_9fa48('75');
			return new Promise((resolve) => {
				if (stryMutAct_9fa48('76')) {
					{
					}
				} else {
					stryCov_9fa48('76');
					const start = audio.volume;
					const startTime = performance.now();
					const step = (now: number) => {
						if (stryMutAct_9fa48('77')) {
							{
							}
						} else {
							stryCov_9fa48('77');
							const elapsed = stryMutAct_9fa48('78')
								? now + startTime
								: (stryCov_9fa48('78'), now - startTime);
							const t = stryMutAct_9fa48('79')
								? Math.max(elapsed / duration, 1)
								: (stryCov_9fa48('79'),
									Math.min(
										stryMutAct_9fa48('80')
											? elapsed * duration
											: (stryCov_9fa48('80'), elapsed / duration),
										1
									));
							audio.volume = stryMutAct_9fa48('81')
								? start - (target - start) * t
								: (stryCov_9fa48('81'),
									start +
										(stryMutAct_9fa48('82')
											? (target - start) / t
											: (stryCov_9fa48('82'),
												(stryMutAct_9fa48('83')
													? target + start
													: (stryCov_9fa48('83'), target - start)) * t)));
							if (
								stryMutAct_9fa48('87')
									? t >= 1
									: stryMutAct_9fa48('86')
										? t <= 1
										: stryMutAct_9fa48('85')
											? false
											: stryMutAct_9fa48('84')
												? true
												: (stryCov_9fa48('84', '85', '86', '87'), t < 1)
							) {
								if (stryMutAct_9fa48('88')) {
									{
									}
								} else {
									stryCov_9fa48('88');
									requestAnimationFrame(step);
								}
							} else {
								if (stryMutAct_9fa48('89')) {
									{
									}
								} else {
									stryCov_9fa48('89');
									resolve();
								}
							}
						}
					};
					requestAnimationFrame(step);
				}
			});
		}
	}
}
export const audioManager = new AudioManager();

// Compatibility wrappers for legacy Song-based API
export function playPreview(song: Song): Promise<void> {
	if (stryMutAct_9fa48('90')) {
		{
		}
	} else {
		stryCov_9fa48('90');
		const track: Track = stryMutAct_9fa48('91')
			? {}
			: (stryCov_9fa48('91'),
				{
					...song,
					deezer_id: 0,
					preview_url: stryMutAct_9fa48('92') ? 'Stryker was here!' : (stryCov_9fa48('92'), ''),
					cover_small: null,
					cover_medium: null,
					duration: 30,
				});
		return audioManager.play(track);
	}
}
export function stopPreview(): void {
	if (stryMutAct_9fa48('93')) {
		{
		}
	} else {
		stryCov_9fa48('93');
		audioManager.stop();
	}
}
export function preloadPreviews(_songs: Song[]): void {
	// No-op: static songs don't have preview URLs
}
