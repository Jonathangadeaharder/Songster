-- Migration 005: Game features — history, leaderboard, spectators, rematch

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
