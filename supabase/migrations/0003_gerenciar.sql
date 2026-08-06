-- Extends lessons to match materials' publish/draft + highlight + author
-- pattern, so the Gerenciar form's "Salvar rascunho" / "Publicar em
-- Novidades" controls mean the same thing for both content kinds.

alter table lessons add column status text not null default 'published';
alter table lessons add column is_highlight boolean not null default true;
alter table lessons add column created_by uuid references profiles;

drop policy read_lessons on lessons;
create policy read_lessons on lessons for select to authenticated
  using (status = 'published' or is_admin());
