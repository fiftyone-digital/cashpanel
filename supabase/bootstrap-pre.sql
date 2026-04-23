-- Bootstrap prerequisites for a fresh remote Supabase project before
-- applying the full Drizzle schema.
--
-- Why this exists:
-- - The app schema uses pgvector and generated columns backed by SQL functions.
-- - RLS policies reference private.get_teams_for_authenticated_user().
-- - On a blank Supabase project, those objects do not exist yet.
--
-- Run this before:
--   bunx drizzle-kit push --config packages/db/drizzle.config.ts --force

CREATE EXTENSION IF NOT EXISTS vector;

CREATE SCHEMA IF NOT EXISTS private;

-- Temporary stub so Drizzle can create policies that reference this function.
-- Replaced with the real implementation in bootstrap-post.sql once the tables
-- it depends on exist.
CREATE OR REPLACE FUNCTION private.get_teams_for_authenticated_user()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULL::uuid WHERE FALSE
$$;

CREATE OR REPLACE FUNCTION extract_product_names(data json)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  result text;
BEGIN
  IF data IS NULL OR json_typeof(data) <> 'array' THEN
    RETURN '';
  END IF;

  SELECT COALESCE(
    string_agg(NULLIF(COALESCE(item->>'name', ''), ''), ' '),
    ''
  )
  INTO result
  FROM json_array_elements(data) AS item;

  RETURN COALESCE(result, '');
END;
$$;

CREATE OR REPLACE FUNCTION generate_inbox_fts(name text, products text)
RETURNS tsvector
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT to_tsvector(
    'english',
    COALESCE(name, '') || ' ' || COALESCE(products, '')
  )
$$;

CREATE OR REPLACE FUNCTION generate_inbox(length integer DEFAULT 10)
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT substr(replace(gen_random_uuid()::text, '-', ''), 1, GREATEST(length, 1))
$$;
