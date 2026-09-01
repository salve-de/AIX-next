create table if not exists public.aix_next_rate_limits (
  key text primary key,
  window_started_at timestamptz not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.aix_next_consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_row public.aix_next_rate_limits%rowtype;
begin
  insert into public.aix_next_rate_limits(key, window_started_at, request_count, updated_at)
  values (p_key, v_now, 1, v_now)
  on conflict (key) do update set
    window_started_at = case when aix_next_rate_limits.window_started_at + make_interval(secs => p_window_seconds) <= v_now then v_now else aix_next_rate_limits.window_started_at end,
    request_count = case when aix_next_rate_limits.window_started_at + make_interval(secs => p_window_seconds) <= v_now then 1 else aix_next_rate_limits.request_count + 1 end,
    updated_at = v_now
  returning * into v_row;

  return jsonb_build_object(
    'allowed', v_row.request_count <= greatest(1, p_limit),
    'count', v_row.request_count,
    'reset_at', v_row.window_started_at + make_interval(secs => p_window_seconds)
  );
end;
$$;

revoke all on function public.aix_next_consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.aix_next_consume_rate_limit(text, integer, integer) to service_role;

alter table public.aix_next_rate_limits enable row level security;
