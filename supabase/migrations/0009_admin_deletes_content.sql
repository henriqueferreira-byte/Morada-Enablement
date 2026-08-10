-- Lets admins delete lessons and tracks from Gerenciar (materials already had
-- this via admin_delete_materials). Deleting a track cascades its lessons,
-- and deleting a lesson cascades its progress/feedback rows (see 0001_init).
create policy admin_delete_lessons on lessons for delete to authenticated
  using (is_admin());
create policy admin_delete_tracks on tracks for delete to authenticated
  using (is_admin());
