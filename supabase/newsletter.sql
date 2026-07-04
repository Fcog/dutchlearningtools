-- Migration: daily-newsletter opt-in.
-- Safe to run on the existing database (idempotent). Paste into the Supabase
-- SQL editor. See NEWSLETTER_SETUP.md for the scheduler + secrets.

-- ── 1. Per-user opt-in preferences ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  user_id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT        NOT NULL,
  opted_in          BOOLEAN     NOT NULL DEFAULT TRUE,
  lang              TEXT        NOT NULL DEFAULT 'en' CHECK (lang IN ('en','es')),
  unsubscribe_token UUID        NOT NULL DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- The daily job (service role) filters on this.
CREATE INDEX IF NOT EXISTS newsletter_opted_in_idx ON newsletter_subscriptions (opted_in) WHERE opted_in;

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Each user may read and manage only their own subscription row.
DROP POLICY IF EXISTS "own sub select" ON newsletter_subscriptions;
CREATE POLICY "own sub select" ON newsletter_subscriptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own sub insert" ON newsletter_subscriptions;
CREATE POLICY "own sub insert" ON newsletter_subscriptions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own sub update" ON newsletter_subscriptions;
CREATE POLICY "own sub update" ON newsletter_subscriptions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Keep updated_at fresh.
CREATE OR REPLACE FUNCTION public.touch_newsletter_updated_at()
  RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS newsletter_updated_at ON newsletter_subscriptions;
CREATE TRIGGER newsletter_updated_at BEFORE UPDATE ON newsletter_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.touch_newsletter_updated_at();

-- ── 2. The global "exercise of the day" ─────────────────────────────────────
-- One row per calendar day so the email and the landing page always match, and
-- re-running the job on the same day is idempotent.
CREATE TABLE IF NOT EXISTS daily_exercise (
  day           DATE        PRIMARY KEY,
  exercise_type TEXT        NOT NULL,
  exercise_id   TEXT        NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE daily_exercise ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read daily_exercise" ON daily_exercise;
CREATE POLICY "public read daily_exercise" ON daily_exercise
  FOR SELECT TO anon, authenticated USING (true);

-- ── 3. Token-based unsubscribe (callable by anon, no login needed) ──────────
CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter(p_token UUID)
  RETURNS BOOLEAN
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE affected INT;
BEGIN
  UPDATE newsletter_subscriptions
     SET opted_in = FALSE, updated_at = NOW()
   WHERE unsubscribe_token = p_token;
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected > 0;
END; $$;

GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter(UUID) TO anon, authenticated;
