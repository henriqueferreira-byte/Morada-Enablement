-- Tracks whether a user has already seen the first-login navigation tour,
-- so it only auto-shows once. The topbar's "?" button replays it on demand
-- (client-side only — replaying never touches this column).
alter table profiles add column onboarded_at timestamptz;
