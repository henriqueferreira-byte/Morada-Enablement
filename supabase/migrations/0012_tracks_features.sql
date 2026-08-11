-- Lets a trilha live inside a materials "pasta" (feature) so the two
-- libraries connect, and lets admins create a brand new trilha from
-- Gerenciar instead of only picking from tracks seeded by hand.
alter table tracks add column feature_id text references features(id) on delete set null;

create policy admin_insert_tracks on tracks for insert to authenticated
  with check (is_admin());
