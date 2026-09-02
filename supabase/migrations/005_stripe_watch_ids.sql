alter table public.aix_next_watches
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

create index if not exists aix_next_watches_stripe_customer_idx
  on public.aix_next_watches(stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists aix_next_watches_stripe_subscription_unique_idx
  on public.aix_next_watches(stripe_subscription_id)
  where stripe_subscription_id is not null;
