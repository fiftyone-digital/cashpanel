-- Normalize columns that were created quoted/camelCase during the remote bootstrap.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'baseAmount'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'base_amount'
  ) THEN
    ALTER TABLE public.transactions RENAME COLUMN "baseAmount" TO base_amount;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bank_accounts' AND column_name = 'baseBalance'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bank_accounts' AND column_name = 'base_balance'
  ) THEN
    ALTER TABLE public.bank_accounts RENAME COLUMN "baseBalance" TO base_balance;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bank_accounts' AND column_name = 'availableBalance'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bank_accounts' AND column_name = 'available_balance'
  ) THEN
    ALTER TABLE public.bank_accounts RENAME COLUMN "availableBalance" TO available_balance;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bank_accounts' AND column_name = 'creditLimit'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bank_accounts' AND column_name = 'credit_limit'
  ) THEN
    ALTER TABLE public.bank_accounts RENAME COLUMN "creditLimit" TO credit_limit;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'customers' AND column_name = 'billingEmail'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'customers' AND column_name = 'billing_email'
  ) THEN
    ALTER TABLE public.customers RENAME COLUMN "billingEmail" TO billing_email;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'invoice_products' AND column_name = 'isActive'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'invoice_products' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.invoice_products RENAME COLUMN "isActive" TO is_active;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.total_duration(project public.tracker_projects)
RETURNS bigint
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(SUM(duration), 0)::bigint
  FROM public.tracker_entries
  WHERE project_id = project.id;
$$;

CREATE OR REPLACE FUNCTION public.get_project_total_amount(project public.tracker_projects)
RETURNS numeric
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    SUM(
      (COALESCE(entry.duration, 0)::numeric / 3600)
      * COALESCE(entry.rate, project.rate, 0)
    ),
    0
  )
  FROM public.tracker_entries AS entry
  WHERE entry.project_id = project.id;
$$;

CREATE OR REPLACE FUNCTION public.get_assigned_users_for_project(project public.tracker_projects)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    jsonb_agg(
      DISTINCT jsonb_build_object(
        'user_id', users.id,
        'full_name', users.full_name,
        'avatar_url', users.avatar_url
      )
    ) FILTER (WHERE users.id IS NOT NULL),
    '[]'::jsonb
  )
  FROM public.tracker_entries AS entry
  LEFT JOIN public.users AS users ON users.id = entry.assigned_id
  WHERE entry.project_id = project.id;
$$;

CREATE OR REPLACE FUNCTION public.global_search(
  p_search_term text,
  p_team_id uuid,
  p_search_lang text DEFAULT 'english',
  p_limit integer DEFAULT 30,
  p_items_per_table_limit integer DEFAULT 5,
  p_relevance_threshold double precision DEFAULT 0.01
)
RETURNS TABLE (
  id text,
  type text,
  title text,
  relevance double precision,
  created_at timestamptz,
  data jsonb
)
LANGUAGE sql
STABLE
AS $$
  WITH query AS (
    SELECT NULLIF(trim(COALESCE(p_search_term, '')), '') AS value
  ),
  transaction_results AS (
    SELECT
      transactions.id::text AS id,
      'transaction'::text AS type,
      COALESCE(transactions.name, transactions.counterparty_name, 'Transaction') AS title,
      1::double precision AS relevance,
      transactions.created_at AS created_at,
      to_jsonb(transactions) AS data
    FROM public.transactions, query
    WHERE transactions.team_id = p_team_id
      AND (
        query.value IS NULL
        OR transactions.name ILIKE ('%' || query.value || '%')
        OR transactions.description ILIKE ('%' || query.value || '%')
        OR transactions.counterparty_name ILIKE ('%' || query.value || '%')
      )
    ORDER BY transactions.created_at DESC
    LIMIT COALESCE(p_items_per_table_limit, 5)
  ),
  customer_results AS (
    SELECT
      customers.id::text AS id,
      'customer'::text AS type,
      COALESCE(customers.name, 'Customer') AS title,
      1::double precision AS relevance,
      customers.created_at AS created_at,
      to_jsonb(customers) AS data
    FROM public.customers, query
    WHERE customers.team_id = p_team_id
      AND (
        query.value IS NULL
        OR customers.name ILIKE ('%' || query.value || '%')
        OR customers.email ILIKE ('%' || query.value || '%')
        OR customers.website ILIKE ('%' || query.value || '%')
      )
    ORDER BY customers.created_at DESC
    LIMIT COALESCE(p_items_per_table_limit, 5)
  ),
  invoice_results AS (
    SELECT
      invoices.id::text AS id,
      'invoice'::text AS type,
      COALESCE(invoices.invoice_number, 'Invoice') AS title,
      1::double precision AS relevance,
      invoices.created_at AS created_at,
      to_jsonb(invoices) AS data
    FROM public.invoices, query
    WHERE invoices.team_id = p_team_id
      AND (
        query.value IS NULL
        OR invoices.invoice_number ILIKE ('%' || query.value || '%')
      )
    ORDER BY invoices.created_at DESC
    LIMIT COALESCE(p_items_per_table_limit, 5)
  ),
  inbox_results AS (
    SELECT
      inbox.id::text AS id,
      'inbox'::text AS type,
      COALESCE(inbox.display_name, inbox.file_name, 'Inbox item') AS title,
      1::double precision AS relevance,
      inbox.created_at AS created_at,
      to_jsonb(inbox) AS data
    FROM public.inbox, query
    WHERE inbox.team_id = p_team_id
      AND (
        query.value IS NULL
        OR inbox.display_name ILIKE ('%' || query.value || '%')
        OR inbox.file_name ILIKE ('%' || query.value || '%')
      )
    ORDER BY inbox.created_at DESC
    LIMIT COALESCE(p_items_per_table_limit, 5)
  ),
  results AS (
    SELECT * FROM transaction_results
    UNION ALL
    SELECT * FROM customer_results
    UNION ALL
    SELECT * FROM invoice_results
    UNION ALL
    SELECT * FROM inbox_results
  )
  SELECT *
  FROM results
  WHERE relevance >= COALESCE(p_relevance_threshold, 0)
  ORDER BY created_at DESC
  LIMIT COALESCE(p_limit, 30);
$$;

CREATE OR REPLACE FUNCTION public.global_semantic_search(
  team_id uuid,
  search_term text DEFAULT NULL,
  start_date text DEFAULT NULL,
  end_date text DEFAULT NULL,
  types text[] DEFAULT NULL,
  amount numeric DEFAULT NULL,
  amount_min numeric DEFAULT NULL,
  amount_max numeric DEFAULT NULL,
  status text DEFAULT NULL,
  currency text DEFAULT NULL,
  language text DEFAULT 'english',
  due_date_start text DEFAULT NULL,
  due_date_end text DEFAULT NULL,
  max_results integer DEFAULT 20,
  items_per_table_limit integer DEFAULT 5
)
RETURNS TABLE (
  id text,
  type text,
  title text,
  relevance double precision,
  created_at timestamptz,
  data jsonb
)
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM public.global_search(
    search_term,
    team_id,
    language,
    max_results,
    items_per_table_limit,
    0
  );
$$;
