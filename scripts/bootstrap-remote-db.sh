#!/usr/bin/env bash

set -euo pipefail

if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required to bootstrap the remote database." >&2
  exit 1
fi

if [[ -z "${DATABASE_SESSION_POOLER:-}" ]]; then
  echo "DATABASE_SESSION_POOLER must be set." >&2
  exit 1
fi

echo "Running pre-bootstrap SQL..."
psql "$DATABASE_SESSION_POOLER" -v ON_ERROR_STOP=1 -f supabase/bootstrap-pre.sql

echo "Applying Drizzle schema..."
DATABASE_SESSION_POOLER="$DATABASE_SESSION_POOLER" \
  bunx drizzle-kit push --config packages/db/drizzle.config.ts --force

echo "Running post-bootstrap SQL..."
psql "$DATABASE_SESSION_POOLER" -v ON_ERROR_STOP=1 -f supabase/bootstrap-post.sql

echo "Applying custom compatibility SQL..."
psql "$DATABASE_SESSION_POOLER" -v ON_ERROR_STOP=1 -f packages/db/migrations/0040_fix_bootstrap_schema_drift.sql
psql "$DATABASE_SESSION_POOLER" -v ON_ERROR_STOP=1 -f packages/db/migrations/0041_fix_team_inbox_default.sql

echo "Remote database bootstrap complete."
