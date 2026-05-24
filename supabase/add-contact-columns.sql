-- Add company & contact information columns
ALTER TABLE public.freight_quote_requests
  ADD COLUMN IF NOT EXISTS company_name       TEXT,
  ADD COLUMN IF NOT EXISTS contact_name       TEXT,
  ADD COLUMN IF NOT EXISTS contact_email      TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone      TEXT,
  ADD COLUMN IF NOT EXISTS contact_country    TEXT,
  ADD COLUMN IF NOT EXISTS contact_department TEXT,
  ADD COLUMN IF NOT EXISTS contact_position   TEXT;
