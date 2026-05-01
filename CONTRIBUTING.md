# Contributing to Songster

Thank you for your interest in contributing! This guide covers the development workflow, conventions, and tooling.

## Table of contents

- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Development workflow](#development-workflow)
- [Code style](#code-style)
- [Testing](#testing)
- [Commit conventions](#commit-conventions)
- [Branch naming](#branch-naming)
- [Pull requests](#pull-requests)
- [Architecture decisions](#architecture-decisions)

---

## Project structure

```
Songster/
├── songster-svelte/   # SvelteKit app (all application code lives here)
│   ├── src/
│   │   ├── lib/       # Shared utilities, stores, components
│   │   └── routes/    # SvelteKit file-based routing
│   ├── supabase/      # DB migrations + seed SQL
│   └── e2e/           # Playwright end-to-end tests
├── docs/
│   └── adr/           # Architecture Decision Records
└── .github/
    └── workflows/     # CI pipelines
```

> **Note:** The `app/` directory at the repo root is a legacy artefact (node_modules + dist). Do not commit to it.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 22 LTS |
| pnpm | 9+ |
| Supabase CLI | latest |

---

## Setup

```bash
# 1. Clone the repo
git clone git@github.com:Jonathangadeaharder/Songster.git
cd Songster

# 2. Install root devDependencies (husky + lint-staged)
pnpm install

# 3. Install app dependencies
cd songster-svelte
pnpm install

# 4. Copy environment template
cp .env.example .env
# → Fill in PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY
#   (see Supabase Dashboard → Project Settings → API)

# 5. Start dev server
pnpm dev
```

---

## Development workflow

```bash
# Run dev server with HMR
pnpm dev

# Typecheck
pnpm check

# Run unit tests (vitest)
pnpm test

# Run unit tests in watch mode
pnpm test:watch

# Run E2E tests (Playwright)
pnpm test:e2e

# Run all tests
pnpm test:all

# Mutation testing (Stryker)
pnpm test:mutant
```

---

## Code style

Formatting is enforced by **Prettier** (config in `songster-svelte/.prettierrc.json`) and run automatically as a pre-commit hook via lint-staged.

Key settings:
- Tabs (not spaces)
- Single quotes
- Trailing commas (ES5)
- Print width 100

To format manually:

```bash
cd songster-svelte
pnpm exec prettier --write src/
```

TypeScript strict mode is enabled. Run `pnpm check` before pushing.

---

## Testing

- **Unit/integration** — Vitest + Testing Library. Test files live next to source in `__tests__/` subdirectories.
- **E2E** — Playwright. Tests live in `e2e/`.
- **Mutation** — Stryker (target ≥ 95% mutation score).

All tests must pass before a PR can merge.

---

## Commit conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

Common types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `style`, `perf`.

Examples:
```
feat(game): add anonymous guest sign-in via Supabase auth
fix(timeline): correct year-boundary placement logic
docs(adr): add ADR-002 for Deezer provider choice
```

---

## Branch naming

| Pattern | Purpose |
|---------|---------|
| `epic/SONG-E<N>-<slug>` | Epic implementation branch |
| `feat/SONG-<N>-<slug>` | Feature story |
| `fix/SONG-<N>-<slug>` | Bug fix |
| `test/SONG-<N>-<slug>` | Test-only changes |
| `chore/<slug>` | Tooling, deps, config |

---

## Pull requests

1. Branch off `main` using the naming convention above.
2. Keep PRs focused on a single epic or story.
3. Ensure `pnpm check` and `pnpm test` pass locally before pushing.
4. Fill in the PR template (summary, stories completed, test plan).
5. PRs are reviewed by [CodeRabbit](https://coderabbit.ai/) automatically.

---

## Architecture decisions

Significant architectural choices are documented as Architecture Decision Records (ADRs) in [`docs/adr/`](docs/adr/).

To propose a new ADR:

1. Copy `docs/adr/0000-template.md` to `docs/adr/<NNNN>-<slug>.md`.
2. Fill in the context, decision, and consequences.
3. Open a PR with the new ADR file.

See the [ADR index](docs/adr/README.md) for existing decisions.
