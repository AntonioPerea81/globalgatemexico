-- Create training inquiries table
CREATE TABLE IF NOT EXISTS public.training_inquiries (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name             TEXT        NOT NULL,
  contact_name             TEXT        NOT NULL,
  job_title                TEXT,
  email                    TEXT        NOT NULL,
  phone                    TEXT,
  trainees_range           TEXT        NOT NULL,
  modality                 TEXT[]      NOT NULL DEFAULT '{}',
  regulatory_scope         TEXT[]               DEFAULT '{}',
  transportation_modes     TEXT[]               DEFAULT '{}',
  preferred_dates          TEXT,
  training_location        TEXT,
  language                 TEXT        NOT NULL,
  operational_requirements TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.training_inquiries ENABLE ROW LEVEL SECURITY;

-- Public INSERT policy (form submissions from the website)
CREATE POLICY "public insert into training_inquiries"
  ON public.training_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Service-role read access (for internal admin queries)
CREATE POLICY "service role can read training_inquiries"
  ON public.training_inquiries
  FOR SELECT
  TO service_role
  USING (true);
