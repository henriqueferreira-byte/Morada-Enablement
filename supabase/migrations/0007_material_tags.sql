-- Two curated tag dimensions for materials, set at publish time in
-- Gerenciar and shown as badges wherever materials are listed.
alter table materials add column content_type text;
alter table materials add column category text;
