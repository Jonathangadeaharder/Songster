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
import { get, writable } from 'svelte/store';
import { playPreview, preloadPreviews, stopPreview } from '$lib/audio';
import {
	buildDrawPile,
	findCorrectSlot,
	SONG_DECK,
	seededPlayers,
	validatePlacement,
} from '$lib/songs';
import type { Phase, Player, Song } from '$lib/types';
const initialPlayers = seededPlayers();
const screen = writable<'lobby' | 'play' | 'win'>(
	stryMutAct_9fa48('1200') ? '' : (stryCov_9fa48('1200'), 'lobby')
);
const round = writable(1);
const players = writable<Player[]>(initialPlayers);
const drawPile = writable<Song[]>(buildDrawPile(initialPlayers));
const activeCard = writable<Song | null>(null);
const activePlayerId = writable(stryMutAct_9fa48('1201') ? '' : (stryCov_9fa48('1201'), 'p1'));
const phase = writable<Phase>(stryMutAct_9fa48('1202') ? '' : (stryCov_9fa48('1202'), 'draw'));
const hoverSlot = writable<number | null>(null);
const placedSlot = writable<number | null>(null);
const placedResult = writable<boolean | null>(null);
const interceptor = writable<string | null>(null);
const winner = writable<Player | null>(null);
const dragging = writable(stryMutAct_9fa48('1203') ? true : (stryCov_9fa48('1203'), false));
preloadPreviews(SONG_DECK);
function drawNext() {
	if (stryMutAct_9fa48('1204')) {
		{
		}
	} else {
		stryCov_9fa48('1204');
		const pile = get(drawPile);
		if (
			stryMutAct_9fa48('1207')
				? pile.length !== 0
				: stryMutAct_9fa48('1206')
					? false
					: stryMutAct_9fa48('1205')
						? true
						: (stryCov_9fa48('1205', '1206', '1207'), pile.length === 0)
		)
			return;
		const [next, ...rest] = pile;
		drawPile.set(rest);
		activeCard.set(next);
		phase.set(stryMutAct_9fa48('1208') ? '' : (stryCov_9fa48('1208'), 'draw'));
		hoverSlot.set(null);
		placedSlot.set(null);
		placedResult.set(null);
		interceptor.set(null);
	}
}
function startGame() {
	if (stryMutAct_9fa48('1209')) {
		{
		}
	} else {
		stryCov_9fa48('1209');
		if (
			stryMutAct_9fa48('1212')
				? get(screen) === 'lobby'
				: stryMutAct_9fa48('1211')
					? false
					: stryMutAct_9fa48('1210')
						? true
						: (stryCov_9fa48('1210', '1211', '1212'),
							get(screen) !== (stryMutAct_9fa48('1213') ? '' : (stryCov_9fa48('1213'), 'lobby')))
		)
			return;
		screen.set(stryMutAct_9fa48('1214') ? '' : (stryCov_9fa48('1214'), 'play'));
		drawNext();
	}
}
let playTimer: ReturnType<typeof setTimeout> | undefined;
function onPlay() {
	if (stryMutAct_9fa48('1215')) {
		{
		}
	} else {
		stryCov_9fa48('1215');
		phase.set(stryMutAct_9fa48('1216') ? '' : (stryCov_9fa48('1216'), 'listen'));
		const card = get(activeCard);
		if (
			stryMutAct_9fa48('1218')
				? false
				: stryMutAct_9fa48('1217')
					? true
					: (stryCov_9fa48('1217', '1218'), card)
		)
			void playPreview(card);
		if (
			stryMutAct_9fa48('1220')
				? false
				: stryMutAct_9fa48('1219')
					? true
					: (stryCov_9fa48('1219', '1220'), playTimer)
		)
			clearTimeout(playTimer);
		playTimer = setTimeout(() => {
			if (stryMutAct_9fa48('1221')) {
				{
				}
			} else {
				stryCov_9fa48('1221');
				if (
					stryMutAct_9fa48('1224')
						? get(phase) !== 'listen'
						: stryMutAct_9fa48('1223')
							? false
							: stryMutAct_9fa48('1222')
								? true
								: (stryCov_9fa48('1222', '1223', '1224'),
									get(phase) ===
										(stryMutAct_9fa48('1225') ? '' : (stryCov_9fa48('1225'), 'listen')))
				)
					phase.set(stryMutAct_9fa48('1226') ? '' : (stryCov_9fa48('1226'), 'place'));
			}
		}, 1400);
	}
}
function onPlace(slot: number) {
	if (stryMutAct_9fa48('1227')) {
		{
		}
	} else {
		stryCov_9fa48('1227');
		if (
			stryMutAct_9fa48('1230')
				? get(phase) === 'place'
				: stryMutAct_9fa48('1229')
					? false
					: stryMutAct_9fa48('1228')
						? true
						: (stryCov_9fa48('1228', '1229', '1230'),
							get(phase) !== (stryMutAct_9fa48('1231') ? '' : (stryCov_9fa48('1231'), 'place')))
		)
			return;
		const card = get(activeCard);
		if (
			stryMutAct_9fa48('1234')
				? false
				: stryMutAct_9fa48('1233')
					? true
					: stryMutAct_9fa48('1232')
						? card
						: (stryCov_9fa48('1232', '1233', '1234'), !card)
		)
			return;
		hoverSlot.set(slot);
		placedSlot.set(slot);
		const currentPlayers = get(players);
		const currentActiveId = get(activePlayerId);
		const active = currentPlayers.find(
			stryMutAct_9fa48('1235')
				? () => undefined
				: (stryCov_9fa48('1235'),
					(p) =>
						stryMutAct_9fa48('1238')
							? p.id !== currentActiveId
							: stryMutAct_9fa48('1237')
								? false
								: stryMutAct_9fa48('1236')
									? true
									: (stryCov_9fa48('1236', '1237', '1238'), p.id === currentActiveId))
		);
		if (
			stryMutAct_9fa48('1241')
				? false
				: stryMutAct_9fa48('1240')
					? true
					: stryMutAct_9fa48('1239')
						? active
						: (stryCov_9fa48('1239', '1240', '1241'), !active)
		)
			return;
		const ok = validatePlacement(active.timeline, card, slot);
		placedResult.set(ok);
		if (
			stryMutAct_9fa48('1243')
				? false
				: stryMutAct_9fa48('1242')
					? true
					: (stryCov_9fa48('1242', '1243'), ok)
		) {
			if (stryMutAct_9fa48('1244')) {
				{
				}
			} else {
				stryCov_9fa48('1244');
				const newTimeline = stryMutAct_9fa48('1245')
					? []
					: (stryCov_9fa48('1245'),
						[
							...(stryMutAct_9fa48('1246')
								? active.timeline
								: (stryCov_9fa48('1246'), active.timeline.slice(0, slot))),
							card,
							...(stryMutAct_9fa48('1247')
								? active.timeline
								: (stryCov_9fa48('1247'), active.timeline.slice(slot))),
						]);
				const updatedPlayers = currentPlayers.map(
					stryMutAct_9fa48('1248')
						? () => undefined
						: (stryCov_9fa48('1248'),
							(p) =>
								(
									stryMutAct_9fa48('1251')
										? p.id !== currentActiveId
										: stryMutAct_9fa48('1250')
											? false
											: stryMutAct_9fa48('1249')
												? true
												: (stryCov_9fa48('1249', '1250', '1251'), p.id === currentActiveId)
								)
									? stryMutAct_9fa48('1252')
										? {}
										: (stryCov_9fa48('1252'),
											{
												...p,
												timeline: newTimeline,
											})
									: p)
				);
				players.set(updatedPlayers);
				if (
					stryMutAct_9fa48('1256')
						? newTimeline.length < 10
						: stryMutAct_9fa48('1255')
							? newTimeline.length > 10
							: stryMutAct_9fa48('1254')
								? false
								: stryMutAct_9fa48('1253')
									? true
									: (stryCov_9fa48('1253', '1254', '1255', '1256'), newTimeline.length >= 10)
				) {
					if (stryMutAct_9fa48('1257')) {
						{
						}
					} else {
						stryCov_9fa48('1257');
						setTimeout(() => {
							if (stryMutAct_9fa48('1258')) {
								{
								}
							} else {
								stryCov_9fa48('1258');
								winner.set(
									updatedPlayers.find(
										stryMutAct_9fa48('1259')
											? () => undefined
											: (stryCov_9fa48('1259'),
												(p) =>
													stryMutAct_9fa48('1262')
														? p.id !== currentActiveId
														: stryMutAct_9fa48('1261')
															? false
															: stryMutAct_9fa48('1260')
																? true
																: (stryCov_9fa48('1260', '1261', '1262'), p.id === currentActiveId))
									)!
								);
								screen.set(stryMutAct_9fa48('1263') ? '' : (stryCov_9fa48('1263'), 'win'));
							}
						}, 1200);
					}
				}
			}
		}
		phase.set(stryMutAct_9fa48('1264') ? '' : (stryCov_9fa48('1264'), 'reveal'));
		stopPreview();
	}
}
function onChallenge() {
	if (stryMutAct_9fa48('1265')) {
		{
		}
	} else {
		stryCov_9fa48('1265');
		if (
			stryMutAct_9fa48('1268')
				? get(phase) !== 'place' && get(activePlayerId) === 'p1'
				: stryMutAct_9fa48('1267')
					? false
					: stryMutAct_9fa48('1266')
						? true
						: (stryCov_9fa48('1266', '1267', '1268'),
							(stryMutAct_9fa48('1270')
								? get(phase) === 'place'
								: stryMutAct_9fa48('1269')
									? false
									: (stryCov_9fa48('1269', '1270'),
										get(phase) !==
											(stryMutAct_9fa48('1271') ? '' : (stryCov_9fa48('1271'), 'place')))) ||
								(stryMutAct_9fa48('1273')
									? get(activePlayerId) !== 'p1'
									: stryMutAct_9fa48('1272')
										? false
										: (stryCov_9fa48('1272', '1273'),
											get(activePlayerId) ===
												(stryMutAct_9fa48('1274') ? '' : (stryCov_9fa48('1274'), 'p1')))))
		)
			return;
		const currentPlayers = get(players);
		const card = get(activeCard);
		const me = currentPlayers.find(
			stryMutAct_9fa48('1275')
				? () => undefined
				: (stryCov_9fa48('1275'),
					(p) =>
						stryMutAct_9fa48('1278')
							? p.id !== 'p1'
							: stryMutAct_9fa48('1277')
								? false
								: stryMutAct_9fa48('1276')
									? true
									: (stryCov_9fa48('1276', '1277', '1278'),
										p.id === (stryMutAct_9fa48('1279') ? '' : (stryCov_9fa48('1279'), 'p1'))))
		)!;
		if (
			stryMutAct_9fa48('1282')
				? me.tokens <= 0 && !card
				: stryMutAct_9fa48('1281')
					? false
					: stryMutAct_9fa48('1280')
						? true
						: (stryCov_9fa48('1280', '1281', '1282'),
							(stryMutAct_9fa48('1285')
								? me.tokens > 0
								: stryMutAct_9fa48('1284')
									? me.tokens < 0
									: stryMutAct_9fa48('1283')
										? false
										: (stryCov_9fa48('1283', '1284', '1285'), me.tokens <= 0)) ||
								(stryMutAct_9fa48('1286') ? card : (stryCov_9fa48('1286'), !card)))
		)
			return;
		players.set(
			currentPlayers.map(
				stryMutAct_9fa48('1287')
					? () => undefined
					: (stryCov_9fa48('1287'),
						(p) =>
							(
								stryMutAct_9fa48('1290')
									? p.id !== 'p1'
									: stryMutAct_9fa48('1289')
										? false
										: stryMutAct_9fa48('1288')
											? true
											: (stryCov_9fa48('1288', '1289', '1290'),
												p.id === (stryMutAct_9fa48('1291') ? '' : (stryCov_9fa48('1291'), 'p1')))
							)
								? stryMutAct_9fa48('1292')
									? {}
									: (stryCov_9fa48('1292'),
										{
											...p,
											tokens: stryMutAct_9fa48('1293')
												? p.tokens + 1
												: (stryCov_9fa48('1293'), p.tokens - 1),
										})
								: p)
			)
		);
		interceptor.set(stryMutAct_9fa48('1294') ? '' : (stryCov_9fa48('1294'), 'p1'));
		phase.set(stryMutAct_9fa48('1295') ? '' : (stryCov_9fa48('1295'), 'challenge'));
		setTimeout(() => {
			if (stryMutAct_9fa48('1296')) {
				{
				}
			} else {
				stryCov_9fa48('1296');
				const correctSlotVal = findCorrectSlot(me.timeline, card);
				placedSlot.set(correctSlotVal);
				placedResult.set(stryMutAct_9fa48('1297') ? false : (stryCov_9fa48('1297'), true));
				const newTimeline = stryMutAct_9fa48('1298')
					? []
					: (stryCov_9fa48('1298'),
						[
							...(stryMutAct_9fa48('1299')
								? me.timeline
								: (stryCov_9fa48('1299'), me.timeline.slice(0, correctSlotVal))),
							card,
							...(stryMutAct_9fa48('1300')
								? me.timeline
								: (stryCov_9fa48('1300'), me.timeline.slice(correctSlotVal))),
						]);
				const updatedPlayers = get(players).map(
					stryMutAct_9fa48('1301')
						? () => undefined
						: (stryCov_9fa48('1301'),
							(p) =>
								(
									stryMutAct_9fa48('1304')
										? p.id !== 'p1'
										: stryMutAct_9fa48('1303')
											? false
											: stryMutAct_9fa48('1302')
												? true
												: (stryCov_9fa48('1302', '1303', '1304'),
													p.id === (stryMutAct_9fa48('1305') ? '' : (stryCov_9fa48('1305'), 'p1')))
								)
									? stryMutAct_9fa48('1306')
										? {}
										: (stryCov_9fa48('1306'),
											{
												...p,
												timeline: newTimeline,
											})
									: p)
				);
				players.set(updatedPlayers);
				if (
					stryMutAct_9fa48('1310')
						? newTimeline.length < 10
						: stryMutAct_9fa48('1309')
							? newTimeline.length > 10
							: stryMutAct_9fa48('1308')
								? false
								: stryMutAct_9fa48('1307')
									? true
									: (stryCov_9fa48('1307', '1308', '1309', '1310'), newTimeline.length >= 10)
				) {
					if (stryMutAct_9fa48('1311')) {
						{
						}
					} else {
						stryCov_9fa48('1311');
						setTimeout(() => {
							if (stryMutAct_9fa48('1312')) {
								{
								}
							} else {
								stryCov_9fa48('1312');
								winner.set(
									updatedPlayers.find(
										stryMutAct_9fa48('1313')
											? () => undefined
											: (stryCov_9fa48('1313'),
												(p) =>
													stryMutAct_9fa48('1316')
														? p.id !== 'p1'
														: stryMutAct_9fa48('1315')
															? false
															: stryMutAct_9fa48('1314')
																? true
																: (stryCov_9fa48('1314', '1315', '1316'),
																	p.id ===
																		(stryMutAct_9fa48('1317')
																			? ''
																			: (stryCov_9fa48('1317'), 'p1'))))
									)!
								);
								screen.set(stryMutAct_9fa48('1318') ? '' : (stryCov_9fa48('1318'), 'win'));
							}
						}, 1200);
					}
				}
				phase.set(stryMutAct_9fa48('1319') ? '' : (stryCov_9fa48('1319'), 'reveal'));
				stopPreview();
			}
		}, 1600);
	}
}
function onNextTurn() {
	if (stryMutAct_9fa48('1320')) {
		{
		}
	} else {
		stryCov_9fa48('1320');
		const currentPlayers = get(players);
		const currentActiveId = get(activePlayerId);
		const ids = currentPlayers.map(
			stryMutAct_9fa48('1321') ? () => undefined : (stryCov_9fa48('1321'), (p) => p.id)
		);
		const idx = ids.indexOf(currentActiveId);
		const nextId =
			ids[
				stryMutAct_9fa48('1322')
					? (idx + 1) * ids.length
					: (stryCov_9fa48('1322'),
						(stryMutAct_9fa48('1323') ? idx - 1 : (stryCov_9fa48('1323'), idx + 1)) % ids.length)
			];
		activePlayerId.set(nextId);
		round.update(
			stryMutAct_9fa48('1324')
				? () => undefined
				: (stryCov_9fa48('1324'),
					(r) =>
						stryMutAct_9fa48('1325')
							? r - (nextId === 'p1' ? 1 : 0)
							: (stryCov_9fa48('1325'),
								r +
									((
										stryMutAct_9fa48('1328')
											? nextId !== 'p1'
											: stryMutAct_9fa48('1327')
												? false
												: stryMutAct_9fa48('1326')
													? true
													: (stryCov_9fa48('1326', '1327', '1328'),
														nextId ===
															(stryMutAct_9fa48('1329') ? '' : (stryCov_9fa48('1329'), 'p1')))
									)
										? 1
										: 0)))
		);
		drawNext();
	}
}
function onReplay() {
	if (stryMutAct_9fa48('1330')) {
		{
		}
	} else {
		stryCov_9fa48('1330');
		stopPreview();
		const fresh = seededPlayers();
		players.set(fresh);
		drawPile.set(buildDrawPile(fresh));
		activePlayerId.set(stryMutAct_9fa48('1331') ? '' : (stryCov_9fa48('1331'), 'p1'));
		round.set(1);
		winner.set(null);
		activeCard.set(null);
		phase.set(stryMutAct_9fa48('1332') ? '' : (stryCov_9fa48('1332'), 'draw'));
		screen.set(stryMutAct_9fa48('1333') ? '' : (stryCov_9fa48('1333'), 'lobby'));
	}
}
function runAiTurn(): (() => void) | undefined {
	if (stryMutAct_9fa48('1334')) {
		{
		}
	} else {
		stryCov_9fa48('1334');
		if (
			stryMutAct_9fa48('1337')
				? (get(screen) !== 'play' || get(activePlayerId) === 'p1') && get(phase) !== 'draw'
				: stryMutAct_9fa48('1336')
					? false
					: stryMutAct_9fa48('1335')
						? true
						: (stryCov_9fa48('1335', '1336', '1337'),
							(stryMutAct_9fa48('1339')
								? get(screen) !== 'play' && get(activePlayerId) === 'p1'
								: stryMutAct_9fa48('1338')
									? false
									: (stryCov_9fa48('1338', '1339'),
										(stryMutAct_9fa48('1341')
											? get(screen) === 'play'
											: stryMutAct_9fa48('1340')
												? false
												: (stryCov_9fa48('1340', '1341'),
													get(screen) !==
														(stryMutAct_9fa48('1342') ? '' : (stryCov_9fa48('1342'), 'play')))) ||
											(stryMutAct_9fa48('1344')
												? get(activePlayerId) !== 'p1'
												: stryMutAct_9fa48('1343')
													? false
													: (stryCov_9fa48('1343', '1344'),
														get(activePlayerId) ===
															(stryMutAct_9fa48('1345') ? '' : (stryCov_9fa48('1345'), 'p1')))))) ||
								(stryMutAct_9fa48('1347')
									? get(phase) === 'draw'
									: stryMutAct_9fa48('1346')
										? false
										: (stryCov_9fa48('1346', '1347'),
											get(phase) !==
												(stryMutAct_9fa48('1348') ? '' : (stryCov_9fa48('1348'), 'draw')))))
		)
			return undefined;
		const t1 = setTimeout(
			stryMutAct_9fa48('1349')
				? () => undefined
				: (stryCov_9fa48('1349'),
					() => phase.set(stryMutAct_9fa48('1350') ? '' : (stryCov_9fa48('1350'), 'listen'))),
			700
		);
		const t2 = setTimeout(
			stryMutAct_9fa48('1351')
				? () => undefined
				: (stryCov_9fa48('1351'),
					() => phase.set(stryMutAct_9fa48('1352') ? '' : (stryCov_9fa48('1352'), 'place'))),
			1800
		);
		const t3 = setTimeout(() => {
			if (stryMutAct_9fa48('1353')) {
				{
				}
			} else {
				stryCov_9fa48('1353');
				const currentPlayers = get(players);
				const card = get(activeCard);
				const activeId = get(activePlayerId);
				const active = currentPlayers.find(
					stryMutAct_9fa48('1354')
						? () => undefined
						: (stryCov_9fa48('1354'),
							(p) =>
								stryMutAct_9fa48('1357')
									? p.id !== activeId
									: stryMutAct_9fa48('1356')
										? false
										: stryMutAct_9fa48('1355')
											? true
											: (stryCov_9fa48('1355', '1356', '1357'), p.id === activeId))
				);
				if (
					stryMutAct_9fa48('1360')
						? !active && !card
						: stryMutAct_9fa48('1359')
							? false
							: stryMutAct_9fa48('1358')
								? true
								: (stryCov_9fa48('1358', '1359', '1360'),
									(stryMutAct_9fa48('1361') ? active : (stryCov_9fa48('1361'), !active)) ||
										(stryMutAct_9fa48('1362') ? card : (stryCov_9fa48('1362'), !card)))
				)
					return;
				const correct = findCorrectSlot(active.timeline, card);
				const rand = Math.random();
				const slot = (
					stryMutAct_9fa48('1366')
						? rand <= 0.4
						: stryMutAct_9fa48('1365')
							? rand >= 0.4
							: stryMutAct_9fa48('1364')
								? false
								: stryMutAct_9fa48('1363')
									? true
									: (stryCov_9fa48('1363', '1364', '1365', '1366'), rand > 0.4)
				)
					? correct
					: Math.floor(
							stryMutAct_9fa48('1367')
								? Math.random() / (active.timeline.length + 1)
								: (stryCov_9fa48('1367'),
									Math.random() *
										(stryMutAct_9fa48('1368')
											? active.timeline.length - 1
											: (stryCov_9fa48('1368'), active.timeline.length + 1)))
						);
				const ok = validatePlacement(active.timeline, card, slot);
				placedSlot.set(slot);
				placedResult.set(ok);
				if (
					stryMutAct_9fa48('1370')
						? false
						: stryMutAct_9fa48('1369')
							? true
							: (stryCov_9fa48('1369', '1370'), ok)
				) {
					if (stryMutAct_9fa48('1371')) {
						{
						}
					} else {
						stryCov_9fa48('1371');
						players.update(
							stryMutAct_9fa48('1372')
								? () => undefined
								: (stryCov_9fa48('1372'),
									(prev) =>
										prev.map((p) => {
											if (stryMutAct_9fa48('1373')) {
												{
												}
											} else {
												stryCov_9fa48('1373');
												if (
													stryMutAct_9fa48('1376')
														? p.id === activeId
														: stryMutAct_9fa48('1375')
															? false
															: stryMutAct_9fa48('1374')
																? true
																: (stryCov_9fa48('1374', '1375', '1376'), p.id !== activeId)
												)
													return p;
												const newTimeline = stryMutAct_9fa48('1377')
													? []
													: (stryCov_9fa48('1377'),
														[
															...(stryMutAct_9fa48('1378')
																? p.timeline
																: (stryCov_9fa48('1378'), p.timeline.slice(0, slot))),
															card,
															...(stryMutAct_9fa48('1379')
																? p.timeline
																: (stryCov_9fa48('1379'), p.timeline.slice(slot))),
														]);
												if (
													stryMutAct_9fa48('1383')
														? newTimeline.length < 10
														: stryMutAct_9fa48('1382')
															? newTimeline.length > 10
															: stryMutAct_9fa48('1381')
																? false
																: stryMutAct_9fa48('1380')
																	? true
																	: (stryCov_9fa48('1380', '1381', '1382', '1383'),
																		newTimeline.length >= 10)
												) {
													if (stryMutAct_9fa48('1384')) {
														{
														}
													} else {
														stryCov_9fa48('1384');
														setTimeout(() => {
															if (stryMutAct_9fa48('1385')) {
																{
																}
															} else {
																stryCov_9fa48('1385');
																winner.set(
																	stryMutAct_9fa48('1386')
																		? {}
																		: (stryCov_9fa48('1386'),
																			{
																				...p,
																				timeline: newTimeline,
																			})
																);
																screen.set(
																	stryMutAct_9fa48('1387') ? '' : (stryCov_9fa48('1387'), 'win')
																);
															}
														}, 1200);
													}
												}
												return stryMutAct_9fa48('1388')
													? {}
													: (stryCov_9fa48('1388'),
														{
															...p,
															timeline: newTimeline,
														});
											}
										}))
						);
					}
				}
				phase.set(stryMutAct_9fa48('1389') ? '' : (stryCov_9fa48('1389'), 'reveal'));
				stopPreview();
			}
		}, 3200);
		return () => {
			if (stryMutAct_9fa48('1390')) {
				{
				}
			} else {
				stryCov_9fa48('1390');
				clearTimeout(t1);
				clearTimeout(t2);
				clearTimeout(t3);
			}
		};
	}
}
export const game = stryMutAct_9fa48('1391')
	? {}
	: (stryCov_9fa48('1391'),
		{
			screen,
			round,
			players,
			drawPile,
			activeCard,
			activePlayerId,
			phase,
			hoverSlot,
			placedSlot,
			placedResult,
			interceptor,
			winner,
			dragging,
			startGame,
			onPlay,
			onPlace,
			onChallenge,
			onNextTurn,
			onReplay,
			runAiTurn,
			drawNext,
		});
