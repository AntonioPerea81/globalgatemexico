-- ── quote-documents bucket — storage.objects RLS policies ──────────────────
--
-- WHY TO public NOT TO anon:
--   Supabase Storage's internal API proxies uploads under a Postgres role that
--   may not literally be "anon". Using TO public ensures the policy matches
--   regardless of which internal role the storage server uses.
--
-- WHY no upsert / no UPDATE policy:
--   The x-upsert:true header triggers a different internal SQL flow that
--   requires additional RLS checks we cannot easily control. Since every upload
--   path includes a unique refId (quote-requests/{refId}/{filename}), collisions
--   are impossible and plain INSERT (no upsert) is sufficient.
--
-- INSERT: any role can upload to quote-documents (no path restriction —
--   path restriction via LIKE was found to block the storage API's pre-flight
--   check even when the actual name matched the pattern).
--
CREATE POLICY "public insert into quote-documents"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'quote-documents');

-- SELECT: service_role only — used by the freight-quote-request Edge Function to
-- generate 7-day signed download URLs that are embedded in the notification email.
-- Anon and authenticated users cannot list or read objects directly.
--
CREATE POLICY "service role can read quote-documents"
  ON storage.objects FOR SELECT
  TO service_role
  USING (bucket_id = 'quote-documents');
