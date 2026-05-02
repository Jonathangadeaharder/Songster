import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	createRoom,
	joinRoom,
	getRoomPlayers,
	getRoomByCode,
	startGame,
	getGameState,
	getPlayerTimelines,
	subscribeToRoom,
	updateGameState,
	placeCard,
	useToken,
	getCurrentPlayer,
	getCurrentPlayerInRoom,
	pickAvatar,
} from '$lib/room';

const { mockRpc, mockFrom, mockAuth } = vi.hoisted(() => ({
	mockRpc: vi.fn(),
	mockFrom: vi.fn(),
	mockAuth: { getUser: vi.fn() },
}));

vi.mock('$lib/supabase', () => ({
	supabase: {
		rpc: (...args: unknown[]) => mockRpc(...args),
		from: (...args: unknown[]) => mockFrom(...args),
		auth: mockAuth,
		channel: vi.fn(() => ({
			on: vi.fn().mockReturnThis(),
			subscribe: vi.fn(),
		})),
	},
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe('pickAvatar', () => {
	it('returns avatars in sequence', () => {
		expect(pickAvatar(0)).toBe('♪');
		expect(pickAvatar(1)).toBe('♫');
		expect(pickAvatar(7)).toBe('𝄢');
		expect(pickAvatar(8)).toBe('♪');
	});
});

describe('createRoom', () => {
	it('calls create_room RPC with host name', async () => {
		const room = { id: 'r1', code: 'ABC123', host_id: 'u1', status: 'waiting' };
		mockRpc.mockResolvedValue({ data: room, error: null });

		const result = await createRoom('Alice');
		expect(mockRpc).toHaveBeenCalledWith('create_room', { host_name: 'Alice' });
		expect(result).toEqual(room);
	});

	it('throws on error', async () => {
		mockRpc.mockResolvedValue({ data: null, error: new Error('fail') });
		await expect(createRoom('Alice')).rejects.toThrow('fail');
	});
});

describe('joinRoom', () => {
	it('calls join_room RPC', async () => {
		const player = { id: 'p1', name: 'Bob' };
		mockRpc.mockResolvedValue({ data: player, error: null });

		const result = await joinRoom('ABC123', 'Bob');
		expect(mockRpc).toHaveBeenCalledWith('join_room', { room_code: 'ABC123', player_name: 'Bob' });
		expect(result).toEqual(player);
	});
});

describe('getRoomPlayers', () => {
	it('fetches players ordered by joined_at', async () => {
		const players = [{ id: 'p1' }, { id: 'p2' }];
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			order: vi.fn().mockResolvedValue({ data: players, error: null }),
		};
		mockFrom.mockReturnValue(chain);

		const result = await getRoomPlayers('room-1');
		expect(mockFrom).toHaveBeenCalledWith('players');
		expect(result).toEqual(players);
	});

	it('throws on error', async () => {
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			order: vi.fn().mockResolvedValue({ data: null, error: new Error('db fail') }),
		};
		mockFrom.mockReturnValue(chain);

		await expect(getRoomPlayers('room-1')).rejects.toThrow('db fail');
	});

	it('returns empty array on null data', async () => {
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			order: vi.fn().mockResolvedValue({ data: null, error: null }),
		};
		mockFrom.mockReturnValue(chain);

		const result = await getRoomPlayers('room-1');
		expect(result).toEqual([]);
	});
});

describe('getRoomByCode', () => {
	it('returns room on success', async () => {
		const room = { id: 'r1', code: 'ABC' };
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			single: vi.fn().mockResolvedValue({ data: room, error: null }),
		};
		mockFrom.mockReturnValue(chain);

		const result = await getRoomByCode('ABC');
		expect(result).toEqual(room);
	});

	it('returns null when not found', async () => {
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
		};
		mockFrom.mockReturnValue(chain);

		const result = await getRoomByCode('XXX');
		expect(result).toBeNull();
	});
});

describe('startGame', () => {
	it('calls start_game RPC', async () => {
		mockRpc.mockResolvedValue({ data: null, error: null });
		await startGame('ABC123');
		expect(mockRpc).toHaveBeenCalledWith('start_game', { p_room_code: 'ABC123' });
	});
});

describe('getGameState', () => {
	it('returns game state', async () => {
		const state = { id: 'gs1', round: 1, phase: 'draw' };
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			single: vi.fn().mockResolvedValue({ data: state, error: null }),
		};
		mockFrom.mockReturnValue(chain);

		const result = await getGameState('room-1');
		expect(result).toEqual(state);
	});
});

describe('updateGameState', () => {
	it('sends only defined fields', async () => {
		mockRpc.mockResolvedValue({ data: null, error: null });
		await updateGameState('ABC', { phase: 'listen' });
		expect(mockRpc).toHaveBeenCalledWith('update_game_state', {
			p_room_code: 'ABC',
			p_phase: 'listen',
		});
	});

	it('passes draw pile and active card as raw objects', async () => {
		mockRpc.mockResolvedValue({ data: null, error: null });
		const pile = [{ id: 's1', num: 1, title: 'A', artist: 'B', year: 2000 }];
		const card = { id: 's2', num: 2, title: 'C', artist: 'D', year: 2010 };
		await updateGameState('ABC', { drawPile: pile, activeCard: card });
		expect(mockRpc).toHaveBeenCalledWith(
			'update_game_state',
			expect.objectContaining({
				p_draw_pile: pile,
				p_active_card: card,
			})
		);
	});

	it('sends null for null activeCard', async () => {
		mockRpc.mockResolvedValue({ data: null, error: null });
		await updateGameState('ABC', { activeCard: null });
		expect(mockRpc).toHaveBeenCalledWith(
			'update_game_state',
			expect.objectContaining({
				p_active_card: null,
			})
		);
	});
});

describe('placeCard', () => {
	it('calls place_card RPC with all params', async () => {
		mockRpc.mockResolvedValue({ data: null, error: null });
		await placeCard('ABC', 'p1', 's01', 2, true);
		expect(mockRpc).toHaveBeenCalledWith('place_card', {
			p_room_code: 'ABC',
			p_player_id: 'p1',
			p_song_id: 's01',
			p_position: 2,
			p_correct: true,
		});
	});
});

describe('useToken', () => {
	it('calls use_token RPC', async () => {
		mockRpc.mockResolvedValue({ data: null, error: null });
		await useToken('ABC', 'p1');
		expect(mockRpc).toHaveBeenCalledWith('use_token', {
			p_room_code: 'ABC',
			p_player_id: 'p1',
		});
	});
});

describe('getCurrentPlayer', () => {
	it('returns null when no user', async () => {
		mockAuth.getUser.mockResolvedValue({ data: { user: null } });
		const result = await getCurrentPlayer();
		expect(result).toBeNull();
	});

	it('returns player info', async () => {
		mockAuth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			order: vi.fn().mockReturnThis(),
			limit: vi.fn().mockReturnThis(),
			maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'p1', user_id: 'u1' }, error: null }),
		};
		mockFrom.mockReturnValue(chain);

		const result = await getCurrentPlayer();
		expect(result).toEqual({ playerId: 'p1', userId: 'u1' });
	});

	it('returns null when no player record found', async () => {
		mockAuth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			order: vi.fn().mockReturnThis(),
			limit: vi.fn().mockReturnThis(),
			maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
		};
		mockFrom.mockReturnValue(chain);

		const result = await getCurrentPlayer();
		expect(result).toBeNull();
	});

	it('returns null on query error', async () => {
		mockAuth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			order: vi.fn().mockReturnThis(),
			limit: vi.fn().mockReturnThis(),
			maybeSingle: vi.fn().mockResolvedValue({ data: null, error: new Error('db fail') }),
		};
		mockFrom.mockReturnValue(chain);

		const result = await getCurrentPlayer();
		expect(result).toBeNull();
	});
});

describe('getPlayerTimelines', () => {
	it('fetches timelines for room', async () => {
		const timelines = [{ id: 't1', player_id: 'p1', song_id: 's01', position: 0 }];
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			order: vi.fn().mockResolvedValue({ data: timelines, error: null }),
		};
		mockFrom.mockReturnValue(chain);

		const result = await getPlayerTimelines('room-1');
		expect(mockFrom).toHaveBeenCalledWith('timelines');
		expect(result).toEqual(timelines);
	});

	it('returns empty array on null data', async () => {
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			order: vi.fn().mockResolvedValue({ data: null, error: null }),
		};
		mockFrom.mockReturnValue(chain);

		const result = await getPlayerTimelines('room-1');
		expect(result).toEqual([]);
	});

	it('throws on error', async () => {
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			order: vi.fn().mockResolvedValue({ data: null, error: new Error('fail') }),
		};
		mockFrom.mockReturnValue(chain);
		await expect(getPlayerTimelines('room-1')).rejects.toThrow('fail');
	});
});

describe('subscribeToRoom', () => {
	it('creates a channel with postgres_changes subscriptions', async () => {
		const { supabase } = await import('$lib/supabase');
		const mockOn = vi.fn().mockReturnThis();
		const mockSubscribe = vi.fn();
		const mockChannel = vi.fn().mockReturnValue({
			on: mockOn,
			subscribe: mockSubscribe,
		});
		supabase.channel = mockChannel;

		const callback = vi.fn();
		subscribeToRoom('room-1', callback);

		expect(mockChannel).toHaveBeenCalledWith('room:room-1');
		expect(mockOn).toHaveBeenCalledTimes(4);
		expect(mockSubscribe).toHaveBeenCalled();
	});

	it('invokes callback with correct shape for each table', async () => {
		const callbacks: Record<
			string,
			(payload: { eventType: string; new: Record<string, unknown> }) => void
		> = {};
		let callIndex = 0;
		const tables = ['game_state', 'players', 'timelines', 'rooms'];

		const mockOn = vi.fn().mockImplementation((_event: string, _filter: unknown, cb: unknown) => {
			const key = tables[callIndex++];
			callbacks[key] = cb as (payload: { eventType: string; new: Record<string, unknown> }) => void;
			return { on: mockOn, subscribe: vi.fn() };
		});

		const mockChannel = vi.fn().mockReturnValue({ on: mockOn, subscribe: vi.fn() });

		const { supabase } = await import('$lib/supabase');
		supabase.channel = mockChannel;

		const callback = vi.fn();
		subscribeToRoom('room-1', callback);

		for (const table of tables) {
			callbacks[table]({ eventType: 'INSERT', new: { id: '1' } });
		}

		expect(callback).toHaveBeenCalledTimes(4);
		expect(callback).toHaveBeenCalledWith({
			event: 'INSERT',
			table: 'game_state',
			new: { id: '1' },
		});
		expect(callback).toHaveBeenCalledWith({ event: 'INSERT', table: 'players', new: { id: '1' } });
		expect(callback).toHaveBeenCalledWith({
			event: 'INSERT',
			table: 'timelines',
			new: { id: '1' },
		});
		expect(callback).toHaveBeenCalledWith({ event: 'INSERT', table: 'rooms', new: { id: '1' } });
	});
});

describe('getCurrentPlayerInRoom', () => {
	it('returns null when no user', async () => {
		mockAuth.getUser.mockResolvedValue({ data: { user: null } });
		const result = await getCurrentPlayerInRoom('room-1');
		expect(result).toBeNull();
	});

	it('returns player info scoped to room', async () => {
		mockAuth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'p1', user_id: 'u1' }, error: null }),
		};
		mockFrom.mockReturnValue(chain);

		const result = await getCurrentPlayerInRoom('room-1');
		expect(result).toEqual({ playerId: 'p1', userId: 'u1' });
	});

	it('returns null when no player in room', async () => {
		mockAuth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
		};
		mockFrom.mockReturnValue(chain);

		const result = await getCurrentPlayerInRoom('room-1');
		expect(result).toBeNull();
	});
});

describe('getRoomByCode error handling', () => {
	it('throws on non-not-found errors', async () => {
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			single: vi
				.fn()
				.mockResolvedValue({ data: null, error: { code: 'OTHER', message: 'db error' } }),
		};
		mockFrom.mockReturnValue(chain);
		await expect(getRoomByCode('ABC')).rejects.toThrow('db error');
	});
});

describe('getGameState null handling', () => {
	it('returns null when not found', async () => {
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
		};
		mockFrom.mockReturnValue(chain);
		const result = await getGameState('room-1');
		expect(result).toBeNull();
	});

	it('throws on other errors', async () => {
		const chain = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			single: vi.fn().mockResolvedValue({ data: null, error: { code: 'OTHER', message: 'fail' } }),
		};
		mockFrom.mockReturnValue(chain);
		await expect(getGameState('room-1')).rejects.toThrow('fail');
	});
});

describe('updateGameState edge cases', () => {
	it('sends all fields when all defined', async () => {
		mockRpc.mockResolvedValue({ data: null, error: null });
		await updateGameState('ABC', {
			phase: 'listen',
			activePlayerId: 'p1',
			drawPile: [],
			activeCard: null,
			round: 2,
		});
		expect(mockRpc).toHaveBeenCalledWith('update_game_state', {
			p_room_code: 'ABC',
			p_phase: 'listen',
			p_active_player_id: 'p1',
			p_draw_pile: [],
			p_active_card: null,
			p_round: 2,
		});
	});

	it('throws on RPC error', async () => {
		mockRpc.mockResolvedValue({ data: null, error: new Error('rpc fail') });
		await expect(updateGameState('ABC', { phase: 'listen' })).rejects.toThrow('rpc fail');
	});
});

describe('joinRoom error', () => {
	it('throws on error', async () => {
		mockRpc.mockResolvedValue({ data: null, error: new Error('room full') });
		await expect(joinRoom('ABC', 'Bob')).rejects.toThrow('room full');
	});
});

describe('startGame error', () => {
	it('throws on error', async () => {
		mockRpc.mockResolvedValue({ data: null, error: new Error('already started') });
		await expect(startGame('ABC')).rejects.toThrow('already started');
	});
});

describe('placeCard error', () => {
	it('throws on error', async () => {
		mockRpc.mockResolvedValue({ data: null, error: new Error('not your turn') });
		await expect(placeCard('ABC', 'p1', 's01', 0, true)).rejects.toThrow('not your turn');
	});
});

describe('useToken error', () => {
	it('throws on error', async () => {
		mockRpc.mockResolvedValue({ data: null, error: new Error('no tokens') });
		await expect(useToken('ABC', 'p1')).rejects.toThrow('no tokens');
	});
});
