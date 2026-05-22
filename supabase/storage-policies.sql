-- Allow anonymous users to upload to quote-documents bucket
CREATE POLICY "anon can upload to quote-documents"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'quote-documents');

-- Allow service role to read (for signed URL generation in Edge Function)
CREATE POLICY "service role can read quote-documents"
  ON storage.objects FOR SELECT
  TO service_role
  USING (bucket_id = 'quote-documents');
