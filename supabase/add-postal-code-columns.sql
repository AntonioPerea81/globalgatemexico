-- Add postal code columns for ground freight carrier rating
ALTER TABLE public.freight_quote_requests
  ADD COLUMN IF NOT EXISTS origin_postal_code      TEXT,
  ADD COLUMN IF NOT EXISTS destination_postal_code TEXT;
