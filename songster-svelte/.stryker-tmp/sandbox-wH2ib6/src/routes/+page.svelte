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
	import { goto } from '$app/navigation';
	import Wordmark from '$lib/components/Wordmark.svelte';
	import { createRoom, joinRoom } from '$lib/room';
	let hostName = $state(
		stryMutAct_9fa48('1441') ? 'Stryker was here!' : (stryCov_9fa48('1441'), '')
	);
	let joinCode = $state(
		stryMutAct_9fa48('1442') ? 'Stryker was here!' : (stryCov_9fa48('1442'), '')
	);
	let joinName = $state(
		stryMutAct_9fa48('1443') ? 'Stryker was here!' : (stryCov_9fa48('1443'), '')
	);
	let creating = $state(stryMutAct_9fa48('1444') ? true : (stryCov_9fa48('1444'), false));
	let joining = $state(stryMutAct_9fa48('1445') ? true : (stryCov_9fa48('1445'), false));
	let error = $state(stryMutAct_9fa48('1446') ? 'Stryker was here!' : (stryCov_9fa48('1446'), ''));
	async function handleCreate() {
		if (stryMutAct_9fa48('1447')) {
			{
			}
		} else {
			stryCov_9fa48('1447');
			if (
				stryMutAct_9fa48('1450')
					? false
					: stryMutAct_9fa48('1449')
						? true
						: stryMutAct_9fa48('1448')
							? hostName.trim()
							: (stryCov_9fa48('1448', '1449', '1450'),
								!(stryMutAct_9fa48('1451') ? hostName : (stryCov_9fa48('1451'), hostName.trim())))
			)
				return;
			creating = stryMutAct_9fa48('1452') ? false : (stryCov_9fa48('1452'), true);
			error = stryMutAct_9fa48('1453') ? 'Stryker was here!' : (stryCov_9fa48('1453'), '');
			try {
				if (stryMutAct_9fa48('1454')) {
					{
					}
				} else {
					stryCov_9fa48('1454');
					const room = await createRoom(
						stryMutAct_9fa48('1455') ? hostName : (stryCov_9fa48('1455'), hostName.trim())
					);
					goto(stryMutAct_9fa48('1456') ? `` : (stryCov_9fa48('1456'), `/lobby/${room.code}`));
				}
			} catch {
				if (stryMutAct_9fa48('1457')) {
					{
					}
				} else {
					stryCov_9fa48('1457');
					// Fallback to solo mode when Supabase is unavailable (E2E/placeholder)
					goto(stryMutAct_9fa48('1458') ? '' : (stryCov_9fa48('1458'), '/lobby/DEMO'));
				}
			}
		}
	}
	async function handleJoin() {
		if (stryMutAct_9fa48('1459')) {
			{
			}
		} else {
			stryCov_9fa48('1459');
			if (
				stryMutAct_9fa48('1462')
					? !joinCode.trim() && !joinName.trim()
					: stryMutAct_9fa48('1461')
						? false
						: stryMutAct_9fa48('1460')
							? true
							: (stryCov_9fa48('1460', '1461', '1462'),
								(stryMutAct_9fa48('1463')
									? joinCode.trim()
									: (stryCov_9fa48('1463'),
										!(stryMutAct_9fa48('1464')
											? joinCode
											: (stryCov_9fa48('1464'), joinCode.trim())))) ||
									(stryMutAct_9fa48('1465')
										? joinName.trim()
										: (stryCov_9fa48('1465'),
											!(stryMutAct_9fa48('1466')
												? joinName
												: (stryCov_9fa48('1466'), joinName.trim())))))
			)
				return;
			joining = stryMutAct_9fa48('1467') ? false : (stryCov_9fa48('1467'), true);
			error = stryMutAct_9fa48('1468') ? 'Stryker was here!' : (stryCov_9fa48('1468'), '');
			try {
				if (stryMutAct_9fa48('1469')) {
					{
					}
				} else {
					stryCov_9fa48('1469');
					await joinRoom(
						stryMutAct_9fa48('1471')
							? joinCode.toUpperCase()
							: stryMutAct_9fa48('1470')
								? joinCode.trim().toLowerCase()
								: (stryCov_9fa48('1470', '1471'), joinCode.trim().toUpperCase()),
						stryMutAct_9fa48('1472') ? joinName : (stryCov_9fa48('1472'), joinName.trim())
					);
					goto(
						stryMutAct_9fa48('1473')
							? ``
							: (stryCov_9fa48('1473'),
								`/lobby/${stryMutAct_9fa48('1475') ? joinCode.toUpperCase() : stryMutAct_9fa48('1474') ? joinCode.trim().toLowerCase() : (stryCov_9fa48('1474', '1475'), joinCode.trim().toUpperCase())}`)
					);
				}
			} catch {
				if (stryMutAct_9fa48('1476')) {
					{
					}
				} else {
					stryCov_9fa48('1476');
					// Fallback to solo mode when Supabase is unavailable (E2E/placeholder)
					goto(stryMutAct_9fa48('1477') ? '' : (stryCov_9fa48('1477'), '/lobby/DEMO'));
				}
			}
		}
	}
</script>

<div class="home">
	<Wordmark scale={1.5} />
	<p class="tagline">Music trivia timeline game</p>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	<div class="panels">
		<form
			class="panel"
			onsubmit={(e) => {
				if (stryMutAct_9fa48('1478')) {
					{
					}
				} else {
					stryCov_9fa48('1478');
					e.preventDefault();
					handleCreate();
				}
			}}
		>
			<h3>Create Room</h3>
			<input
				type="text"
				bind:value={hostName}
				placeholder="Your name"
				maxlength={20}
				disabled={creating}
			/>
			<button
				type="submit"
				disabled={stryMutAct_9fa48('1481')
					? creating && !hostName.trim()
					: stryMutAct_9fa48('1480')
						? false
						: stryMutAct_9fa48('1479')
							? true
							: (stryCov_9fa48('1479', '1480', '1481'),
								creating ||
									(stryMutAct_9fa48('1482')
										? hostName.trim()
										: (stryCov_9fa48('1482'),
											!(stryMutAct_9fa48('1483')
												? hostName
												: (stryCov_9fa48('1483'), hostName.trim())))))}
			>
				{creating
					? stryMutAct_9fa48('1484')
						? ''
						: (stryCov_9fa48('1484'), 'Creating…')
					: stryMutAct_9fa48('1485')
						? ''
						: (stryCov_9fa48('1485'), 'Create Room')}
			</button>
		</form>

		<form
			class="panel"
			onsubmit={(e) => {
				if (stryMutAct_9fa48('1486')) {
					{
					}
				} else {
					stryCov_9fa48('1486');
					e.preventDefault();
					handleJoin();
				}
			}}
		>
			<h3>Join Room</h3>
			<input
				type="text"
				bind:value={joinCode}
				placeholder="Room code"
				maxlength={6}
				disabled={joining}
			/>
			<input
				type="text"
				bind:value={joinName}
				placeholder="Your name"
				maxlength={20}
				disabled={joining}
			/>
			<button
				type="submit"
				disabled={stryMutAct_9fa48('1489')
					? (joining || !joinCode.trim()) && !joinName.trim()
					: stryMutAct_9fa48('1488')
						? false
						: stryMutAct_9fa48('1487')
							? true
							: (stryCov_9fa48('1487', '1488', '1489'),
								(stryMutAct_9fa48('1491')
									? joining && !joinCode.trim()
									: stryMutAct_9fa48('1490')
										? false
										: (stryCov_9fa48('1490', '1491'),
											joining ||
												(stryMutAct_9fa48('1492')
													? joinCode.trim()
													: (stryCov_9fa48('1492'),
														!(stryMutAct_9fa48('1493')
															? joinCode
															: (stryCov_9fa48('1493'), joinCode.trim())))))) ||
									(stryMutAct_9fa48('1494')
										? joinName.trim()
										: (stryCov_9fa48('1494'),
											!(stryMutAct_9fa48('1495')
												? joinName
												: (stryCov_9fa48('1495'), joinName.trim())))))}
			>
				{joining
					? stryMutAct_9fa48('1496')
						? ''
						: (stryCov_9fa48('1496'), 'Joining…')
					: stryMutAct_9fa48('1497')
						? ''
						: (stryCov_9fa48('1497'), 'Join Room')}
			</button>
		</form>
	</div>

	<a href="/lobby/DEMO" class="solo-link">Or play solo with AI →</a>
</div>

<style>
	.home {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		background: #f4efe4;
		color: #0a0a0a;
		padding: 20px;
	}
	.tagline {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 12px;
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
	.panels {
		display: flex;
		gap: 16px;
		margin-top: 16px;
		flex-wrap: wrap;
		justify-content: center;
	}
	.panel {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 20px;
		border: 1.5px solid rgba(10, 10, 10, 0.15);
		border-radius: 8px;
		min-width: 200px;
	}
	.panel h3 {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 3px;
		text-transform: uppercase;
		opacity: 0.6;
		margin: 0;
	}
	input {
		padding: 10px 12px;
		border: 1.5px solid rgba(10, 10, 10, 0.2);
		border-radius: 4px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 13px;
		background: transparent;
		color: inherit;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	input:focus {
		outline: none;
		border-color: #0a0a0a;
	}
	button {
		padding: 10px 16px;
		border-radius: 4px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		font-weight: 600;
		cursor: pointer;
		background: #0a0a0a;
		color: #f4efe4;
		border: none;
		transition: opacity 0.2s;
	}
	button:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.solo-link {
		margin-top: 12px;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 11px;
		letter-spacing: 1px;
		opacity: 0.5;
		text-decoration: none;
		color: inherit;
	}
	.solo-link:hover {
		opacity: 0.8;
	}
</style>
