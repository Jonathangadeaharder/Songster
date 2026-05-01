-- Migration 004: Add start_game RPC, winner tracking, and Broadcast channel support

-- Add winner tracking to rooms
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS winner_player_id UUID REFERENCES public.players(id);
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;

-- RPC: Start game — initializes game_state with shuffled deck
CREATE OR REPLACE FUNCTION public.start_game(p_room_code VARCHAR)
RETURNS void AS $$
DECLARE
  target_room RECORD;
  deck JSONB;
  room_players RECORD[];
  i INT := 0;
  card JSONB;
  timeline_cards JSONB := '[]';
BEGIN
  SELECT * INTO target_room FROM public.rooms WHERE code = p_room_code;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room not found'; END IF;

  -- Only host can start
  IF target_room.host_id != auth.uid() THEN
    RAISE EXCEPTION 'Only the host can start the game';
  END IF;

  -- Shuffle deck using random()
  WITH shuffled AS (
    SELECT jsonb_build_object('id', id, 'num', num, 'title', title, 'artist', artist, 'year', year) AS card
    FROM public.songs ORDER BY random()
  ) SELECT jsonb_agg(card) INTO deck FROM shuffled;

  -- If no songs table, fall back to a hardcoded deck
  IF deck IS NULL THEN
    deck := '[]';
  END IF;

  -- Create game state
  INSERT INTO public.game_state (room_id, round, phase, active_player_id, draw_pile, active_card)
  VALUES (
    target_room.id,
    1,
    'draw',
    (SELECT id FROM public.players WHERE room_id = target_room.id AND is_host = true LIMIT 1),
    deck,
    NULL
  );

  -- Mark room as started
  UPDATE public.rooms SET status = 'playing', started_at = now() WHERE id = target_room.id;

  -- Deal first card to each player's timeline
  FOR room_players IN SELECT * FROM public.players WHERE room_id = target_room.id ORDER BY joined_at
  LOOP
    i := i + 1;
    IF deck->(i - 1) IS NOT NULL THEN
      INSERT INTO public.timelines (player_id, song_id, position)
      VALUES (
        room_players.id,
        (deck->(i - 1)->>'id'),
        0
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Update game state (phase, active player, draw pile, active card)
CREATE OR REPLACE FUNCTION public.update_game_state(
  p_room_code VARCHAR,
  p_phase VARCHAR DEFAULT NULL,
  p_active_player_id UUID DEFAULT NULL,
  p_draw_pile JSONB DEFAULT NULL,
  p_active_card JSONB DEFAULT NULL,
  p_round INT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  target_room RECORD;
BEGIN
  SELECT * INTO target_room FROM public.rooms WHERE code = p_room_code;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room not found'; END IF;

  UPDATE public.game_state SET
    phase = COALESCE(p_phase, game_state.phase),
    active_player_id = COALESCE(p_active_player_id, game_state.active_player_id),
    draw_pile = COALESCE(p_draw_pile, game_state.draw_pile),
    active_card = COALESCE(p_active_card, game_state.active_card),
    round = COALESCE(p_round, game_state.round),
    updated_at = now()
  WHERE room_id = target_room.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Place card on timeline
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
    INSERT INTO public.timelines (player_id, song_id, position)
    VALUES (p_player_id, p_song_id, p_position)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Check win: player has 10 timeline entries
  IF p_correct AND (SELECT COUNT(*) FROM public.timelines WHERE player_id = p_player_id) >= 10 THEN
    UPDATE public.rooms SET winner_player_id = p_player_id, status = 'finished' WHERE id = target_room.id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Use a challenge token
CREATE OR REPLACE FUNCTION public.use_token(
  p_room_code VARCHAR,
  p_player_id UUID
)
RETURNS void AS $$
DECLARE
  target_room RECORD;
BEGIN
  SELECT * INTO target_room FROM public.rooms WHERE code = p_room_code;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room not found'; END IF;

  UPDATE public.players SET tokens = GREATEST(tokens - 1, 0)
  WHERE id = p_player_id AND room_id = target_room.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow room members to update game_state (for any player's turn)
DROP POLICY IF EXISTS "Participants can update game state" ON public.game_state;
CREATE POLICY "Participants can update game state" ON public.game_state FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.players WHERE players.room_id = game_state.room_id AND players.user_id = auth.uid())
);

-- Allow players to insert their own timeline entries
DROP POLICY IF EXISTS "Players can add to timeline" ON public.timelines;
CREATE POLICY "Players can add to timeline" ON public.timelines FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.players WHERE players.id = timelines.player_id AND players.user_id = auth.uid())
);

-- Allow players to update their own token count
CREATE POLICY "Players can update own tokens" ON public.players FOR UPDATE USING (
  user_id = auth.uid()
);

-- Ensure realtime broadcasts changes to game_state
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_state;
