-- Songster initial schema
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  host_id UUID REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'waiting',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(50) NOT NULL,
  avatar VARCHAR(2) DEFAULT '♪',
  tokens INT DEFAULT 3,
  is_host BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.game_state (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID UNIQUE REFERENCES public.rooms(id) ON DELETE CASCADE,
  round INT DEFAULT 1,
  phase VARCHAR(20) DEFAULT 'draw',
  active_player_id UUID REFERENCES public.players(id),
  draw_pile JSONB DEFAULT '[]',
  active_card JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.timelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  song_id VARCHAR(10) NOT NULL,
  position INT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT now()
);

-- RPC: Create room
CREATE OR REPLACE FUNCTION public.create_room(host_name VARCHAR)
RETURNS public.rooms AS $$
DECLARE
  new_room public.rooms;
  new_player public.players;
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  room_code VARCHAR(8) := '';
BEGIN
  FOR i IN 1..6 LOOP
    room_code := room_code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  
  INSERT INTO public.rooms (code, host_id) VALUES (room_code, auth.uid()) RETURNING * INTO new_room;
  INSERT INTO public.players (room_id, user_id, name, is_host) VALUES (new_room.id, auth.uid(), host_name, true) RETURNING * INTO new_player;
  RETURN new_room;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Join room
CREATE OR REPLACE FUNCTION public.join_room(room_code VARCHAR, player_name VARCHAR)
RETURNS public.players AS $$
DECLARE
  target_room public.rooms;
  new_player public.players;
BEGIN
  SELECT * INTO target_room FROM public.rooms WHERE code = room_code;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room not found'; END IF;
  
  INSERT INTO public.players (room_id, user_id, name)
  VALUES (target_room.id, auth.uid(), player_name) RETURNING * INTO new_player;
  RETURN new_player;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_state;
ALTER PUBLICATION supabase_realtime ADD TABLE public.timelines;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rooms_code ON public.rooms(code);
CREATE INDEX IF NOT EXISTS idx_players_room_id ON public.players(room_id);
CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
