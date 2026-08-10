-- Lets admins create a new materials folder (feature) on the fly from
-- Gerenciar, instead of only being able to pick from features seeded by hand.
create policy admin_insert_features on features for insert to authenticated
  with check (is_admin());
