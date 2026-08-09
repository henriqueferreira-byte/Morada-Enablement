-- In-app inbox for "Solicitar conteúdo" (Home) — replaces the mailto:
-- approach: requests land here, visible only to admins in Gerenciar.
create table content_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  message text not null,
  status text not null default 'open',        -- 'open' | 'resolved'
  created_at timestamptz not null default now()
);

alter table content_requests enable row level security;

create policy own_content_request_insert on content_requests for insert to authenticated
  with check (user_id = auth.uid());

create policy admin_reads_content_requests on content_requests for select to authenticated
  using (is_admin());

create policy admin_updates_content_requests on content_requests for update to authenticated
  using (is_admin()) with check (is_admin());
