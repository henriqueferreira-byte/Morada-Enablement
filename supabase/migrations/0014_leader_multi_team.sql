-- leads_team can now hold more than one team as a comma-separated list
-- (e.g. 'onboarding,suporte') — Luiza leads both. 'all' still means
-- company-wide and is never combined with a team list.
drop policy leader_reads_scoped_progress on lesson_progress;
create policy leader_reads_scoped_progress on lesson_progress for select to authenticated
  using (
    is_leader()
    and (
      leader_scope() = 'all'
      or (select team from profiles where id = lesson_progress.user_id) = any(string_to_array(leader_scope(), ','))
    )
  );

update profiles set leads_team = 'onboarding,suporte' where lower(email) = 'luiza.kolanscki@morada.ai';

-- Keep the signup-time trigger in sync for consistency, in case her row
-- is ever recreated (e.g. account deleted and re-invited).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  assigned_team text;
begin
  assigned_team := case lower(new.email)
    when 'karen.silva@morada.ai' then 'marketing'
    when 'pedro.miranda@morada.ai' then 'cs'
    when 'luiza.kolanscki@morada.ai' then 'onboarding,suporte'
    when 'lucas.carvalho@morada.ai' then 'tecnologia'
    when 'gabriel.chaves@morada.ai' then 'produto'
    when 'ramon@morada.ai' then 'all'
    when 'luis@morada.ai' then 'all'
    when 'gabriel.maracaipe@morada.ai' then 'all'
    else null
  end;

  insert into public.profiles (id, email, full_name, avatar_url, role, leads_team)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    case when assigned_team is not null then 'leader' else 'member' end,
    assigned_team
  );
  return new;
end;
$$;
