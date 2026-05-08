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

    echo "  apply $name"

    # Use advisory lock + single transaction for idempotency
    psql "$DB_URL" -v ON_ERROR_STOP=1 -v migration_name="$name" <<EOF
SELECT pg_advisory_lock(hashtext(:'migration_name'));
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM _migrations WHERE name = :'migration_name') THEN
    \i $file
    INSERT INTO _migrations (name) VALUES (:'migration_name');
  END IF;
END
\$\$;
SELECT pg_advisory_unlock(hashtext(:'migration_name'));
EOF

done

echo "Migrations complete."
