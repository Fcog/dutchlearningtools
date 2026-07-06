-- Adds a per-day "already sent" guard so the newsletter is delivered at most
-- once per calendar day, regardless of how many times the function is invoked.
-- Safe to run on the existing database (idempotent).

ALTER TABLE daily_exercise ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;
