create or replace function public.aix_next_claim_due_watches(p_limit integer default 5, p_lease_seconds integer default 900)
returns setof public.aix_next_watches
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
begin
  return query
  with due as (
    select id
    from public.aix_next_watches
    where status in ('trial', 'active')
      and next_run_at <= v_now
    order by next_run_at asc
    for update skip locked
    limit least(50, greatest(1, p_limit))
  )
  update public.aix_next_watches as watch
  set next_run_at = v_now + make_interval(secs => greatest(60, p_lease_seconds)),
      updated_at = v_now
  from due
  where watch.id = due.id
  returning watch.*;
end;
$$;

revoke all on function public.aix_next_claim_due_watches(integer, integer) from public, anon, authenticated;
grant execute on function public.aix_next_claim_due_watches(integer, integer) to service_role;
