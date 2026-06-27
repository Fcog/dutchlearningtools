-- Migration: add article_nouns table and extend user_progress constraint
-- Run this in the Supabase SQL editor before seeding data with:
--   npx tsx scripts/migrate-articles.ts

-- ── 1. New table ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS article_nouns (
  id             TEXT        PRIMARY KEY,
  noun           TEXT        NOT NULL,
  article        TEXT        NOT NULL CHECK (article IN ('de','het')),
  english        TEXT        NOT NULL,
  translation_es TEXT,
  level          TEXT        NOT NULL CHECK (level IN ('A1','A2','B1')),
  tip            TEXT,
  tip_es         TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. RLS ─────────────────────────────────────────────────────────────────

ALTER TABLE article_nouns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON article_nouns FOR SELECT USING (true);

-- ── 3. Extend user_progress to allow 'article' exercise type ───────────────

ALTER TABLE user_progress
  DROP CONSTRAINT IF EXISTS user_progress_exercise_type_check;

ALTER TABLE user_progress
  ADD CONSTRAINT user_progress_exercise_type_check
  CHECK (exercise_type IN ('verb','separable','positional','article'));
