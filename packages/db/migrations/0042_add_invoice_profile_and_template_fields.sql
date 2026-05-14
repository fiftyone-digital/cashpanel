ALTER TABLE "teams"
ADD COLUMN IF NOT EXISTS "invoice_legal_name" text,
ADD COLUMN IF NOT EXISTS "invoice_address_line1" text,
ADD COLUMN IF NOT EXISTS "invoice_address_line2" text,
ADD COLUMN IF NOT EXISTS "invoice_city" text,
ADD COLUMN IF NOT EXISTS "invoice_state" text,
ADD COLUMN IF NOT EXISTS "invoice_postal_code" text,
ADD COLUMN IF NOT EXISTS "invoice_country" text,
ADD COLUMN IF NOT EXISTS "invoice_email" text,
ADD COLUMN IF NOT EXISTS "invoice_phone" text,
ADD COLUMN IF NOT EXISTS "invoice_website" text,
ADD COLUMN IF NOT EXISTS "invoice_tax_number" text,
ADD COLUMN IF NOT EXISTS "invoice_registration_number" text;

ALTER TABLE "invoice_templates"
ADD COLUMN IF NOT EXISTS "from_fields" jsonb,
ADD COLUMN IF NOT EXISTS "customer_fields" jsonb;
