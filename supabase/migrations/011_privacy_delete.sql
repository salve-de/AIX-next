-- Public profiles have independent bearer owners. source_scan_id alone does
-- not authorize export/deletion: preserve all profiles and their source scans.
-- Receipt hashes support retries after a successful commit with a lost response.
alter table public.aix_next_deletion_audit
  add column if not exists token_hash text,
  add column if not exists result jsonb;
create unique index if not exists aix_next_deletion_audit_token_hash_idx
  on public.aix_next_deletion_audit(token_hash) where token_hash is not null;

create or replace function public.aix_next_delete_watch_data(
  p_token text, p_email text, p_expected_subscription_id text,
  p_subscription_cancelled boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
set lock_timeout = '5s'
as $$
declare
  v_watch public.aix_next_watches%rowtype;
  v_token_hash text := encode(sha256(convert_to(p_token, 'UTF8')), 'hex');
  v_email_hash text := encode(sha256(convert_to(lower(btrim(p_email)), 'UTF8')), 'hex');
  v_result jsonb;
  v_scan_deleted boolean := false;
  v_completed_at timestamptz := clock_timestamp();
begin
  if p_token is null or p_token = '' or p_email is null or btrim(p_email) = '' then
    raise exception 'Watch credentials required' using errcode = '28000';
  end if;
  -- A short, service-only transaction serializes shared-scan reference checks
  -- with writes. No Stripe/network call occurs while these locks are held.
  -- Contention/deadlocks fail the entire RPC; callers can retry with intact data.
  lock table public.aix_next_watches, public.aix_next_public_profiles
    in share row exclusive mode;
  select * into v_watch from public.aix_next_watches where token = p_token for update;
  if not found then
    select result into v_result from public.aix_next_deletion_audit
      where token_hash = v_token_hash and email_hash = v_email_hash;
    if v_result is null then
      raise exception 'Watch credentials do not match' using errcode = '28000';
    end if;
    return v_result;
  end if;
  if lower(btrim(v_watch.email)) <> lower(btrim(p_email)) then
    raise exception 'Watch credentials do not match' using errcode = '28000';
  end if;
  if v_watch.stripe_subscription_id is distinct from p_expected_subscription_id
    or (v_watch.paid and (v_watch.stripe_subscription_id is null or not coalesce(p_subscription_cancelled, false))) then
    raise exception 'Subscription changed or cancellation unconfirmed';
  end if;

  delete from public.aix_next_watch_runs where watch_id = v_watch.id;
  delete from public.aix_next_watches where id = v_watch.id;
  if v_watch.scan_id is not null
    and not exists (select 1 from public.aix_next_watches where scan_id = v_watch.scan_id)
    and not exists (select 1 from public.aix_next_public_profiles where source_scan_id = v_watch.scan_id) then
    delete from public.aix_next_scans where id = v_watch.scan_id;
    v_scan_deleted := found;
  end if;
  v_result := jsonb_build_object('deleted', true,
    'subscriptionCancelled', coalesce(p_subscription_cancelled, false),
    'completedAt', v_completed_at, 'scanDeleted', v_scan_deleted,
    'publicProfiles', 'retained: independent ownership not verified');
  insert into public.aix_next_deletion_audit(email_hash, domain_hash, watch_id, scan_id, token_hash, result, completed_at)
    values (v_email_hash,
      encode(sha256(convert_to(lower(btrim(coalesce(v_watch.latest #>> '{discovery,domain}', ''))), 'UTF8')), 'hex'),
      v_watch.id, v_watch.scan_id, v_token_hash, v_result, v_completed_at);
  return v_result;
end;
$$;

-- One SQL statement provides a consistent snapshot without PostgREST row-page
-- truncation. Export only this Watch, its source Scan and its own measurement
-- runs; never include other watches, profile drafts or profile management tokens.
create or replace function public.aix_next_export_watch_data(p_token text, p_email text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare v_result jsonb;
begin
  select jsonb_build_object(
    'watch', to_jsonb(w) - 'token',
    'scan', (select to_jsonb(s) from public.aix_next_scans s where s.id = w.scan_id),
    'measurementRuns', coalesce((select jsonb_agg(to_jsonb(r) - 'watch_token' order by r.created_at, r.id)
      from public.aix_next_watch_runs r where r.watch_id = w.id and r.watch_token = w.token), '[]'::jsonb),
    'excluded', jsonb_build_array('public_profiles: independent ownership not verified', 'deletion_audit: operational retention record')
  ) into v_result from public.aix_next_watches w
    where w.token = p_token and lower(btrim(w.email)) = lower(btrim(p_email));
  if v_result is null then
    raise exception 'Watch credentials do not match' using errcode = '28000';
  end if;
  return v_result;
end;
$$;

revoke all on function public.aix_next_delete_watch_data(text, text, text, boolean) from public, anon, authenticated;
revoke all on function public.aix_next_export_watch_data(text, text) from public, anon, authenticated;
grant execute on function public.aix_next_delete_watch_data(text, text, text, boolean) to service_role;
grant execute on function public.aix_next_export_watch_data(text, text) to service_role;
