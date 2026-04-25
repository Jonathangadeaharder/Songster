-- RLS policies for Songster
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;

-- Rooms: readable by room members, creatable by authenticated users
CREATE POLICY "Rooms readable by members" ON public.rooms FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.players WHERE players.room_id = rooms.id AND players.user_id = auth.uid())
);
CREATE POLICY "Authenticated users can create rooms" ON public.rooms FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Players: readable by room members, insertable by authenticated users
CREATE POLICY "Players readable by room members" ON public.players FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.players p WHERE p.room_id = players.room_id AND p.user_id = auth.uid())
);
CREATE POLICY "Authenticated users can join rooms" ON public.players FOR INSERT WITH CHECK (user_id = auth.uid());

-- Game state: readable by room participants
CREATE POLICY "Game state readable by participants" ON public.game_state FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.players WHERE players.room_id = game_state.room_id AND players.user_id = auth.uid())
);
CREATE POLICY "Participants can update game state" ON public.game_state FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.players WHERE players.room_id = game_state.room_id AND players.user_id = auth.uid())
);

-- Timelines: readable by room members, insertable by room members
CREATE POLICY "Timelines readable by room members" ON public.timelines FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.players p WHERE p.room_id = (SELECT room_id FROM public.players pl WHERE pl.id = timelines.player_id) AND p.user_id = auth.uid())
);
CREATE POLICY "Players can add to timeline" ON public.timelines FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.players WHERE players.id = timelines.player_id AND players.user_id = auth.uid())
);
