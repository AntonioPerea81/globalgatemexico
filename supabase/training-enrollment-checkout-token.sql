alter table public.training_orders
  add column if not exists checkout_session_token uuid not null default gen_random_uuid();

create unique index if not exists training_orders_checkout_session_token_idx
  on public.training_orders (checkout_session_token);

