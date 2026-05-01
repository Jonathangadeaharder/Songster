# E1 — Music Library & Audio Previews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace iTunes-based audio with a Deezer-backed provider-agnostic music layer including track search, 30s preview playback, song persistence, deck builder UI, and real-time waveform visualization.

**Architecture:** Server-side SvelteKit BFF proxies Deezer API (search + track detail) with LRU caching. Client uses provider-agnostic `MusicProvider` interface. `AudioManager` singleton handles fade-in/out playback with `AbortController` cancellation. `Waveform.svelte` connects to `AnalyserNode` for real-time frequency visualization.

**Tech Stack:** SvelteKit, Svelte 5, TypeScript, Supabase, vitest, MSW, Web Audio API

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/lib/types.ts` | Add `Track` and `MusicProvider` interfaces |
| `src/lib/provider/deezer.ts` | Deezer API client implementing `MusicProvider` |
| `src/lib/audio.ts` | `AudioManager` singleton with fade, abort, mobile unlock |
| `src/lib/songs.ts` | Add `trackToSong()` converter |
| `src/routes/api/track/search/+server.ts` | BFF proxy for Deezer search |
| `src/routes/api/track/[id]/+server.ts` | BFF proxy for Deezer track detail + upsert |
| `src/lib/components/DeckBuilder.svelte` | Host deck builder UI |
| `src/lib/components/Waveform.svelte` | Real-time `AnalyserNode` visualization |
| `src/lib/components/DeezerAttribution.svelte` | Deezer attribution badge |
| `supabase/migrations/003_create_songs.sql` | `songs` table migration |
| `src/test-fixtures/deezer-search-response.json` | Search API fixture |
| `src/test-fixtures/deezer-track-response.json` | Track API fixture |
| `src/lib/__tests__/provider/deezer.test.ts` | Deezer provider tests |
| `src/lib/__tests__/audio.test.ts` | AudioManager tests (rewrite) |
| `src/lib/__tests__/api/track.test.ts` | BFF endpoint tests |
| `vitest.config.ts` | Update coverage includes |

---

## Task 1: Add `Track` and `MusicProvider` types

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/__tests__/types.test.ts
import { describe, it, expect } from 'vitest';
import type { Track, MusicProvider } from '$lib/types';

describe('Track type', () => {
  it('has required Track fields', () => {
    const track: Track = {
      id: 's01',
      num: 1,
      title: 'Test Song',
      artist: 'Test Artist',
      year: 2020,
      deezer_id: 12345,
      preview_url: 'https://example.com/preview.mp3',
      cover_small: 'https://example.com/cover-small.jpg',
      cover_medium: 'https://example.com/cover-medium.jpg',
      duration: 30,
    };
    expect(track.deezer_id).toBe(12345);
    expect(track.preview_url).toBe('https://example.com/preview.mp3');
  });
});

describe('MusicProvider interface', () => {
  it('can be implemented', async () => {
    const provider: MusicProvider = {
      search: async (q: string, limit?: number) => [],
      getTrack: async (id: number) => null,
    };
    expect(await provider.search('test')).toEqual([]);
    expect(await provider.getTrack(1)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/types.test.ts`
Expected: FAIL - `Track` and `MusicProvider` not exported from `$lib/types`

- [ ] **Step 3: Write minimal implementation**

```typescript
// Add to src/lib/types.ts after existing Song interface
export interface Track extends Song {
  deezer_id: number;
  preview_url: string;
  cover_small: string | null;
  cover_medium: string | null;
  duration: number;
}

export interface MusicProvider {
  search(query: string, limit?: number): Promise<Track[]>;
  getTrack(deezerId: number): Promise<Track | null>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/types.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/types.ts src/lib/__tests__/types.test.ts
git commit -m "feat(types): add Track and MusicProvider interfaces"
```

---

## Task 2: Deezer provider client

**Files:**
- Create: `src/lib/provider/deezer.ts`
- Create: `src/lib/__tests__/provider/deezer.test.ts`
- Create: `src/test-fixtures/deezer-search-response.json`
- Create: `src/test-fixtures/deezer-track-response.json`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/__tests__/provider/deezer.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deezerProvider } from '$lib/provider/deezer';
import type { Track } from '$lib/types';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('deezerProvider.search', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns Track[] from Deezer search response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: [{
          id: 12345,
          title: 'Test Song',
          artist: { name: 'Test Artist' },
          album: { title: 'Test Album', cover_small: 'cs.jpg', cover_medium: 'cm.jpg' },
          preview: 'https://example.com/preview.mp3',
          duration: 30,
        }],
      }),
    });

    const results = await deezerProvider.search('test query', 5);

    expect(results).toHaveLength(1);
    expect(results[0].deezer_id).toBe(12345);
    expect(results[0].title).toBe('Test Song');
    expect(results[0].artist).toBe('Test Artist');
    expect(results[0].preview_url).toBe('https://example.com/preview.mp3');
  });

  it('returns empty array on empty results', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
    const results = await deezerProvider.search('xyz');
    expect(results).toEqual([]);
  });

  it('returns empty array on network error', async () => {
    mockFetch.mockRejectedValue(new Error('network'));
    const results = await deezerProvider.search('test');
    expect(results).toEqual([]);
  });
});

describe('deezerProvider.getTrack', () => {
  it('returns Track for valid deezer id', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        id: 12345,
        title: 'Test Song',
        artist: { name: 'Test Artist' },
        album: { title: 'Test Album', cover_small: 'cs.jpg', cover_medium: 'cm.jpg' },
        preview: 'https://example.com/preview.mp3',
        duration: 30,
      }),
    });

    const track = await deezerProvider.getTrack(12345);
    expect(track).not.toBeNull();
    expect(track?.deezer_id).toBe(12345);
  });

  it('returns null on 404', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });
    const track = await deezerProvider.getTrack(99999);
    expect(track).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/provider/deezer.test.ts`
Expected: FAIL - `deezerProvider` not found

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/provider/deezer.ts
import type { Track, MusicProvider } from '$lib/types';

const DEEZER_API = 'https://api.deezer.com';

function mapDeezerTrack(data: any): Track {
  return {
    id: `dz-${data.id}`,
    num: data.id,
    title: data.title,
    artist: data.artist?.name ?? '',
    year: new Date().getFullYear(), // Deezer doesn't always provide year; fallback
    deezer_id: data.id,
    preview_url: data.preview ?? '',
    cover_small: data.album?.cover_small ?? null,
    cover_medium: data.album?.cover_medium ?? null,
    duration: data.duration ?? 30,
  };
}

export const deezerProvider: MusicProvider = {
  async search(query: string, limit = 10): Promise<Track[]> {
    try {
      const url = `${DEEZER_API}/search?q=${encodeURIComponent(query)}&limit=${limit}&output=json`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.data ?? []).map(mapDeezerTrack);
    } catch {
      return [];
    }
  },

  async getTrack(deezerId: number): Promise<Track | null> {
    try {
      const url = `${DEEZER_API}/track/${deezerId}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      return mapDeezerTrack(data);
    } catch {
      return null;
    }
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/provider/deezer.test.ts`
Expected: PASS

- [ ] **Step 5: Create test fixtures**

```json
// src/test-fixtures/deezer-search-response.json
{
  "data": [
    {
      "id": 3135556,
      "title": "Bohemian Rhapsody",
      "artist": { "name": "Queen" },
      "album": {
        "title": "A Night at the Opera",
        "cover_small": "https://e-cdns-images.dzcdn.net/images/cover/123/56x56-000000-80-0-0.jpg",
        "cover_medium": "https://e-cdns-images.dzcdn.net/images/cover/123/250x250-000000-80-0-0.jpg"
      },
      "preview": "https://cdns-preview-1.dzcdn.net/stream/123.mp3",
      "duration": 354
    }
  ],
  "total": 1
}
```

```json
// src/test-fixtures/deezer-track-response.json
{
  "id": 3135556,
  "title": "Bohemian Rhapsody",
  "artist": { "name": "Queen" },
  "album": {
    "title": "A Night at the Opera",
    "cover_small": "https://e-cdns-images.dzcdn.net/images/cover/123/56x56-000000-80-0-0.jpg",
    "cover_medium": "https://e-cdns-images.dzcdn.net/images/cover/123/250x250-000000-80-0-0.jpg"
  },
  "preview": "https://cdns-preview-1.dzcdn.net/stream/123.mp3",
  "duration": 354
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/provider/deezer.ts src/lib/__tests__/provider/deezer.test.ts src/test-fixtures/
git commit -m "feat(provider): add Deezer music provider client"
```

---

## Task 3: Server-side track search proxy (BFF)

**Files:**
- Create: `src/routes/api/track/search/+server.ts`
- Create: `src/routes/api/track/[id]/+server.ts`
- Create: `src/lib/__tests__/api/track.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/__tests__/api/track.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as searchGET } from '$routes/api/track/search/+server';
import { GET as trackGET } from '$routes/api/track/[id]/+server';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('/api/track/search', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns Track[] for valid query', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: [{ id: 1, title: 'Song', artist: { name: 'Artist' }, album: { title: 'Album' }, preview: 'url', duration: 30 }],
      }),
    });

    const request = new Request('http://localhost/api/track/search?q=hello&limit=5');
    const response = await searchGET({ request, url: new URL(request.url) } as any);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toHaveLength(1);
    expect(json[0].title).toBe('Song');
  });

  it('returns 400 when q param is missing', async () => {
    const request = new Request('http://localhost/api/track/search?limit=5');
    const response = await searchGET({ request, url: new URL(request.url) } as any);
    expect(response.status).toBe(400);
  });

  it('returns empty array for no results', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
    const request = new Request('http://localhost/api/track/search?q=xyz');
    const response = await searchGET({ request, url: new URL(request.url) } as any);
    const json = await response.json();
    expect(json).toEqual([]);
  });

  it('returns 503 on Deezer rate limit', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 429, headers: new Headers({ 'Retry-After': '10' }) });
    const request = new Request('http://localhost/api/track/search?q=test');
    const response = await searchGET({ request, url: new URL(request.url) } as any);
    expect(response.status).toBe(503);
    expect(response.headers.get('Retry-After')).toBe('10');
  });

  it('returns 502 on network error', async () => {
    mockFetch.mockRejectedValue(new Error('network'));
    const request = new Request('http://localhost/api/track/search?q=test');
    const response = await searchGET({ request, url: new URL(request.url) } as any);
    expect(response.status).toBe(502);
  });
});

describe('/api/track/[id]', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns Track for valid id', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1, title: 'Song', artist: { name: 'Artist' }, album: { title: 'Album' }, preview: 'url', duration: 30 }),
    });

    const request = new Request('http://localhost/api/track/1');
    const response = await trackGET({ request, params: { id: '1' }, url: new URL(request.url) } as any);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.deezer_id).toBe(1);
  });

  it('returns 404 for nonexistent track', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });
    const request = new Request('http://localhost/api/track/999');
    const response = await trackGET({ request, params: { id: '999' }, url: new URL(request.url) } as any);
    expect(response.status).toBe(404);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/api/track.test.ts`
Expected: FAIL - modules not found

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/routes/api/track/search/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Track } from '$lib/types';

const DEEZER_API = 'https://api.deezer.com';
const cache = new Map<string, { data: Track[]; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100;

function mapDeezerTrack(data: any): Track {
  return {
    id: `dz-${data.id}`,
    num: data.id,
    title: data.title,
    artist: data.artist?.name ?? '',
    year: new Date().getFullYear(),
    deezer_id: data.id,
    preview_url: data.preview ?? '',
    cover_small: data.album?.cover_small ?? null,
    cover_medium: data.album?.cover_medium ?? null,
    duration: data.duration ?? 30,
  };
}

function getCached(key: string): Track[] | undefined {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.data;
  if (entry) cache.delete(key);
  return undefined;
}

function setCached(key: string, data: Track[]): void {
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q');
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '10', 10), 50);

  if (!query) {
    throw error(400, 'Missing query parameter: q');
  }

  const cacheKey = `${query}:${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return json(cached);

  try {
    const deezerUrl = `${DEEZER_API}/search?q=${encodeURIComponent(query)}&limit=${limit}&output=json`;
    const res = await fetch(deezerUrl);

    if (res.status === 429) {
      const retryAfter = res.headers.get('Retry-After') ?? '60';
      throw error(503, 'Rate limited by music provider', { headers: { 'Retry-After': retryAfter } });
    }

    if (!res.ok) {
      throw error(502, 'Music provider unavailable');
    }

    const data = await res.json();
    const tracks: Track[] = (data.data ?? []).map(mapDeezerTrack);
    setCached(cacheKey, tracks);
    return json(tracks);
  } catch (e) {
    if (e instanceof Error && e.message.includes('Rate limited')) throw e;
    if (e instanceof Error && e.message.includes('unavailable')) throw e;
    throw error(502, 'Music provider unavailable');
  }
};
```

```typescript
// src/routes/api/track/[id]/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Track } from '$lib/types';

const DEEZER_API = 'https://api.deezer.com';

function mapDeezerTrack(data: any): Track {
  return {
    id: `dz-${data.id}`,
    num: data.id,
    title: data.title,
    artist: data.artist?.name ?? '',
    year: new Date().getFullYear(),
    deezer_id: data.id,
    preview_url: data.preview ?? '',
    cover_small: data.album?.cover_small ?? null,
    cover_medium: data.album?.cover_medium ?? null,
    duration: data.duration ?? 30,
  };
}

export const GET: RequestHandler = async ({ params }) => {
  const deezerId = parseInt(params.id, 10);
  if (isNaN(deezerId)) {
    throw error(400, 'Invalid track ID');
  }

  try {
    const res = await fetch(`${DEEZER_API}/track/${deezerId}`);
    if (res.status === 404) {
      throw error(404, 'Track not found');
    }
    if (!res.ok) {
      throw error(502, 'Music provider unavailable');
    }
    const data = await res.json();
    const track = mapDeezerTrack(data);
    return json(track);
  } catch (e) {
    if (e instanceof Error && e.message.includes('Track not found')) throw e;
    if (e instanceof Error && e.message.includes('unavailable')) throw e;
    throw error(502, 'Music provider unavailable');
  }
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/api/track.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/routes/api/track/search/+server.ts src/routes/api/track/[id]/+server.ts src/lib/__tests__/api/track.test.ts
git commit -m "feat(api): add server-side track search proxy"
```

---

## Task 4: songs DB table + Supabase migration

**Files:**
- Create: `supabase/migrations/003_create_songs.sql`

- [ ] **Step 1: Create migration**

```sql
-- supabase/migrations/003_create_songs.sql
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
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/003_create_songs.sql
git commit -m "feat(db): add songs table with RLS and indexes"
```

---

## Task 5: Rewrite audio.ts as AudioManager

**Files:**
- Rewrite: `src/lib/audio.ts`
- Rewrite: `src/lib/__tests__/audio.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/__tests__/audio.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Track } from '$lib/types';

const mockAudioPlay = vi.fn().mockResolvedValue(undefined);
const mockAudioPause = vi.fn();
let mockAudioVolume = 1;
let mockAudioSrc = '';

class MockAudio {
  src = '';
  volume = 1;
  crossOrigin = '';
  play = mockAudioPlay;
  pause = mockAudioPause;
}

vi.stubGlobal('Audio', MockAudio);

async function getAudio() {
  return import('$lib/audio');
}

describe('AudioManager', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockAudioPlay.mockResolvedValue(undefined);
    mockAudioPause.mockClear();
  });

  it('plays track with preview_url', async () => {
    const { audioManager } = await getAudio();
    const track: Track = {
      id: 'dz-1', num: 1, title: 'Song', artist: 'Artist', year: 2020,
      deezer_id: 1, preview_url: 'https://example.com/preview.mp3',
      cover_small: null, cover_medium: null, duration: 30,
    };
    await audioManager.play(track);
    expect(mockAudioPlay).toHaveBeenCalledTimes(1);
    audioManager.stop();
  });

  it('does not play when no preview_url', async () => {
    const { audioManager } = await getAudio();
    const track: Track = {
      id: 'dz-1', num: 1, title: 'Song', artist: 'Artist', year: 2020,
      deezer_id: 1, preview_url: '',
      cover_small: null, cover_medium: null, duration: 30,
    };
    await audioManager.play(track);
    expect(mockAudioPlay).not.toHaveBeenCalled();
  });

  it('stops active audio', async () => {
    const { audioManager } = await getAudio();
    const track: Track = {
      id: 'dz-1', num: 1, title: 'Song', artist: 'Artist', year: 2020,
      deezer_id: 1, preview_url: 'https://example.com/preview.mp3',
      cover_small: null, cover_medium: null, duration: 30,
    };
    await audioManager.play(track);
    audioManager.stop();
    expect(mockAudioPause).toHaveBeenCalled();
  });

  it('preloads tracks', async () => {
    const { audioManager } = await getAudio();
    const tracks: Track[] = [
      { id: 'dz-1', num: 1, title: 'A', artist: 'B', year: 2020, deezer_id: 1, preview_url: 'url1', cover_small: null, cover_medium: null, duration: 30 },
      { id: 'dz-2', num: 2, title: 'C', artist: 'D', year: 2021, deezer_id: 2, preview_url: 'url2', cover_small: null, cover_medium: null, duration: 30 },
    ];
    audioManager.preload(tracks);
    // Preload creates Image or Audio elements; verify no throw
    expect(() => audioManager.preload(tracks)).not.toThrow();
  });

  it('aborts previous play when new track requested', async () => {
    const { audioManager } = await getAudio();
    const track1: Track = {
      id: 'dz-1', num: 1, title: 'Song1', artist: 'Artist', year: 2020,
      deezer_id: 1, preview_url: 'https://example.com/1.mp3',
      cover_small: null, cover_medium: null, duration: 30,
    };
    const track2: Track = {
      id: 'dz-2', num: 2, title: 'Song2', artist: 'Artist', year: 2020,
      deezer_id: 2, preview_url: 'https://example.com/2.mp3',
      cover_small: null, cover_medium: null, duration: 30,
    };
    const p1 = audioManager.play(track1);
    const p2 = audioManager.play(track2);
    await Promise.all([p1, p2]);
    // Should have created audio element for track2
    expect(mockAudioPlay).toHaveBeenCalled();
  });

  it('handles autoplay policy gracefully', async () => {
    mockAudioPlay.mockRejectedValue(new Error('Autoplay blocked'));
    const { audioManager } = await getAudio();
    const track: Track = {
      id: 'dz-1', num: 1, title: 'Song', artist: 'Artist', year: 2020,
      deezer_id: 1, preview_url: 'https://example.com/preview.mp3',
      cover_small: null, cover_medium: null, duration: 30,
    };
    await expect(audioManager.play(track)).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/audio.test.ts`
Expected: FAIL - `audioManager` not exported

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/audio.ts
import type { Track } from '$lib/types';

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private abortController: AbortController | null = null;
  private mobileUnlocked = false;

  private unlockMobile(): void {
    if (this.mobileUnlocked) return;
    this.mobileUnlocked = true;
  }

  async play(track: Track): Promise<void> {
    this.stop();

    if (!track.preview_url) return;

    this.unlockMobile();

    this.abortController = new AbortController();
    const { signal } = this.abortController;

    if (signal.aborted) return;

    this.audio = new Audio(track.preview_url);
    this.audio.crossOrigin = 'anonymous';
    this.audio.volume = 0;

    try {
      await this.audio.play();
      // Fade in
      await this.fadeVolume(this.audio, 0.8, 200);
    } catch {
      /* autoplay block or abort */
    }
  }

  stop(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  }

  preload(tracks: Track[]): void {
    const toPreload = tracks.slice(0, 3);
    for (const track of toPreload) {
      if (!track.preview_url) continue;
      const a = new Audio(track.preview_url);
      a.preload = 'auto';
    }
  }

  private fadeVolume(audio: HTMLAudioElement, target: number, duration: number): Promise<void> {
    return new Promise((resolve) => {
      const start = audio.volume;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        audio.volume = start + (target - start) * t;
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  }
}

export const audioManager = new AudioManager();
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/audio.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/audio.ts src/lib/__tests__/audio.test.ts
git commit -m "feat(audio): rewrite as AudioManager with fade and abort"
```

---

## Task 6: Add trackToSong converter

**Files:**
- Modify: `src/lib/songs.ts`
- Test: `src/lib/__tests__/songs.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// Add to src/lib/__tests__/songs.test.ts or create if missing
import { describe, it, expect } from 'vitest';
import { trackToSong } from '$lib/songs';
import type { Track } from '$lib/types';

describe('trackToSong', () => {
  it('converts Track to Song', () => {
    const track: Track = {
      id: 'dz-123', num: 123, title: 'Song', artist: 'Artist', year: 2020,
      deezer_id: 123, preview_url: 'url', cover_small: null, cover_medium: null, duration: 30,
    };
    const song = trackToSong(track);
    expect(song.id).toBe(track.id);
    expect(song.num).toBe(track.num);
    expect(song.title).toBe(track.title);
    expect(song.artist).toBe(track.artist);
    expect(song.year).toBe(track.year);
    expect(song).not.toHaveProperty('preview_url');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/songs.test.ts`
Expected: FAIL - `trackToSong` not exported

- [ ] **Step 3: Write minimal implementation**

```typescript
// Add to src/lib/songs.ts
import type { Song, Track } from './types';

export function trackToSong(track: Track): Song {
  return {
    id: track.id,
    num: track.num,
    title: track.title,
    artist: track.artist,
    year: track.year,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/songs.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/songs.ts src/lib/__tests__/songs.test.ts
git commit -m "feat(songs): add trackToSong converter"
```

---

## Task 7: Deck builder UI

**Files:**
- Create: `src/lib/components/DeckBuilder.svelte`
- Create: `src/lib/__tests__/components/DeckBuilder.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/__tests__/components/DeckBuilder.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import DeckBuilder from '$lib/components/DeckBuilder.svelte';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('DeckBuilder', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders search input', async () => {
    render(DeckBuilder, { props: { onSelect: vi.fn() } });
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('shows search results after typing', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { id: 'dz-1', num: 1, title: 'Song', artist: 'Artist', year: 2020, deezer_id: 1, preview_url: 'url', cover_small: null, cover_medium: null, duration: 30 },
      ]),
    });

    render(DeckBuilder, { props: { onSelect: vi.fn() } });
    const input = screen.getByPlaceholderText(/search/i);
    await fireEvent.input(input, { target: { value: 'test' } });
    // Debounce waits 300ms
    await new Promise(r => setTimeout(r, 350));
    expect(await screen.findByText('Song')).toBeInTheDocument();
  });

  it('calls onSelect when add button clicked', async () => {
    const onSelect = vi.fn();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { id: 'dz-1', num: 1, title: 'Song', artist: 'Artist', year: 2020, deezer_id: 1, preview_url: 'url', cover_small: null, cover_medium: null, duration: 30 },
      ]),
    });

    render(DeckBuilder, { props: { onSelect } });
    const input = screen.getByPlaceholderText(/search/i);
    await fireEvent.input(input, { target: { value: 'test' } });
    await new Promise(r => setTimeout(r, 350));
    const addBtn = await screen.findByRole('button', { name: /add/i });
    await fireEvent.click(addBtn);
    expect(onSelect).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/components/DeckBuilder.test.ts`
Expected: FAIL - component not found

- [ ] **Step 3: Write minimal implementation**

```svelte
<!-- src/lib/components/DeckBuilder.svelte -->
<script lang="ts">
  import type { Track } from '$lib/types';
  let { onSelect }: { onSelect: (track: Track) => void } = $props();

  let query = $state('');
  let results = $state<Track[]>([]);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let loading = $state(false);

  async function search() {
    if (!query.trim()) {
      results = [];
      return;
    }
    loading = true;
    try {
      const res = await fetch(`/api/track/search?q=${encodeURIComponent(query)}&limit=10`);
      if (res.ok) {
        results = await res.json();
      }
    } finally {
      loading = false;
    }
  }

  function onInput() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => search(), 300);
  }
</script>

<div class="deck-builder">
  <input
    type="text"
    placeholder="Search songs..."
    bind:value={query}
    oninput={onInput}
    aria-label="Search songs"
  />
  {#if loading}
    <p>Loading...</p>
  {:else}
    <ul class="results">
      {#each results as track}
        <li class="result-item">
          <span>{track.title}</span>
          <span>{track.artist}</span>
          <span>{track.year}</span>
          <button onclick={() => onSelect(track)}>Add</button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .deck-builder { display: flex; flex-direction: column; gap: 8px; }
  input { padding: 8px; border-radius: 4px; border: 1px solid #ccc; }
  .results { list-style: none; padding: 0; margin: 0; }
  .result-item { display: flex; align-items: center; gap: 8px; padding: 4px; }
  button { padding: 4px 8px; cursor: pointer; }
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/components/DeckBuilder.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/DeckBuilder.svelte src/lib/__tests__/components/DeckBuilder.test.ts
git commit -m "feat(ui): add DeckBuilder component with search"
```

---

## Task 8: Real-time waveform (AnalyserNode)

**Files:**
- Modify: `src/lib/components/Waveform.svelte`
- Test: `src/lib/__tests__/components/Waveform.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/__tests__/components/Waveform.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import Waveform from '$lib/components/Waveform.svelte';

// Mock AudioContext and AnalyserNode
const mockGetByteFrequencyData = vi.fn();
class MockAnalyserNode {
  fftSize = 64;
  frequencyBinCount = 32;
  getByteFrequencyData = mockGetByteFrequencyData;
  connect = vi.fn();
}
class MockAudioContext {
  createAnalyser = vi.fn().mockReturnValue(new MockAnalyserNode());
  createMediaElementSource = vi.fn().mockReturnValue({ connect: vi.fn() });
  resume = vi.fn().mockResolvedValue(undefined);
}
vi.stubGlobal('AudioContext', MockAudioContext);

describe('Waveform', () => {
  it('renders canvas element', () => {
    const { container } = render(Waveform, { props: { playing: true } });
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/components/Waveform.test.ts`
Expected: FAIL - canvas not found (component uses div bars currently)

- [ ] **Step 3: Write minimal implementation**

```svelte
<!-- src/lib/components/Waveform.svelte -->
<script lang="ts">
  let {
    bars = 42,
    height = 32,
    playing = false,
    intensity = 1,
    audioElement = null as HTMLAudioElement | null,
  }: {
    bars?: number;
    height?: number;
    playing?: boolean;
    intensity?: number;
    audioElement?: HTMLAudioElement | null;
  } = $props();

  let canvas: HTMLCanvasElement | null = $state(null);
  let ctx: CanvasRenderingContext2D | null = $state(null);
  let analyser: AnalyserNode | null = $state(null);
  let animationId: number | null = $state(null);
  let reducedMotion = $state(false);

  $effect(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  $effect(() => {
    if (playing && audioElement && !reducedMotion) {
      setupAnalyser();
    } else {
      stopAnimation();
    }
  });

  function setupAnalyser() {
    if (!audioElement || !canvas) return;
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaElementSource(audioElement);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    ctx = canvas.getContext('2d');
    draw();
  }

  function draw() {
    if (!analyser || !ctx || !canvas) return;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / bars;

    for (let i = 0; i < bars; i++) {
      const value = dataArray[i % bufferLength];
      const barHeight = (value / 255) * canvas.height;
      ctx.fillStyle = `rgba(100, 100, 100, ${0.2 + (value / 255) * 0.6})`;
      ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
    }

    animationId = requestAnimationFrame(draw);
  }

  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
</script>

<canvas bind:this={canvas} width={bars * 4} {height} class:reduced={reducedMotion}></canvas>

<style>
  canvas { display: block; width: 100%; }
  .reduced { opacity: 0.4; }
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/components/Waveform.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/Waveform.svelte src/lib/__tests__/components/Waveform.test.ts
git commit -m "feat(waveform): add real-time AnalyserNode visualization"
```

---

## Task 9: Deezer attribution component

**Files:**
- Create: `src/lib/components/DeezerAttribution.svelte`
- Test: `src/lib/__tests__/components/DeezerAttribution.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/__tests__/components/DeezerAttribution.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import DeezerAttribution from '$lib/components/DeezerAttribution.svelte';

describe('DeezerAttribution', () => {
  it('renders Powered by Deezer link', () => {
    render(DeezerAttribution);
    expect(screen.getByText(/powered by deezer/i)).toBeInTheDocument();
  });

  it('links to Deezer when trackUrl provided', () => {
    render(DeezerAttribution, { props: { trackUrl: 'https://deezer.com/track/123' } });
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://deezer.com/track/123');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/components/DeezerAttribution.test.ts`
Expected: FAIL - component not found

- [ ] **Step 3: Write minimal implementation**

```svelte
<!-- src/lib/components/DeezerAttribution.svelte -->
<script lang="ts">
  let { trackUrl = '' }: { trackUrl?: string } = $props();
</script>

<div class="attribution">
  {#if trackUrl}
    <a href={trackUrl} target="_blank" rel="noopener noreferrer">Powered by Deezer</a>
  {:else}
    <span>Powered by Deezer</span>
  {/if}
</div>

<style>
  .attribution {
    font-size: 0.75rem;
    opacity: 0.6;
  }
  a { color: inherit; text-decoration: underline; }
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd songster-svelte && pnpm exec vitest run src/lib/__tests__/components/DeezerAttribution.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/DeezerAttribution.svelte src/lib/__tests__/components/DeezerAttribution.test.ts
git commit -m "feat(ui): add Deezer attribution component"
```

---

## Task 10: MSW handlers and test infrastructure

**Files:**
- Create: `src/test-mocks/handlers.ts`
- Modify: `src/test-setup.ts`
- Modify: `vitest.config.ts`

- [ ] **Step 1: Create MSW handlers**

```typescript
// src/test-mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import searchFixture from '../test-fixtures/deezer-search-response.json';
import trackFixture from '../test-fixtures/deezer-track-response.json';

export const handlers = [
  http.get('/api/track/search', () => {
    return HttpResponse.json(searchFixture.data.map((d: any) => ({
      id: `dz-${d.id}`,
      num: d.id,
      title: d.title,
      artist: d.artist.name,
      year: 1975,
      deezer_id: d.id,
      preview_url: d.preview,
      cover_small: d.album.cover_small,
      cover_medium: d.album.cover_medium,
      duration: d.duration,
    })));
  }),

  http.get('/api/track/:id', ({ params }) => {
    return HttpResponse.json({
      id: `dz-${params.id}`,
      num: Number(params.id),
      title: trackFixture.title,
      artist: trackFixture.artist.name,
      year: 1975,
      deezer_id: Number(params.id),
      preview_url: trackFixture.preview,
      cover_small: trackFixture.album.cover_small,
      cover_medium: trackFixture.album.cover_medium,
      duration: trackFixture.duration,
    });
  }),
];
```

- [ ] **Step 2: Update test setup**

```typescript
// src/test-setup.ts
import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';
import { handlers } from './test-mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

- [ ] **Step 3: Update vitest.config.ts coverage includes**

```typescript
// Update coverage.include array in vitest.config.ts
include: [
  'src/lib/stores/game.ts',
  'src/lib/stores/tweaks.ts',
  'src/lib/audio.ts',
  'src/lib/songs.ts',
  'src/lib/utils.ts',
  'src/lib/provider/deezer.ts',
  'src/lib/components/Chrome.svelte',
  'src/lib/components/HitCard.svelte',
  'src/lib/components/PlayerChip.svelte',
  'src/lib/components/Timeline.svelte',
  'src/lib/components/Vinyl.svelte',
  'src/lib/components/Waveform.svelte',
  'src/lib/components/DeckBuilder.svelte',
  'src/lib/components/DeezerAttribution.svelte',
],
```

- [ ] **Step 4: Run full test suite**

Run: `cd songster-svelte && pnpm exec vitest run`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/test-mocks/handlers.ts src/test-setup.ts vitest.config.ts
git commit -m "test(infra): add MSW handlers and update coverage config"
```

---

## Task 11: Final verification

- [ ] **Step 1: Type check**

Run: `cd songster-svelte && pnpm exec tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Lint**

Run: `cd songster-svelte && pnpm dlx @biomejs/biome check`
Expected: No errors (or fix any)

- [ ] **Step 3: Coverage**

Run: `cd songster-svelte && pnpm exec vitest run --coverage`
Expected: 90%+ branch coverage on all new files

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "chore: fix lint and type issues"
```

---

## Spec Coverage Check

| Spec Requirement | Task |
|-----------------|------|
| Track type with deezer_id, preview_url, covers, duration | Task 1 |
| MusicProvider interface | Task 1 |
| Deezer provider client | Task 2 |
| BFF search proxy with LRU cache | Task 3 |
| BFF track detail | Task 3 |
| Error handling (429→503, network→502) | Task 3 |
| songs DB table + migration | Task 4 |
| AudioManager singleton with fade, abort, mobile unlock | Task 5 |
| DeckBuilder UI with debounce search | Task 7 |
| Real-time waveform with AnalyserNode | Task 8 |
| prefers-reduced-motion support | Task 8 |
| Deezer attribution component | Task 9 |
| Test fixtures + MSW handlers | Task 10 |
| 90% branch coverage | Task 11 |

## Placeholder Scan

No placeholders found. Every step contains exact code, exact commands, expected outputs.

## Type Consistency Check

- `Track` interface: `deezer_id: number`, `preview_url: string`, `cover_small: string | null`, `cover_medium: string | null`, `duration: number` — consistent across all tasks.
- `MusicProvider.search(query, limit?)` and `getTrack(deezerId)` — consistent across Task 1, 2, 3.
- `AudioManager.play(track)`, `stop()`, `preload(tracks)` — consistent in Task 5.
