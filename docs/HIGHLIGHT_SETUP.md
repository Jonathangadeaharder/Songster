# Local Highlight.io Setup

Songster uses [Highlight.io](https://highlight.io) for session replay and telemetry. Data stays local — no cloud account needed.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose)

## Start

```bash
pnpm highlight:start
```

This launches ClickHouse, Kafka, Redis, Postgres, and the Highlight backend. First pull takes a few minutes.

## Dashboard

Open **http://localhost:3000** in your browser. Create a local account on first visit.

The SvelteKit app sends telemetry to `http://localhost:8082` (configured in `songster-svelte/src/lib/config/highlight.ts`).

## Stop

```bash
pnpm highlight:stop
```

Data persists in Docker volumes. Run `docker compose -f docker-compose.highlight.yml down -v` to wipe everything.

## Logs

```bash
pnpm highlight:logs
```
