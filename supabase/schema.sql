-- ============================================================
-- Global Gate México — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Table: shipment_leads
CREATE TABLE IF NOT EXISTS public.shipment_leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Step 1 — Lead capture
  name             TEXT NOT NULL,
  company          TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT NOT NULL,
  merchandise      TEXT NOT NULL,

  -- Step 2 — Shipment detail
  origin           TEXT,
  destination      TEXT,
  transport_mode   TEXT CHECK (transport_mode IN ('air','ground','ocean','not_sure')),
  weight_dims      TEXT,
  quantity_detail  TEXT,
  instruction_support BOOLEAN DEFAULT FALSE,
  emergency_name   TEXT,
  emergency_phone  TEXT,

  -- Internal tracking
  status           TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','closed'))
);

-- Table: lead_files
CREATE TABLE IF NOT EXISTS public.lead_files (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  lead_id     UUID NOT NULL REFERENCES public.shipment_leads(id) ON DELETE CASCADE,
  field_name  TEXT NOT NULL,   -- 'sds' | 'photo' | 'instruction_file'
  file_path   TEXT NOT NULL,   -- path inside the 'shipment-docs' bucket
  file_name   TEXT NOT NULL,
  file_size   BIGINT,
  mime_type   TEXT
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.shipment_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_files      ENABLE ROW LEVEL SECURITY;

-- Allow anonymous INSERT (public form submissions)
CREATE POLICY "anon can insert leads"
  ON public.shipment_leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "anon can insert lead_files"
  ON public.lead_files FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated service role can SELECT (admins / Edge Functions)
CREATE POLICY "service role can read leads"
  ON public.shipment_leads FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "service role can read files"
  ON public.lead_files FOR SELECT
  TO service_role
  USING (true);

-- ============================================================
-- Storage bucket: shipment-docs
-- Run in Supabase Dashboard > Storage > New Bucket
-- OR via SQL:
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('shipment-docs', 'shipment-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Allow anonymous uploads to the bucket
CREATE POLICY "anon can upload to shipment-docs"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'shipment-docs');

-- Only service role can read files
CREATE POLICY "service role can read shipment-docs"
  ON storage.objects FOR SELECT
  TO service_role
  USING (bucket_id = 'shipment-docs');
