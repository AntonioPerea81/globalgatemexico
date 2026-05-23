-- Add sea freight specialization column
ALTER TABLE public.freight_quote_requests
  ADD COLUMN IF NOT EXISTS sea_shipment_type TEXT; -- 'lcl' | 'fcl' | null
