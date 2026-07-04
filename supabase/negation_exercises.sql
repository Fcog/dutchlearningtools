-- Migration: negation exercise type (geen vs niet + niet placement).
-- Safe to run on the existing database (idempotent). Paste into the Supabase
-- SQL editor, then seed rows with `npm run migrate-negation`.

-- 1. The exercise table
CREATE TABLE IF NOT EXISTS negation_exercises (
  id             TEXT        PRIMARY KEY,
  english        TEXT        NOT NULL,
  translation_es TEXT,
  words          JSONB       NOT NULL,  -- ordered array of the affirmative sentence's tokens
  negator        TEXT        NOT NULL CHECK (negator IN ('niet','geen')),
  mode           TEXT        NOT NULL CHECK (mode IN ('insert','replace')),
  position       INT         NOT NULL,  -- gap index (insert) or token index (replace)
  explanation    TEXT        NOT NULL,
  explanation_es TEXT,
  level          TEXT        NOT NULL CHECK (level IN ('A1','A2','B1')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row-level security: exercise data is readable by everyone
ALTER TABLE negation_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read negation_exercises" ON negation_exercises;
CREATE POLICY "Public read negation_exercises"
  ON negation_exercises FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3. Allow the new exercise_type value for progress tracking
ALTER TABLE user_progress
  DROP CONSTRAINT IF EXISTS user_progress_exercise_type_check;

ALTER TABLE user_progress
  ADD CONSTRAINT user_progress_exercise_type_check
  CHECK (exercise_type IN ('verb', 'separable', 'positional', 'directional', 'from-to', 'article', 'plural', 'word-order', 'voorstellen', 'negation'));
