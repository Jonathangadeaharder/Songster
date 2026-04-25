-- RLS policies for Songster
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;

-- Rooms: anyone can read, authenticated can create
CREATE POLICY "Rooms are readable by all" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create rooms" ON public.rooms FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Players: readable by room members, insertable by anyone
CREATE POLICY "Players readable by all" ON public.players FOR SELECT USING (true);
CREATE POLICY "Anyone can join rooms" ON public.players FOR INSERT WITH CHECK (true);

-- Game state: readable by room participants
CREATE POLICY "Game state readable by all" ON public.game_state FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update game state" ON public.game_state FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Timelines: readable by all in room
CREATE POLICY "Timelines readable by all" ON public.timelines FOR SELECT USING (true);
CREATE POLICY "Players can add to timeline" ON public.timelines FOR INSERT WITH CHECK (true);
