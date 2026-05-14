ALTER TABLE "invoice_templates"
ADD COLUMN IF NOT EXISTS "payment_details_full_width" boolean DEFAULT false;
