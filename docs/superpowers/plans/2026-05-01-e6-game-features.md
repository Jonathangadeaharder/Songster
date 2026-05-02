# Epic SONG-E6: Game Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add spectator mode, rematch, game history, leaderboard, game stats, and supporting database/service changes to the Songster music trivia game.

**Architecture:** Extend existing SvelteKit app in `songster-svelte/`. Add new routes for history and leaderboard. Extend existing game page with spectator mode via query parameter. Add rematch component to results page. Extend `room.ts` with new service functions. Add database migration for new columns and indexes.

**Tech Stack:** Svelte 5 (runes), SvelteKit, Supabase (PostgreSQL + Realtime), TypeScript, pnpm

---

## File Structure

### New Files
- `songster-svelte/src/routes/history/+page.svelte` — Game history page
- `songster-svelte/src/routes/leaderboard/+page.svelte` — Leaderboard page
- `songster-svelte/src/lib/components/Rematch.svelte` — Rematch button component
- `songster-svelte/src/lib/components/GameStats.svelte` — In-game statistics component
- `songster-svelte/supabase/migrations/006_game_features.sql` — Database migration

### Modified Files
- `songster-svelte/src/lib/room.ts` — Add new service functions
- `songster-svelte/src/routes/game/[code]/+page.svelte` — Add spectator mode
- `songster-svelte/src/routes/results/[code]/+page.svelte` — Add rematch component
- `songster-svelte/src/lib/types.ts` — Add new types if needed
- `songster-svelte/src/routes/+layout.svelte` — Add nav links for history/leaderboard

---

## Task 1: Database Migration

**Files:**
- Create: `songster-svelte/supabase/migrations/006_game_features.sql`

- [ ] **Step 1: Create migration file**

```sql
-- Migration 006: Game features — history, leaderboard, spectators, rematch

-- Add game duration tracking
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS finished_at TIMESTAMPTZ;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS game_duration INTERVAL
  GENERATED ALWAYS AS (finished_at - started_at) STORED;

-- Add spectators table
CREATE TABLE IF NOT EXISTS public.spectators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Indexes for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_winner ON public.rooms(winner_player_id);
CREATE INDEX IF NOT EXISTS idx_players_user_room ON public.players(user_id, room_id);
CREATE INDEX IF NOT EXISTS idx_spectators_room ON public.spectators(room_id);

-- Enable realtime for spectators
ALTER PUBLICATION supabase_realtime ADD TABLE public.spectators;

-- RLS for spectators
ALTER TABLE public.spectators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read spectators" ON public.spectators
  FOR SELECT USING (true);

CREATE POLICY "Users can join as spectator" ON public.spectators
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update place_card to set finished_at when game ends
CREATE OR REPLACE FUNCTION public.place_card(
  p_room_code VARCHAR,
  p_player_id UUID,
  p_song_id VARCHAR,
  p_position INT,
  p_correct BOOLEAN DEFAULT true
)
RETURNS void AS $$
DECLARE
  target_room RECORD;
BEGIN
  SELECT * INTO target_room FROM public.rooms WHERE code = p_room_code;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room not found'; END IF;

  IF p_correct THEN
    INSERT INTO public.timelines (player_id, song_id, position, room_id)
    VALUES (p_player_id, p_song_id, p_position, target_room.id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Check win: player has 10 timeline entries
  IF p_correct AND (SELECT COUNT(*) FROM public.timelines WHERE player_id = p_player_id) >= 10 THEN
    UPDATE public.rooms
    SET winner_player_id = p_player_id, status = 'finished', finished_at = now()
    WHERE id = target_room.id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Create rematch — creates new room with same players
CREATE OR REPLACE FUNCTION public.create_rematch(p_old_room_code VARCHAR)
RETURNS public.rooms AS $$
DECLARE
  old_room public.rooms;
  new_room public.rooms;
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  room_code VARCHAR(8) := '';
  room_player RECORD;
  new_player public.players;
BEGIN
  SELECT * INTO old_room FROM public.rooms WHERE code = p_old_room_code;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room not found'; END IF;

  -- Only host can start rematch
  IF old_room.host_id != auth.uid() THEN
    RAISE EXCEPTION 'Only the host can start a rematch';
  END IF;

  -- Generate new room code
  FOR i IN 1..6 LOOP
    room_code := room_code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;

  -- Create new room
  INSERT INTO public.rooms (code, host_id)
  VALUES (room_code, auth.uid())
  RETURNING * INTO new_room;

  -- Copy all players from old room to new room
  FOR room_player IN SELECT * FROM public.players WHERE room_id = old_room.id ORDER BY joined_at
  LOOP
    INSERT INTO public.players (room_id, user_id, name, avatar, is_host)
    VALUES (
      new_room.id,
      room_player.user_id,
      room_player.name,
      room_player.avatar,
      room_player.is_host
    );
  END LOOP;

  -- Broadcast new room code on old room's channel
  PERFORM pg_notify('rematch_created', json_build_object(
    'old_room_id', old_room.id,
    'new_room_code', room_code
  )::text);

  RETURN new_room;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- [ ] **Step 2: Verify migration syntax**

Run: Check SQL syntax by reading the file and verifying no typos.

- [ ] **Step 3: Commit**

```bash
git add songster-svelte/supabase/migrations/006_game_features.sql
git commit -m "feat(db): add migration for game features (history, leaderboard, spectators, rematch)"
```

---

## Task 2: Room Service Additions

**Files:**
- Modify: `songster-svelte/src/lib/room.ts`

- [ ] **Step 1: Add new types and functions to room.ts**

Add after the existing `getCurrentPlayerInRoom` function (line 190):

```typescript
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
    .select(`
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
    `)
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
  const statsMap = new Map<string, {
    name: string;
    games_played: number;
    games_won: number;
    player_ids: string[];
  }>();

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
```

- [ ] **Step 2: Run type check**

Run: `pnpm run check`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add songster-svelte/src/lib/room.ts
git commit -m "feat(room): add spectator, history, leaderboard, and rematch service functions"
```

---

## Task 3: Game Stats Component

**Files:**
- Create: `songster-svelte/src/lib/components/GameStats.svelte`

- [ ] **Step 1: Create GameStats component**

```svelte
<script lang="ts">
  import type { Player, Song } from '$lib/types';

  interface Props {
    drawPileCount: number;
    round: number;
    players: Player[];
    activePlayerId: string;
    startTime?: string | null;
  }

  let { drawPileCount, round, players, activePlayerId, startTime = null }: Props = $props();

  let elapsed = $state(0);
  let timer: ReturnType<typeof setInterval> | undefined;

  $effect(() => {
    if (startTime) {
      const start = new Date(startTime).getTime();
      timer = setInterval(() => {
        elapsed = Math.floor((Date.now() - start) / 1000);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  });

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
</script>

<div class="game-stats">
  <div class="stat">
    <span class="stat-label">DRAW PILE</span>
    <span class="stat-value">{drawPileCount}</span>
  </div>
  <div class="stat">
    <span class="stat-label">ROUND</span>
    <span class="stat-value">{round}</span>
  </div>
  <div class="stat">
    <span class="stat-label">TIME</span>
    <span class="stat-value">{formatTime(elapsed)}</span>
  </div>
  {#each players as player}
    <div class="stat" class:active={player.id === activePlayerId}>
      <span class="stat-label">{player.name}</span>
      <span class="stat-value">{player.timeline.length}/10</span>
    </div>
  {/each}
</div>

<style>
  .game-stats {
    display: flex;
    gap: 16px;
    padding: 8px 16px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 1px;
    border-bottom: 0.5px solid var(--primary, #0a0a0a);
    overflow-x: auto;
  }
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    opacity: 0.6;
  }
  .stat.active {
    opacity: 1;
  }
  .stat-label {
    text-transform: uppercase;
    opacity: 0.5;
    font-size: 8px;
  }
  .stat-value {
    font-weight: 600;
  }
</style>
```

- [ ] **Step 2: Run type check**

Run: `pnpm run check`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add songster-svelte/src/lib/components/GameStats.svelte
git commit -m "feat(ui): add GameStats component for in-game statistics"
```

---

## Task 4: Spectator Mode

**Files:**
- Modify: `songster-svelte/src/routes/game/[code]/+page.svelte`

- [ ] **Step 1: Add spectator detection and mode**

In the `<script>` section, add after the `isDemo` derivation (around line 29):

```typescript
import { page } from '$app/state';
// ... existing imports ...
import { addSpectator } from '$lib/room';

// Add spectator detection
let isSpectator = $derived(page.url.searchParams.get('spectate') === 'true');
```

- [ ] **Step 2: Modify onMount to handle spectators**

Replace the `onMount` block (lines 82-112) with:

```typescript
onMount(() => {
  if (isDemo) {
    if ($screenStore === 'lobby') game.startGame();
    return;
  }

  let cancelled = false;

  (async () => {
    try {
      const room = await getRoomByCode(code);
      if (cancelled || !room) return;

      if (isSpectator) {
        // Spectator: connect without player ID
        await remoteGame.connectRemoteGame({
          roomCode: code,
          roomId: room.id,
          myPlayerId: '',
          isHost: false,
        });
        // Register as spectator
        const { data: { user } } = await import('$lib/supabase').then(m => m.supabase.auth.getUser());
        if (user) {
          await addSpectator(room.id, user.id);
        }
      } else {
        const playerInfo = await getCurrentPlayerInRoom(room.id);
        if (cancelled || !playerInfo) return;

        await remoteGame.connectRemoteGame({
          roomCode: code,
          roomId: room.id,
          myPlayerId: playerInfo.playerId,
          isHost: room.host_id === playerInfo.userId,
        });
      }
    } catch {
      // Silently fail — will show empty state
    }
  })();

  return () => {
    cancelled = true;
    remoteGame.disconnectRemoteGame();
  };
});
```

- [ ] **Step 3: Disable interactions for spectators**

Add spectator guard to drag/drop handlers. Replace the interaction functions:

```typescript
function onCardDragStart(e: DragEvent) {
  if (isSpectator || !myTurnAndPlacing) {
    e.preventDefault();
    return;
  }
  e.dataTransfer!.setData('text/plain', 'active-card');
  e.dataTransfer!.effectAllowed = 'move';
  getStore().dragging.set(true);
}

function onSlotDrop(e: DragEvent, i: number) {
  if (isSpectator) return;
  e.preventDefault();
  dragSlot = null;
  getStore().dragging.set(false);
  getStore().onPlace(i);
}

function onPlay() {
  if (isSpectator) return;
  getStore().onPlay();
}

function onNextTurn() {
  if (isSpectator) return;
  getStore().onNextTurn();
}

function onChallenge() {
  if (isSpectator) return;
  getStore().onChallenge();
}
```

- [ ] **Step 4: Update template for spectator mode**

Update the template sections:

1. Change the turn label to show "SPECTATING" when spectator:
```svelte
{#snippet right()}
  <div class="turn-label">
    {#if isSpectator}
      <span style="opacity: 0.6">SPECTATING</span>
    {:else}
      <span style="opacity: 0.6">TURN</span>
    {/if}
    <span>{activePlayer?.name}</span>
  </div>
{/snippet}
```

2. Hide drag instructions for spectators:
```svelte
{#if $phase === 'place'}
  {#if isSpectator}
    {`${activePlayer?.name} is placing…`}
  {:else}
    {$activePlayerId === $myPlayerId
      ? 'Drag the card onto your timeline'
      : `${activePlayer?.name} is placing…`}
  {/if}
{/if}
```

3. Disable draggable for spectators:
```svelte
draggable={isSpectator ? undefined : (myTurnAndPlacing ? 'true' : undefined)}
```

4. Hide challenge bar for spectators:
```svelte
{#if !isSpectator && t.interceptionEnabled && ($phase === 'place' || $phase === 'challenge') && $activePlayerId !== $myPlayerId}
```

5. Hide next turn button for spectators:
```svelte
{#if $phase === 'reveal'}
  {#if !isSpectator}
    <div class="next-btn-wrap">
      <button class="next-btn" style="background: {primary}; color: {paper}" onclick={onNextTurn}>
        Side B · Next Turn →
      </button>
    </div>
  {/if}
{:else}
  <div style="height: 16px"></div>
{/if}
```

- [ ] **Step 5: Add GameStats component to game page**

Import and add GameStats:
```svelte
import GameStats from '$lib/components/GameStats.svelte';
```

Add after the player-rail section:
```svelte
<GameStats
  drawPileCount={$drawPile.length}
  round={$round}
  players={$players}
  activePlayerId={$activePlayerId}
  startTime={null}
/>
```

- [ ] **Step 6: Run type check**

Run: `pnpm run check`
Expected: 0 errors

- [ ] **Step 7: Commit**

```bash
git add songster-svelte/src/routes/game/[code]/+page.svelte
git commit -m "feat(game): add spectator mode with read-only view"
```

---

## Task 5: Rematch Component

**Files:**
- Create: `songster-svelte/src/lib/components/Rematch.svelte`
- Modify: `songster-svelte/src/routes/results/[code]/+page.svelte`

- [ ] **Step 1: Create Rematch component**

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { createRematch } from '$lib/room';

  interface Props {
    roomCode: string;
    isHost: boolean;
  }

  let { roomCode, isHost }: Props = $props();
  let loading = $state(false);
  let error = $state<string | null>(null);

  async function handleRematch() {
    if (!isHost || loading) return;
    loading = true;
    error = null;

    try {
      const newRoom = await createRematch(roomCode);
      goto(`/game/${newRoom.code}`);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to create rematch';
      loading = false;
    }
  }
</script>

<div class="rematch">
  {#if isHost}
    <button
      class="rematch-btn"
      onclick={handleRematch}
      disabled={loading}
    >
      {loading ? 'Creating...' : 'Play Again'}
    </button>
  {:else}
    <div class="waiting">Waiting for host to start rematch...</div>
  {/if}

  {#if error}
    <div class="error">{error}</div>
  {/if}
</div>

<style>
  .rematch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .rematch-btn {
    padding: 12px 24px;
    background: #0a0a0a;
    color: #f4efe4;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .rematch-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .waiting {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 1px;
    opacity: 0.6;
  }
  .error {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: #c00;
  }
</style>
```

- [ ] **Step 2: Update results page to use Rematch component**

Replace `songster-svelte/src/routes/results/[code]/+page.svelte`:

```svelte
<script lang="ts">
  import { page } from '$app/state';
  import Chrome from '$lib/components/Chrome.svelte';
  import Wordmark from '$lib/components/Wordmark.svelte';
  import Rematch from '$lib/components/Rematch.svelte';
  import { game } from '$lib/stores/game';
  import { remoteGame } from '$lib/stores/game-remote';

  let code: string = $derived(page.params.code ?? '');
  let { winner } = game;
  let isHost = $derived($remoteGame.isHost);
</script>

<Chrome title="RESULTS · {code}">
  {#snippet children()}
    <div class="results">
      <Wordmark scale={2} />
      <div class="winner">
        <div class="winner-label">Winner</div>
        <div class="winner-name">{$winner?.name ?? 'Nobody'}</div>
      </div>
      <Rematch roomCode={code} {isHost} />
      <button class="replay-btn" onclick={() => { game.onReplay(); goto('/'); }}>Back to Lobby</button>
    </div>
  {/snippet}
</Chrome>

<style>
  .results {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 24px;
  }
  .winner { text-align: center; }
  .winner-label {
    font-family: 'IBM Plex Mono', monospace; font-size: 10px;
    letter-spacing: 3px; text-transform: uppercase; opacity: 0.5;
  }
  .winner-name {
    font-family: 'Playfair Display', serif; font-size: 36px;
    font-weight: 700; font-style: italic;
  }
  .replay-btn {
    padding: 12px 24px; background: none; color: #0a0a0a;
    border: 1.5px solid #0a0a0a; border-radius: 4px; cursor: pointer;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    letter-spacing: 2px; text-transform: uppercase;
  }
</style>
```

- [ ] **Step 3: Run type check**

Run: `pnpm run check`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add songster-svelte/src/lib/components/Rematch.svelte songster-svelte/src/routes/results/[code]/+page.svelte
git commit -m "feat(results): add rematch button with auto-join for non-hosts"
```

---

## Task 6: Game History Page

**Files:**
- Create: `songster-svelte/src/routes/history/+page.svelte`

- [ ] **Step 1: Create history page**

```svelte
<script lang="ts">
  import Chrome from '$lib/components/Chrome.svelte';
  import { getGameHistory, type GameHistoryEntry } from '$lib/room';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';

  let history = $state<GameHistoryEntry[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        error = 'Please sign in to view history';
        loading = false;
        return;
      }
      history = await getGameHistory(user.id);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load history';
    } finally {
      loading = false;
    }
  });

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function formatDuration(duration: string | null): string {
    if (!duration) return '--';
    // Parse PostgreSQL interval format
    const match = duration.match(/(\d+):(\d+):(\d+)/);
    if (match) {
      const [, h, m, s] = match;
      if (parseInt(h) > 0) return `${h}h ${m}m`;
      return `${m}m ${s}s`;
    }
    return duration;
  }
</script>

<Chrome title="Game History · Songster">
  {#snippet children()}
    <div class="history-page">
      <h1>Game History</h1>

      {#if loading}
        <div class="loading">Loading...</div>
      {:else if error}
        <div class="error">{error}</div>
      {:else if history.length === 0}
        <div class="empty">No games played yet. Start a game to see your history!</div>
      {:else}
        <div class="game-list">
          {#each history as game}
            <a href="/game/{game.room_code}" class="game-card">
              <div class="game-header">
                <span class="game-date">{formatDate(game.created_at)}</span>
                <span class="game-code">{game.room_code}</span>
              </div>
              <div class="game-details">
                <div class="detail">
                  <span class="detail-label">Winner</span>
                  <span class="detail-value">{game.winner_name ?? 'N/A'}</span>
                </div>
                <div class="detail">
                  <span class="detail-label">Players</span>
                  <span class="detail-value">{game.players.join(', ')}</span>
                </div>
                <div class="detail">
                  <span class="detail-label">Duration</span>
                  <span class="detail-value">{formatDuration(game.game_duration)}</span>
                </div>
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  {/snippet}
</Chrome>

<style>
  .history-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 24px 16px;
  }
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    font-style: italic;
    margin-bottom: 24px;
  }
  .loading, .error, .empty {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    text-align: center;
    padding: 40px 0;
    opacity: 0.6;
  }
  .error { color: #c00; }
  .game-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .game-card {
    display: block;
    padding: 16px;
    border: 0.5px solid var(--primary, #0a0a0a);
    border-radius: 6px;
    text-decoration: none;
    color: inherit;
    transition: opacity 0.15s;
  }
  .game-card:hover {
    opacity: 0.8;
  }
  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .game-date {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 1px;
    opacity: 0.5;
  }
  .game-code {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
  }
  .game-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .detail {
    display: flex;
    gap: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
  }
  .detail-label {
    opacity: 0.4;
    min-width: 60px;
  }
  .detail-value {
    font-weight: 500;
  }
</style>
```

- [ ] **Step 2: Run type check**

Run: `pnpm run check`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add songster-svelte/src/routes/history/+page.svelte
git commit -m "feat(history): add game history page showing past games"
```

---

## Task 7: Leaderboard Page

**Files:**
- Create: `songster-svelte/src/routes/leaderboard/+page.svelte`

- [ ] **Step 1: Create leaderboard page**

```svelte
<script lang="ts">
  import Chrome from '$lib/components/Chrome.svelte';
  import { getLeaderboard, type LeaderboardEntry } from '$lib/room';
  import { onMount } from 'svelte';

  let leaderboard = $state<LeaderboardEntry[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let sortBy = $state<'games_won' | 'win_rate' | 'games_played'>('games_won');

  onMount(async () => {
    try {
      leaderboard = await getLeaderboard(50);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load leaderboard';
    } finally {
      loading = false;
    }
  });

  let sorted = $derived(
    [...leaderboard].sort((a, b) => {
      if (sortBy === 'win_rate') return b.win_rate - a.win_rate;
      if (sortBy === 'games_played') return b.games_played - a.games_played;
      return b.games_won - a.games_won;
    })
  );

  function formatRate(rate: number): string {
    return `${Math.round(rate * 100)}%`;
  }
</script>

<Chrome title="Leaderboard · Songster">
  {#snippet children()}
    <div class="leaderboard-page">
      <h1>Leaderboard</h1>

      <div class="sort-controls">
        <button
          class:active={sortBy === 'games_won'}
          onclick={() => sortBy = 'games_won'}
        >
          Wins
        </button>
        <button
          class:active={sortBy === 'win_rate'}
          onclick={() => sortBy = 'win_rate'}
        >
          Win Rate
        </button>
        <button
          class:active={sortBy === 'games_played'}
          onclick={() => sortBy = 'games_played'}
        >
          Games
        </button>
      </div>

      {#if loading}
        <div class="loading">Loading...</div>
      {:else if error}
        <div class="error">{error}</div>
      {:else if sorted.length === 0}
        <div class="empty">No games played yet. Be the first on the leaderboard!</div>
      {:else}
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th class="rank">#</th>
                <th>Player</th>
                <th class="num">Wins</th>
                <th class="num">Win Rate</th>
                <th class="num">Games</th>
                <th class="num">Avg Timeline</th>
              </tr>
            </thead>
            <tbody>
              {#each sorted as entry, i}
                <tr>
                  <td class="rank">{i + 1}</td>
                  <td class="name">{entry.name}</td>
                  <td class="num">{entry.games_won}</td>
                  <td class="num">{formatRate(entry.win_rate)}</td>
                  <td class="num">{entry.games_played}</td>
                  <td class="num">{entry.avg_timeline_length.toFixed(1)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  {/snippet}
</Chrome>

<style>
  .leaderboard-page {
    max-width: 700px;
    margin: 0 auto;
    padding: 24px 16px;
  }
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    font-style: italic;
    margin-bottom: 16px;
  }
  .sort-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }
  .sort-controls button {
    padding: 6px 12px;
    border: 1px solid var(--primary, #0a0a0a);
    border-radius: 4px;
    background: none;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 1px;
    cursor: pointer;
    opacity: 0.5;
  }
  .sort-controls button.active {
    opacity: 1;
    background: var(--primary, #0a0a0a);
    color: var(--paper, #f4efe4);
  }
  .loading, .error, .empty {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    text-align: center;
    padding: 40px 0;
    opacity: 0.6;
  }
  .error { color: #c00; }
  .table-wrapper {
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
  }
  th {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid var(--primary, #0a0a0a);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.5;
  }
  td {
    padding: 10px 12px;
    border-bottom: 0.5px solid rgba(128, 128, 128, 0.2);
  }
  .rank {
    width: 40px;
    text-align: center;
  }
  .num {
    text-align: right;
  }
  .name {
    font-weight: 600;
  }
</style>
```

- [ ] **Step 2: Run type check**

Run: `pnpm run check`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add songster-svelte/src/routes/leaderboard/+page.svelte
git commit -m "feat(leaderboard): add global leaderboard page with sortable stats"
```

---

## Task 8: Navigation Links

**Files:**
- Modify: `songster-svelte/src/routes/+layout.svelte`

- [ ] **Step 1: Add nav links to layout**

Read the current layout file first, then add navigation links for History and Leaderboard. The links should be added to the Chrome component or as a simple nav bar.

- [ ] **Step 2: Run type check**

Run: `pnpm run check`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add songster-svelte/src/routes/+layout.svelte
git commit -m "feat(nav): add navigation links for history and leaderboard"
```

---

## Task 9: Verification

- [ ] **Step 1: Run type check**

Run: `cd songster-svelte && pnpm run check`
Expected: 0 errors

- [ ] **Step 2: Run tests**

Run: `cd songster-svelte && pnpm run test`
Expected: All tests pass

- [ ] **Step 3: Run build**

Run: `cd songster-svelte && pnpm run build`
Expected: Build succeeds

- [ ] **Step 4: Final commit if needed**

```bash
git add -A
git commit -m "chore: verify all game features pass checks and tests"
```
