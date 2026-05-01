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

export interface GameHistoryEntry {
	room_id: string;
	room_code: string;
	created_at: string;
	started_at: string | null;
	finished_at: string | null;
	game_duration: string | null;
	winner_name: string | null;
	players: string[];
	player_count: number;
}

export interface LeaderboardEntry {
	user_id: string;
	name: string;
	games_played: number;
	games_won: number;
	win_rate: number;
	avg_timeline_length: number;
}

export async function addSpectator(roomId: string, userId: string): Promise<void> {
	const { error } = await supabase
		.from('spectators')
		.insert({ room_id: roomId, user_id: userId })
		.select()
		.single();
	if (error && error.code !== '23505') throw error; // Ignore duplicate
}

export async function getGameHistory(userId: string): Promise<GameHistoryEntry[]> {
	const { data, error } = await supabase
		.from('players')
		.select(
			`
			room_id,
			rooms!inner(
				id,
				code,
				created_at,
				started_at,
				finished_at,
				game_duration,
				status,
				winner_player_id
			)
		`
		)
		.eq('user_id', userId)
		.eq('rooms.status', 'finished')
		.order('rooms.created_at', { ascending: false });

	if (error) throw error;
	if (!data) return [];

	const entries: GameHistoryEntry[] = [];
	for (const row of data) {
		const room = row.rooms as unknown as {
			id: string;
			code: string;
			created_at: string;
			started_at: string | null;
			finished_at: string | null;
			game_duration: string | null;
			winner_player_id: string | null;
		};

		// Get all players for this room
		const { data: roomPlayers } = await supabase
			.from('players')
			.select('name')
			.eq('room_id', room.id)
			.order('joined_at');

		// Get winner name
		let winnerName: string | null = null;
		if (room.winner_player_id) {
			const { data: winner } = await supabase
				.from('players')
				.select('name')
				.eq('id', room.winner_player_id)
				.single();
			winnerName = winner?.name ?? null;
		}

		entries.push({
			room_id: room.id,
			room_code: room.code,
			created_at: room.created_at,
			started_at: room.started_at,
			finished_at: room.finished_at,
			game_duration: room.game_duration,
			winner_name: winnerName,
			players: (roomPlayers ?? []).map((p: { name: string }) => p.name),
			player_count: (roomPlayers ?? []).length,
		});
	}

	return entries;
}

export async function getLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
	// Get all finished rooms
	const { data: finishedRooms, error: roomsError } = await supabase
		.from('rooms')
		.select('id, winner_player_id')
		.eq('status', 'finished');

	if (roomsError) throw roomsError;
	if (!finishedRooms || finishedRooms.length === 0) return [];

	const roomIds = finishedRooms.map((r) => r.id);
	const winnerIds = new Set(finishedRooms.map((r) => r.winner_player_id).filter(Boolean));

	// Get all players in finished rooms
	const { data: allPlayers, error: playersError } = await supabase
		.from('players')
		.select('user_id, name, id, room_id')
		.in('room_id', roomIds);

	if (playersError) throw playersError;
	if (!allPlayers) return [];

	// Aggregate stats by user_id
	const statsMap = new Map<
		string,
		{
			name: string;
			games_played: number;
			games_won: number;
			player_ids: string[];
		}
	>();

	for (const player of allPlayers) {
		const existing = statsMap.get(player.user_id);
		if (existing) {
			existing.games_played++;
			existing.player_ids.push(player.id);
			if (winnerIds.has(player.id)) {
				existing.games_won++;
			}
		} else {
			statsMap.set(player.user_id, {
				name: player.name,
				games_played: 1,
				games_won: winnerIds.has(player.id) ? 1 : 0,
				player_ids: [player.id],
			});
		}
	}

	// Get avg timeline lengths
	const allPlayerIds = allPlayers.map((p) => p.id);
	const { data: timelineCounts } = await supabase
		.from('timelines')
		.select('player_id')
		.in('player_id', allPlayerIds);

	const timelineCountMap = new Map<string, number>();
	if (timelineCounts) {
		for (const t of timelineCounts) {
			timelineCountMap.set(t.player_id, (timelineCountMap.get(t.player_id) ?? 0) + 1);
		}
	}

	// Build leaderboard entries
	const entries: LeaderboardEntry[] = [];
	for (const [userId, stats] of statsMap) {
		const totalTimeline = stats.player_ids.reduce(
			(sum, pid) => sum + (timelineCountMap.get(pid) ?? 0),
			0
		);
		entries.push({
			user_id: userId,
			name: stats.name,
			games_played: stats.games_played,
			games_won: stats.games_won,
			win_rate: stats.games_played > 0 ? stats.games_won / stats.games_played : 0,
			avg_timeline_length: stats.games_played > 0 ? totalTimeline / stats.games_played : 0,
		});
	}

	// Sort by win count descending
	entries.sort((a, b) => b.games_won - a.games_won);

	return entries.slice(0, limit);
}

export async function createRematch(oldRoomCode: string): Promise<Room> {
	const { data, error } = await supabase.rpc('create_rematch', {
		p_old_room_code: oldRoomCode,
	});
	if (error) throw error;
	return data as Room;
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
