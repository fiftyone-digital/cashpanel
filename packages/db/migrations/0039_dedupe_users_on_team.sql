-- Remove duplicate team memberships before enforcing uniqueness.
WITH duplicate_memberships AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY user_id, team_id
      ORDER BY created_at ASC NULLS LAST, id ASC
    ) AS row_number
  FROM public.users_on_team
)
DELETE FROM public.users_on_team AS users_on_team
USING duplicate_memberships
WHERE users_on_team.id = duplicate_memberships.id
  AND duplicate_memberships.row_number > 1;

ALTER TABLE public.users_on_team
  ADD CONSTRAINT users_on_team_user_id_team_id_key
  UNIQUE (user_id, team_id);
