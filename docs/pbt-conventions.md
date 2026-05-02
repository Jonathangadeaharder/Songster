# Property-Based Testing (PBT) Conventions

## Overview

Songster uses [fast-check](https://github.com/dubzzz/fast-check) for property-based tests alongside traditional unit tests. PBT tests verify invariants across many randomly generated inputs.

## File Naming

PBT test files follow the pattern: `src/lib/__tests__/pbt.<domain>.test.ts`

Current PBT test files:
- `pbt.smoke.test.ts` — Generator validation + game logic invariants
- `pbt.scoring.test.ts` — Token/timeline/round/draw pile properties
- `pbt.room-state.test.ts` — Room state machine transitions
- `pbt.song-matching.test.ts` — Song placement and matching properties
- `pbt.type-validation.test.ts` — Runtime type shape validation

## Generators

Shared generators live in `src/lib/__tests__/generators.ts`. Each generator is an `Arbitrary<T>` from fast-check.

Available generators:
- `song()` — Song with random id, num, title, artist, year
- `player()` — Player with random id, name, avatar, timeline, tokens
- `gameState()` — Full GameState with all fields
- `sortedSongDeck(n)` — Array of n songs sorted by year
- `room()` — Room with random status and timestamps
- `roomStatus()` — 'waiting' | 'playing' | 'finished'
- Primitive helpers: `songId()`, `year()`, `songTitle()`, `artistName()`, `phase()`, `screen()`

## Conventions

1. **numRuns:** All PBT tests use `{ numRuns: 1000 }` per property
2. **Naming:** Test names describe the invariant being verified, not the implementation
3. **Structure:** Each `it()` block wraps a single `fc.assert(fc.property(...))` call
4. **Generators:** Reuse generators from `./generators.ts`; add new ones there when needed
5. **No mocks:** PBT tests verify pure logic, not I/O; avoid mocking
6. **Fast:** Each property should complete in < 1s; avoid expensive generators

## Running PBT Tests

```bash
# All tests (includes PBT)
pnpm run test

# Only PBT tests
pnpm run test -- --run src/lib/__tests__/pbt.

# With verbose output
pnpm run test -- --run --reporter=verbose src/lib/__tests__/pbt.
```

## Adding New Properties

1. Add the generator to `generators.ts` if one doesn't exist
2. Create `pbt.<domain>.test.ts` in `src/lib/__tests__/`
3. Use `fc.assert(fc.property(..., { numRuns: 1000 }))` for each property
4. Run `pnpm run test` to verify
5. Update this doc if adding new generators

## CI

PBT tests run as part of the `unit` job in CI via `pnpm test:coverage`. No separate CI step needed — vitest discovers all `*.test.ts` files automatically.
