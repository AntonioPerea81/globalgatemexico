create index if not exists training_orders_course_id_idx
  on public.training_orders (course_id);

-- Event-trigger helper is not intended to be called through the public Data API.
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

