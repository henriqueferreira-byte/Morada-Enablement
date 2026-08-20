-- auth.users.last_sign_in_at only updates on a fresh sign-in, not on every
-- visit — a user with a persisted session can stay "active" for weeks
-- without ever re-triggering it, making "último acesso" in the admin
-- directory stale. Track real visits separately, updated (throttled) on
-- every authenticated request in proxy.ts.
alter table profiles add column last_seen_at timestamptz;

-- existing self-update policy (update_own_profile, id = auth.uid()) already
-- covers this column — no new policy needed.
