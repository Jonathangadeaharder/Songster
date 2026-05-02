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
import { playPreview, stopPreview } from '$lib/audio';
import { findCorrectSlot, SONG_DECK, shuffled, validatePlacement } from '$lib/songs';
import type { Phase, Player, Screen, Song } from '$lib/types';
import {
	getGameState,
	getPlayerTimelines,
	getRoomPlayers,
	placeCard,
	subscribeToRoom,
	updateGameState,
	useToken,
} from '$lib/room';
import type { RoomPlayer } from '$lib/room';
export interface RemoteGameConfig {
	roomCode: string;
	roomId: string;
	myPlayerId: string;
	isHost: boolean;
}
const screen = writable<Screen>(stryMutAct_9fa48('833') ? '' : (stryCov_9fa48('833'), 'lobby'));
const round = writable(1);
const players = writable<Player[]>(
	stryMutAct_9fa48('834') ? ['Stryker was here'] : (stryCov_9fa48('834'), [])
);
const drawPile = writable<Song[]>(
	stryMutAct_9fa48('835') ? ['Stryker was here'] : (stryCov_9fa48('835'), [])
);
const activeCard = writable<Song | null>(null);
const activePlayerId = writable(
	stryMutAct_9fa48('836') ? 'Stryker was here!' : (stryCov_9fa48('836'), '')
);
const phase = writable<Phase>(stryMutAct_9fa48('837') ? '' : (stryCov_9fa48('837'), 'draw'));
const hoverSlot = writable<number | null>(null);
const placedSlot = writable<number | null>(null);
const placedResult = writable<boolean | null>(null);
const interceptor = writable<string | null>(null);
const winner = writable<Player | null>(null);
const dragging = writable(stryMutAct_9fa48('838') ? true : (stryCov_9fa48('838'), false));
const connected = writable(stryMutAct_9fa48('839') ? true : (stryCov_9fa48('839'), false));
const roomCode = writable(
	stryMutAct_9fa48('840') ? 'Stryker was here!' : (stryCov_9fa48('840'), '')
);
const myPlayerId = writable(
	stryMutAct_9fa48('841') ? 'Stryker was here!' : (stryCov_9fa48('841'), '')
);
const isHost = writable(stryMutAct_9fa48('842') ? true : (stryCov_9fa48('842'), false));
let config: RemoteGameConfig | null = null;
let channel: ReturnType<typeof subscribeToRoom> | null = null;
let playTimer: ReturnType<typeof setTimeout> | undefined;
let aiTimers: ReturnType<typeof setTimeout>[] = stryMutAct_9fa48('843')
	? ['Stryker was here']
	: (stryCov_9fa48('843'), []);
function mapRoomPlayers(roomPlayers: RoomPlayer[], timelines: Map<string, Song[]>): Player[] {
	if (stryMutAct_9fa48('844')) {
		{
		}
	} else {
		stryCov_9fa48('844');
		return roomPlayers.map(
			stryMutAct_9fa48('845')
				? () => undefined
				: (stryCov_9fa48('845'),
					(rp, i) =>
						stryMutAct_9fa48('846')
							? {}
							: (stryCov_9fa48('846'),
								{
									id: rp.id,
									name: rp.name,
									avatar: rp.avatar,
									timeline: stryMutAct_9fa48('847')
										? timelines.get(rp.id) && []
										: (stryCov_9fa48('847'),
											timelines.get(rp.id) ??
												(stryMutAct_9fa48('848')
													? ['Stryker was here']
													: (stryCov_9fa48('848'), []))),
									tokens: rp.tokens,
								}))
		);
	}
}
async function loadInitialState(cfg: RemoteGameConfig) {
	if (stryMutAct_9fa48('849')) {
		{
		}
	} else {
		stryCov_9fa48('849');
		const [roomPlayers, timelinesRows] = await Promise.all(
			stryMutAct_9fa48('850')
				? []
				: (stryCov_9fa48('850'), [getRoomPlayers(cfg.roomId), getPlayerTimelines(cfg.roomId)])
		);
		const timelineMap = new Map<string, Song[]>();
		// Rows are expected sorted by t.position ascending — getPlayerTimelines orders by position.
		// splice is safe because positions are contiguous within each player.
		for (const t of timelinesRows) {
			if (stryMutAct_9fa48('851')) {
				{
				}
			} else {
				stryCov_9fa48('851');
				const song = SONG_DECK.find(
					stryMutAct_9fa48('852')
						? () => undefined
						: (stryCov_9fa48('852'),
							(s) =>
								stryMutAct_9fa48('855')
									? s.id !== t.song_id
									: stryMutAct_9fa48('854')
										? false
										: stryMutAct_9fa48('853')
											? true
											: (stryCov_9fa48('853', '854', '855'), s.id === t.song_id))
				);
				if (
					stryMutAct_9fa48('858')
						? false
						: stryMutAct_9fa48('857')
							? true
							: stryMutAct_9fa48('856')
								? song
								: (stryCov_9fa48('856', '857', '858'), !song)
				)
					continue;
				const existing = stryMutAct_9fa48('859')
					? timelineMap.get(t.player_id) && []
					: (stryCov_9fa48('859'),
						timelineMap.get(t.player_id) ??
							(stryMutAct_9fa48('860') ? ['Stryker was here'] : (stryCov_9fa48('860'), [])));
				if (
					stryMutAct_9fa48('864')
						? t.position > existing.length
						: stryMutAct_9fa48('863')
							? t.position < existing.length
							: stryMutAct_9fa48('862')
								? false
								: stryMutAct_9fa48('861')
									? true
									: (stryCov_9fa48('861', '862', '863', '864'), t.position <= existing.length)
				) {
					if (stryMutAct_9fa48('865')) {
						{
						}
					} else {
						stryCov_9fa48('865');
						existing.splice(t.position, 0, song);
					}
				} else {
					if (stryMutAct_9fa48('866')) {
						{
						}
					} else {
						stryCov_9fa48('866');
						existing.push(song);
					}
				}
				timelineMap.set(t.player_id, existing);
			}
		}
		const mapped = mapRoomPlayers(roomPlayers, timelineMap);
		players.set(mapped);
		myPlayerId.set(cfg.myPlayerId);
		isHost.set(cfg.isHost);
		roomCode.set(cfg.roomCode);
		const state = await getGameState(cfg.roomId);
		if (
			stryMutAct_9fa48('868')
				? false
				: stryMutAct_9fa48('867')
					? true
					: (stryCov_9fa48('867', '868'), state)
		) {
			if (stryMutAct_9fa48('869')) {
				{
				}
			} else {
				stryCov_9fa48('869');
				round.set(state.round);
				phase.set(state.phase as Phase);
				activePlayerId.set(
					stryMutAct_9fa48('870')
						? state.active_player_id && ''
						: (stryCov_9fa48('870'),
							state.active_player_id ??
								(stryMutAct_9fa48('871') ? 'Stryker was here!' : (stryCov_9fa48('871'), '')))
				);
				drawPile.set(
					stryMutAct_9fa48('872')
						? state.draw_pile && []
						: (stryCov_9fa48('872'),
							state.draw_pile ??
								(stryMutAct_9fa48('873') ? ['Stryker was here'] : (stryCov_9fa48('873'), [])))
				);
				activeCard.set(state.active_card);
				screen.set(stryMutAct_9fa48('874') ? '' : (stryCov_9fa48('874'), 'play'));
			}
		}
	}
}
async function syncDrawNext() {
	if (stryMutAct_9fa48('875')) {
		{
		}
	} else {
		stryCov_9fa48('875');
		if (
			stryMutAct_9fa48('878')
				? false
				: stryMutAct_9fa48('877')
					? true
					: stryMutAct_9fa48('876')
						? config
						: (stryCov_9fa48('876', '877', '878'), !config)
		)
			return;
		const pile = get(drawPile);
		if (
			stryMutAct_9fa48('881')
				? pile.length !== 0
				: stryMutAct_9fa48('880')
					? false
					: stryMutAct_9fa48('879')
						? true
						: (stryCov_9fa48('879', '880', '881'), pile.length === 0)
		)
			return;
		const [next, ...rest] = pile;
		await updateGameState(
			config.roomCode,
			stryMutAct_9fa48('882')
				? {}
				: (stryCov_9fa48('882'),
					{
						drawPile: rest,
						activeCard: next,
						phase: stryMutAct_9fa48('883') ? '' : (stryCov_9fa48('883'), 'draw'),
					})
		);
	}
}
async function handleRemoteChange(
	payload: {
		event: string;
		table: string;
		new: Record<string, unknown>;
	},
	cfg: RemoteGameConfig
) {
	if (stryMutAct_9fa48('884')) {
		{
		}
	} else {
		stryCov_9fa48('884');
		if (
			stryMutAct_9fa48('887')
				? payload.table !== 'game_state'
				: stryMutAct_9fa48('886')
					? false
					: stryMutAct_9fa48('885')
						? true
						: (stryCov_9fa48('885', '886', '887'),
							payload.table ===
								(stryMutAct_9fa48('888') ? '' : (stryCov_9fa48('888'), 'game_state')))
		) {
			if (stryMutAct_9fa48('889')) {
				{
				}
			} else {
				stryCov_9fa48('889');
				const state = payload.new;
				round.set(
					stryMutAct_9fa48('890')
						? (state.round as number) && get(round)
						: (stryCov_9fa48('890'), (state.round as number) ?? get(round))
				);
				phase.set(
					stryMutAct_9fa48('891')
						? (state.phase as Phase) && get(phase)
						: (stryCov_9fa48('891'), (state.phase as Phase) ?? get(phase))
				);
				activePlayerId.set(
					stryMutAct_9fa48('892')
						? (state.active_player_id as string) && get(activePlayerId)
						: (stryCov_9fa48('892'), (state.active_player_id as string) ?? get(activePlayerId))
				);
				drawPile.set(
					stryMutAct_9fa48('893')
						? (state.draw_pile as Song[]) && get(drawPile)
						: (stryCov_9fa48('893'), (state.draw_pile as Song[]) ?? get(drawPile))
				);
				activeCard.set(
					stryMutAct_9fa48('894')
						? (state.active_card as Song | null) && null
						: (stryCov_9fa48('894'), (state.active_card as Song | null) ?? null)
				);
				if (
					stryMutAct_9fa48('897')
						? payload.event !== 'UPDATE'
						: stryMutAct_9fa48('896')
							? false
							: stryMutAct_9fa48('895')
								? true
								: (stryCov_9fa48('895', '896', '897'),
									payload.event ===
										(stryMutAct_9fa48('898') ? '' : (stryCov_9fa48('898'), 'UPDATE')))
				) {
					if (stryMutAct_9fa48('899')) {
						{
						}
					} else {
						stryCov_9fa48('899');
						hoverSlot.set(null);
						placedSlot.set(null);
						placedResult.set(null);
						interceptor.set(null);
					}
				}
			}
		} else if (
			stryMutAct_9fa48('902')
				? payload.table === 'players' && payload.table === 'timelines'
				: stryMutAct_9fa48('901')
					? false
					: stryMutAct_9fa48('900')
						? true
						: (stryCov_9fa48('900', '901', '902'),
							(stryMutAct_9fa48('904')
								? payload.table !== 'players'
								: stryMutAct_9fa48('903')
									? false
									: (stryCov_9fa48('903', '904'),
										payload.table ===
											(stryMutAct_9fa48('905') ? '' : (stryCov_9fa48('905'), 'players')))) ||
								(stryMutAct_9fa48('907')
									? payload.table !== 'timelines'
									: stryMutAct_9fa48('906')
										? false
										: (stryCov_9fa48('906', '907'),
											payload.table ===
												(stryMutAct_9fa48('908') ? '' : (stryCov_9fa48('908'), 'timelines')))))
		) {
			if (stryMutAct_9fa48('909')) {
				{
				}
			} else {
				stryCov_9fa48('909');
				try {
					if (stryMutAct_9fa48('910')) {
						{
						}
					} else {
						stryCov_9fa48('910');
						const [roomPlayers, timelinesRows] = await Promise.all(
							stryMutAct_9fa48('911')
								? []
								: (stryCov_9fa48('911'),
									[getRoomPlayers(cfg.roomId), getPlayerTimelines(cfg.roomId)])
						);
						const timelineMap = new Map<string, Song[]>();
						for (const t of timelinesRows) {
							if (stryMutAct_9fa48('912')) {
								{
								}
							} else {
								stryCov_9fa48('912');
								const song = SONG_DECK.find(
									stryMutAct_9fa48('913')
										? () => undefined
										: (stryCov_9fa48('913'),
											(s) =>
												stryMutAct_9fa48('916')
													? s.id !== t.song_id
													: stryMutAct_9fa48('915')
														? false
														: stryMutAct_9fa48('914')
															? true
															: (stryCov_9fa48('914', '915', '916'), s.id === t.song_id))
								);
								if (
									stryMutAct_9fa48('919')
										? false
										: stryMutAct_9fa48('918')
											? true
											: stryMutAct_9fa48('917')
												? song
												: (stryCov_9fa48('917', '918', '919'), !song)
								)
									continue;
								const existing = stryMutAct_9fa48('920')
									? timelineMap.get(t.player_id) && []
									: (stryCov_9fa48('920'),
										timelineMap.get(t.player_id) ??
											(stryMutAct_9fa48('921')
												? ['Stryker was here']
												: (stryCov_9fa48('921'), [])));
								if (
									stryMutAct_9fa48('925')
										? t.position > existing.length
										: stryMutAct_9fa48('924')
											? t.position < existing.length
											: stryMutAct_9fa48('923')
												? false
												: stryMutAct_9fa48('922')
													? true
													: (stryCov_9fa48('922', '923', '924', '925'),
														t.position <= existing.length)
								) {
									if (stryMutAct_9fa48('926')) {
										{
										}
									} else {
										stryCov_9fa48('926');
										existing.splice(t.position, 0, song);
									}
								} else {
									if (stryMutAct_9fa48('927')) {
										{
										}
									} else {
										stryCov_9fa48('927');
										existing.push(song);
									}
								}
								timelineMap.set(t.player_id, existing);
							}
						}
						players.set(mapRoomPlayers(roomPlayers, timelineMap));
					}
				} catch {
					// Graceful degradation: skip update on fetch failure
				}
			}
		} else if (
			stryMutAct_9fa48('930')
				? payload.table !== 'rooms'
				: stryMutAct_9fa48('929')
					? false
					: stryMutAct_9fa48('928')
						? true
						: (stryCov_9fa48('928', '929', '930'),
							payload.table === (stryMutAct_9fa48('931') ? '' : (stryCov_9fa48('931'), 'rooms')))
		) {
			if (stryMutAct_9fa48('932')) {
				{
				}
			} else {
				stryCov_9fa48('932');
				const state = payload.new;
				if (
					stryMutAct_9fa48('935')
						? state.status === 'playing' || get(screen) === 'lobby'
						: stryMutAct_9fa48('934')
							? false
							: stryMutAct_9fa48('933')
								? true
								: (stryCov_9fa48('933', '934', '935'),
									(stryMutAct_9fa48('937')
										? state.status !== 'playing'
										: stryMutAct_9fa48('936')
											? true
											: (stryCov_9fa48('936', '937'),
												state.status ===
													(stryMutAct_9fa48('938') ? '' : (stryCov_9fa48('938'), 'playing')))) &&
										(stryMutAct_9fa48('940')
											? get(screen) !== 'lobby'
											: stryMutAct_9fa48('939')
												? true
												: (stryCov_9fa48('939', '940'),
													get(screen) ===
														(stryMutAct_9fa48('941') ? '' : (stryCov_9fa48('941'), 'lobby')))))
				) {
					if (stryMutAct_9fa48('942')) {
						{
						}
					} else {
						stryCov_9fa48('942');
						screen.set(stryMutAct_9fa48('943') ? '' : (stryCov_9fa48('943'), 'play'));
					}
				}
				if (
					stryMutAct_9fa48('946')
						? state.status === 'finished' && state.winner_player_id
						: stryMutAct_9fa48('945')
							? false
							: stryMutAct_9fa48('944')
								? true
								: (stryCov_9fa48('944', '945', '946'),
									(stryMutAct_9fa48('948')
										? state.status !== 'finished'
										: stryMutAct_9fa48('947')
											? false
											: (stryCov_9fa48('947', '948'),
												state.status ===
													(stryMutAct_9fa48('949') ? '' : (stryCov_9fa48('949'), 'finished')))) ||
										state.winner_player_id)
				) {
					if (stryMutAct_9fa48('950')) {
						{
						}
					} else {
						stryCov_9fa48('950');
						const currentPlayers = get(players);
						const w = currentPlayers.find(
							stryMutAct_9fa48('951')
								? () => undefined
								: (stryCov_9fa48('951'),
									(p) =>
										stryMutAct_9fa48('954')
											? p.id !== state.winner_player_id
											: stryMutAct_9fa48('953')
												? false
												: stryMutAct_9fa48('952')
													? true
													: (stryCov_9fa48('952', '953', '954'), p.id === state.winner_player_id))
						);
						if (
							stryMutAct_9fa48('956')
								? false
								: stryMutAct_9fa48('955')
									? true
									: (stryCov_9fa48('955', '956'), w)
						) {
							if (stryMutAct_9fa48('957')) {
								{
								}
							} else {
								stryCov_9fa48('957');
								winner.set(w);
								screen.set(stryMutAct_9fa48('958') ? '' : (stryCov_9fa48('958'), 'win'));
							}
						}
					}
				}
			}
		}
	}
}
export async function connectRemoteGame(cfg: RemoteGameConfig) {
	if (stryMutAct_9fa48('959')) {
		{
		}
	} else {
		stryCov_9fa48('959');
		config = cfg;
		await loadInitialState(cfg);
		connected.set(stryMutAct_9fa48('960') ? false : (stryCov_9fa48('960'), true));
		channel = subscribeToRoom(cfg.roomId, (payload) => {
			if (stryMutAct_9fa48('961')) {
				{
				}
			} else {
				stryCov_9fa48('961');
				handleRemoteChange(payload, cfg);
			}
		});
	}
}
export function disconnectRemoteGame() {
	if (stryMutAct_9fa48('962')) {
		{
		}
	} else {
		stryCov_9fa48('962');
		if (
			stryMutAct_9fa48('964')
				? false
				: stryMutAct_9fa48('963')
					? true
					: (stryCov_9fa48('963', '964'), channel)
		) {
			if (stryMutAct_9fa48('965')) {
				{
				}
			} else {
				stryCov_9fa48('965');
				void removeChannel(channel);
				channel = null;
			}
		}
		clearTimers();
		config = null;
		connected.set(stryMutAct_9fa48('966') ? true : (stryCov_9fa48('966'), false));
		screen.set(stryMutAct_9fa48('967') ? '' : (stryCov_9fa48('967'), 'lobby'));
	}
}
async function removeChannel(ch: NonNullable<typeof channel>) {
	if (stryMutAct_9fa48('968')) {
		{
		}
	} else {
		stryCov_9fa48('968');
		const { supabase } = await import('$lib/supabase');
		supabase.removeChannel(ch);
	}
}
function clearTimers() {
	if (stryMutAct_9fa48('969')) {
		{
		}
	} else {
		stryCov_9fa48('969');
		if (
			stryMutAct_9fa48('971')
				? false
				: stryMutAct_9fa48('970')
					? true
					: (stryCov_9fa48('970', '971'), playTimer)
		)
			clearTimeout(playTimer);
		for (const t of aiTimers) clearTimeout(t);
		aiTimers = stryMutAct_9fa48('972') ? ['Stryker was here'] : (stryCov_9fa48('972'), []);
	}
}
async function drawNext() {
	if (stryMutAct_9fa48('973')) {
		{
		}
	} else {
		stryCov_9fa48('973');
		if (
			stryMutAct_9fa48('976')
				? false
				: stryMutAct_9fa48('975')
					? true
					: stryMutAct_9fa48('974')
						? config
						: (stryCov_9fa48('974', '975', '976'), !config)
		)
			return;
		const pile = get(drawPile);
		if (
			stryMutAct_9fa48('979')
				? pile.length !== 0
				: stryMutAct_9fa48('978')
					? false
					: stryMutAct_9fa48('977')
						? true
						: (stryCov_9fa48('977', '978', '979'), pile.length === 0)
		)
			return;
		const [next, ...rest] = pile;
		drawPile.set(rest);
		activeCard.set(next);
		phase.set(stryMutAct_9fa48('980') ? '' : (stryCov_9fa48('980'), 'draw'));
		hoverSlot.set(null);
		placedSlot.set(null);
		placedResult.set(null);
		interceptor.set(null);
	}
}
async function startGame() {
	if (stryMutAct_9fa48('981')) {
		{
		}
	} else {
		stryCov_9fa48('981');
		if (
			stryMutAct_9fa48('984')
				? !config && get(screen) !== 'lobby'
				: stryMutAct_9fa48('983')
					? false
					: stryMutAct_9fa48('982')
						? true
						: (stryCov_9fa48('982', '983', '984'),
							(stryMutAct_9fa48('985') ? config : (stryCov_9fa48('985'), !config)) ||
								(stryMutAct_9fa48('987')
									? get(screen) === 'lobby'
									: stryMutAct_9fa48('986')
										? false
										: (stryCov_9fa48('986', '987'),
											get(screen) !==
												(stryMutAct_9fa48('988') ? '' : (stryCov_9fa48('988'), 'lobby')))))
		)
			return;
		if (
			stryMutAct_9fa48('991')
				? false
				: stryMutAct_9fa48('990')
					? true
					: stryMutAct_9fa48('989')
						? config.isHost
						: (stryCov_9fa48('989', '990', '991'), !config.isHost)
		)
			return;
		const { startGame } = await import('$lib/room');
		await startGame(config.roomCode);
		const freshDeck = shuffled(SONG_DECK);
		const initialPlayers = get(players);
		const remaining = stryMutAct_9fa48('992')
			? freshDeck
			: (stryCov_9fa48('992'), freshDeck.slice(initialPlayers.length));
		drawPile.set(remaining);
		await updateGameState(
			config.roomCode,
			stryMutAct_9fa48('993')
				? {}
				: (stryCov_9fa48('993'),
					{
						drawPile: remaining,
						activeCard: stryMutAct_9fa48('994')
							? remaining[0] && null
							: (stryCov_9fa48('994'), remaining[0] ?? null),
						phase: stryMutAct_9fa48('995') ? '' : (stryCov_9fa48('995'), 'draw'),
						activePlayerId: stryMutAct_9fa48('996')
							? initialPlayers[0].id
							: (stryCov_9fa48('996'), initialPlayers[0]?.id),
					})
		);
	}
}
async function onPlay() {
	if (stryMutAct_9fa48('997')) {
		{
		}
	} else {
		stryCov_9fa48('997');
		phase.set(stryMutAct_9fa48('998') ? '' : (stryCov_9fa48('998'), 'listen'));
		const card = get(activeCard);
		if (
			stryMutAct_9fa48('1000')
				? false
				: stryMutAct_9fa48('999')
					? true
					: (stryCov_9fa48('999', '1000'), card)
		)
			void playPreview(card);
		if (
			stryMutAct_9fa48('1002')
				? false
				: stryMutAct_9fa48('1001')
					? true
					: (stryCov_9fa48('1001', '1002'), playTimer)
		)
			clearTimeout(playTimer);
		playTimer = setTimeout(() => {
			if (stryMutAct_9fa48('1003')) {
				{
				}
			} else {
				stryCov_9fa48('1003');
				if (
					stryMutAct_9fa48('1006')
						? get(phase) !== 'listen'
						: stryMutAct_9fa48('1005')
							? false
							: stryMutAct_9fa48('1004')
								? true
								: (stryCov_9fa48('1004', '1005', '1006'),
									get(phase) ===
										(stryMutAct_9fa48('1007') ? '' : (stryCov_9fa48('1007'), 'listen')))
				)
					phase.set(stryMutAct_9fa48('1008') ? '' : (stryCov_9fa48('1008'), 'place'));
			}
		}, 1400);
	}
}
async function onPlace(slot: number) {
	if (stryMutAct_9fa48('1009')) {
		{
		}
	} else {
		stryCov_9fa48('1009');
		if (
			stryMutAct_9fa48('1012')
				? get(phase) !== 'place' && !config
				: stryMutAct_9fa48('1011')
					? false
					: stryMutAct_9fa48('1010')
						? true
						: (stryCov_9fa48('1010', '1011', '1012'),
							(stryMutAct_9fa48('1014')
								? get(phase) === 'place'
								: stryMutAct_9fa48('1013')
									? false
									: (stryCov_9fa48('1013', '1014'),
										get(phase) !==
											(stryMutAct_9fa48('1015') ? '' : (stryCov_9fa48('1015'), 'place')))) ||
								(stryMutAct_9fa48('1016') ? config : (stryCov_9fa48('1016'), !config)))
		)
			return;
		const card = get(activeCard);
		if (
			stryMutAct_9fa48('1019')
				? false
				: stryMutAct_9fa48('1018')
					? true
					: stryMutAct_9fa48('1017')
						? card
						: (stryCov_9fa48('1017', '1018', '1019'), !card)
		)
			return;
		hoverSlot.set(slot);
		placedSlot.set(slot);
		const currentPlayers = get(players);
		const currentActiveId = get(activePlayerId);
		const active = currentPlayers.find(
			stryMutAct_9fa48('1020')
				? () => undefined
				: (stryCov_9fa48('1020'),
					(p) =>
						stryMutAct_9fa48('1023')
							? p.id !== currentActiveId
							: stryMutAct_9fa48('1022')
								? false
								: stryMutAct_9fa48('1021')
									? true
									: (stryCov_9fa48('1021', '1022', '1023'), p.id === currentActiveId))
		);
		if (
			stryMutAct_9fa48('1026')
				? false
				: stryMutAct_9fa48('1025')
					? true
					: stryMutAct_9fa48('1024')
						? active
						: (stryCov_9fa48('1024', '1025', '1026'), !active)
		)
			return;
		const ok = validatePlacement(active.timeline, card, slot);
		placedResult.set(ok);
		if (
			stryMutAct_9fa48('1028')
				? false
				: stryMutAct_9fa48('1027')
					? true
					: (stryCov_9fa48('1027', '1028'), ok)
		) {
			if (stryMutAct_9fa48('1029')) {
				{
				}
			} else {
				stryCov_9fa48('1029');
				const newTimeline = stryMutAct_9fa48('1030')
					? []
					: (stryCov_9fa48('1030'),
						[
							...(stryMutAct_9fa48('1031')
								? active.timeline
								: (stryCov_9fa48('1031'), active.timeline.slice(0, slot))),
							card,
							...(stryMutAct_9fa48('1032')
								? active.timeline
								: (stryCov_9fa48('1032'), active.timeline.slice(slot))),
						]);
				players.set(
					currentPlayers.map(
						stryMutAct_9fa48('1033')
							? () => undefined
							: (stryCov_9fa48('1033'),
								(p) =>
									(
										stryMutAct_9fa48('1036')
											? p.id !== currentActiveId
											: stryMutAct_9fa48('1035')
												? false
												: stryMutAct_9fa48('1034')
													? true
													: (stryCov_9fa48('1034', '1035', '1036'), p.id === currentActiveId)
									)
										? stryMutAct_9fa48('1037')
											? {}
											: (stryCov_9fa48('1037'),
												{
													...p,
													timeline: newTimeline,
												})
										: p)
					)
				);
				await placeCard(
					config.roomCode,
					currentActiveId,
					card.id,
					slot,
					stryMutAct_9fa48('1038') ? false : (stryCov_9fa48('1038'), true)
				);
				if (
					stryMutAct_9fa48('1042')
						? newTimeline.length < 10
						: stryMutAct_9fa48('1041')
							? newTimeline.length > 10
							: stryMutAct_9fa48('1040')
								? false
								: stryMutAct_9fa48('1039')
									? true
									: (stryCov_9fa48('1039', '1040', '1041', '1042'), newTimeline.length >= 10)
				) {
					if (stryMutAct_9fa48('1043')) {
						{
						}
					} else {
						stryCov_9fa48('1043');
						setTimeout(() => {
							if (stryMutAct_9fa48('1044')) {
								{
								}
							} else {
								stryCov_9fa48('1044');
								winner.set(
									currentPlayers.find(
										stryMutAct_9fa48('1045')
											? () => undefined
											: (stryCov_9fa48('1045'),
												(p) =>
													stryMutAct_9fa48('1048')
														? p.id !== currentActiveId
														: stryMutAct_9fa48('1047')
															? false
															: stryMutAct_9fa48('1046')
																? true
																: (stryCov_9fa48('1046', '1047', '1048'), p.id === currentActiveId))
									)!
								);
								screen.set(stryMutAct_9fa48('1049') ? '' : (stryCov_9fa48('1049'), 'win'));
							}
						}, 1200);
						return;
					}
				}
			}
		} else {
			if (stryMutAct_9fa48('1050')) {
				{
				}
			} else {
				stryCov_9fa48('1050');
				await placeCard(
					config.roomCode,
					currentActiveId,
					card.id,
					slot,
					stryMutAct_9fa48('1051') ? true : (stryCov_9fa48('1051'), false)
				);
			}
		}
		phase.set(stryMutAct_9fa48('1052') ? '' : (stryCov_9fa48('1052'), 'reveal'));
		stopPreview();
	}
}
async function onChallenge() {
	if (stryMutAct_9fa48('1053')) {
		{
		}
	} else {
		stryCov_9fa48('1053');
		if (
			stryMutAct_9fa48('1056')
				? get(phase) !== 'place' && !config
				: stryMutAct_9fa48('1055')
					? false
					: stryMutAct_9fa48('1054')
						? true
						: (stryCov_9fa48('1054', '1055', '1056'),
							(stryMutAct_9fa48('1058')
								? get(phase) === 'place'
								: stryMutAct_9fa48('1057')
									? false
									: (stryCov_9fa48('1057', '1058'),
										get(phase) !==
											(stryMutAct_9fa48('1059') ? '' : (stryCov_9fa48('1059'), 'place')))) ||
								(stryMutAct_9fa48('1060') ? config : (stryCov_9fa48('1060'), !config)))
		)
			return;
		const currentActiveId = get(activePlayerId);
		const meId = get(myPlayerId);
		if (
			stryMutAct_9fa48('1063')
				? currentActiveId !== meId
				: stryMutAct_9fa48('1062')
					? false
					: stryMutAct_9fa48('1061')
						? true
						: (stryCov_9fa48('1061', '1062', '1063'), currentActiveId === meId)
		)
			return;
		const currentPlayers = get(players);
		const card = get(activeCard);
		const me = currentPlayers.find(
			stryMutAct_9fa48('1064')
				? () => undefined
				: (stryCov_9fa48('1064'),
					(p) =>
						stryMutAct_9fa48('1067')
							? p.id !== meId
							: stryMutAct_9fa48('1066')
								? false
								: stryMutAct_9fa48('1065')
									? true
									: (stryCov_9fa48('1065', '1066', '1067'), p.id === meId))
		);
		if (
			stryMutAct_9fa48('1070')
				? (!me || me.tokens <= 0) && !card
				: stryMutAct_9fa48('1069')
					? false
					: stryMutAct_9fa48('1068')
						? true
						: (stryCov_9fa48('1068', '1069', '1070'),
							(stryMutAct_9fa48('1072')
								? !me && me.tokens <= 0
								: stryMutAct_9fa48('1071')
									? false
									: (stryCov_9fa48('1071', '1072'),
										(stryMutAct_9fa48('1073') ? me : (stryCov_9fa48('1073'), !me)) ||
											(stryMutAct_9fa48('1076')
												? me.tokens > 0
												: stryMutAct_9fa48('1075')
													? me.tokens < 0
													: stryMutAct_9fa48('1074')
														? false
														: (stryCov_9fa48('1074', '1075', '1076'), me.tokens <= 0)))) ||
								(stryMutAct_9fa48('1077') ? card : (stryCov_9fa48('1077'), !card)))
		)
			return;
		await useToken(config.roomCode, meId);
		players.set(
			currentPlayers.map(
				stryMutAct_9fa48('1078')
					? () => undefined
					: (stryCov_9fa48('1078'),
						(p) =>
							(
								stryMutAct_9fa48('1081')
									? p.id !== meId
									: stryMutAct_9fa48('1080')
										? false
										: stryMutAct_9fa48('1079')
											? true
											: (stryCov_9fa48('1079', '1080', '1081'), p.id === meId)
							)
								? stryMutAct_9fa48('1082')
									? {}
									: (stryCov_9fa48('1082'),
										{
											...p,
											tokens: stryMutAct_9fa48('1083')
												? p.tokens + 1
												: (stryCov_9fa48('1083'), p.tokens - 1),
										})
								: p)
			)
		);
		interceptor.set(meId);
		phase.set(stryMutAct_9fa48('1084') ? '' : (stryCov_9fa48('1084'), 'challenge'));
		setTimeout(() => {
			if (stryMutAct_9fa48('1085')) {
				{
				}
			} else {
				stryCov_9fa48('1085');
				const correctSlotVal = findCorrectSlot(me.timeline, card);
				placedSlot.set(correctSlotVal);
				placedResult.set(stryMutAct_9fa48('1086') ? false : (stryCov_9fa48('1086'), true));
				const newTimeline = stryMutAct_9fa48('1087')
					? []
					: (stryCov_9fa48('1087'),
						[
							...(stryMutAct_9fa48('1088')
								? me.timeline
								: (stryCov_9fa48('1088'), me.timeline.slice(0, correctSlotVal))),
							card,
							...(stryMutAct_9fa48('1089')
								? me.timeline
								: (stryCov_9fa48('1089'), me.timeline.slice(correctSlotVal))),
						]);
				const updatedPlayers = get(players).map(
					stryMutAct_9fa48('1090')
						? () => undefined
						: (stryCov_9fa48('1090'),
							(p) =>
								(
									stryMutAct_9fa48('1093')
										? p.id !== meId
										: stryMutAct_9fa48('1092')
											? false
											: stryMutAct_9fa48('1091')
												? true
												: (stryCov_9fa48('1091', '1092', '1093'), p.id === meId)
								)
									? stryMutAct_9fa48('1094')
										? {}
										: (stryCov_9fa48('1094'),
											{
												...p,
												timeline: newTimeline,
											})
									: p)
				);
				players.set(updatedPlayers);
				if (
					stryMutAct_9fa48('1098')
						? newTimeline.length < 10
						: stryMutAct_9fa48('1097')
							? newTimeline.length > 10
							: stryMutAct_9fa48('1096')
								? false
								: stryMutAct_9fa48('1095')
									? true
									: (stryCov_9fa48('1095', '1096', '1097', '1098'), newTimeline.length >= 10)
				) {
					if (stryMutAct_9fa48('1099')) {
						{
						}
					} else {
						stryCov_9fa48('1099');
						setTimeout(() => {
							if (stryMutAct_9fa48('1100')) {
								{
								}
							} else {
								stryCov_9fa48('1100');
								winner.set(
									updatedPlayers.find(
										stryMutAct_9fa48('1101')
											? () => undefined
											: (stryCov_9fa48('1101'),
												(p) =>
													stryMutAct_9fa48('1104')
														? p.id !== meId
														: stryMutAct_9fa48('1103')
															? false
															: stryMutAct_9fa48('1102')
																? true
																: (stryCov_9fa48('1102', '1103', '1104'), p.id === meId))
									)!
								);
								screen.set(stryMutAct_9fa48('1105') ? '' : (stryCov_9fa48('1105'), 'win'));
							}
						}, 1200);
						return;
					}
				}
				phase.set(stryMutAct_9fa48('1106') ? '' : (stryCov_9fa48('1106'), 'reveal'));
				stopPreview();
			}
		}, 1600);
	}
}
async function onNextTurn() {
	if (stryMutAct_9fa48('1107')) {
		{
		}
	} else {
		stryCov_9fa48('1107');
		if (
			stryMutAct_9fa48('1110')
				? false
				: stryMutAct_9fa48('1109')
					? true
					: stryMutAct_9fa48('1108')
						? config
						: (stryCov_9fa48('1108', '1109', '1110'), !config)
		)
			return;
		const currentPlayers = get(players);
		const currentActiveId = get(activePlayerId);
		const ids = currentPlayers.map(
			stryMutAct_9fa48('1111') ? () => undefined : (stryCov_9fa48('1111'), (p) => p.id)
		);
		const idx = ids.indexOf(currentActiveId);
		const nextId =
			ids[
				stryMutAct_9fa48('1112')
					? (idx + 1) * ids.length
					: (stryCov_9fa48('1112'),
						(stryMutAct_9fa48('1113') ? idx - 1 : (stryCov_9fa48('1113'), idx + 1)) % ids.length)
			];
		const newRound = stryMutAct_9fa48('1114')
			? get(round) - (nextId === ids[0] ? 1 : 0)
			: (stryCov_9fa48('1114'),
				get(round) +
					((
						stryMutAct_9fa48('1117')
							? nextId !== ids[0]
							: stryMutAct_9fa48('1116')
								? false
								: stryMutAct_9fa48('1115')
									? true
									: (stryCov_9fa48('1115', '1116', '1117'), nextId === ids[0])
					)
						? 1
						: 0));
		const pile = get(drawPile);
		const nextCard = (
			stryMutAct_9fa48('1121')
				? pile.length <= 0
				: stryMutAct_9fa48('1120')
					? pile.length >= 0
					: stryMutAct_9fa48('1119')
						? false
						: stryMutAct_9fa48('1118')
							? true
							: (stryCov_9fa48('1118', '1119', '1120', '1121'), pile.length > 0)
		)
			? pile[0]
			: null;
		const restPile = stryMutAct_9fa48('1122') ? pile : (stryCov_9fa48('1122'), pile.slice(1));
		await updateGameState(
			config.roomCode,
			stryMutAct_9fa48('1123')
				? {}
				: (stryCov_9fa48('1123'),
					{
						activePlayerId: nextId,
						round: newRound,
						phase: stryMutAct_9fa48('1124') ? '' : (stryCov_9fa48('1124'), 'draw'),
						activeCard: nextCard,
						drawPile: restPile,
					})
		);
		activePlayerId.set(nextId);
		round.set(newRound);
		drawPile.set(restPile);
		activeCard.set(nextCard);
		phase.set(stryMutAct_9fa48('1125') ? '' : (stryCov_9fa48('1125'), 'draw'));
		hoverSlot.set(null);
		placedSlot.set(null);
		placedResult.set(null);
		interceptor.set(null);
	}
}
function onReplay() {
	if (stryMutAct_9fa48('1126')) {
		{
		}
	} else {
		stryCov_9fa48('1126');
		stopPreview();
		clearTimers();
		players.set(stryMutAct_9fa48('1127') ? ['Stryker was here'] : (stryCov_9fa48('1127'), []));
		drawPile.set(stryMutAct_9fa48('1128') ? ['Stryker was here'] : (stryCov_9fa48('1128'), []));
		activeCard.set(null);
		phase.set(stryMutAct_9fa48('1129') ? '' : (stryCov_9fa48('1129'), 'draw'));
		hoverSlot.set(null);
		placedSlot.set(null);
		placedResult.set(null);
		interceptor.set(null);
		winner.set(null);
		activePlayerId.set(
			stryMutAct_9fa48('1130') ? 'Stryker was here!' : (stryCov_9fa48('1130'), '')
		);
		round.set(1);
		screen.set(stryMutAct_9fa48('1131') ? '' : (stryCov_9fa48('1131'), 'lobby'));
	}
}
function runAiTurn(): (() => void) | undefined {
	if (stryMutAct_9fa48('1132')) {
		{
		}
	} else {
		stryCov_9fa48('1132');
		if (
			stryMutAct_9fa48('1135')
				? false
				: stryMutAct_9fa48('1134')
					? true
					: stryMutAct_9fa48('1133')
						? config
						: (stryCov_9fa48('1133', '1134', '1135'), !config)
		)
			return undefined;
		if (
			stryMutAct_9fa48('1138')
				? get(screen) === 'play'
				: stryMutAct_9fa48('1137')
					? false
					: stryMutAct_9fa48('1136')
						? true
						: (stryCov_9fa48('1136', '1137', '1138'),
							get(screen) !== (stryMutAct_9fa48('1139') ? '' : (stryCov_9fa48('1139'), 'play')))
		)
			return undefined;
		const meId = get(myPlayerId);
		if (
			stryMutAct_9fa48('1142')
				? get(activePlayerId) !== meId
				: stryMutAct_9fa48('1141')
					? false
					: stryMutAct_9fa48('1140')
						? true
						: (stryCov_9fa48('1140', '1141', '1142'), get(activePlayerId) === meId)
		)
			return undefined;
		if (
			stryMutAct_9fa48('1145')
				? get(phase) === 'draw'
				: stryMutAct_9fa48('1144')
					? false
					: stryMutAct_9fa48('1143')
						? true
						: (stryCov_9fa48('1143', '1144', '1145'),
							get(phase) !== (stryMutAct_9fa48('1146') ? '' : (stryCov_9fa48('1146'), 'draw')))
		)
			return undefined;
		clearTimers();
		const t1 = setTimeout(
			stryMutAct_9fa48('1147')
				? () => undefined
				: (stryCov_9fa48('1147'),
					() => phase.set(stryMutAct_9fa48('1148') ? '' : (stryCov_9fa48('1148'), 'listen'))),
			700
		);
		aiTimers.push(t1);
		const t2 = setTimeout(
			stryMutAct_9fa48('1149')
				? () => undefined
				: (stryCov_9fa48('1149'),
					() => phase.set(stryMutAct_9fa48('1150') ? '' : (stryCov_9fa48('1150'), 'place'))),
			1800
		);
		aiTimers.push(t2);
		const t3 = setTimeout(async () => {
			if (stryMutAct_9fa48('1151')) {
				{
				}
			} else {
				stryCov_9fa48('1151');
				const currentPlayers = get(players);
				const card = get(activeCard);
				const activeId = get(activePlayerId);
				const active = currentPlayers.find(
					stryMutAct_9fa48('1152')
						? () => undefined
						: (stryCov_9fa48('1152'),
							(p) =>
								stryMutAct_9fa48('1155')
									? p.id !== activeId
									: stryMutAct_9fa48('1154')
										? false
										: stryMutAct_9fa48('1153')
											? true
											: (stryCov_9fa48('1153', '1154', '1155'), p.id === activeId))
				);
				if (
					stryMutAct_9fa48('1158')
						? (!active || !card) && !config
						: stryMutAct_9fa48('1157')
							? false
							: stryMutAct_9fa48('1156')
								? true
								: (stryCov_9fa48('1156', '1157', '1158'),
									(stryMutAct_9fa48('1160')
										? !active && !card
										: stryMutAct_9fa48('1159')
											? false
											: (stryCov_9fa48('1159', '1160'),
												(stryMutAct_9fa48('1161') ? active : (stryCov_9fa48('1161'), !active)) ||
													(stryMutAct_9fa48('1162') ? card : (stryCov_9fa48('1162'), !card)))) ||
										(stryMutAct_9fa48('1163') ? config : (stryCov_9fa48('1163'), !config)))
				)
					return;
				const correct = findCorrectSlot(active.timeline, card);
				const rightful = (
					stryMutAct_9fa48('1167')
						? correct < 0
						: stryMutAct_9fa48('1166')
							? correct > 0
							: stryMutAct_9fa48('1165')
								? false
								: stryMutAct_9fa48('1164')
									? true
									: (stryCov_9fa48('1164', '1165', '1166', '1167'), correct >= 0)
				)
					? correct
					: 0;
				const rand = Math.random();
				const slot = (
					stryMutAct_9fa48('1171')
						? rand <= 0.4
						: stryMutAct_9fa48('1170')
							? rand >= 0.4
							: stryMutAct_9fa48('1169')
								? false
								: stryMutAct_9fa48('1168')
									? true
									: (stryCov_9fa48('1168', '1169', '1170', '1171'), rand > 0.4)
				)
					? rightful
					: Math.floor(
							stryMutAct_9fa48('1172')
								? Math.random() / (active.timeline.length + 1)
								: (stryCov_9fa48('1172'),
									Math.random() *
										(stryMutAct_9fa48('1173')
											? active.timeline.length - 1
											: (stryCov_9fa48('1173'), active.timeline.length + 1)))
						);
				const ok = validatePlacement(active.timeline, card, slot);
				placedSlot.set(slot);
				placedResult.set(ok);
				if (
					stryMutAct_9fa48('1175')
						? false
						: stryMutAct_9fa48('1174')
							? true
							: (stryCov_9fa48('1174', '1175'), ok)
				) {
					if (stryMutAct_9fa48('1176')) {
						{
						}
					} else {
						stryCov_9fa48('1176');
						const newTimeline = stryMutAct_9fa48('1177')
							? []
							: (stryCov_9fa48('1177'),
								[
									...(stryMutAct_9fa48('1178')
										? active.timeline
										: (stryCov_9fa48('1178'), active.timeline.slice(0, slot))),
									card,
									...(stryMutAct_9fa48('1179')
										? active.timeline
										: (stryCov_9fa48('1179'), active.timeline.slice(slot))),
								]);
						players.update(
							stryMutAct_9fa48('1180')
								? () => undefined
								: (stryCov_9fa48('1180'),
									(prev) =>
										prev.map((p) => {
											if (stryMutAct_9fa48('1181')) {
												{
												}
											} else {
												stryCov_9fa48('1181');
												if (
													stryMutAct_9fa48('1184')
														? p.id === activeId
														: stryMutAct_9fa48('1183')
															? false
															: stryMutAct_9fa48('1182')
																? true
																: (stryCov_9fa48('1182', '1183', '1184'), p.id !== activeId)
												)
													return p;
												return stryMutAct_9fa48('1185')
													? {}
													: (stryCov_9fa48('1185'),
														{
															...p,
															timeline: newTimeline,
														});
											}
										}))
						);
						await placeCard(
							config.roomCode,
							activeId,
							card.id,
							slot,
							stryMutAct_9fa48('1186') ? false : (stryCov_9fa48('1186'), true)
						);
						if (
							stryMutAct_9fa48('1190')
								? newTimeline.length < 10
								: stryMutAct_9fa48('1189')
									? newTimeline.length > 10
									: stryMutAct_9fa48('1188')
										? false
										: stryMutAct_9fa48('1187')
											? true
											: (stryCov_9fa48('1187', '1188', '1189', '1190'), newTimeline.length >= 10)
						) {
							if (stryMutAct_9fa48('1191')) {
								{
								}
							} else {
								stryCov_9fa48('1191');
								setTimeout(() => {
									if (stryMutAct_9fa48('1192')) {
										{
										}
									} else {
										stryCov_9fa48('1192');
										winner.set(
											stryMutAct_9fa48('1193')
												? {}
												: (stryCov_9fa48('1193'),
													{
														...active,
														timeline: newTimeline,
													})
										);
										screen.set(stryMutAct_9fa48('1194') ? '' : (stryCov_9fa48('1194'), 'win'));
									}
								}, 1200);
								return;
							}
						}
					}
				} else {
					if (stryMutAct_9fa48('1195')) {
						{
						}
					} else {
						stryCov_9fa48('1195');
						await placeCard(
							config.roomCode,
							activeId,
							card.id,
							slot,
							stryMutAct_9fa48('1196') ? true : (stryCov_9fa48('1196'), false)
						);
					}
				}
				phase.set(stryMutAct_9fa48('1197') ? '' : (stryCov_9fa48('1197'), 'reveal'));
				stopPreview();
			}
		}, 3200);
		aiTimers.push(t3);
		return stryMutAct_9fa48('1198')
			? () => undefined
			: (stryCov_9fa48('1198'), () => clearTimers());
	}
}
export const remoteGame = stryMutAct_9fa48('1199')
	? {}
	: (stryCov_9fa48('1199'),
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
			connected,
			roomCode,
			myPlayerId,
			isHost,
			connectRemoteGame,
			disconnectRemoteGame,
			startGame,
			onPlay,
			onPlace,
			onChallenge,
			onNextTurn,
			onReplay,
			runAiTurn,
		});
