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

const AVATARS = ['♪', '♫', '♬', '♭', '♮', '♯', '𝄞', '𝄢'];

function pickAvatar(index: number): string {
	return AVATARS[index % AVATARS.length];
}

export async function createRoom(hostName: string): Promise<Room> {
	const { data, error } = await supabase.rpc('create_room', { host_name: hostName });
	if (error) throw error;
	return data as Room;
}

export async function joinRoom(roomCode: string, playerName: string): Promise<RoomPlayer> {
	const { data, error } = await supabase.rpc('join_room', {
		room_code: roomCode,
		player_name: playerName,
	});
	if (error) throw error;
	return data as RoomPlayer;
}

export async function getRoomPlayers(roomId: string): Promise<RoomPlayer[]> {
	const { data, error } = await supabase
		.from('players')
		.select('*')
		.eq('room_id', roomId)
		.order('joined_at', { ascending: true });
	if (error) throw error;
	return (data ?? []) as RoomPlayer[];
}

export async function getRoomByCode(code: string): Promise<Room | null> {
	const { data, error } = await supabase.from('rooms').select('*').eq('code', code).single();
	if (error) {
		if (error.code === 'PGRST116') return null;
		throw error;
	}
	return data as Room;
}

export async function startGame(roomCode: string): Promise<void> {
	const { error } = await supabase.rpc('start_game', { p_room_code: roomCode });
	if (error) throw error;
}

export async function getGameState(roomId: string): Promise<GameStateRow | null> {
	const { data, error } = await supabase
		.from('game_state')
		.select('*')
		.eq('room_id', roomId)
		.single();
	if (error) {
		if (error.code === 'PGRST116') return null;
		throw error;
	}
	return data as GameStateRow;
}

export async function getPlayerTimelines(roomId: string): Promise<TimelineRow[]> {
	const { data, error } = await supabase
		.from('timelines')
		.select('*, players!inner(room_id)')
		.eq('players.room_id', roomId)
		.order('position', { ascending: true });
	if (error) throw error;
	return (data ?? []) as TimelineRow[];
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
	const params: Record<string, unknown> = { p_room_code: roomCode };
	if (updates.phase !== undefined) params.p_phase = updates.phase;
	if (updates.activePlayerId !== undefined) params.p_active_player_id = updates.activePlayerId;
	if (updates.drawPile !== undefined) params.p_draw_pile = updates.drawPile;
	if (updates.activeCard !== undefined) params.p_active_card = updates.activeCard ?? null;
	if (updates.round !== undefined) params.p_round = updates.round;

	const { error } = await supabase.rpc('update_game_state', params);
	if (error) throw error;
}

export async function placeCard(
	roomCode: string,
	playerId: string,
	songId: string,
	position: number,
	correct: boolean
): Promise<void> {
	const { error } = await supabase.rpc('place_card', {
		p_room_code: roomCode,
		p_player_id: playerId,
		p_song_id: songId,
		p_position: position,
		p_correct: correct,
	});
	if (error) throw error;
}

export async function useToken(roomCode: string, playerId: string): Promise<void> {
	const { error } = await supabase.rpc('use_token', {
		p_room_code: roomCode,
		p_player_id: playerId,
	});
	if (error) throw error;
}

export async function getCurrentPlayer(): Promise<{ playerId: string; userId: string } | null> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	const { data, error } = await supabase
		.from('players')
		.select('id, user_id')
		.eq('user_id', user.id)
		.order('joined_at', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error || !data) return null;
	return { playerId: data.id, userId: data.user_id };
}

export async function getCurrentPlayerInRoom(
	roomId: string
): Promise<{ playerId: string; userId: string } | null> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	const { data, error } = await supabase
		.from('players')
		.select('id, user_id')
		.eq('user_id', user.id)
		.eq('room_id', roomId)
		.maybeSingle();
	if (error || !data) return null;
	return { playerId: data.id, userId: data.user_id };
}

export function subscribeToRoom(
	roomId: string,
	onChange: (payload: { event: string; table: string; new: Record<string, unknown> }) => void
) {
	return supabase
		.channel(`room:${roomId}`)
		.on(
			'postgres_changes',
			{ event: '*', schema: 'public', table: 'game_state', filter: `room_id=eq.${roomId}` },
			(payload) => {
				onChange({
					event: payload.eventType,
					table: 'game_state',
					new: payload.new as Record<string, unknown>,
				});
			}
		)
		.on(
			'postgres_changes',
			{ event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` },
			(payload) => {
				onChange({
					event: payload.eventType,
					table: 'players',
					new: payload.new as Record<string, unknown>,
				});
			}
		)
		.on(
			'postgres_changes',
			{ event: '*', schema: 'public', table: 'timelines', filter: `room_id=eq.${roomId}` },
			(payload) => {
				onChange({
					event: payload.eventType,
					table: 'timelines',
					new: payload.new as Record<string, unknown>,
				});
			}
		)
		.on(
			'postgres_changes',
			{ event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
			(payload) => {
				onChange({
					event: payload.eventType,
					table: 'rooms',
					new: payload.new as Record<string, unknown>,
				});
			}
		)
		.subscribe();
}

export { pickAvatar };
