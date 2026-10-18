-- Optional referral attribution for live virtual training orders.

create table if not exists public.training_referral_codes (
  code text primary key check (code ~ '^[A-Z0-9][A-Z0-9-]{0,31}$'),
  source_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.training_referral_codes enable row level security;

alter table public.training_orders
  add column if not exists referral_code text
  references public.training_referral_codes(code) on update cascade;

create index if not exists training_orders_referral_status_idx
  on public.training_orders (referral_code, status, paid_at);

insert into public.training_referral_codes (code, source_name)
values ('SMDG', 'Solutions MDG')
on conflict (code) do update set
  source_name = excluded.source_name,
  is_active = true,
  updated_at = now();
