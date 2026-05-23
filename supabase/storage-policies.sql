-- ── quote-documents bucket — storage.objects RLS policies ──────────────────
--
-- INSERT: TO public (not TO anon) so it matches regardless of which internal
-- Postgres role Supabase Storage uses when proxying the upload request.
-- Path is restricted to quote-requests/* so no other paths can be written.
--
CREATE POLICY "public can insert into quote-requests"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (
    bucket_id = 'quote-documents'
    AND name LIKE 'quote-requests/%'
  );

-- UPDATE: required when upsert:true finds an existing object and issues an UPDATE
-- instead of a fresh INSERT. Without this, re-uploading the same filename fails.
--
CREATE POLICY "public can update in quote-requests"
  ON storage.objects FOR UPDATE
  TO public
  USING (
    bucket_id = 'quote-documents'
    AND name LIKE 'quote-requests/%'
  )
  WITH CHECK (
    bucket_id = 'quote-documents'
    AND name LIKE 'quote-requests/%'
  );

-- SELECT: service_role only — used by the freight-quote-request Edge Function to
-- generate 7-day signed download URLs that are embedded in the notification email.
--
CREATE POLICY "service role can read quote-documents"
  ON storage.objects FOR SELECT
  TO service_role
  USING (bucket_id = 'quote-documents');
