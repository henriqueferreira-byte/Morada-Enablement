-- Hub de Enablement Morada — schema, RLS and the auth.users -> profiles trigger.
-- See CLAUDE_CODE_PROMPT.md (design-reference/) for the source spec.

create extension if not exists pgcrypto;

-- ── Profiles ────────────────────────────────────────────────────────────────

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  team text,                                  -- 'vendas' | 'cs' | 'onboarding' | 'marketing' | 'outro'
  role text not null default 'member',        -- 'member' | 'admin'
  created_at timestamptz not null default now()
);

-- ── Catalog: product > feature (materials folder) ──────────────────────────

create table products (
  id text primary key,                        -- 'vendas' | 'relacionamento' | 'institucional' | 'transversal'
  name text not null,
  accent text not null,
  description text,
  position int not null default 0
);

create table features (
  id text primary key,                        -- 'vendas:filas'
  product_id text not null references products on delete cascade,
  name text not null,
  description text,
  position int not null default 0
);

-- ── Materials library ────────────────────────────────────────────────────────

create table materials (
  id uuid primary key default gen_random_uuid(),
  feature_id text not null references features on delete cascade,
  title text not null,
  description text,
  ext text not null,                          -- 'PPTX' | 'PDF' | 'DOCX' | 'XLSX' | 'MP4' | 'LINK'
  format text not null,                       -- 'Apresentação' | 'PDF' | 'Documento' | 'Planilha' | 'Vídeo' | 'Notion' | 'Drive'
  storage_path text,                          -- file in the bucket
  external_url text,                          -- or Drive/Notion link
  status text not null default 'published',   -- 'draft' | 'published'
  is_highlight boolean not null default true, -- surfaces in Novidades
  created_by uuid references profiles,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (storage_path is not null or external_url is not null)
);

-- ── Tracks and lessons ───────────────────────────────────────────────────────

create table tracks (
  id text primary key,                        -- 'v1'
  product_id text not null references products,
  title text not null,
  description text,
  level text not null,                        -- 'Essencial' | 'Intermediário' | 'Avançado'
  audience text,
  owner_id uuid references profiles,          -- set once a real admin owns the track
  owner_name text,                            -- seed-time display fallback when owner_id is null
  owner_role text,
  is_required boolean not null default false,
  position int not null default 0,
  updated_at timestamptz not null default now()
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  track_id text not null references tracks on delete cascade,
  position int not null,
  title text not null,
  kind text not null,                         -- 'video' | 'artigo' | 'deck' | 'quiz' | 'template' | 'link'
  duration_min int not null default 0,
  source_label text,                          -- 'Gravação interna', 'Notion', '8 perguntas'
  storage_path text,
  external_url text,
  published_at timestamptz not null default now(),
  unique (track_id, position)
);

-- ── Progress, feedback and telemetry ────────────────────────────────────────

create table lesson_progress (
  user_id uuid not null references profiles on delete cascade,
  lesson_id uuid not null references lessons on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table lesson_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  lesson_id uuid not null references lessons on delete cascade,
  stars smallint not null check (stars between 1 and 5),
  tags text[] not null default '{}',
  comment text,
  created_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table material_events (                -- usage telemetry
  id bigserial primary key,
  user_id uuid references profiles,
  material_id uuid references materials on delete cascade,
  kind text not null,                         -- 'open' | 'download'
  created_at timestamptz not null default now()
);

-- security definer: lesson rows show the aggregate rating to every user,
-- but lesson_feedback RLS below restricts raw rows (with comments) to their
-- author and admins — so the aggregate is exposed through this function
-- instead of a plain view, which would otherwise inherit that same RLS.
create function lesson_ratings_agg()
returns table (lesson_id uuid, avg_stars numeric, ratings_count bigint)
language sql
security definer set search_path = public
stable
as $$
  select lesson_id, round(avg(stars)::numeric, 1) as avg_stars, count(*) as ratings_count
  from lesson_feedback group by lesson_id;
$$;

create view lesson_ratings as select * from lesson_ratings_agg();
grant select on lesson_ratings to authenticated;

-- ── auth.users -> profiles trigger ──────────────────────────────────────────

create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── RLS ──────────────────────────────────────────────────────────────────────

alter table profiles enable row level security;
alter table products enable row level security;
alter table features enable row level security;
alter table materials enable row level security;
alter table tracks enable row level security;
alter table lessons enable row level security;
alter table lesson_progress enable row level security;
alter table lesson_feedback enable row level security;
alter table material_events enable row level security;

create function is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- Profiles: everyone authenticated can read profiles (names/avatars for the
-- "responsável" block); each user can only update their own row.
create policy read_profiles on profiles for select to authenticated using (true);
create policy update_own_profile on profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Catalog: readable by any authenticated user (domain gate happens at login).
create policy read_products on products for select to authenticated using (true);
create policy read_features on features for select to authenticated using (true);
create policy read_tracks on tracks for select to authenticated using (true);
create policy read_lessons on lessons for select to authenticated using (true);

-- Materials: published rows are readable by everyone; drafts only by admins.
create policy read_materials on materials for select to authenticated
  using (status = 'published' or is_admin());
create policy admin_insert_materials on materials for insert to authenticated
  with check (is_admin());
create policy admin_update_materials on materials for update to authenticated
  using (is_admin()) with check (is_admin());
create policy admin_delete_materials on materials for delete to authenticated
  using (is_admin());

-- Lessons: admin-authored (day-1 scope only lets admins publish materials
-- and lessons — see CLAUDE_CODE_PROMPT.md §7 "o que não fazer no dia 1").
create policy admin_insert_lessons on lessons for insert to authenticated
  with check (is_admin());
create policy admin_update_lessons on lessons for update to authenticated
  using (is_admin()) with check (is_admin());
create policy admin_update_tracks on tracks for update to authenticated
  using (is_admin()) with check (is_admin());

-- Progress and feedback: each user only sees and writes their own.
create policy own_progress on lesson_progress for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy own_feedback_write on lesson_feedback for insert to authenticated
  with check (user_id = auth.uid());
create policy own_feedback_read on lesson_feedback for select to authenticated
  using (user_id = auth.uid());
create policy admin_reads_feedback on lesson_feedback for select to authenticated
  using (is_admin());

-- Telemetry: users insert their own events; admins read all (not exposed in UI yet).
create policy own_events_write on material_events for insert to authenticated
  with check (user_id = auth.uid());
create policy admin_reads_events on material_events for select to authenticated
  using (is_admin());
