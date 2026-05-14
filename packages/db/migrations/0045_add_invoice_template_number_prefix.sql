ALTER TABLE "invoice_templates"
ADD COLUMN IF NOT EXISTS "invoice_number_prefix" text DEFAULT 'INV-';
