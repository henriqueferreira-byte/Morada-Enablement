-- Separate "a real lesson was published here" signal from the generic
-- updated_at column, which also gets bumped by unrelated admin edits
-- (toggling coming_soon, connecting a pasta, marking obrigatória...).
-- Using plain updated_at for the "NOVO" badge and trilhas sort meant any
-- metadata edit — or even coincidental seed-time offsets landing within the
-- lookback window — could make a placeholder trilha look freshly updated.
alter table tracks add column content_updated_at timestamptz;
