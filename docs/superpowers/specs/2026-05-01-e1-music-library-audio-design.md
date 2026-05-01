# E1 — Music Library & Audio Previews: Design Spec

**Date:** 2026-05-01
**Epic:** [EPIC] E1 — Music Library & Audio Previews (SONG-019)
**ADR:** ADR-002 (Deezer 30s preview, accepted)

---

## Overview

Replace the legacy iTunes-based audio preview system with a provider-agnostic music layer backed by Deezer. The system provides track search, metadata, 30-second preview playback, and song persistence for game rounds.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Client                                              │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ DeckBuilder│  │ audio.ts     │  │ Waveform.svelte│  │
│  │ (E1.4)    │  │ (E1.5)       │  │ (E1.6)        │  │
│  └─────┬─────┘  └──────┬───────┘  └───────┬───────┘  │
│        │               │                   │          │
│        ▼               ▼                   ▼          │
│  ┌──────────────────────────────────────────────┐    │
│  │          provider/deezer.ts                  │    │
│  │  search(query) → Track[]                     │    │
│  │  getTrack(deezerId) → Track                  │    │
│  └──────────────────┬───────────────────────────┘    │
│                     │                                │
│  ┌──────────────────▼───────────────────────────┐    │
│  │  /api/track/search (SvelteKit BFF)   (E1.2) │    │
│  │  GET ?q=<query>&limit=<n>                    │    │
│  │  GET /<deezerId>                             │    │
│  └──────────────────┬───────────────────────────┘    │
└─────────────────────┼───────────────────────────────┘
                      │
           Deezer Public API
           (CORS-allowed for previews)
```

## Data Types

```typescript
// Extends existing Song type
interface Track extends Song {
  deezer_id: number;
  preview_url: string;
  cover_small: string | null;
  cover_medium: string | null;
  duration: number; // seconds
}

// Provider interface (swappable)
interface MusicProvider {
  search(query: string, limit?: number): Promise<Track[]>;
  getTrack(deezerId: number): Promise<Track | null>;
}
```

## Work Items (execution order)

### E1.1 — ADR: pick music provider (DONE)
ADR-002 accepted. Deezer chosen.

### E1.0 — Spike: Deezer 30s preview from SvelteKit BFF
**Status:** Validated by this design.
- Deezer CDN preview URLs are CORS-accessible from browsers.
- Search endpoint (`api.deezer.com/search`) works from server-side BFF.
- Rate limiting: 50 requests/second (generous for game use).
- Attribution: "Powered by Deezer" link required in UI.

### E1.3 — songs DB table + Supabase migration
**Supabase migration:** `supabase/migrations/YYYYMMDD_create_songs.sql`

```sql
CREATE TABLE songs (
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

-- RLS: anyone can read, only authenticated host can write
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "songs_read_all" ON songs FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "songs_insert_host" ON songs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "songs_update_host" ON songs FOR UPDATE TO authenticated USING (true);

CREATE INDEX idx_songs_deezer_id ON songs (deezer_id);
CREATE INDEX idx_songs_artist_title ON songs USING gin (to_tsvector('english', artist || ' ' || title));
```

### E1.2 — Server-side track search proxy
**Files:**
- `src/routes/api/track/search/+server.ts` — `GET /api/track/search?q=<query>&limit=<n>`
- `src/routes/api/track/[id]/+server.ts` — `GET /api/track/<deezerId>`

**Behavior:**
1. Accept search query from client.
2. Proxy to `https://api.deezer.com/search?q=<query>&limit=<n>&output=json`.
3. Map Deezer response to `Track[]`.
4. Cache results in-memory (LRU, max 100 entries, 5min TTL).
5. On track detail fetch, upsert to `songs` table if not present.

**Error handling:**
- Deezer rate limit (429): return 503 with Retry-After header.
- Network error: return 502.
- Empty results: return 200 with empty array.

### E1.4 — Deck builder UI (host)
**File:** `src/routes/lobby/[code]/DeckBuilder.svelte`

**Features:**
- Search input with debounce (300ms).
- Results list showing title, artist, year, cover thumbnail.
- Add/remove songs to deck.
- Deck preview showing selected songs.
- "Use these songs" button saves deck to room state.

### E1.5 — Robust audio.ts
**File:** `src/lib/audio.ts` (rewrite)

**Features:**
- Replace iTunes fetch with Deezer preview URLs (from Track).
- `AudioManager` class (singleton):
  - `play(track: Track)`: load preview_url, fade in (200ms), play.
  - `stop()`: fade out (150ms), stop, cleanup.
  - `preload(tracks: Track[])`: preload first N preview URLs.
  - Mobile unlock: handle autoplay policy on first user interaction.
- AbortController for cancelling in-flight loads.
- Preload queue: max 3 concurrent loads.

### E1.6 — Real-time waveform (AnalyserNode)
**File:** `src/lib/components/Waveform.svelte` (enhance existing)

**Features:**
- Connect `HTMLAudioElement` → `AudioContext` → `AnalyserNode`.
- Draw frequency bars on `<canvas>`.
- Animation loop synced to `requestAnimationFrame`.
- Respect `prefers-reduced-motion`: show static bars instead of animated.

### E1.7 — Licensing/copyright + attribution UI
**File:** `src/lib/components/DeezerAttribution.svelte`

- "Powered by Deezer" badge in footer/footer area.
- Link to Deezer track page for current song.
- Complies with Deezer API terms (attribution required).

### E1.8 — Audio test cassettes + provider mocks
**Files:**
- `src/lib/__tests__/provider/deezer.test.ts`
- `src/lib/__tests__/audio.test.ts` (rewrite)
- `src/test-fixtures/deezer-search-response.json`
- `src/test-fixtures/deezer-track-response.json`

**MSW handlers** for:
- `GET /api/track/search*` → returns fixture
- `GET /api/track/*` → returns fixture
- Network error scenarios
- Rate limit scenarios

## Testing Strategy

- **Unit:** vitest with MSW for API mocking. Each module tested in isolation.
- **Coverage:** 90% branch minimum on all new/modified files.
- **Fixtures:** Real Deezer API responses captured as JSON cassettes.
- **Mutation:** Stryker for audio.ts and provider/deezer.ts.

## File Changes Summary

| File | Action |
|------|--------|
| `src/lib/types.ts` | Add `Track` interface, `MusicProvider` interface |
| `src/lib/audio.ts` | Rewrite: `AudioManager` with Deezer, fade, abort, mobile unlock |
| `src/lib/songs.ts` | Add `trackToSong()` converter, keep game logic |
| `src/lib/provider/deezer.ts` | New: Deezer API client |
| `src/routes/api/track/search/+server.ts` | New: BFF search proxy |
| `src/routes/api/track/[id]/+server.ts` | New: BFF track detail |
| `src/lib/components/DeckBuilder.svelte` | New: host deck builder UI |
| `src/lib/components/Waveform.svelte` | Enhance: real AnalyserNode visualization |
| `src/lib/components/DeezerAttribution.svelte` | New: attribution badge |
| `supabase/migrations/*_create_songs.sql` | New: songs table migration |
| Test files (6+) | New/rewrite: full test coverage |
| `vitest.config.ts` | Update coverage includes |

## Dependencies

- No new npm packages required (Web Audio API, fetch are native).
- Supabase client already installed.
- Existing test infrastructure (vitest, msw, playwright) sufficient.
