#!/usr/bin/env bash
# Run database migrations against the target Postgres instance.
#
# Usage:
#   ./scripts/migrate.sh                          # uses $DATABASE_URL
#   ./scripts/migrate.sh "postgres://user:pass@host:5432/dbname"
#
# Migrations are read from supabase/migrations/*.sql and applied in
# lexicographic order. A tracking table (_migrations) prevents re-runs.

set -euo pipefail

DB_URL="${1:-${DATABASE_URL:-}}"

if [ -z "$DB_URL" ]; then
    echo "Error: Provide DATABASE_URL as argument or environment variable." >&2
    exit 1
fi

MIGRATIONS_DIR="$(cd "$(dirname "$0")/.." && pwd)/supabase/migrations"

if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "No migrations directory found at $MIGRATIONS_DIR" >&2
    exit 1
fi

# Create tracking table if it doesn't exist
psql "$DB_URL" -q -c "
    CREATE TABLE IF NOT EXISTS _migrations (
        name        TEXT PRIMARY KEY,
        applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
"

# Apply each pending migration in order
for file in "$MIGRATIONS_DIR"/*.sql; do
    [ -f "$file" ] || continue
    name="$(basename "$file")"

    already=$(psql "$DB_URL" -t -A -c "SELECT 1 FROM _migrations WHERE name = '$name'" 2>/dev/null || true)
    if [ "$already" = "1" ]; then
        echo "  skip  $name"
        continue
    fi

    echo "  apply $name"
    psql "$DB_URL" -q -f "$file"
    psql "$DB_URL" -q -c "INSERT INTO _migrations (name) VALUES ('$name');"
done

echo "Migrations complete."
