-- Manual per-track flag for content that isn't real yet (seed placeholder
-- lessons with no video/file/link behind them). Set by hand in SQL — track
-- authoring stays out of the Gerenciar UI per CLAUDE_CODE_PROMPT.md §7.
alter table tracks add column coming_soon boolean not null default false;
