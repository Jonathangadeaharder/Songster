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
	import { page } from '$app/state';
	import Chrome from '$lib/components/Chrome.svelte';
	import PlayerChip from '$lib/components/PlayerChip.svelte';
	import HitCard from '$lib/components/HitCard.svelte';
	import Vinyl from '$lib/components/Vinyl.svelte';
	import Waveform from '$lib/components/Waveform.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import { game } from '$lib/stores/game';
	import { remoteGame } from '$lib/stores/game-remote';
	import { tweaks } from '$lib/stores/tweaks';
	import { colors } from '$lib/utils';
	import type { Player, Theme, ArtStyle, FlipStyle, Density } from '$lib/types';
	import { onMount, untrack } from 'svelte';
	import TweaksPanel from '$lib/components/Tweaks.svelte';
	import TweakSection from '$lib/components/TweakSection.svelte';
	import TweakRadio from '$lib/components/TweakRadio.svelte';
	import TweakSlider from '$lib/components/TweakSlider.svelte';
	import TweakToggle from '$lib/components/TweakToggle.svelte';
	import { getRoomByCode, getCurrentPlayerInRoom } from '$lib/room';
	let code: string = $derived(
		stryMutAct_9fa48('1718')
			? page.params.code && ''
			: (stryCov_9fa48('1718'),
				page.params.code ??
					(stryMutAct_9fa48('1719') ? 'Stryker was here!' : (stryCov_9fa48('1719'), '')))
	);
	let t = $derived($tweaks);
	let { primary, paper } = $derived(colors(t.theme));
	import { derived, writable } from 'svelte/store';
	import type { Writable, Readable } from 'svelte/store';
	let isDemo = $derived(
		stryMutAct_9fa48('1722')
			? code !== 'DEMO'
			: stryMutAct_9fa48('1721')
				? false
				: stryMutAct_9fa48('1720')
					? true
					: (stryCov_9fa48('1720', '1721', '1722'),
						code === (stryMutAct_9fa48('1723') ? '' : (stryCov_9fa48('1723'), 'DEMO')))
	);
	// svelte-ignore state_referenced_locally
	const mode = writable<'demo' | 'remote'>(
		(
			stryMutAct_9fa48('1726')
				? code !== 'DEMO'
				: stryMutAct_9fa48('1725')
					? false
					: stryMutAct_9fa48('1724')
						? true
						: (stryCov_9fa48('1724', '1725', '1726'),
							code === (stryMutAct_9fa48('1727') ? '' : (stryCov_9fa48('1727'), 'DEMO')))
		)
			? stryMutAct_9fa48('1728')
				? ''
				: (stryCov_9fa48('1728'), 'demo')
			: stryMutAct_9fa48('1729')
				? ''
				: (stryCov_9fa48('1729'), 'remote')
	);
	$effect(() => {
		if (stryMutAct_9fa48('1730')) {
			{
			}
		} else {
			stryCov_9fa48('1730');
			mode.set(
				isDemo
					? stryMutAct_9fa48('1731')
						? ''
						: (stryCov_9fa48('1731'), 'demo')
					: stryMutAct_9fa48('1732')
						? ''
						: (stryCov_9fa48('1732'), 'remote')
			);
		}
	});
	function proxy<T>(demo: Writable<T>, remote: Writable<T>): Readable<T> {
		if (stryMutAct_9fa48('1733')) {
			{
			}
		} else {
			stryCov_9fa48('1733');
			return derived(
				stryMutAct_9fa48('1734') ? [] : (stryCov_9fa48('1734'), [demo, remote, mode]),
				stryMutAct_9fa48('1735')
					? () => undefined
					: (stryCov_9fa48('1735'),
						([d, r, m]) =>
							(
								stryMutAct_9fa48('1738')
									? m !== 'demo'
									: stryMutAct_9fa48('1737')
										? false
										: stryMutAct_9fa48('1736')
											? true
											: (stryCov_9fa48('1736', '1737', '1738'),
												m === (stryMutAct_9fa48('1739') ? '' : (stryCov_9fa48('1739'), 'demo')))
							)
								? d
								: r)
			);
		}
	}
	function proxyConst<T>(demo: T, remote: Writable<T>): Readable<T> {
		if (stryMutAct_9fa48('1740')) {
			{
			}
		} else {
			stryCov_9fa48('1740');
			return derived(
				stryMutAct_9fa48('1741') ? [] : (stryCov_9fa48('1741'), [remote, mode]),
				stryMutAct_9fa48('1742')
					? () => undefined
					: (stryCov_9fa48('1742'),
						([r, m]) =>
							(
								stryMutAct_9fa48('1745')
									? m !== 'demo'
									: stryMutAct_9fa48('1744')
										? false
										: stryMutAct_9fa48('1743')
											? true
											: (stryCov_9fa48('1743', '1744', '1745'),
												m === (stryMutAct_9fa48('1746') ? '' : (stryCov_9fa48('1746'), 'demo')))
							)
								? demo
								: r)
			);
		}
	}
	const round = proxy(game.round, remoteGame.round);
	const drawPile = proxy(game.drawPile, remoteGame.drawPile);
	const players = proxy(game.players, remoteGame.players);
	const activeCard = proxy(game.activeCard, remoteGame.activeCard);
	const activePlayerId = proxy(game.activePlayerId, remoteGame.activePlayerId);
	const phase = proxy(game.phase, remoteGame.phase);
	const placedSlot = proxy(game.placedSlot, remoteGame.placedSlot);
	const placedResult = proxy(game.placedResult, remoteGame.placedResult);
	const interceptor = proxy(game.interceptor, remoteGame.interceptor);
	const screenStore = proxy(game.screen, remoteGame.screen);
	const dragging = proxy(game.dragging, remoteGame.dragging);
	const myPlayerId = proxyConst(
		stryMutAct_9fa48('1747') ? '' : (stryCov_9fa48('1747'), 'p1'),
		remoteGame.myPlayerId
	);
	const isHost = proxyConst(
		stryMutAct_9fa48('1748') ? true : (stryCov_9fa48('1748'), false),
		remoteGame.isHost
	);
	const connected = proxyConst(
		stryMutAct_9fa48('1749') ? true : (stryCov_9fa48('1749'), false),
		remoteGame.connected
	);
	function setTheme(v: string) {
		if (stryMutAct_9fa48('1750')) {
			{
			}
		} else {
			stryCov_9fa48('1750');
			tweaks.set(stryMutAct_9fa48('1751') ? '' : (stryCov_9fa48('1751'), 'theme'), v as Theme);
		}
	}
	function setArtStyle(v: string) {
		if (stryMutAct_9fa48('1752')) {
			{
			}
		} else {
			stryCov_9fa48('1752');
			tweaks.set(
				stryMutAct_9fa48('1753') ? '' : (stryCov_9fa48('1753'), 'artStyle'),
				v as ArtStyle
			);
		}
	}
	function setFlipStyle(v: string) {
		if (stryMutAct_9fa48('1754')) {
			{
			}
		} else {
			stryCov_9fa48('1754');
			tweaks.set(
				stryMutAct_9fa48('1755') ? '' : (stryCov_9fa48('1755'), 'flipStyle'),
				v as FlipStyle
			);
		}
	}
	function setDensity(v: string) {
		if (stryMutAct_9fa48('1756')) {
			{
			}
		} else {
			stryCov_9fa48('1756');
			tweaks.set(stryMutAct_9fa48('1757') ? '' : (stryCov_9fa48('1757'), 'density'), v as Density);
		}
	}
	let activePlayer: Player | undefined = $derived(
		$players.find(
			stryMutAct_9fa48('1758')
				? () => undefined
				: (stryCov_9fa48('1758'),
					(p: Player) =>
						stryMutAct_9fa48('1761')
							? p.id !== $activePlayerId
							: stryMutAct_9fa48('1760')
								? false
								: stryMutAct_9fa48('1759')
									? true
									: (stryCov_9fa48('1759', '1760', '1761'), p.id === $activePlayerId))
		)
	);
	let me: Player | undefined = $derived(
		$players.find(
			stryMutAct_9fa48('1762')
				? () => undefined
				: (stryCov_9fa48('1762'),
					(p: Player) =>
						stryMutAct_9fa48('1765')
							? p.id !== $myPlayerId
							: stryMutAct_9fa48('1764')
								? false
								: stryMutAct_9fa48('1763')
									? true
									: (stryCov_9fa48('1763', '1764', '1765'), p.id === $myPlayerId))
		)
	);
	let myTimeline = $derived(
		stryMutAct_9fa48('1766')
			? me?.timeline && []
			: (stryCov_9fa48('1766'),
				(stryMutAct_9fa48('1767') ? me.timeline : (stryCov_9fa48('1767'), me?.timeline)) ??
					(stryMutAct_9fa48('1768') ? ['Stryker was here'] : (stryCov_9fa48('1768'), [])))
	);
	let myTokens = $derived(
		stryMutAct_9fa48('1769')
			? me?.tokens && 0
			: (stryCov_9fa48('1769'),
				(stryMutAct_9fa48('1770') ? me.tokens : (stryCov_9fa48('1770'), me?.tokens)) ?? 0)
	);
	let myLength = $derived(
		stryMutAct_9fa48('1771')
			? me?.timeline.length && 0
			: (stryCov_9fa48('1771'),
				(stryMutAct_9fa48('1772')
					? me.timeline.length
					: (stryCov_9fa48('1772'), me?.timeline.length)) ?? 0)
	);
	let myTurnAndPlacing = $derived(
		stryMutAct_9fa48('1775')
			? $phase === 'place' || $activePlayerId === $myPlayerId
			: stryMutAct_9fa48('1774')
				? false
				: stryMutAct_9fa48('1773')
					? true
					: (stryCov_9fa48('1773', '1774', '1775'),
						(stryMutAct_9fa48('1777')
							? $phase !== 'place'
							: stryMutAct_9fa48('1776')
								? true
								: (stryCov_9fa48('1776', '1777'),
									$phase === (stryMutAct_9fa48('1778') ? '' : (stryCov_9fa48('1778'), 'place')))) &&
							(stryMutAct_9fa48('1780')
								? $activePlayerId !== $myPlayerId
								: stryMutAct_9fa48('1779')
									? true
									: (stryCov_9fa48('1779', '1780'), $activePlayerId === $myPlayerId)))
	);
	onMount(() => {
		if (stryMutAct_9fa48('1781')) {
			{
			}
		} else {
			stryCov_9fa48('1781');
			if (
				stryMutAct_9fa48('1783')
					? false
					: stryMutAct_9fa48('1782')
						? true
						: (stryCov_9fa48('1782', '1783'), isDemo)
			) {
				if (stryMutAct_9fa48('1784')) {
					{
					}
				} else {
					stryCov_9fa48('1784');
					if (
						stryMutAct_9fa48('1787')
							? $screenStore !== 'lobby'
							: stryMutAct_9fa48('1786')
								? false
								: stryMutAct_9fa48('1785')
									? true
									: (stryCov_9fa48('1785', '1786', '1787'),
										$screenStore ===
											(stryMutAct_9fa48('1788') ? '' : (stryCov_9fa48('1788'), 'lobby')))
					)
						game.startGame();
					return;
				}
			}
			let cancelled = stryMutAct_9fa48('1789') ? true : (stryCov_9fa48('1789'), false);
			(async () => {
				if (stryMutAct_9fa48('1790')) {
					{
					}
				} else {
					stryCov_9fa48('1790');
					try {
						if (stryMutAct_9fa48('1791')) {
							{
							}
						} else {
							stryCov_9fa48('1791');
							const room = await getRoomByCode(code);
							if (
								stryMutAct_9fa48('1794')
									? cancelled && !room
									: stryMutAct_9fa48('1793')
										? false
										: stryMutAct_9fa48('1792')
											? true
											: (stryCov_9fa48('1792', '1793', '1794'),
												cancelled ||
													(stryMutAct_9fa48('1795') ? room : (stryCov_9fa48('1795'), !room)))
							)
								return;
							const playerInfo = await getCurrentPlayerInRoom(room.id);
							if (
								stryMutAct_9fa48('1798')
									? cancelled && !playerInfo
									: stryMutAct_9fa48('1797')
										? false
										: stryMutAct_9fa48('1796')
											? true
											: (stryCov_9fa48('1796', '1797', '1798'),
												cancelled ||
													(stryMutAct_9fa48('1799')
														? playerInfo
														: (stryCov_9fa48('1799'), !playerInfo)))
							)
								return;
							await remoteGame.connectRemoteGame(
								stryMutAct_9fa48('1800')
									? {}
									: (stryCov_9fa48('1800'),
										{
											roomCode: code,
											roomId: room.id,
											myPlayerId: playerInfo.playerId,
											isHost: stryMutAct_9fa48('1803')
												? room.host_id !== playerInfo.userId
												: stryMutAct_9fa48('1802')
													? false
													: stryMutAct_9fa48('1801')
														? true
														: (stryCov_9fa48('1801', '1802', '1803'),
															room.host_id === playerInfo.userId),
										})
							);
						}
					} catch {
						// Silently fail — will show empty state
					}
				}
			})();
			return () => {
				if (stryMutAct_9fa48('1804')) {
					{
					}
				} else {
					stryCov_9fa48('1804');
					cancelled = stryMutAct_9fa48('1805') ? false : (stryCov_9fa48('1805'), true);
					remoteGame.disconnectRemoteGame();
				}
			};
		}
	});
	$effect(() => {
		if (stryMutAct_9fa48('1806')) {
			{
			}
		} else {
			stryCov_9fa48('1806');
			$activePlayerId;
			untrack(() => {
				if (stryMutAct_9fa48('1807')) {
					{
					}
				} else {
					stryCov_9fa48('1807');
					if (
						stryMutAct_9fa48('1810')
							? $phase === 'draw' || $activePlayerId !== $myPlayerId
							: stryMutAct_9fa48('1809')
								? false
								: stryMutAct_9fa48('1808')
									? true
									: (stryCov_9fa48('1808', '1809', '1810'),
										(stryMutAct_9fa48('1812')
											? $phase !== 'draw'
											: stryMutAct_9fa48('1811')
												? true
												: (stryCov_9fa48('1811', '1812'),
													$phase ===
														(stryMutAct_9fa48('1813') ? '' : (stryCov_9fa48('1813'), 'draw')))) &&
											(stryMutAct_9fa48('1815')
												? $activePlayerId === $myPlayerId
												: stryMutAct_9fa48('1814')
													? true
													: (stryCov_9fa48('1814', '1815'), $activePlayerId !== $myPlayerId)))
					) {
						if (stryMutAct_9fa48('1816')) {
							{
							}
						} else {
							stryCov_9fa48('1816');
							if (
								stryMutAct_9fa48('1818')
									? false
									: stryMutAct_9fa48('1817')
										? true
										: (stryCov_9fa48('1817', '1818'), isDemo)
							)
								game.runAiTurn();
							else remoteGame.runAiTurn();
						}
					}
				}
			});
		}
	});
	let dragSlot = $state<number | null>(null);
	function getStore() {
		if (stryMutAct_9fa48('1819')) {
			{
			}
		} else {
			stryCov_9fa48('1819');
			return isDemo ? game : remoteGame;
		}
	}
	function onCardDragStart(e: DragEvent) {
		if (stryMutAct_9fa48('1820')) {
			{
			}
		} else {
			stryCov_9fa48('1820');
			if (
				stryMutAct_9fa48('1823')
					? false
					: stryMutAct_9fa48('1822')
						? true
						: stryMutAct_9fa48('1821')
							? myTurnAndPlacing
							: (stryCov_9fa48('1821', '1822', '1823'), !myTurnAndPlacing)
			) {
				if (stryMutAct_9fa48('1824')) {
					{
					}
				} else {
					stryCov_9fa48('1824');
					e.preventDefault();
					return;
				}
			}
			e.dataTransfer!.setData(
				stryMutAct_9fa48('1825') ? '' : (stryCov_9fa48('1825'), 'text/plain'),
				stryMutAct_9fa48('1826') ? '' : (stryCov_9fa48('1826'), 'active-card')
			);
			e.dataTransfer!.effectAllowed = stryMutAct_9fa48('1827')
				? ''
				: (stryCov_9fa48('1827'), 'move');
			getStore().dragging.set(stryMutAct_9fa48('1828') ? false : (stryCov_9fa48('1828'), true));
		}
	}
	function onCardDragEnd() {
		if (stryMutAct_9fa48('1829')) {
			{
			}
		} else {
			stryCov_9fa48('1829');
			getStore().dragging.set(stryMutAct_9fa48('1830') ? true : (stryCov_9fa48('1830'), false));
			dragSlot = null;
		}
	}
	function onSlotDragOver(e: DragEvent, i: number) {
		if (stryMutAct_9fa48('1831')) {
			{
			}
		} else {
			stryCov_9fa48('1831');
			e.preventDefault();
			e.dataTransfer!.dropEffect = stryMutAct_9fa48('1832') ? '' : (stryCov_9fa48('1832'), 'move');
			dragSlot = i;
		}
	}
	function onSlotDragLeave(_e: DragEvent, i: number) {
		if (stryMutAct_9fa48('1833')) {
			{
			}
		} else {
			stryCov_9fa48('1833');
			if (
				stryMutAct_9fa48('1836')
					? dragSlot !== i
					: stryMutAct_9fa48('1835')
						? false
						: stryMutAct_9fa48('1834')
							? true
							: (stryCov_9fa48('1834', '1835', '1836'), dragSlot === i)
			)
				dragSlot = null;
		}
	}
	function onSlotDrop(e: DragEvent, i: number) {
		if (stryMutAct_9fa48('1837')) {
			{
			}
		} else {
			stryCov_9fa48('1837');
			e.preventDefault();
			dragSlot = null;
			getStore().dragging.set(stryMutAct_9fa48('1838') ? true : (stryCov_9fa48('1838'), false));
			getStore().onPlace(i);
		}
	}
	function onPlay() {
		if (stryMutAct_9fa48('1839')) {
			{
			}
		} else {
			stryCov_9fa48('1839');
			getStore().onPlay();
		}
	}
	function onNextTurn() {
		if (stryMutAct_9fa48('1840')) {
			{
			}
		} else {
			stryCov_9fa48('1840');
			getStore().onNextTurn();
		}
	}
	function onChallenge() {
		if (stryMutAct_9fa48('1841')) {
			{
			}
		} else {
			stryCov_9fa48('1841');
			getStore().onChallenge();
		}
	}
</script>

<div class="page">
	<Chrome theme={t.theme} title="Game · {code} · Songster">
		{#snippet right()}
			<div class="turn-label">
				<span style="opacity: 0.6">TURN</span>
				<span
					>{stryMutAct_9fa48('1842')
						? activePlayer.name
						: (stryCov_9fa48('1842'), activePlayer?.name)}</span
				>
			</div>
		{/snippet}

		{#snippet children()}
			<div class="player-rail">
				{#each $players as player}
					<PlayerChip
						{player}
						active={stryMutAct_9fa48('1845')
							? player.id !== $activePlayerId
							: stryMutAct_9fa48('1844')
								? false
								: stryMutAct_9fa48('1843')
									? true
									: (stryCov_9fa48('1843', '1844', '1845'), player.id === $activePlayerId)}
						theme={t.theme}
					/>
				{/each}
			</div>

			<div class="vinyl-section">
				<Vinyl
					size={190}
					spinning={stryMutAct_9fa48('1848')
						? $phase === 'listen' && $phase === 'place'
						: stryMutAct_9fa48('1847')
							? false
							: stryMutAct_9fa48('1846')
								? true
								: (stryCov_9fa48('1846', '1847', '1848'),
									(stryMutAct_9fa48('1850')
										? $phase !== 'listen'
										: stryMutAct_9fa48('1849')
											? false
											: (stryCov_9fa48('1849', '1850'),
												$phase ===
													(stryMutAct_9fa48('1851') ? '' : (stryCov_9fa48('1851'), 'listen')))) ||
										(stryMutAct_9fa48('1853')
											? $phase !== 'place'
											: stryMutAct_9fa48('1852')
												? false
												: (stryCov_9fa48('1852', '1853'),
													$phase ===
														(stryMutAct_9fa48('1854') ? '' : (stryCov_9fa48('1854'), 'place')))))}
					label={(
						stryMutAct_9fa48('1857')
							? $phase === 'listen' && $phase === 'place'
							: stryMutAct_9fa48('1856')
								? false
								: stryMutAct_9fa48('1855')
									? true
									: (stryCov_9fa48('1855', '1856', '1857'),
										(stryMutAct_9fa48('1859')
											? $phase !== 'listen'
											: stryMutAct_9fa48('1858')
												? false
												: (stryCov_9fa48('1858', '1859'),
													$phase ===
														(stryMutAct_9fa48('1860') ? '' : (stryCov_9fa48('1860'), 'listen')))) ||
											(stryMutAct_9fa48('1862')
												? $phase !== 'place'
												: stryMutAct_9fa48('1861')
													? false
													: (stryCov_9fa48('1861', '1862'),
														$phase ===
															(stryMutAct_9fa48('1863') ? '' : (stryCov_9fa48('1863'), 'place')))))
					)
						? stryMutAct_9fa48('1864')
							? ''
							: (stryCov_9fa48('1864'), 'NOW SPINNING')
						: (
									stryMutAct_9fa48('1867')
										? $phase !== 'reveal'
										: stryMutAct_9fa48('1866')
											? false
											: stryMutAct_9fa48('1865')
												? true
												: (stryCov_9fa48('1865', '1866', '1867'),
													$phase ===
														(stryMutAct_9fa48('1868') ? '' : (stryCov_9fa48('1868'), 'reveal')))
							  )
							? $placedResult
								? stryMutAct_9fa48('1869')
									? ''
									: (stryCov_9fa48('1869'), 'CORRECT')
								: stryMutAct_9fa48('1870')
									? ''
									: (stryCov_9fa48('1870'), 'DISCARD')
							: stryMutAct_9fa48('1871')
								? ''
								: (stryCov_9fa48('1871'), 'STANDBY')}
					subLabel={(
						stryMutAct_9fa48('1874')
							? $phase === 'reveal' || $activeCard
							: stryMutAct_9fa48('1873')
								? false
								: stryMutAct_9fa48('1872')
									? true
									: (stryCov_9fa48('1872', '1873', '1874'),
										(stryMutAct_9fa48('1876')
											? $phase !== 'reveal'
											: stryMutAct_9fa48('1875')
												? true
												: (stryCov_9fa48('1875', '1876'),
													$phase ===
														(stryMutAct_9fa48('1877') ? '' : (stryCov_9fa48('1877'), 'reveal')))) &&
											$activeCard)
					)
						? stryMutAct_9fa48('1878')
							? ``
							: (stryCov_9fa48('1878'), `${$activeCard.year} · ${$activeCard.artist}`)
						: stryMutAct_9fa48('1879')
							? ''
							: (stryCov_9fa48('1879'), '33⅓ RPM')}
					intensity={t.animIntensity}
				/>

				<Waveform
					bars={42}
					height={32}
					playing={stryMutAct_9fa48('1882')
						? $phase === 'listen' && $phase === 'place'
						: stryMutAct_9fa48('1881')
							? false
							: stryMutAct_9fa48('1880')
								? true
								: (stryCov_9fa48('1880', '1881', '1882'),
									(stryMutAct_9fa48('1884')
										? $phase !== 'listen'
										: stryMutAct_9fa48('1883')
											? false
											: (stryCov_9fa48('1883', '1884'),
												$phase ===
													(stryMutAct_9fa48('1885') ? '' : (stryCov_9fa48('1885'), 'listen')))) ||
										(stryMutAct_9fa48('1887')
											? $phase !== 'place'
											: stryMutAct_9fa48('1886')
												? false
												: (stryCov_9fa48('1886', '1887'),
													$phase ===
														(stryMutAct_9fa48('1888') ? '' : (stryCov_9fa48('1888'), 'place')))))}
					intensity={t.animIntensity}
				/>

				<div class="phase-label">
					{#if stryMutAct_9fa48('1891') ? $phase !== 'draw' : stryMutAct_9fa48('1890') ? false : stryMutAct_9fa48('1889') ? true : (stryCov_9fa48('1889', '1890', '1891'), $phase === (stryMutAct_9fa48('1892') ? '' : (stryCov_9fa48('1892'), 'draw')))}
						{stryMutAct_9fa48('1893')
							? activePlayer.name
							: (stryCov_9fa48('1893'), activePlayer?.name)}'s draw — tap the record
					{:else if stryMutAct_9fa48('1896') ? $phase !== 'listen' : stryMutAct_9fa48('1895') ? false : stryMutAct_9fa48('1894') ? true : (stryCov_9fa48('1894', '1895', '1896'), $phase === (stryMutAct_9fa48('1897') ? '' : (stryCov_9fa48('1897'), 'listen')))}
						Listening · 0:30 preview
					{:else if stryMutAct_9fa48('1900') ? $phase !== 'place' : stryMutAct_9fa48('1899') ? false : stryMutAct_9fa48('1898') ? true : (stryCov_9fa48('1898', '1899', '1900'), $phase === (stryMutAct_9fa48('1901') ? '' : (stryCov_9fa48('1901'), 'place')))}
						{(
							stryMutAct_9fa48('1904')
								? $activePlayerId !== $myPlayerId
								: stryMutAct_9fa48('1903')
									? false
									: stryMutAct_9fa48('1902')
										? true
										: (stryCov_9fa48('1902', '1903', '1904'), $activePlayerId === $myPlayerId)
						)
							? stryMutAct_9fa48('1905')
								? ''
								: (stryCov_9fa48('1905'), 'Drag the card onto your timeline')
							: stryMutAct_9fa48('1906')
								? ``
								: (stryCov_9fa48('1906'),
									`${stryMutAct_9fa48('1907') ? activePlayer.name : (stryCov_9fa48('1907'), activePlayer?.name)} is placing…`)}
					{:else if stryMutAct_9fa48('1910') ? $phase !== 'reveal' : stryMutAct_9fa48('1909') ? false : stryMutAct_9fa48('1908') ? true : (stryCov_9fa48('1908', '1909', '1910'), $phase === (stryMutAct_9fa48('1911') ? '' : (stryCov_9fa48('1911'), 'reveal')))}
						{$placedResult
							? stryMutAct_9fa48('1912')
								? ''
								: (stryCov_9fa48('1912'), 'Correct placement')
							: stryMutAct_9fa48('1913')
								? ''
								: (stryCov_9fa48('1913'), 'Wrong — card discarded')}
					{:else if stryMutAct_9fa48('1916') ? $phase !== 'challenge' : stryMutAct_9fa48('1915') ? false : stryMutAct_9fa48('1914') ? true : (stryCov_9fa48('1914', '1915', '1916'), $phase === (stryMutAct_9fa48('1917') ? '' : (stryCov_9fa48('1917'), 'challenge')))}
						{stryMutAct_9fa48('1918')
							? $players.find((p) => p.id === $interceptor).name
							: (stryCov_9fa48('1918'),
								$players.find(
									stryMutAct_9fa48('1919')
										? () => undefined
										: (stryCov_9fa48('1919'),
											(p) =>
												stryMutAct_9fa48('1922')
													? p.id !== $interceptor
													: stryMutAct_9fa48('1921')
														? false
														: stryMutAct_9fa48('1920')
															? true
															: (stryCov_9fa48('1920', '1921', '1922'), p.id === $interceptor))
								)?.name)} challenged!
					{/if}
				</div>
			</div>

			<div class="card-area">
				{#if stryMutAct_9fa48('1925') ? $activeCard || $phase === 'draw' || $phase === 'listen' || $phase === 'place' || $phase === 'challenge' : stryMutAct_9fa48('1924') ? false : stryMutAct_9fa48('1923') ? true : (stryCov_9fa48('1923', '1924', '1925'), $activeCard && (stryMutAct_9fa48('1927') ? ($phase === 'draw' || $phase === 'listen' || $phase === 'place') && $phase === 'challenge' : stryMutAct_9fa48('1926') ? true : (stryCov_9fa48('1926', '1927'), (stryMutAct_9fa48('1929') ? ($phase === 'draw' || $phase === 'listen') && $phase === 'place' : stryMutAct_9fa48('1928') ? false : (stryCov_9fa48('1928', '1929'), (stryMutAct_9fa48('1931') ? $phase === 'draw' && $phase === 'listen' : stryMutAct_9fa48('1930') ? false : (stryCov_9fa48('1930', '1931'), (stryMutAct_9fa48('1933') ? $phase !== 'draw' : stryMutAct_9fa48('1932') ? false : (stryCov_9fa48('1932', '1933'), $phase === (stryMutAct_9fa48('1934') ? '' : (stryCov_9fa48('1934'), 'draw')))) || (stryMutAct_9fa48('1936') ? $phase !== 'listen' : stryMutAct_9fa48('1935') ? false : (stryCov_9fa48('1935', '1936'), $phase === (stryMutAct_9fa48('1937') ? '' : (stryCov_9fa48('1937'), 'listen')))))) || (stryMutAct_9fa48('1939') ? $phase !== 'place' : stryMutAct_9fa48('1938') ? false : (stryCov_9fa48('1938', '1939'), $phase === (stryMutAct_9fa48('1940') ? '' : (stryCov_9fa48('1940'), 'place')))))) || (stryMutAct_9fa48('1942') ? $phase !== 'challenge' : stryMutAct_9fa48('1941') ? false : (stryCov_9fa48('1941', '1942'), $phase === (stryMutAct_9fa48('1943') ? '' : (stryCov_9fa48('1943'), 'challenge')))))))}
					<div
						class="card-wrapper"
						role="group"
						aria-label="Active card"
						draggable={myTurnAndPlacing
							? stryMutAct_9fa48('1944')
								? ''
								: (stryCov_9fa48('1944'), 'true')
							: undefined}
						ondragstart={onCardDragStart}
						ondragend={onCardDragEnd}
						style="cursor: {myTurnAndPlacing
							? stryMutAct_9fa48('1945')
								? ''
								: (stryCov_9fa48('1945'), 'grab')
							: (
										stryMutAct_9fa48('1948')
											? $phase === 'draw' || $activePlayerId === $myPlayerId
											: stryMutAct_9fa48('1947')
												? false
												: stryMutAct_9fa48('1946')
													? true
													: (stryCov_9fa48('1946', '1947', '1948'),
														(stryMutAct_9fa48('1950')
															? $phase !== 'draw'
															: stryMutAct_9fa48('1949')
																? true
																: (stryCov_9fa48('1949', '1950'),
																	$phase ===
																		(stryMutAct_9fa48('1951')
																			? ''
																			: (stryCov_9fa48('1951'), 'draw')))) &&
															(stryMutAct_9fa48('1953')
																? $activePlayerId !== $myPlayerId
																: stryMutAct_9fa48('1952')
																	? true
																	: (stryCov_9fa48('1952', '1953'),
																		$activePlayerId === $myPlayerId)))
								  )
								? stryMutAct_9fa48('1954')
									? ''
									: (stryCov_9fa48('1954'), 'pointer')
								: stryMutAct_9fa48('1955')
									? ''
									: (stryCov_9fa48('1955'), 'default')}; opacity: {$dragging ? 0.3 : 1}"
					>
						<button
							onclick={(
								stryMutAct_9fa48('1958')
									? $phase === 'draw' || $activePlayerId === $myPlayerId
									: stryMutAct_9fa48('1957')
										? false
										: stryMutAct_9fa48('1956')
											? true
											: (stryCov_9fa48('1956', '1957', '1958'),
												(stryMutAct_9fa48('1960')
													? $phase !== 'draw'
													: stryMutAct_9fa48('1959')
														? true
														: (stryCov_9fa48('1959', '1960'),
															$phase ===
																(stryMutAct_9fa48('1961')
																	? ''
																	: (stryCov_9fa48('1961'), 'draw')))) &&
													(stryMutAct_9fa48('1963')
														? $activePlayerId !== $myPlayerId
														: stryMutAct_9fa48('1962')
															? true
															: (stryCov_9fa48('1962', '1963'), $activePlayerId === $myPlayerId)))
							)
								? onPlay
								: undefined}
							style="background: none; border: none; padding: 0; pointer-events: {myTurnAndPlacing
								? stryMutAct_9fa48('1964')
									? ''
									: (stryCov_9fa48('1964'), 'none')
								: stryMutAct_9fa48('1965')
									? ''
									: (stryCov_9fa48('1965'), 'auto')}"
						>
							<HitCard
								song={$activeCard}
								faceDown={stryMutAct_9fa48('1966') ? false : (stryCov_9fa48('1966'), true)}
								size="md"
								artStyle={t.artStyle}
								flipStyle={t.flipStyle}
								theme={t.theme}
							/>
						</button>
					</div>
				{:else if stryMutAct_9fa48('1969') ? $phase === 'reveal' || $activeCard : stryMutAct_9fa48('1968') ? false : stryMutAct_9fa48('1967') ? true : (stryCov_9fa48('1967', '1968', '1969'), (stryMutAct_9fa48('1971') ? $phase !== 'reveal' : stryMutAct_9fa48('1970') ? true : (stryCov_9fa48('1970', '1971'), $phase === (stryMutAct_9fa48('1972') ? '' : (stryCov_9fa48('1972'), 'reveal')))) && $activeCard)}
					<HitCard
						song={$activeCard}
						faceDown={stryMutAct_9fa48('1973') ? true : (stryCov_9fa48('1973'), false)}
						size="md"
						artStyle={t.artStyle}
						flipStyle={t.flipStyle}
						theme={t.theme}
						correct={stryMutAct_9fa48('1974')
							? $placedResult && undefined
							: (stryCov_9fa48('1974'), $placedResult ?? undefined)}
					/>
				{/if}
			</div>

			{#if stryMutAct_9fa48('1977') ? (t.interceptionEnabled && ($phase === 'place' || $phase === 'challenge')) || $activePlayerId !== $myPlayerId : stryMutAct_9fa48('1976') ? false : stryMutAct_9fa48('1975') ? true : (stryCov_9fa48('1975', '1976', '1977'), (stryMutAct_9fa48('1979') ? t.interceptionEnabled || $phase === 'place' || $phase === 'challenge' : stryMutAct_9fa48('1978') ? true : (stryCov_9fa48('1978', '1979'), t.interceptionEnabled && (stryMutAct_9fa48('1981') ? $phase === 'place' && $phase === 'challenge' : stryMutAct_9fa48('1980') ? true : (stryCov_9fa48('1980', '1981'), (stryMutAct_9fa48('1983') ? $phase !== 'place' : stryMutAct_9fa48('1982') ? false : (stryCov_9fa48('1982', '1983'), $phase === (stryMutAct_9fa48('1984') ? '' : (stryCov_9fa48('1984'), 'place')))) || (stryMutAct_9fa48('1986') ? $phase !== 'challenge' : stryMutAct_9fa48('1985') ? false : (stryCov_9fa48('1985', '1986'), $phase === (stryMutAct_9fa48('1987') ? '' : (stryCov_9fa48('1987'), 'challenge')))))))) && (stryMutAct_9fa48('1989') ? $activePlayerId === $myPlayerId : stryMutAct_9fa48('1988') ? true : (stryCov_9fa48('1988', '1989'), $activePlayerId !== $myPlayerId)))}
				<div class="challenge-bar">
					<div>
						<div class="challenge-label">Challenge</div>
						<div class="challenge-text">Think they're wrong? Spend a token.</div>
					</div>
					<button
						class="intercept-btn"
						onclick={onChallenge}
						disabled={stryMutAct_9fa48('1993')
							? myTokens > 0
							: stryMutAct_9fa48('1992')
								? myTokens < 0
								: stryMutAct_9fa48('1991')
									? false
									: stryMutAct_9fa48('1990')
										? true
										: (stryCov_9fa48('1990', '1991', '1992', '1993'), myTokens <= 0)}
						style="opacity: {(
							stryMutAct_9fa48('1997')
								? myTokens <= 0
								: stryMutAct_9fa48('1996')
									? myTokens >= 0
									: stryMutAct_9fa48('1995')
										? false
										: stryMutAct_9fa48('1994')
											? true
											: (stryCov_9fa48('1994', '1995', '1996', '1997'), myTokens > 0)
						)
							? 1
							: 0.35}; cursor: {(
							stryMutAct_9fa48('2001')
								? myTokens <= 0
								: stryMutAct_9fa48('2000')
									? myTokens >= 0
									: stryMutAct_9fa48('1999')
										? false
										: stryMutAct_9fa48('1998')
											? true
											: (stryCov_9fa48('1998', '1999', '2000', '2001'), myTokens > 0)
						)
							? stryMutAct_9fa48('2002')
								? ''
								: (stryCov_9fa48('2002'), 'pointer')
							: stryMutAct_9fa48('2003')
								? ''
								: (stryCov_9fa48('2003'), 'default')}"
					>
						◈ {myTokens} · Intercept
					</button>
				</div>
			{/if}

			<div class="timeline-section">
				<div class="timeline-header">
					<div class="timeline-label">Your Timeline</div>
					<div class="timeline-count">
						{myLength}<span style="opacity: 0.4">/10</span>
					</div>
				</div>

				<Timeline
					cards={myTimeline}
					density={t.density}
					artStyle={t.artStyle}
					theme={t.theme}
					frozen={stryMutAct_9fa48('2004')
						? myTurnAndPlacing
						: (stryCov_9fa48('2004'), !myTurnAndPlacing)}
					draggingActive={myTurnAndPlacing}
					hoverSlot={dragSlot}
					highlightSlot={(
						stryMutAct_9fa48('2007')
							? ($phase === 'reveal' && $placedResult) || $activePlayerId === $myPlayerId
							: stryMutAct_9fa48('2006')
								? false
								: stryMutAct_9fa48('2005')
									? true
									: (stryCov_9fa48('2005', '2006', '2007'),
										(stryMutAct_9fa48('2009')
											? $phase === 'reveal' || $placedResult
											: stryMutAct_9fa48('2008')
												? true
												: (stryCov_9fa48('2008', '2009'),
													(stryMutAct_9fa48('2011')
														? $phase !== 'reveal'
														: stryMutAct_9fa48('2010')
															? true
															: (stryCov_9fa48('2010', '2011'),
																$phase ===
																	(stryMutAct_9fa48('2012')
																		? ''
																		: (stryCov_9fa48('2012'), 'reveal')))) && $placedResult)) &&
											(stryMutAct_9fa48('2014')
												? $activePlayerId !== $myPlayerId
												: stryMutAct_9fa48('2013')
													? true
													: (stryCov_9fa48('2013', '2014'), $activePlayerId === $myPlayerId)))
					)
						? $placedSlot
						: null}
					wrongSlot={(
						stryMutAct_9fa48('2017')
							? ($phase === 'reveal' && !$placedResult) || $activePlayerId === $myPlayerId
							: stryMutAct_9fa48('2016')
								? false
								: stryMutAct_9fa48('2015')
									? true
									: (stryCov_9fa48('2015', '2016', '2017'),
										(stryMutAct_9fa48('2019')
											? $phase === 'reveal' || !$placedResult
											: stryMutAct_9fa48('2018')
												? true
												: (stryCov_9fa48('2018', '2019'),
													(stryMutAct_9fa48('2021')
														? $phase !== 'reveal'
														: stryMutAct_9fa48('2020')
															? true
															: (stryCov_9fa48('2020', '2021'),
																$phase ===
																	(stryMutAct_9fa48('2022')
																		? ''
																		: (stryCov_9fa48('2022'), 'reveal')))) &&
														(stryMutAct_9fa48('2023')
															? $placedResult
															: (stryCov_9fa48('2023'), !$placedResult)))) &&
											(stryMutAct_9fa48('2025')
												? $activePlayerId !== $myPlayerId
												: stryMutAct_9fa48('2024')
													? true
													: (stryCov_9fa48('2024', '2025'), $activePlayerId === $myPlayerId)))
					)
						? $placedSlot
						: null}
					onSlotClick={myTurnAndPlacing
						? stryMutAct_9fa48('2026')
							? () => undefined
							: (stryCov_9fa48('2026'), (i) => getStore().onPlace(i))
						: undefined}
					onSlotDragOver={myTurnAndPlacing
						? stryMutAct_9fa48('2027')
							? () => undefined
							: (stryCov_9fa48('2027'), (_e, i) => onSlotDragOver(_e, i))
						: undefined}
					onSlotDragLeave={myTurnAndPlacing
						? stryMutAct_9fa48('2028')
							? () => undefined
							: (stryCov_9fa48('2028'), (_e, i) => onSlotDragLeave(_e, i))
						: undefined}
					onSlotDrop={myTurnAndPlacing
						? stryMutAct_9fa48('2029')
							? () => undefined
							: (stryCov_9fa48('2029'), (_e, i) => onSlotDrop(_e, i))
						: undefined}
				/>

				{#if stryMutAct_9fa48('2032') ? $phase !== 'reveal' : stryMutAct_9fa48('2031') ? false : stryMutAct_9fa48('2030') ? true : (stryCov_9fa48('2030', '2031', '2032'), $phase === (stryMutAct_9fa48('2033') ? '' : (stryCov_9fa48('2033'), 'reveal')))}
					<div class="next-btn-wrap">
						<button
							class="next-btn"
							style="background: {primary}; color: {paper}"
							onclick={onNextTurn}
						>
							Side B · Next Turn →
						</button>
					</div>
				{:else}
					<div style="height: 16px"></div>
				{/if}
			</div>
		{/snippet}
	</Chrome>

	<TweaksPanel title="Tweaks · Songster">
		<TweakSection label="Theme" />
		<TweakRadio
			label="Mode"
			value={t.theme}
			options={stryMutAct_9fa48('2034')
				? []
				: (stryCov_9fa48('2034'),
					[
						stryMutAct_9fa48('2035')
							? {}
							: (stryCov_9fa48('2035'),
								{
									value: stryMutAct_9fa48('2036') ? '' : (stryCov_9fa48('2036'), 'light'),
									label: stryMutAct_9fa48('2037') ? '' : (stryCov_9fa48('2037'), 'Paper'),
								}),
						stryMutAct_9fa48('2038')
							? {}
							: (stryCov_9fa48('2038'),
								{
									value: stryMutAct_9fa48('2039') ? '' : (stryCov_9fa48('2039'), 'dark'),
									label: stryMutAct_9fa48('2040') ? '' : (stryCov_9fa48('2040'), 'After-hours'),
								}),
					])}
			onchange={setTheme}
		/>
		<TweakRadio
			label="Card Art"
			value={t.artStyle}
			options={stryMutAct_9fa48('2041')
				? []
				: (stryCov_9fa48('2041'),
					[
						stryMutAct_9fa48('2042')
							? {}
							: (stryCov_9fa48('2042'),
								{
									value: stryMutAct_9fa48('2043') ? '' : (stryCov_9fa48('2043'), 'grooves'),
									label: stryMutAct_9fa48('2044') ? '' : (stryCov_9fa48('2044'), 'Grooves'),
								}),
						stryMutAct_9fa48('2045')
							? {}
							: (stryCov_9fa48('2045'),
								{
									value: stryMutAct_9fa48('2046') ? '' : (stryCov_9fa48('2046'), 'halftone'),
									label: stryMutAct_9fa48('2047') ? '' : (stryCov_9fa48('2047'), 'Halftone'),
								}),
						stryMutAct_9fa48('2048')
							? {}
							: (stryCov_9fa48('2048'),
								{
									value: stryMutAct_9fa48('2049') ? '' : (stryCov_9fa48('2049'), 'solid'),
									label: stryMutAct_9fa48('2050') ? '' : (stryCov_9fa48('2050'), 'Solid'),
								}),
						stryMutAct_9fa48('2051')
							? {}
							: (stryCov_9fa48('2051'),
								{
									value: stryMutAct_9fa48('2052') ? '' : (stryCov_9fa48('2052'), 'inverse'),
									label: stryMutAct_9fa48('2053') ? '' : (stryCov_9fa48('2053'), 'Inverse'),
								}),
					])}
			onchange={setArtStyle}
		/>

		<TweakSection label="Motion" />
		<TweakRadio
			label="Flip"
			value={t.flipStyle}
			options={stryMutAct_9fa48('2054')
				? []
				: (stryCov_9fa48('2054'),
					[
						stryMutAct_9fa48('2055')
							? {}
							: (stryCov_9fa48('2055'),
								{
									value: stryMutAct_9fa48('2056') ? '' : (stryCov_9fa48('2056'), 'flip'),
									label: stryMutAct_9fa48('2057') ? '' : (stryCov_9fa48('2057'), '3D'),
								}),
						stryMutAct_9fa48('2058')
							? {}
							: (stryCov_9fa48('2058'),
								{
									value: stryMutAct_9fa48('2059') ? '' : (stryCov_9fa48('2059'), 'slide'),
									label: stryMutAct_9fa48('2060') ? '' : (stryCov_9fa48('2060'), 'Slide'),
								}),
						stryMutAct_9fa48('2061')
							? {}
							: (stryCov_9fa48('2061'),
								{
									value: stryMutAct_9fa48('2062') ? '' : (stryCov_9fa48('2062'), 'fade'),
									label: stryMutAct_9fa48('2063') ? '' : (stryCov_9fa48('2063'), 'Fade'),
								}),
						stryMutAct_9fa48('2064')
							? {}
							: (stryCov_9fa48('2064'),
								{
									value: stryMutAct_9fa48('2065') ? '' : (stryCov_9fa48('2065'), 'instant'),
									label: stryMutAct_9fa48('2066') ? '' : (stryCov_9fa48('2066'), 'Cut'),
								}),
					])}
			onchange={setFlipStyle}
		/>
		<TweakSlider
			label="Anim intensity"
			value={t.animIntensity}
			min={0.3}
			max={2.5}
			step={0.1}
			onchange={stryMutAct_9fa48('2067')
				? () => undefined
				: (stryCov_9fa48('2067'),
					(v) =>
						tweaks.set(
							stryMutAct_9fa48('2068') ? '' : (stryCov_9fa48('2068'), 'animIntensity'),
							v
						))}
		/>

		<TweakSection label="Timeline" />
		<TweakRadio
			label="Density"
			value={t.density}
			options={stryMutAct_9fa48('2069')
				? []
				: (stryCov_9fa48('2069'),
					[
						stryMutAct_9fa48('2070')
							? {}
							: (stryCov_9fa48('2070'),
								{
									value: stryMutAct_9fa48('2071') ? '' : (stryCov_9fa48('2071'), 'compact'),
									label: stryMutAct_9fa48('2072') ? '' : (stryCov_9fa48('2072'), 'Tight'),
								}),
						stryMutAct_9fa48('2073')
							? {}
							: (stryCov_9fa48('2073'),
								{
									value: stryMutAct_9fa48('2074') ? '' : (stryCov_9fa48('2074'), 'regular'),
									label: stryMutAct_9fa48('2075') ? '' : (stryCov_9fa48('2075'), 'Reg'),
								}),
						stryMutAct_9fa48('2076')
							? {}
							: (stryCov_9fa48('2076'),
								{
									value: stryMutAct_9fa48('2077') ? '' : (stryCov_9fa48('2077'), 'comfy'),
									label: stryMutAct_9fa48('2078') ? '' : (stryCov_9fa48('2078'), 'Airy'),
								}),
					])}
			onchange={setDensity}
		/>

		<TweakSection label="Rules" />
		<TweakToggle
			label="Interception tokens"
			value={t.interceptionEnabled}
			onchange={stryMutAct_9fa48('2079')
				? () => undefined
				: (stryCov_9fa48('2079'),
					(v) =>
						tweaks.set(
							stryMutAct_9fa48('2080') ? '' : (stryCov_9fa48('2080'), 'interceptionEnabled'),
							v
						))}
		/>
	</TweaksPanel>
</div>

<style>
	.page {
		min-height: 100vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}
	.turn-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		letter-spacing: 2px;
		display: flex;
		gap: 8px;
	}
	.player-rail {
		display: flex;
		gap: 10px;
		padding: 10px 16px 12px;
		border-bottom: 0.5px solid var(--primary, #0a0a0a);
	}
	.vinyl-section {
		padding: 20px 16px 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.phase-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		letter-spacing: 3px;
		opacity: 0.7;
		text-transform: uppercase;
		text-align: center;
	}
	.card-area {
		display: flex;
		justify-content: center;
		padding: 0 0 6px;
		min-height: 148px;
	}
	.card-wrapper {
		display: inline-block;
	}
	.challenge-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 16px;
		background: rgba(128, 128, 128, 0.06);
		margin: 0 16px;
		border-radius: 6px;
	}
	.challenge-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 1px;
	}
	.challenge-text {
		font-size: 10px;
		opacity: 0.5;
	}
	.intercept-btn {
		background: none;
		border: 1.5px solid currentColor;
		padding: 6px 12px;
		border-radius: 4px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		letter-spacing: 1px;
		cursor: pointer;
	}
	.timeline-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
	.timeline-header {
		padding: 0 18px 2px;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.timeline-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 9px;
		letter-spacing: 3px;
		opacity: 0.65;
		text-transform: uppercase;
	}
	.timeline-count {
		font-family: 'Playfair Display', serif;
		font-style: italic;
		font-size: 18px;
		font-weight: 700;
	}
	.next-btn-wrap {
		padding: 4px 16px 16px;
	}
	.next-btn {
		width: 100%;
		padding: 14px;
		border: none;
		border-radius: 4px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 4px;
		text-transform: uppercase;
		font-weight: 600;
		cursor: pointer;
	}
</style>
