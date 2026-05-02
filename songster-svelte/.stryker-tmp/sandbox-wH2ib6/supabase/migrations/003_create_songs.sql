-- songs table for E1 — Music Library & Audio Previews
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deezer_id BIGINT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  year INT NOT NULL,
  preview_url TEXT,
  cover_small TEXT,
  cover_medium TEXT,
  duration INT DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: anyone can read, only authenticated can write
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "songs_read_all" ON public.songs FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "songs_insert_host" ON public.songs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "songs_update_host" ON public.songs FOR UPDATE TO authenticated USING (true);

-- Indexes
CREATE INDEX idx_songs_deezer_id ON public.songs (deezer_id);
CREATE INDEX idx_songs_artist_title ON public.songs USING gin (to_tsvector('english', artist || ' ' || title));

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.songs;
