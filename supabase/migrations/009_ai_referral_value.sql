alter table public.aix_next_agent_events
  add column if not exists conversion_type text,
  add column if not exists conversion_value numeric(18,2),
  add column if not exists currency text;

alter table public.aix_next_agent_events
  add constraint aix_next_agent_events_conversion_value_nonnegative
  check (conversion_value is null or conversion_value >= 0) not valid;

comment on column public.aix_next_agent_events.conversion_type is
  'Optional non-PII business event label such as demo_request, signup, purchase.';
comment on column public.aix_next_agent_events.conversion_value is
  'Optional value supplied by the customer analytics pipeline. Observed attribution only; not causal uplift.';
comment on column public.aix_next_agent_events.currency is
  'ISO-style currency label supplied with conversion_value. No payment instrument data is stored.';
