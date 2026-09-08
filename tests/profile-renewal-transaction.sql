-- Run after migration 015 on a disposable PostgreSQL database.
-- All fixtures and changes are rolled back, including on assertion failure.
\set ON_ERROR_STOP on
begin;

insert into public.aix_next_scans (id, target_url, stage)
values ('renewal-tx-scan', 'https://renewal.example/', 'complete');

insert into public.aix_next_watches
  (id, token, email, scan_id, status, paid, stripe_subscription_id, baseline, latest, next_run_at)
values
  ('renewal-tx-watch', 'renewal-tx-token', '', 'renewal-tx-scan', 'active', true,
   'renewal-tx-subscription', '{}', '{"targetUrl":"https://renewal.example/"}', now());

insert into public.aix_next_public_profiles
  (id, slug, status, title, brand_name, target_url, token, source_scan_id,
   created_at, updated_at, expires_at, automation)
select 'renewal-tx-' || label, 'renewal-tx-' || label, state, 'Renewal fixture', 'Renewal fixture',
       target, 'renewal-tx-owner-' || label, 'renewal-tx-scan',
       now() - interval '35 days', now() - interval '2 days', expiry,
       jsonb_build_object('watchId', binding, 'enabled', false, 'maintenanceEnabled', consent,
                          'grantedAt', now() - interval '35 days', 'freeExpiresAt', now() - interval '5 days')
from (values
  ('active', 'published', 'https://renewal.example/', now() + interval '1 day', 'renewal-tx-watch', true),
  ('revoked', 'revoked', 'https://renewal.example/', now() + interval '1 day', 'renewal-tx-watch', true),
  ('expired-status', 'expired', 'https://renewal.example/', now() + interval '1 day', 'renewal-tx-watch', true),
  ('expired-date', 'published', 'https://renewal.example/', now() - interval '1 day', 'renewal-tx-watch', true),
  ('no-consent', 'published', 'https://renewal.example/', now() + interval '1 day', 'renewal-tx-watch', false),
  ('unbound', 'published', 'https://renewal.example/', now() + interval '1 day', 'another-watch', true),
  ('wrong-target', 'published', 'https://other.example/', now() + interval '1 day', 'renewal-tx-watch', true),
  ('draft', 'draft', 'https://renewal.example/', now() + interval '1 day', 'renewal-tx-watch', true)
) as fixtures(label, state, target, expiry, binding, consent);

do $$
declare
  count_updated integer;
  original_expiry timestamptz;
  first_expiry timestamptz;
  first_updated timestamptz;
  original_free text;
begin
  if has_function_privilege('anon', 'public.aix_next_renew_public_profiles(text)', 'EXECUTE')
     or has_function_privilege('authenticated', 'public.aix_next_renew_public_profiles(text)', 'EXECUTE')
     or not has_function_privilege('service_role', 'public.aix_next_renew_public_profiles(text)', 'EXECUTE') then
    raise exception 'renewal RPC permissions are not service-role-only';
  end if;
  select expires_at, automation->>'freeExpiresAt' into original_expiry, original_free
  from public.aix_next_public_profiles where id = 'renewal-tx-active';

  select count(*) into count_updated from public.aix_next_renew_public_profiles('wrong-token');
  if count_updated <> 0 then raise exception 'wrong token renewed a profile'; end if;
  select count(*) into count_updated from public.aix_next_renew_public_profiles('renewal-tx-token');
  if count_updated <> 1 then raise exception 'expected exactly one eligible active profile; got %', count_updated; end if;
  select expires_at, updated_at into first_expiry, first_updated
  from public.aix_next_public_profiles where id = 'renewal-tx-active';
  if first_expiry < now() + interval '8 days' or first_expiry <= original_expiry then
    raise exception 'active paid lease did not renew beyond 30 days';
  end if;
  if exists (select 1 from public.aix_next_public_profiles where id = 'renewal-tx-active'
    and (automation->>'freeExpiresAt' <> original_free or automation->>'enabled' <> 'false'
      or automation->>'renewedAt' is null or automation->>'renewalExpiresAt' is null)) then
    raise exception 'renewal changed the free expiry/content consent or omitted durable receipt';
  end if;
  if exists (select 1 from public.aix_next_public_profiles where id like 'renewal-tx-%'
      and id <> 'renewal-tx-active' and automation ? 'renewedAt') then
    raise exception 'revoked/expired/draft/no-consent/unbound/wrong-target profile was renewed';
  end if;
  select count(*) into count_updated from public.aix_next_renew_public_profiles('renewal-tx-token');
  if count_updated <> 0 or exists (select 1 from public.aix_next_public_profiles where id = 'renewal-tx-active'
      and (expires_at <> first_expiry or updated_at <> first_updated)) then
    raise exception 'duplicate renewal is not idempotent';
  end if;

  -- Make the profile due again. Each contract rejection must come from the
  -- current locked Watch state, not the daily duplicate-renewal guard.
  update public.aix_next_public_profiles set automation = automation - 'renewedAt'
  where id = 'renewal-tx-active';
  update public.aix_next_watches set status = 'cancelled', paid = false where id = 'renewal-tx-watch';
  select count(*) into count_updated from public.aix_next_renew_public_profiles('renewal-tx-token');
  if count_updated <> 0 then raise exception 'just-cancelled subscription renewed'; end if;
  update public.aix_next_watches set status = 'active', paid = false where id = 'renewal-tx-watch';
  select count(*) into count_updated from public.aix_next_renew_public_profiles('renewal-tx-token');
  if count_updated <> 0 then raise exception 'unpaid active subscription renewed'; end if;
  update public.aix_next_watches set status = 'past_due', paid = true where id = 'renewal-tx-watch';
  select count(*) into count_updated from public.aix_next_renew_public_profiles('renewal-tx-token');
  if count_updated <> 0 then raise exception 'past-due subscription renewed'; end if;
  update public.aix_next_watches set status = 'active', paid = true, stripe_subscription_id = null where id = 'renewal-tx-watch';
  select count(*) into count_updated from public.aix_next_renew_public_profiles('renewal-tx-token');
  if count_updated <> 0 then raise exception 'missing subscription renewed'; end if;
  if exists (select 1 from public.aix_next_public_profiles where id = 'renewal-tx-active'
      and (expires_at <> first_expiry or automation ? 'renewedAt')) then
    raise exception 'a rejected renewal wrote expiry or receipt';
  end if;

  -- Contract recovery does not resurrect a revoked profile.
  update public.aix_next_public_profiles set status = 'revoked' where id = 'renewal-tx-active';
  update public.aix_next_watches set stripe_subscription_id = 'renewal-tx-subscription' where id = 'renewal-tx-watch';
  select count(*) into count_updated from public.aix_next_renew_public_profiles('renewal-tx-token');
  if count_updated <> 0 then raise exception 'payment recovery resurrected a revoked profile'; end if;
end;
$$;

rollback;
\echo 'profile renewal transaction assertions passed; fixtures rolled back'
