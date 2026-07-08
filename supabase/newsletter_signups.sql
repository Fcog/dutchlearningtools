-- Migration: public newsletter sign-ups (homepage CTA) with double opt-in.
-- Safe to run on the existing database (idempotent). Paste into the Supabase
-- SQL editor.

-- 1. Public sign-up store. A captured email does nothing until confirmed=true
--    (double opt-in), so a bot cannot actually subscribe other people.
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT        NOT NULL UNIQUE,
  lang              TEXT        NOT NULL DEFAULT 'en' CHECK (lang IN ('en','es')),
  confirmed         BOOLEAN     NOT NULL DEFAULT FALSE,
  unsubscribed      BOOLEAN     NOT NULL DEFAULT FALSE,
  confirm_token     UUID        NOT NULL DEFAULT gen_random_uuid(),
  unsubscribe_token UUID        NOT NULL DEFAULT gen_random_uuid(),
  ip                TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at      TIMESTAMPTZ
);

-- For per-IP rate limiting in the Edge Function.
CREATE INDEX IF NOT EXISTS newsletter_signups_ip_idx ON newsletter_signups (ip, created_at);

-- No public table access — all reads/writes go through the service role
-- (Edge Function) or the SECURITY DEFINER RPCs below.
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- 2. Confirm (double opt-in). Called by the /confirm-newsletter page (anon).
CREATE OR REPLACE FUNCTION public.confirm_newsletter_signup(p_token UUID)
  RETURNS BOOLEAN
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE found BOOLEAN;
BEGIN
  UPDATE newsletter_signups
     SET confirmed = TRUE, confirmed_at = COALESCE(confirmed_at, NOW()), unsubscribed = FALSE
   WHERE confirm_token = p_token;
  SELECT EXISTS (SELECT 1 FROM newsletter_signups WHERE confirm_token = p_token) INTO found;
  RETURN found;
END; $$;

GRANT EXECUTE ON FUNCTION public.confirm_newsletter_signup(UUID) TO anon, authenticated;

-- 3. Unsubscribe — extend the existing function to also cover public sign-ups,
--    so one /unsubscribe link works for both logged-in opt-ins and CTA sign-ups.
CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter(p_token UUID)
  RETURNS BOOLEAN
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a INT; b INT;
BEGIN
  UPDATE newsletter_subscriptions SET opted_in = FALSE, updated_at = NOW()
   WHERE unsubscribe_token = p_token;
  GET DIAGNOSTICS a = ROW_COUNT;
  UPDATE newsletter_signups SET unsubscribed = TRUE
   WHERE unsubscribe_token = p_token;
  GET DIAGNOSTICS b = ROW_COUNT;
  RETURN (a + b) > 0;
END; $$;

GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter(UUID) TO anon, authenticated;
