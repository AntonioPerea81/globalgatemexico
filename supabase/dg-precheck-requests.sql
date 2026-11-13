-- DG Pre-Check Requests table
-- DO NOT EXECUTE directly. Run this through the Supabase dashboard or CLI
-- after reviewing it with the ops team.

CREATE TABLE dg_precheck_requests (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMPTZ NOT NULL    DEFAULT now(),
  reference             TEXT        NOT NULL    UNIQUE,
  language              TEXT        NOT NULL    CHECK (language IN ('EN', 'ES')),
  contact_name          TEXT        NOT NULL,
  company_name          TEXT        NOT NULL,
  contact_email         TEXT        NOT NULL,
  contact_phone         TEXT        NOT NULL,
  billing_country       TEXT        NOT NULL    CHECK (billing_country IN ('MX', 'US', 'CA')),
  num_packages          INTEGER     NOT NULL    CHECK (num_packages BETWEEN 1 AND 5),
  entries               JSONB       NOT NULL,
  paypal_transaction_id TEXT        NOT NULL,
  comments              TEXT,
  document_paths        JSONB       NOT NULL    DEFAULT '[]'::jsonb,
  accepted_terms_at     TIMESTAMPTZ NOT NULL,
  terms_version         TEXT        NOT NULL
);

ALTER TABLE dg_precheck_requests ENABLE ROW LEVEL SECURITY;
-- No SELECT/UPDATE/DELETE policies — team reads via service role only.
-- No INSERT policy needed — Edge Function uses service role key.
