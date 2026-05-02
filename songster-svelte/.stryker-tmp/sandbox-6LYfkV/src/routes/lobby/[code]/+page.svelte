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
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Chrome from '$lib/components/Chrome.svelte';
	import PlayerChip from '$lib/components/PlayerChip.svelte';
	import { remoteGame } from '$lib/stores/game-remote';
	import { game } from '$lib/stores/game';
	import {
		getRoomByCode,
		getRoomPlayers,
		getCurrentPlayerInRoom,
		subscribeToRoom,
	} from '$lib/room';
	import type { Player } from '$lib/types';
	let code: string = $derived(
		stryMutAct_9fa48('2089')
			? page.params.code && ''
			: (stryCov_9fa48('2089'),
				page.params.code ??
					(stryMutAct_9fa48('2090') ? 'Stryker was here!' : (stryCov_9fa48('2090'), '')))
	);
	let isDemo = $derived(
		stryMutAct_9fa48('2093')
			? code !== 'DEMO'
			: stryMutAct_9fa48('2092')
				? false
				: stryMutAct_9fa48('2091')
					? true
					: (stryCov_9fa48('2091', '2092', '2093'),
						code === (stryMutAct_9fa48('2094') ? '' : (stryCov_9fa48('2094'), 'DEMO')))
	);
	let starting = $state(stryMutAct_9fa48('2095') ? true : (stryCov_9fa48('2095'), false));
	let roomId = $state(stryMutAct_9fa48('2096') ? 'Stryker was here!' : (stryCov_9fa48('2096'), ''));
	let error = $state(stryMutAct_9fa48('2097') ? 'Stryker was here!' : (stryCov_9fa48('2097'), ''));
	let { connected, players: remotePlayers, isHost, myPlayerId } = remoteGame;
	let { players: localPlayers } = game;
	onMount(() => {
		if (stryMutAct_9fa48('2098')) {
			{
			}
		} else {
			stryCov_9fa48('2098');
			if (
				stryMutAct_9fa48('2100')
					? false
					: stryMutAct_9fa48('2099')
						? true
						: (stryCov_9fa48('2099', '2100'), isDemo)
			)
				return;
			let cancelled = stryMutAct_9fa48('2101') ? true : (stryCov_9fa48('2101'), false);
			let statusChannel: ReturnType<typeof subscribeToRoom> | null = null;
			(async () => {
				if (stryMutAct_9fa48('2102')) {
					{
					}
				} else {
					stryCov_9fa48('2102');
					try {
						if (stryMutAct_9fa48('2103')) {
							{
							}
						} else {
							stryCov_9fa48('2103');
							const room = await getRoomByCode(code);
							if (
								stryMutAct_9fa48('2105')
									? false
									: stryMutAct_9fa48('2104')
										? true
										: (stryCov_9fa48('2104', '2105'), cancelled)
							)
								return;
							if (
								stryMutAct_9fa48('2108')
									? false
									: stryMutAct_9fa48('2107')
										? true
										: stryMutAct_9fa48('2106')
											? room
											: (stryCov_9fa48('2106', '2107', '2108'), !room)
							) {
								if (stryMutAct_9fa48('2109')) {
									{
									}
								} else {
									stryCov_9fa48('2109');
									error = stryMutAct_9fa48('2110') ? '' : (stryCov_9fa48('2110'), 'Room not found');
									return;
								}
							}
							if (
								stryMutAct_9fa48('2113')
									? room.status === 'waiting'
									: stryMutAct_9fa48('2112')
										? false
										: stryMutAct_9fa48('2111')
											? true
											: (stryCov_9fa48('2111', '2112', '2113'),
												room.status !==
													(stryMutAct_9fa48('2114') ? '' : (stryCov_9fa48('2114'), 'waiting')))
							) {
								if (stryMutAct_9fa48('2115')) {
									{
									}
								} else {
									stryCov_9fa48('2115');
									goto(stryMutAct_9fa48('2116') ? `` : (stryCov_9fa48('2116'), `/game/${code}`));
									return;
								}
							}
							roomId = room.id;
							const playerInfo = await getCurrentPlayerInRoom(room.id);
							if (
								stryMutAct_9fa48('2118')
									? false
									: stryMutAct_9fa48('2117')
										? true
										: (stryCov_9fa48('2117', '2118'), cancelled)
							)
								return;
							if (
								stryMutAct_9fa48('2121')
									? false
									: stryMutAct_9fa48('2120')
										? true
										: stryMutAct_9fa48('2119')
											? playerInfo
											: (stryCov_9fa48('2119', '2120', '2121'), !playerInfo)
							) {
								if (stryMutAct_9fa48('2122')) {
									{
									}
								} else {
									stryCov_9fa48('2122');
									error = stryMutAct_9fa48('2123')
										? ''
										: (stryCov_9fa48('2123'), 'Not in this room');
									return;
								}
							}
							await remoteGame.connectRemoteGame(
								stryMutAct_9fa48('2124')
									? {}
									: (stryCov_9fa48('2124'),
										{
											roomCode: code,
											roomId: room.id,
											myPlayerId: playerInfo.playerId,
											isHost: stryMutAct_9fa48('2127')
												? room.host_id !== playerInfo.userId
												: stryMutAct_9fa48('2126')
													? false
													: stryMutAct_9fa48('2125')
														? true
														: (stryCov_9fa48('2125', '2126', '2127'),
															room.host_id === playerInfo.userId),
										})
							);

							// Watch for room status changes so non-hosts navigate when host starts
							if (
								stryMutAct_9fa48('2130')
									? false
									: stryMutAct_9fa48('2129')
										? true
										: stryMutAct_9fa48('2128')
											? cancelled
											: (stryCov_9fa48('2128', '2129', '2130'), !cancelled)
							) {
								if (stryMutAct_9fa48('2131')) {
									{
									}
								} else {
									stryCov_9fa48('2131');
									statusChannel = subscribeToRoom(room.id, (payload) => {
										if (stryMutAct_9fa48('2132')) {
											{
											}
										} else {
											stryCov_9fa48('2132');
											if (
												stryMutAct_9fa48('2135')
													? payload.table === 'rooms' || payload.new.status === 'playing'
													: stryMutAct_9fa48('2134')
														? false
														: stryMutAct_9fa48('2133')
															? true
															: (stryCov_9fa48('2133', '2134', '2135'),
																(stryMutAct_9fa48('2137')
																	? payload.table !== 'rooms'
																	: stryMutAct_9fa48('2136')
																		? true
																		: (stryCov_9fa48('2136', '2137'),
																			payload.table ===
																				(stryMutAct_9fa48('2138')
																					? ''
																					: (stryCov_9fa48('2138'), 'rooms')))) &&
																	(stryMutAct_9fa48('2140')
																		? payload.new.status !== 'playing'
																		: stryMutAct_9fa48('2139')
																			? true
																			: (stryCov_9fa48('2139', '2140'),
																				payload.new.status ===
																					(stryMutAct_9fa48('2141')
																						? ''
																						: (stryCov_9fa48('2141'), 'playing')))))
											) {
												if (stryMutAct_9fa48('2142')) {
													{
													}
												} else {
													stryCov_9fa48('2142');
													goto(
														stryMutAct_9fa48('2143') ? `` : (stryCov_9fa48('2143'), `/game/${code}`)
													);
												}
											}
										}
									});
								}
							}
						}
					} catch (e) {
						if (stryMutAct_9fa48('2144')) {
							{
							}
						} else {
							stryCov_9fa48('2144');
							if (
								stryMutAct_9fa48('2147')
									? false
									: stryMutAct_9fa48('2146')
										? true
										: stryMutAct_9fa48('2145')
											? cancelled
											: (stryCov_9fa48('2145', '2146', '2147'), !cancelled)
							)
								error =
									e instanceof Error
										? e.message
										: stryMutAct_9fa48('2148')
											? ''
											: (stryCov_9fa48('2148'), 'Failed to load room');
						}
					}
				}
			})();
			return () => {
				if (stryMutAct_9fa48('2149')) {
					{
					}
				} else {
					stryCov_9fa48('2149');
					cancelled = stryMutAct_9fa48('2150') ? false : (stryCov_9fa48('2150'), true);
					if (
						stryMutAct_9fa48('2152')
							? false
							: stryMutAct_9fa48('2151')
								? true
								: (stryCov_9fa48('2151', '2152'), statusChannel)
					) {
						if (stryMutAct_9fa48('2153')) {
							{
							}
						} else {
							stryCov_9fa48('2153');
							void import('$lib/supabase').then(({ supabase }) => {
								if (stryMutAct_9fa48('2154')) {
									{
									}
								} else {
									stryCov_9fa48('2154');
									if (
										stryMutAct_9fa48('2156')
											? false
											: stryMutAct_9fa48('2155')
												? true
												: (stryCov_9fa48('2155', '2156'), statusChannel)
									)
										supabase.removeChannel(statusChannel);
								}
							});
						}
					}
					remoteGame.disconnectRemoteGame();
				}
			};
		}
	});
	async function handleStart() {
		if (stryMutAct_9fa48('2157')) {
			{
			}
		} else {
			stryCov_9fa48('2157');
			if (
				stryMutAct_9fa48('2159')
					? false
					: stryMutAct_9fa48('2158')
						? true
						: (stryCov_9fa48('2158', '2159'), isDemo)
			) {
				if (stryMutAct_9fa48('2160')) {
					{
					}
				} else {
					stryCov_9fa48('2160');
					game.startGame();
					goto(stryMutAct_9fa48('2161') ? `` : (stryCov_9fa48('2161'), `/game/${code}`));
					return;
				}
			}
			starting = stryMutAct_9fa48('2162') ? false : (stryCov_9fa48('2162'), true);
			try {
				if (stryMutAct_9fa48('2163')) {
					{
					}
				} else {
					stryCov_9fa48('2163');
					await remoteGame.startGame();
					goto(stryMutAct_9fa48('2164') ? `` : (stryCov_9fa48('2164'), `/game/${code}`));
				}
			} catch (e) {
				if (stryMutAct_9fa48('2165')) {
					{
					}
				} else {
					stryCov_9fa48('2165');
					error =
						e instanceof Error
							? e.message
							: stryMutAct_9fa48('2166')
								? ''
								: (stryCov_9fa48('2166'), 'Failed to start');
					starting = stryMutAct_9fa48('2167') ? true : (stryCov_9fa48('2167'), false);
				}
			}
		}
	}
</script>

<Chrome title="LOBBY · {code}">
	{#snippet children()}
		<div class="lobby">
			{#if isDemo}
				<h2>Solo Game</h2>
				<p class="sub">AI opponents ready</p>
				<div class="player-list">
					{#each $localPlayers as player}
						<PlayerChip
							{player}
							active={stryMutAct_9fa48('2170')
								? player.id !== 'p1'
								: stryMutAct_9fa48('2169')
									? false
									: stryMutAct_9fa48('2168')
										? true
										: (stryCov_9fa48('2168', '2169', '2170'),
											player.id ===
												(stryMutAct_9fa48('2171') ? '' : (stryCov_9fa48('2171'), 'p1')))}
						/>
					{/each}
				</div>
			{:else}
				<h2>Room {code}</h2>
				<p class="sub">Waiting for players…</p>
				{#if error}
					<p class="error">{error}</p>
				{/if}
				<div class="player-list">
					{#each $remotePlayers as player}
						<PlayerChip
							{player}
							active={stryMutAct_9fa48('2174')
								? player.id !== $myPlayerId
								: stryMutAct_9fa48('2173')
									? false
									: stryMutAct_9fa48('2172')
										? true
										: (stryCov_9fa48('2172', '2173', '2174'), player.id === $myPlayerId)}
						/>
					{/each}
				</div>
			{/if}
			<button
				class="start-btn"
				onclick={handleStart}
				disabled={stryMutAct_9fa48('2177')
					? !isDemo && (!$isHost || $remotePlayers.length < 1) && starting
					: stryMutAct_9fa48('2176')
						? false
						: stryMutAct_9fa48('2175')
							? true
							: (stryCov_9fa48('2175', '2176', '2177'),
								(stryMutAct_9fa48('2179')
									? !isDemo || !$isHost || $remotePlayers.length < 1
									: stryMutAct_9fa48('2178')
										? false
										: (stryCov_9fa48('2178', '2179'),
											(stryMutAct_9fa48('2180') ? isDemo : (stryCov_9fa48('2180'), !isDemo)) &&
												(stryMutAct_9fa48('2182')
													? !$isHost && $remotePlayers.length < 1
													: stryMutAct_9fa48('2181')
														? true
														: (stryCov_9fa48('2181', '2182'),
															(stryMutAct_9fa48('2183')
																? $isHost
																: (stryCov_9fa48('2183'), !$isHost)) ||
																(stryMutAct_9fa48('2186')
																	? $remotePlayers.length >= 1
																	: stryMutAct_9fa48('2185')
																		? $remotePlayers.length <= 1
																		: stryMutAct_9fa48('2184')
																			? false
																			: (stryCov_9fa48('2184', '2185', '2186'),
																				$remotePlayers.length < 1)))))) || starting)}
			>
				{starting
					? stryMutAct_9fa48('2187')
						? ''
						: (stryCov_9fa48('2187'), 'Starting…')
					: stryMutAct_9fa48('2188')
						? ''
						: (stryCov_9fa48('2188'), 'Start Game')}
			</button>
		</div>
	{/snippet}
</Chrome>

<style>
	.lobby {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 24px 16px;
		gap: 16px;
	}
	h2 {
		font-family: 'Playfair Display', serif;
		font-size: 24px;
	}
	.sub {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 10px;
		letter-spacing: 2px;
		text-transform: uppercase;
		opacity: 0.5;
	}
	.error {
		color: #c0392b;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 1px;
	}
	.player-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
	}
	.start-btn {
		margin-top: auto;
		width: 100%;
		padding: 14px;
		background: #0a0a0a;
		color: #f4efe4;
		border: none;
		border-radius: 4px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 4px;
		text-transform: uppercase;
		font-weight: 600;
		cursor: pointer;
	}
	.start-btn:disabled {
		opacity: 0.4;
		cursor: default;
	}
</style>
