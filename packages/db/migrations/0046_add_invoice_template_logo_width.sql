ALTER TABLE "invoice_templates"
ADD COLUMN IF NOT EXISTS "logo_width" integer DEFAULT 150;
