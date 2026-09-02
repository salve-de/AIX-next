alter table public.aix_next_watches
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists stripe_price_id text;

create index if not exists aix_next_watches_stripe_customer_idx
  on public.aix_next_watches(stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists aix_next_watches_stripe_subscription_uidx
  on public.aix_next_watches(stripe_subscription_id)
  where stripe_subscription_id is not null;

create table if not exists public.aix_next_stripe_events (
  event_id text primary key,
  event_type text not null,
  status text not null default 'processing'
    check (status in ('processing', 'processed')),
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists aix_next_stripe_events_status_created_idx
  on public.aix_next_stripe_events(status, created_at desc);

alter table public.aix_next_stripe_events enable row level security;
-- Server-side service role only. No anon/authenticated policies are intentionally created.

comment on column public.aix_next_watches.stripe_customer_id is
  'Bound Stripe Customer ID. Portal sessions must use this ID instead of email lookup.';
comment on column public.aix_next_watches.stripe_subscription_id is
  'Bound recurring Stripe Subscription ID for this Watch.';
comment on table public.aix_next_stripe_events is
  'Durable webhook event idempotency ledger. Failed processing releases the processing row so Stripe retries can run again.';
