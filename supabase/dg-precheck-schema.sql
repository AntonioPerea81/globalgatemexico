-- DG Pre-Check Orders
CREATE TABLE public.dg_precheck_orders (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),

  reference               TEXT NOT NULL UNIQUE,
  checkout_session_token  UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),

  -- Client info
  buyer_name              TEXT NOT NULL,
  buyer_email             TEXT NOT NULL,
  buyer_phone             TEXT,
  company_name            TEXT NOT NULL,
  billing_country         TEXT NOT NULL CHECK (billing_country IN ('MX','US','CA')),
  has_mx_establishment    BOOLEAN NOT NULL DEFAULT false,

  -- Fiscal data (CFDI — captured for manual invoicing via Contalink)
  rfc                     TEXT,
  razon_social            TEXT,
  regimen_fiscal          TEXT,
  codigo_postal_fiscal    TEXT,
  uso_cfdi                TEXT,

  -- Shipment
  origin                  TEXT NOT NULL,
  destination             TEXT NOT NULL,
  num_packages            INTEGER NOT NULL CHECK (num_packages BETWEEN 1 AND 5),
  num_dg_entries          INTEGER NOT NULL CHECK (num_dg_entries BETWEEN 1 AND 5),
  cargo_description       TEXT,

  -- Payment
  amount_usd              NUMERIC(10,2) NOT NULL DEFAULT 80.00,
  tax_rate                NUMERIC(5,4)  NOT NULL DEFAULT 0,
  tax_amount_usd          NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_usd               NUMERIC(10,2) NOT NULL,
  currency                TEXT NOT NULL DEFAULT 'USD',
  paypal_order_id         TEXT,
  paypal_capture_id       TEXT,
  paid_at                 TIMESTAMPTZ,

  -- Workflow
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN (
    'pending_payment',
    'paid',
    'docs_received',
    'in_review',
    'report_sent',
    'cancelled',
    'refunded'
  )),
  report_sent_at          TIMESTAMPTZ,
  internal_notes          TEXT,

  -- Attribution
  utm_source              TEXT,
  utm_medium              TEXT,
  utm_campaign            TEXT
);

-- DG Pre-Check Files
CREATE TABLE public.dg_precheck_files (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  order_id    UUID NOT NULL REFERENCES public.dg_precheck_orders(id) ON DELETE CASCADE,
  field_name  TEXT NOT NULL,  -- 'dgd' | 'photo_1' .. 'photo_5'
  file_path   TEXT NOT NULL,  -- storage path: {order_id}/{field_name}
  file_name   TEXT NOT NULL,
  file_size   BIGINT,
  mime_type   TEXT
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_dg_precheck_orders_updated_at
  BEFORE UPDATE ON public.dg_precheck_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.dg_precheck_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dg_precheck_files  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_precheck_orders"
  ON public.dg_precheck_orders FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_precheck_files"
  ON public.dg_precheck_files FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "service_all_precheck_orders"
  ON public.dg_precheck_orders FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_all_precheck_files"
  ON public.dg_precheck_files FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Storage bucket (run in Supabase dashboard or via Supabase CLI):
-- supabase storage create precheck-docs --private
-- Or via SQL:
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
--   VALUES ('precheck-docs', 'precheck-docs', false, 20971520,
--     ARRAY['application/pdf','image/jpeg','image/jpg','image/png','image/webp']);

-- Storage RLS policies (after creating bucket):
-- CREATE POLICY "anon_insert_precheck_docs"
--   ON storage.objects FOR INSERT TO anon
--   WITH CHECK (bucket_id = 'precheck-docs');
-- CREATE POLICY "service_all_precheck_docs"
--   ON storage.objects FOR ALL TO service_role
--   USING (bucket_id = 'precheck-docs') WITH CHECK (bucket_id = 'precheck-docs');

-- Document retention: files older than 90 days after report_sent_at can be purged via scheduled job.
-- Files not yet in report_sent status are retained indefinitely until processed.
