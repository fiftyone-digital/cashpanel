CREATE OR REPLACE FUNCTION public.generate_inbox(length integer DEFAULT 10)
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT substr(replace(gen_random_uuid()::text, '-', ''), 1, GREATEST(length, 1))
$$;

ALTER TABLE public.teams
  ALTER COLUMN inbox_id SET DEFAULT public.generate_inbox(10);

UPDATE public.teams
SET inbox_id = public.generate_inbox(10)
WHERE inbox_id = 'generate_inbox(10)';
