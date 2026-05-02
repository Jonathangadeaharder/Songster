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
import { supabase } from '$lib/supabase';
import type { Song } from '$lib/types';
export interface Room {
	id: string;
	code: string;
	host_id: string;
	status: 'waiting' | 'playing' | 'finished';
	winner_player_id: string | null;
	created_at: string;
	started_at: string | null;
}
export interface RoomPlayer {
	id: string;
	room_id: string;
	user_id: string;
	name: string;
	avatar: string;
	tokens: number;
	is_host: boolean;
	joined_at: string;
}
export interface GameStateRow {
	id: string;
	room_id: string;
	round: number;
	phase: string;
	active_player_id: string | null;
	draw_pile: Song[];
	active_card: Song | null;
	updated_at: string;
}
export interface TimelineRow {
	id: string;
	player_id: string;
	song_id: string;
	position: number;
}
const AVATARS = stryMutAct_9fa48('460')
	? []
	: (stryCov_9fa48('460'),
		[
			stryMutAct_9fa48('461') ? '' : (stryCov_9fa48('461'), '♪'),
			stryMutAct_9fa48('462') ? '' : (stryCov_9fa48('462'), '♫'),
			stryMutAct_9fa48('463') ? '' : (stryCov_9fa48('463'), '♬'),
			stryMutAct_9fa48('464') ? '' : (stryCov_9fa48('464'), '♭'),
			stryMutAct_9fa48('465') ? '' : (stryCov_9fa48('465'), '♮'),
			stryMutAct_9fa48('466') ? '' : (stryCov_9fa48('466'), '♯'),
			stryMutAct_9fa48('467') ? '' : (stryCov_9fa48('467'), '𝄞'),
			stryMutAct_9fa48('468') ? '' : (stryCov_9fa48('468'), '𝄢'),
		]);
function pickAvatar(index: number): string {
	if (stryMutAct_9fa48('469')) {
		{
		}
	} else {
		stryCov_9fa48('469');
		return AVATARS[
			stryMutAct_9fa48('470')
				? index * AVATARS.length
				: (stryCov_9fa48('470'), index % AVATARS.length)
		];
	}
}
export async function createRoom(hostName: string): Promise<Room> {
	if (stryMutAct_9fa48('471')) {
		{
		}
	} else {
		stryCov_9fa48('471');
		const { data, error } = await supabase.rpc(
			stryMutAct_9fa48('472') ? '' : (stryCov_9fa48('472'), 'create_room'),
			stryMutAct_9fa48('473')
				? {}
				: (stryCov_9fa48('473'),
					{
						host_name: hostName,
					})
		);
		if (
			stryMutAct_9fa48('475')
				? false
				: stryMutAct_9fa48('474')
					? true
					: (stryCov_9fa48('474', '475'), error)
		)
			throw error;
		return data as Room;
	}
}
export async function joinRoom(roomCode: string, playerName: string): Promise<RoomPlayer> {
	if (stryMutAct_9fa48('476')) {
		{
		}
	} else {
		stryCov_9fa48('476');
		const { data, error } = await supabase.rpc(
			stryMutAct_9fa48('477') ? '' : (stryCov_9fa48('477'), 'join_room'),
			stryMutAct_9fa48('478')
				? {}
				: (stryCov_9fa48('478'),
					{
						room_code: roomCode,
						player_name: playerName,
					})
		);
		if (
			stryMutAct_9fa48('480')
				? false
				: stryMutAct_9fa48('479')
					? true
					: (stryCov_9fa48('479', '480'), error)
		)
			throw error;
		return data as RoomPlayer;
	}
}
export async function getRoomPlayers(roomId: string): Promise<RoomPlayer[]> {
	if (stryMutAct_9fa48('481')) {
		{
		}
	} else {
		stryCov_9fa48('481');
		const { data, error } = await supabase
			.from(stryMutAct_9fa48('482') ? '' : (stryCov_9fa48('482'), 'players'))
			.select(stryMutAct_9fa48('483') ? '' : (stryCov_9fa48('483'), '*'))
			.eq(stryMutAct_9fa48('484') ? '' : (stryCov_9fa48('484'), 'room_id'), roomId)
			.order(
				stryMutAct_9fa48('485') ? '' : (stryCov_9fa48('485'), 'joined_at'),
				stryMutAct_9fa48('486')
					? {}
					: (stryCov_9fa48('486'),
						{
							ascending: stryMutAct_9fa48('487') ? false : (stryCov_9fa48('487'), true),
						})
			);
		if (
			stryMutAct_9fa48('489')
				? false
				: stryMutAct_9fa48('488')
					? true
					: (stryCov_9fa48('488', '489'), error)
		)
			throw error;
		return (data ?? []) as RoomPlayer[];
	}
}
export async function getRoomByCode(code: string): Promise<Room | null> {
	if (stryMutAct_9fa48('490')) {
		{
		}
	} else {
		stryCov_9fa48('490');
		const { data, error } = await supabase
			.from(stryMutAct_9fa48('491') ? '' : (stryCov_9fa48('491'), 'rooms'))
			.select(stryMutAct_9fa48('492') ? '' : (stryCov_9fa48('492'), '*'))
			.eq(stryMutAct_9fa48('493') ? '' : (stryCov_9fa48('493'), 'code'), code)
			.single();
		if (
			stryMutAct_9fa48('495')
				? false
				: stryMutAct_9fa48('494')
					? true
					: (stryCov_9fa48('494', '495'), error)
		) {
			if (stryMutAct_9fa48('496')) {
				{
				}
			} else {
				stryCov_9fa48('496');
				if (
					stryMutAct_9fa48('499')
						? error.code !== 'PGRST116'
						: stryMutAct_9fa48('498')
							? false
							: stryMutAct_9fa48('497')
								? true
								: (stryCov_9fa48('497', '498', '499'),
									error.code ===
										(stryMutAct_9fa48('500') ? '' : (stryCov_9fa48('500'), 'PGRST116')))
				)
					return null;
				throw error;
			}
		}
		return data as Room;
	}
}
export async function startGame(roomCode: string): Promise<void> {
	if (stryMutAct_9fa48('501')) {
		{
		}
	} else {
		stryCov_9fa48('501');
		const { error } = await supabase.rpc(
			stryMutAct_9fa48('502') ? '' : (stryCov_9fa48('502'), 'start_game'),
			stryMutAct_9fa48('503')
				? {}
				: (stryCov_9fa48('503'),
					{
						p_room_code: roomCode,
					})
		);
		if (
			stryMutAct_9fa48('505')
				? false
				: stryMutAct_9fa48('504')
					? true
					: (stryCov_9fa48('504', '505'), error)
		)
			throw error;
	}
}
export async function getGameState(roomId: string): Promise<GameStateRow | null> {
	if (stryMutAct_9fa48('506')) {
		{
		}
	} else {
		stryCov_9fa48('506');
		const { data, error } = await supabase
			.from(stryMutAct_9fa48('507') ? '' : (stryCov_9fa48('507'), 'game_state'))
			.select(stryMutAct_9fa48('508') ? '' : (stryCov_9fa48('508'), '*'))
			.eq(stryMutAct_9fa48('509') ? '' : (stryCov_9fa48('509'), 'room_id'), roomId)
			.single();
		if (
			stryMutAct_9fa48('511')
				? false
				: stryMutAct_9fa48('510')
					? true
					: (stryCov_9fa48('510', '511'), error)
		) {
			if (stryMutAct_9fa48('512')) {
				{
				}
			} else {
				stryCov_9fa48('512');
				if (
					stryMutAct_9fa48('515')
						? error.code !== 'PGRST116'
						: stryMutAct_9fa48('514')
							? false
							: stryMutAct_9fa48('513')
								? true
								: (stryCov_9fa48('513', '514', '515'),
									error.code ===
										(stryMutAct_9fa48('516') ? '' : (stryCov_9fa48('516'), 'PGRST116')))
				)
					return null;
				throw error;
			}
		}
		return data as GameStateRow;
	}
}
export async function getPlayerTimelines(roomId: string): Promise<TimelineRow[]> {
	if (stryMutAct_9fa48('517')) {
		{
		}
	} else {
		stryCov_9fa48('517');
		const { data, error } = await supabase
			.from(stryMutAct_9fa48('518') ? '' : (stryCov_9fa48('518'), 'timelines'))
			.select(stryMutAct_9fa48('519') ? '' : (stryCov_9fa48('519'), '*, players!inner(room_id)'))
			.eq(stryMutAct_9fa48('520') ? '' : (stryCov_9fa48('520'), 'players.room_id'), roomId)
			.order(
				stryMutAct_9fa48('521') ? '' : (stryCov_9fa48('521'), 'position'),
				stryMutAct_9fa48('522')
					? {}
					: (stryCov_9fa48('522'),
						{
							ascending: stryMutAct_9fa48('523') ? false : (stryCov_9fa48('523'), true),
						})
			);
		if (
			stryMutAct_9fa48('525')
				? false
				: stryMutAct_9fa48('524')
					? true
					: (stryCov_9fa48('524', '525'), error)
		)
			throw error;
		return (data ?? []) as TimelineRow[];
	}
}
export async function updateGameState(
	roomCode: string,
	updates: {
		phase?: string;
		activePlayerId?: string;
		drawPile?: Song[];
		activeCard?: Song | null;
		round?: number;
	}
): Promise<void> {
	if (stryMutAct_9fa48('526')) {
		{
		}
	} else {
		stryCov_9fa48('526');
		const params: Record<string, unknown> = stryMutAct_9fa48('527')
			? {}
			: (stryCov_9fa48('527'),
				{
					p_room_code: roomCode,
				});
		if (
			stryMutAct_9fa48('530')
				? updates.phase === undefined
				: stryMutAct_9fa48('529')
					? false
					: stryMutAct_9fa48('528')
						? true
						: (stryCov_9fa48('528', '529', '530'), updates.phase !== undefined)
		)
			params.p_phase = updates.phase;
		if (
			stryMutAct_9fa48('533')
				? updates.activePlayerId === undefined
				: stryMutAct_9fa48('532')
					? false
					: stryMutAct_9fa48('531')
						? true
						: (stryCov_9fa48('531', '532', '533'), updates.activePlayerId !== undefined)
		)
			params.p_active_player_id = updates.activePlayerId;
		if (
			stryMutAct_9fa48('536')
				? updates.drawPile === undefined
				: stryMutAct_9fa48('535')
					? false
					: stryMutAct_9fa48('534')
						? true
						: (stryCov_9fa48('534', '535', '536'), updates.drawPile !== undefined)
		)
			params.p_draw_pile = updates.drawPile;
		if (
			stryMutAct_9fa48('539')
				? updates.activeCard === undefined
				: stryMutAct_9fa48('538')
					? false
					: stryMutAct_9fa48('537')
						? true
						: (stryCov_9fa48('537', '538', '539'), updates.activeCard !== undefined)
		)
			params.p_active_card = stryMutAct_9fa48('540')
				? updates.activeCard && null
				: (stryCov_9fa48('540'), updates.activeCard ?? null);
		if (
			stryMutAct_9fa48('543')
				? updates.round === undefined
				: stryMutAct_9fa48('542')
					? false
					: stryMutAct_9fa48('541')
						? true
						: (stryCov_9fa48('541', '542', '543'), updates.round !== undefined)
		)
			params.p_round = updates.round;
		const { error } = await supabase.rpc(
			stryMutAct_9fa48('544') ? '' : (stryCov_9fa48('544'), 'update_game_state'),
			params
		);
		if (
			stryMutAct_9fa48('546')
				? false
				: stryMutAct_9fa48('545')
					? true
					: (stryCov_9fa48('545', '546'), error)
		)
			throw error;
	}
}
export async function placeCard(
	roomCode: string,
	playerId: string,
	songId: string,
	position: number,
	correct: boolean
): Promise<void> {
	if (stryMutAct_9fa48('547')) {
		{
		}
	} else {
		stryCov_9fa48('547');
		const { error } = await supabase.rpc(
			stryMutAct_9fa48('548') ? '' : (stryCov_9fa48('548'), 'place_card'),
			stryMutAct_9fa48('549')
				? {}
				: (stryCov_9fa48('549'),
					{
						p_room_code: roomCode,
						p_player_id: playerId,
						p_song_id: songId,
						p_position: position,
						p_correct: correct,
					})
		);
		if (
			stryMutAct_9fa48('551')
				? false
				: stryMutAct_9fa48('550')
					? true
					: (stryCov_9fa48('550', '551'), error)
		)
			throw error;
	}
}
export async function useToken(roomCode: string, playerId: string): Promise<void> {
	if (stryMutAct_9fa48('552')) {
		{
		}
	} else {
		stryCov_9fa48('552');
		const { error } = await supabase.rpc(
			stryMutAct_9fa48('553') ? '' : (stryCov_9fa48('553'), 'use_token'),
			stryMutAct_9fa48('554')
				? {}
				: (stryCov_9fa48('554'),
					{
						p_room_code: roomCode,
						p_player_id: playerId,
					})
		);
		if (
			stryMutAct_9fa48('556')
				? false
				: stryMutAct_9fa48('555')
					? true
					: (stryCov_9fa48('555', '556'), error)
		)
			throw error;
	}
}
export async function getCurrentPlayer(): Promise<{
	playerId: string;
	userId: string;
} | null> {
	if (stryMutAct_9fa48('557')) {
		{
		}
	} else {
		stryCov_9fa48('557');
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (
			stryMutAct_9fa48('560')
				? false
				: stryMutAct_9fa48('559')
					? true
					: stryMutAct_9fa48('558')
						? user
						: (stryCov_9fa48('558', '559', '560'), !user)
		)
			return null;
		const { data, error } = await supabase
			.from(stryMutAct_9fa48('561') ? '' : (stryCov_9fa48('561'), 'players'))
			.select(stryMutAct_9fa48('562') ? '' : (stryCov_9fa48('562'), 'id, user_id'))
			.eq(stryMutAct_9fa48('563') ? '' : (stryCov_9fa48('563'), 'user_id'), user.id)
			.order(
				stryMutAct_9fa48('564') ? '' : (stryCov_9fa48('564'), 'joined_at'),
				stryMutAct_9fa48('565')
					? {}
					: (stryCov_9fa48('565'),
						{
							ascending: stryMutAct_9fa48('566') ? true : (stryCov_9fa48('566'), false),
						})
			)
			.limit(1)
			.maybeSingle();
		if (
			stryMutAct_9fa48('569')
				? error && !data
				: stryMutAct_9fa48('568')
					? false
					: stryMutAct_9fa48('567')
						? true
						: (stryCov_9fa48('567', '568', '569'),
							error || (stryMutAct_9fa48('570') ? data : (stryCov_9fa48('570'), !data)))
		)
			return null;
		return stryMutAct_9fa48('571')
			? {}
			: (stryCov_9fa48('571'),
				{
					playerId: data.id,
					userId: data.user_id,
				});
	}
}
export async function getCurrentPlayerInRoom(roomId: string): Promise<{
	playerId: string;
	userId: string;
} | null> {
	if (stryMutAct_9fa48('572')) {
		{
		}
	} else {
		stryCov_9fa48('572');
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (
			stryMutAct_9fa48('575')
				? false
				: stryMutAct_9fa48('574')
					? true
					: stryMutAct_9fa48('573')
						? user
						: (stryCov_9fa48('573', '574', '575'), !user)
		)
			return null;
		const { data, error } = await supabase
			.from(stryMutAct_9fa48('576') ? '' : (stryCov_9fa48('576'), 'players'))
			.select(stryMutAct_9fa48('577') ? '' : (stryCov_9fa48('577'), 'id, user_id'))
			.eq(stryMutAct_9fa48('578') ? '' : (stryCov_9fa48('578'), 'user_id'), user.id)
			.eq(stryMutAct_9fa48('579') ? '' : (stryCov_9fa48('579'), 'room_id'), roomId)
			.maybeSingle();
		if (
			stryMutAct_9fa48('582')
				? error && !data
				: stryMutAct_9fa48('581')
					? false
					: stryMutAct_9fa48('580')
						? true
						: (stryCov_9fa48('580', '581', '582'),
							error || (stryMutAct_9fa48('583') ? data : (stryCov_9fa48('583'), !data)))
		)
			return null;
		return stryMutAct_9fa48('584')
			? {}
			: (stryCov_9fa48('584'),
				{
					playerId: data.id,
					userId: data.user_id,
				});
	}
}
export function subscribeToRoom(
	roomId: string,
	onChange: (payload: { event: string; table: string; new: Record<string, unknown> }) => void
) {
	if (stryMutAct_9fa48('585')) {
		{
		}
	} else {
		stryCov_9fa48('585');
		return supabase
			.channel(stryMutAct_9fa48('586') ? `` : (stryCov_9fa48('586'), `room:${roomId}`))
			.on(
				stryMutAct_9fa48('587') ? '' : (stryCov_9fa48('587'), 'postgres_changes'),
				stryMutAct_9fa48('588')
					? {}
					: (stryCov_9fa48('588'),
						{
							event: stryMutAct_9fa48('589') ? '' : (stryCov_9fa48('589'), '*'),
							schema: stryMutAct_9fa48('590') ? '' : (stryCov_9fa48('590'), 'public'),
							table: stryMutAct_9fa48('591') ? '' : (stryCov_9fa48('591'), 'game_state'),
							filter: stryMutAct_9fa48('592') ? `` : (stryCov_9fa48('592'), `room_id=eq.${roomId}`),
						}),
				(payload) => {
					if (stryMutAct_9fa48('593')) {
						{
						}
					} else {
						stryCov_9fa48('593');
						onChange(
							stryMutAct_9fa48('594')
								? {}
								: (stryCov_9fa48('594'),
									{
										event: payload.eventType,
										table: stryMutAct_9fa48('595') ? '' : (stryCov_9fa48('595'), 'game_state'),
										new: payload.new as Record<string, unknown>,
									})
						);
					}
				}
			)
			.on(
				stryMutAct_9fa48('596') ? '' : (stryCov_9fa48('596'), 'postgres_changes'),
				stryMutAct_9fa48('597')
					? {}
					: (stryCov_9fa48('597'),
						{
							event: stryMutAct_9fa48('598') ? '' : (stryCov_9fa48('598'), '*'),
							schema: stryMutAct_9fa48('599') ? '' : (stryCov_9fa48('599'), 'public'),
							table: stryMutAct_9fa48('600') ? '' : (stryCov_9fa48('600'), 'players'),
							filter: stryMutAct_9fa48('601') ? `` : (stryCov_9fa48('601'), `room_id=eq.${roomId}`),
						}),
				(payload) => {
					if (stryMutAct_9fa48('602')) {
						{
						}
					} else {
						stryCov_9fa48('602');
						onChange(
							stryMutAct_9fa48('603')
								? {}
								: (stryCov_9fa48('603'),
									{
										event: payload.eventType,
										table: stryMutAct_9fa48('604') ? '' : (stryCov_9fa48('604'), 'players'),
										new: payload.new as Record<string, unknown>,
									})
						);
					}
				}
			)
			.on(
				stryMutAct_9fa48('605') ? '' : (stryCov_9fa48('605'), 'postgres_changes'),
				stryMutAct_9fa48('606')
					? {}
					: (stryCov_9fa48('606'),
						{
							event: stryMutAct_9fa48('607') ? '' : (stryCov_9fa48('607'), '*'),
							schema: stryMutAct_9fa48('608') ? '' : (stryCov_9fa48('608'), 'public'),
							table: stryMutAct_9fa48('609') ? '' : (stryCov_9fa48('609'), 'timelines'),
							filter: stryMutAct_9fa48('610') ? `` : (stryCov_9fa48('610'), `room_id=eq.${roomId}`),
						}),
				(payload) => {
					if (stryMutAct_9fa48('611')) {
						{
						}
					} else {
						stryCov_9fa48('611');
						onChange(
							stryMutAct_9fa48('612')
								? {}
								: (stryCov_9fa48('612'),
									{
										event: payload.eventType,
										table: stryMutAct_9fa48('613') ? '' : (stryCov_9fa48('613'), 'timelines'),
										new: payload.new as Record<string, unknown>,
									})
						);
					}
				}
			)
			.on(
				stryMutAct_9fa48('614') ? '' : (stryCov_9fa48('614'), 'postgres_changes'),
				stryMutAct_9fa48('615')
					? {}
					: (stryCov_9fa48('615'),
						{
							event: stryMutAct_9fa48('616') ? '' : (stryCov_9fa48('616'), '*'),
							schema: stryMutAct_9fa48('617') ? '' : (stryCov_9fa48('617'), 'public'),
							table: stryMutAct_9fa48('618') ? '' : (stryCov_9fa48('618'), 'rooms'),
							filter: stryMutAct_9fa48('619') ? `` : (stryCov_9fa48('619'), `id=eq.${roomId}`),
						}),
				(payload) => {
					if (stryMutAct_9fa48('620')) {
						{
						}
					} else {
						stryCov_9fa48('620');
						onChange(
							stryMutAct_9fa48('621')
								? {}
								: (stryCov_9fa48('621'),
									{
										event: payload.eventType,
										table: stryMutAct_9fa48('622') ? '' : (stryCov_9fa48('622'), 'rooms'),
										new: payload.new as Record<string, unknown>,
									})
						);
					}
				}
			)
			.subscribe();
	}
}
export { pickAvatar };
