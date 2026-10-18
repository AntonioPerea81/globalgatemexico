-- GGM live virtual training enrollment and PayPal order ledger.
-- Monetary values are stored as integer minor units (cents).

create table if not exists public.training_courses (
  id text primary key,
  function_code text not null check (function_code in ('7.1', '7.3')),
  training_type text not null check (training_type in ('initial', 'recurrent')),
  title text not null,
  duration_hours integer not null check (duration_hours > 0),
  duration_days integer not null check (duration_days > 0),
  tuition_cents integer not null check (tuition_cents >= 0),
  currency text not null default 'CAD' check (currency = 'CAD'),
  tax_rate_bps integer not null default 0 check (tax_rate_bps between 0 and 10000),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (function_code, training_type)
);

create table if not exists public.training_cohorts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  course_id text not null references public.training_courses(id) on update cascade,
  start_date date not null,
  end_date date not null,
  start_time time not null default '08:00',
  end_time time not null default '16:00',
  timezone text not null default 'America/Toronto',
  capacity integer not null default 10 check (capacity between 1 and 100),
  status text not null default 'open' check (status in ('draft', 'open', 'closed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date),
  unique (course_id, start_date)
);

create table if not exists public.training_referral_codes (
  code text primary key check (code ~ '^[A-Z0-9][A-Z0-9-]{0,31}$'),
  source_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.training_orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  course_id text not null references public.training_courses(id),
  cohort_id uuid not null references public.training_cohorts(id),
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text,
  company_name text,
  billing_country text not null default 'CA',
  referral_code text references public.training_referral_codes(code) on update cascade,
  seats integer not null check (seats between 1 and 10),
  unit_amount_cents integer not null check (unit_amount_cents >= 0),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  tax_rate_bps integer not null default 0 check (tax_rate_bps between 0 and 10000),
  tax_cents integer not null default 0 check (tax_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'CAD' check (currency = 'CAD'),
  status text not null default 'pending_payment' check (status in ('pending_payment', 'paid', 'payment_failed', 'cancelled', 'expired', 'refunded')),
  hold_expires_at timestamptz,
  paypal_order_id text unique,
  paypal_capture_id text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (subtotal_cents = unit_amount_cents * seats),
  check (total_cents = subtotal_cents + tax_cents)
);

create table if not exists public.training_participants (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.training_orders(id) on delete cascade,
  full_name text not null,
  email text not null,
  job_title text,
  created_at timestamptz not null default now()
);

create table if not exists public.paypal_webhook_events (
  event_id text primary key,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

create index if not exists training_orders_cohort_status_idx
  on public.training_orders (cohort_id, status, hold_expires_at);
create index if not exists training_orders_referral_status_idx
  on public.training_orders (referral_code, status, paid_at);
create index if not exists training_participants_order_idx
  on public.training_participants (order_id);

alter table public.training_courses enable row level security;
alter table public.training_cohorts enable row level security;
alter table public.training_referral_codes enable row level security;
alter table public.training_orders enable row level security;
alter table public.training_participants enable row level security;
alter table public.paypal_webhook_events enable row level security;

drop policy if exists "Public can view active training courses" on public.training_courses;
create policy "Public can view active training courses"
  on public.training_courses for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Public can view open training cohorts" on public.training_cohorts;
create policy "Public can view open training cohorts"
  on public.training_cohorts for select
  to anon, authenticated
  using (status = 'open');

create or replace function public.reserve_training_order(
  p_course_id text,
  p_cohort_code text,
  p_buyer_name text,
  p_buyer_email text,
  p_buyer_phone text,
  p_company_name text,
  p_billing_country text,
  p_participants jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_course public.training_courses%rowtype;
  v_cohort public.training_cohorts%rowtype;
  v_order_id uuid := gen_random_uuid();
  v_reference text := 'GGM-' || upper(substr(replace(v_order_id::text, '-', ''), 1, 10));
  v_seats integer;
  v_reserved integer;
  v_subtotal integer;
  v_tax integer;
  v_total integer;
  v_participant jsonb;
begin
  if p_participants is null or jsonb_typeof(p_participants) <> 'array' then
    raise exception 'Participants must be an array';
  end if;

  v_seats := jsonb_array_length(p_participants);
  if v_seats < 1 or v_seats > 10 then
    raise exception 'Seat count must be between 1 and 10';
  end if;

  select * into v_course
  from public.training_courses
  where id = p_course_id and is_active = true;
  if not found then raise exception 'Course is not available'; end if;

  select * into v_cohort
  from public.training_cohorts
  where code = p_cohort_code and course_id = p_course_id and status = 'open'
  for update;
  if not found then raise exception 'Course date is not available'; end if;

  select coalesce(sum(seats), 0)::integer into v_reserved
  from public.training_orders
  where cohort_id = v_cohort.id
    and (status = 'paid' or (status = 'pending_payment' and hold_expires_at > now()));

  if v_reserved + v_seats > v_cohort.capacity then
    raise exception 'Not enough seats remain for this course date';
  end if;

  v_subtotal := v_course.tuition_cents * v_seats;
  v_tax := round(v_subtotal * v_course.tax_rate_bps / 10000.0);
  v_total := v_subtotal + v_tax;

  insert into public.training_orders (
    id, reference, course_id, cohort_id, buyer_name, buyer_email, buyer_phone,
    company_name, billing_country, seats, unit_amount_cents, subtotal_cents,
    tax_rate_bps, tax_cents, total_cents, currency, hold_expires_at
  ) values (
    v_order_id, v_reference, v_course.id, v_cohort.id, trim(p_buyer_name), lower(trim(p_buyer_email)),
    nullif(trim(p_buyer_phone), ''), nullif(trim(p_company_name), ''), coalesce(nullif(trim(p_billing_country), ''), 'CA'),
    v_seats, v_course.tuition_cents, v_subtotal, v_course.tax_rate_bps, v_tax, v_total,
    v_course.currency, now() + interval '30 minutes'
  );

  for v_participant in select value from jsonb_array_elements(p_participants)
  loop
    if nullif(trim(v_participant->>'fullName'), '') is null or nullif(trim(v_participant->>'email'), '') is null then
      raise exception 'Each participant requires a name and email';
    end if;
    insert into public.training_participants (order_id, full_name, email, job_title)
    values (
      v_order_id,
      trim(v_participant->>'fullName'),
      lower(trim(v_participant->>'email')),
      nullif(trim(v_participant->>'jobTitle'), '')
    );
  end loop;

  return jsonb_build_object(
    'id', v_order_id,
    'reference', v_reference,
    'course_title', v_course.title,
    'cohort_code', v_cohort.code,
    'seats', v_seats,
    'unit_amount_cents', v_course.tuition_cents,
    'subtotal_cents', v_subtotal,
    'tax_cents', v_tax,
    'total_cents', v_total,
    'currency', v_course.currency
  );
end;
$$;

revoke all on function public.reserve_training_order(text, text, text, text, text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.reserve_training_order(text, text, text, text, text, text, text, jsonb) to service_role;

insert into public.training_referral_codes (code, source_name)
values ('SMDG', 'Solutions MDG')
on conflict (code) do update set
  source_name = excluded.source_name,
  is_active = true,
  updated_at = now();

insert into public.training_courses
  (id, function_code, training_type, title, duration_hours, duration_days, tuition_cents, currency, tax_rate_bps)
values
  ('iata-71-initial', '7.1', 'initial', 'Preparing Dangerous Goods Consignments — Initial', 24, 3, 120000, 'CAD', 0),
  ('iata-71-recurrent', '7.1', 'recurrent', 'Preparing Dangerous Goods Consignments — Recurrent', 16, 2, 100000, 'CAD', 0),
  ('iata-73-initial', '7.3', 'initial', 'Accepting Dangerous Goods Consignments — Initial', 24, 3, 120000, 'CAD', 0),
  ('iata-73-recurrent', '7.3', 'recurrent', 'Accepting Dangerous Goods Consignments — Recurrent', 16, 2, 100000, 'CAD', 0)
on conflict (id) do update set
  title = excluded.title,
  duration_hours = excluded.duration_hours,
  duration_days = excluded.duration_days,
  tuition_cents = excluded.tuition_cents,
  currency = excluded.currency,
  tax_rate_bps = excluded.tax_rate_bps,
  is_active = true,
  updated_at = now();

insert into public.training_cohorts (code, course_id, start_date, end_date, capacity, status)
values
  ('71i-2027-01', 'iata-71-initial', '2027-01-19', '2027-01-21', 10, 'open'),
  ('71i-2027-02', 'iata-71-initial', '2027-02-16', '2027-02-18', 10, 'open'),
  ('71i-2027-04', 'iata-71-initial', '2027-04-13', '2027-04-15', 10, 'open'),
  ('71i-2027-05', 'iata-71-initial', '2027-05-18', '2027-05-20', 10, 'open'),
  ('71i-2027-06', 'iata-71-initial', '2027-06-22', '2027-06-24', 10, 'open'),
  ('73i-2027-01', 'iata-73-initial', '2027-01-19', '2027-01-21', 10, 'open'),
  ('73i-2027-02', 'iata-73-initial', '2027-02-16', '2027-02-18', 10, 'open'),
  ('73i-2027-04', 'iata-73-initial', '2027-04-13', '2027-04-15', 10, 'open'),
  ('73i-2027-05', 'iata-73-initial', '2027-05-18', '2027-05-20', 10, 'open'),
  ('73i-2027-06', 'iata-73-initial', '2027-06-22', '2027-06-24', 10, 'open')
on conflict (code) do update set
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  capacity = excluded.capacity,
  status = excluded.status,
  updated_at = now();

