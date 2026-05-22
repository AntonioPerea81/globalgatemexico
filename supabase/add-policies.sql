CREATE POLICY "service role can insert freight_quote_requests"
  ON public.freight_quote_requests FOR INSERT
  TO service_role WITH CHECK (true);

CREATE POLICY "service role can select freight_quote_requests"
  ON public.freight_quote_requests FOR SELECT
  TO service_role USING (true);
