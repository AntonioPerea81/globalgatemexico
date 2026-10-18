alter table public.training_orders
  add column if not exists marketing_attribution jsonb not null default '{}'::jsonb;

alter table public.training_orders
  drop constraint if exists training_orders_marketing_attribution_object;

alter table public.training_orders
  add constraint training_orders_marketing_attribution_object
  check (jsonb_typeof(marketing_attribution) = 'object');
