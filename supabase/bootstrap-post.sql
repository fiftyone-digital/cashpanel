-- Finalize bootstrap after the Drizzle schema has been applied.
--
-- Run this after:
--   bunx drizzle-kit push --config packages/db/drizzle.config.ts --force

CREATE OR REPLACE FUNCTION private.get_teams_for_authenticated_user()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
AS $$
  SELECT DISTINCT team_id
  FROM (
    SELECT u.team_id
    FROM public.users AS u
    WHERE u.id = auth.uid()
      AND u.team_id IS NOT NULL

    UNION ALL

    SELECT uot.team_id
    FROM public.users_on_team AS uot
    WHERE uot.user_id = auth.uid()
      AND uot.team_id IS NOT NULL
  ) AS memberships
$$;
