-- Lets admins see everyone's lesson progress (for the new Gerenciar > Usuários
-- directory), on top of the existing own_progress policy that already lets
-- each user read/write their own rows.
create policy admin_reads_progress on lesson_progress for select to authenticated
  using (is_admin());
