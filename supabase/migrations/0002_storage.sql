-- RLS for the hub-materials Storage bucket. The bucket itself was created
-- via the Storage API (private, no public fileSizeLimit override — the
-- project's global max upload size applies; raise it in
-- Storage settings if the real catalog needs files bigger than that).

create policy hub_materials_read on storage.objects for select to authenticated
  using (bucket_id = 'hub-materials');

create policy hub_materials_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'hub-materials' and is_admin());

create policy hub_materials_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'hub-materials' and is_admin());

create policy hub_materials_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'hub-materials' and is_admin());
