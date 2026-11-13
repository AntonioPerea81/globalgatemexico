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

  -- Shipment
  num_packages            INTEGER NOT NULL CHECK (num_packages BETWEEN 1 AND 5),

  -- Terms acceptance (server-recorded timestamp)
  accepted_terms_at       TIMESTAMPTZ NOT NULL,
  terms_version           TEXT NOT NULL,

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
    'report_sent',
    'refunded'
  )),
  report_sent_at          TIMESTAMPTZ,
  internal_notes          TEXT,

  -- SLA alert tracking — reset to 0 when docs are received
  sla_alert_count         SMALLINT NOT NULL DEFAULT 0,

  -- Document lifecycle
  -- Set by purge-precheck-docs when Storage files are deleted. Order row is kept
  -- for payment record retention; only files and dg_precheck_files are removed.
  files_purged_at         TIMESTAMPTZ,

  -- Attribution
  utm_source              TEXT,
  utm_medium              TEXT,
  utm_campaign            TEXT
);

-- DG Pre-Check Entries (one row per DG line in the DGD — 1 to 5 per order)
CREATE TABLE public.dg_precheck_entries (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES public.dg_precheck_orders(id) ON DELETE CASCADE,
  line_no               INTEGER NOT NULL CHECK (line_no BETWEEN 1 AND 5),
  un_number             TEXT NOT NULL,  -- format: UN####
  hazard_class          TEXT NOT NULL,
  proper_shipping_name  TEXT,
  UNIQUE (order_id, line_no)
);

-- DG Pre-Check Files
CREATE TABLE public.dg_precheck_files (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  order_id    UUID NOT NULL REFERENCES public.dg_precheck_orders(id) ON DELETE CASCADE,
  field_name  TEXT NOT NULL,  -- 'dgd' | 'sds_1'..'sds_5' | 'photo_1'..'photo_5'
  file_path   TEXT NOT NULL,  -- storage path: {order_id}/{field_name}
  file_name   TEXT NOT NULL,
  file_size   BIGINT,
  mime_type   TEXT
);

-- Webhook event log for paypal-webhook-precheck (deduplication)
CREATE TABLE public.paypal_precheck_webhook_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_id    TEXT NOT NULL UNIQUE,  -- PayPal event id — prevents duplicate processing
  event_type  TEXT NOT NULL,
  payload     JSONB
);
ALTER TABLE public.paypal_precheck_webhook_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_all_precheck_webhook_events" ON public.paypal_precheck_webhook_events;
CREATE POLICY "service_all_precheck_webhook_events"
  ON public.paypal_precheck_webhook_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Auto-update updated_at (prefixed to avoid conflict with other triggers)
CREATE OR REPLACE FUNCTION public.dg_precheck_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_dg_precheck_orders_updated_at
  BEFORE UPDATE ON public.dg_precheck_orders
  FOR EACH ROW EXECUTE FUNCTION public.dg_precheck_set_updated_at();

-- RLS
ALTER TABLE public.dg_precheck_orders  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dg_precheck_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dg_precheck_files   ENABLE ROW LEVEL SECURITY;

-- No anon policies: all writes go through service_role Edge Functions only.
-- Clients never write directly to these tables.

DROP POLICY IF EXISTS "service_all_precheck_orders"  ON public.dg_precheck_orders;
DROP POLICY IF EXISTS "service_all_precheck_entries" ON public.dg_precheck_entries;
DROP POLICY IF EXISTS "service_all_precheck_files"   ON public.dg_precheck_files;

CREATE POLICY "service_all_precheck_orders"
  ON public.dg_precheck_orders FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_all_precheck_entries"
  ON public.dg_precheck_entries FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_all_precheck_files"
  ON public.dg_precheck_files FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── Storage bucket (REQUIRED — run before deploying Edge Functions) ────────
-- Private bucket with 20 MB limit and allowed MIME types.
-- ON CONFLICT upserts to allow re-applying this script safely.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'precheck-docs',
    'precheck-docs',
    false,
    20971520,
    ARRAY['application/pdf','image/jpeg','image/jpg','image/png','image/webp']
  )
  ON CONFLICT (id) DO UPDATE SET
    public             = false,
    file_size_limit    = 20971520,
    allowed_mime_types = ARRAY['application/pdf','image/jpeg','image/jpg','image/png','image/webp'];

-- Storage RLS: no anon upload. Clients receive signed upload URLs from the
-- create-precheck-upload-urls Edge Function, which validates paid status first.
DROP POLICY IF EXISTS "service_all_precheck_docs" ON storage.objects;
CREATE POLICY "service_all_precheck_docs"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'precheck-docs') WITH CHECK (bucket_id = 'precheck-docs');

-- ── Document retention ─────────────────────────────────────────────────────
-- purge-precheck-docs deletes Storage objects and dg_precheck_files records
-- and marks orders with files_purged_at. Order rows are NEVER deleted, and
-- dg_precheck_entries rows are NEVER deleted (fiscal and payment data are
-- retained per accountant guidance).
-- Eligible for file purge after 90 days:
--   report_sent  → counted from report_sent_at
--   refunded     → counted from updated_at
--   paid/docs_received → counted from created_at (stale without report)
-- Incomplete checkouts (pending_payment) are hard-deleted after 30 days.
-- Webhook event log (paypal_precheck_webhook_events) is purged after 90 days.
