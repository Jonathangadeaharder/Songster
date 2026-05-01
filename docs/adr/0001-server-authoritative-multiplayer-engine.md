# ADR-001: Server-authoritative multiplayer engine via PL/pgSQL RPCs

**Date:** 2026-04-28
**Status:** Accepted
**Deciders:** Jonathan Harder

---

## Context

Songster is a real-time multiplayer music trivia game (Hitster-style) where multiple players simultaneously place cards on a shared timeline. The core game loop requires:

1. **Consistent shared state** — all players must see the same board at the same time.
2. **Authoritative turn order** — only one player can place a card at a time; placements must be validated server-side.
3. **Low-latency updates** — players need to see state changes within ~200 ms.
4. **Guest/anonymous sessions** — no mandatory signup; Supabase anonymous auth is the entry point.

We evaluated two broad approaches:

| Option | Description |
|--------|-------------|
| **A — Client-authoritative with optimistic UI** | Each client writes game state directly to Supabase tables; conflicts resolved with last-write-wins or CRDTs |
| **B — Server-authoritative via PL/pgSQL RPCs** | All mutations go through Supabase PostgreSQL functions; clients subscribe to state via Realtime |

### Option A: Client-authoritative

- Simpler initial setup — just insert/update rows.
- Prone to race conditions: two players placing simultaneously can corrupt the timeline.
- Requires CRDT or OT logic on the client (significant complexity).
- RLS rules become the security boundary, but don't prevent logic errors.

### Option B: Server-authoritative PL/pgSQL RPCs

- All mutation logic (card placement, turn advancement, score calculation) lives in PostgreSQL functions.
- Each RPC runs in a transaction, preventing race conditions by design.
- Clients call RPC → RPC validates + mutates → Realtime pushes updated state to all subscribers.
- Row-Level Security enforces that players can only call RPCs for rooms they belong to.
- DB schema migrations (in `supabase/migrations/`) version-control the engine.

---

## Decision

We adopt **Option B — server-authoritative PL/pgSQL RPCs**.

The database schema (`rooms`, `players`, `game_state`, `timelines`) and the corresponding RPCs are already migrated. The SvelteKit client calls these RPCs via `supabase.rpc(...)` and subscribes to Realtime channels for state updates. No game logic lives in the client beyond display and optimistic UI hints.

---

## Consequences

### Positive

- Race-condition-free game state: PostgreSQL transactions are ACID.
- Single source of truth: the DB is authoritative; clients are thin renderers.
- Easier to add spectators, reconnection, and replay — just re-read `game_state`.
- RLS + RPCs give a clean security model: the DB enforces invariants, not the client.

### Negative / trade-offs

- All game logic must be written in PL/pgSQL (or wrapped SQL), which is less ergonomic than TypeScript.
- Debugging RPC logic requires Supabase dashboard or `psql` access.
- Cold-start latency for edge functions if we ever move RPCs to Supabase Edge Functions.
- Local development requires `supabase start` (Docker) for the full stack.

### Neutral

- Supabase Realtime is already included in the project dependency via `@supabase/ssr`.
- The migration files in `supabase/migrations/` serve as the canonical documentation for the game schema.
