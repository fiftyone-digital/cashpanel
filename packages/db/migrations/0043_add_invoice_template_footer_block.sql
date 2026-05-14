ALTER TABLE "invoice_templates"
ADD COLUMN IF NOT EXISTS "bottom_block" jsonb;
