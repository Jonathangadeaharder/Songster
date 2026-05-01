# ADR-002: Deezer 30-second preview as MVP music provider

**Date:** 2026-04-28
**Status:** Accepted
**Deciders:** Jonathan Harder

---

## Context

Songster requires audio playback of song snippets so players can identify the track and place it correctly on the timeline. We need a music provider that:

1. **Requires no key for basic use** — reduces MVP friction; no OAuth dance for anonymous players.
2. **Provides consistent metadata** — track title, artist, release year (needed for timeline scoring).
3. **Offers reasonable audio quality** — recognisable 30-second clips.
4. **Is legally usable** — preview URLs are licensed for streaming inside apps.
5. **Has a free tier** — Songster is pre-revenue; zero API cost is essential for MVP.

We evaluated the following options:

| Provider | Free tier | Key required | Preview length | Year metadata |
|----------|-----------|--------------|----------------|---------------|
| **Deezer** | Yes (public API) | No (for previews) | 30 s | Yes |
| Spotify | Yes | Yes (OAuth) | 30 s | Yes |
| Apple Music | No | Yes (MusicKit JWT) | 30 s | Yes |
| YouTube | Yes | Yes (API key) | Full track | Partial |
| Last.fm | Yes | Yes | No audio | Yes |

### Deezer

Deezer's public API exposes `preview` URLs (MP3, 128 kbps, 30 s) for every track in their catalogue without authentication. The `GET /track/{id}` endpoint returns `title`, `artist.name`, `album.release_date`, and `preview` (direct MP3 URL).

The URL format is stable and served from Deezer's CDN (`cdnt-preview-*.dzcdn.net`). No CORS restrictions for browser fetch/Audio playback.

### Spotify

Spotify provides a `preview_url` field on track objects, but:
- Requires OAuth 2.0 client credentials or user auth.
- `preview_url` is null for ~30% of tracks (especially non-Western markets).
- App registration and approval process adds friction.

### Apple Music

Requires a developer account and MusicKit JWT signed with a private key. Per-user MediaSession auth needed for playback in browsers. Too heavy for an MVP with anonymous users.

---

## Decision

We use **Deezer 30-second previews** as the MVP music provider.

The `songs.ts` module exposes a `getDeezerTrack(id)` helper that fetches track metadata (title, artist, year) and the `preview` URL. Audio playback is handled by the Web Audio API in `audio.ts`. No server-side proxy is required for previews because Deezer CDN allows direct browser requests.

The architecture is provider-agnostic: `songs.ts` exports a `Track` interface, and swapping to Spotify requires only replacing `getDeezerTrack` with a Spotify equivalent — the game logic and audio engine are unaffected.

---

## Consequences

### Positive

- Zero API keys required for MVP — guests can play immediately.
- Consistent 30 s preview for every track — good enough to identify songs.
- Release year always present in `album.release_date` — critical for timeline placement.
- Direct browser CDN playback — no server proxy needed, lowest possible latency.

### Negative / trade-offs

- Deezer catalogue is smaller than Spotify in some regions.
- Preview quality capped at 128 kbps (acceptable for game use).
- Deezer's public API terms prohibit commercial use without a partner agreement — this will need revisiting pre-launch if Songster becomes revenue-generating.
- No server-side caching of preview URLs today; if Deezer CDN URLs expire (unlikely), the client would need a refresh.

### Neutral

- `DEEZER_APP_ID` / `DEEZER_SECRET` are stubbed in `.env.example` for a future server-side proxy if rate limiting becomes an issue.
- Switching to Spotify later requires adding OAuth flow (see E3/E4) and updating `songs.ts` only.
