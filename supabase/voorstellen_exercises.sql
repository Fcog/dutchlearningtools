-- Migration: `voorstellen` gap-fill exercise type.
-- Safe to run on the existing database (idempotent). Paste into the Supabase
-- SQL editor, then seed rows with `npm run migrate-voorstellen`.

-- 1. The exercise table
CREATE TABLE IF NOT EXISTS voorstellen_exercises (
  id             TEXT        PRIMARY KEY,
  english        TEXT        NOT NULL,
  translation_es TEXT,
  dutch          TEXT        NOT NULL,
  gapped         TEXT        NOT NULL,
  answers        JSONB       NOT NULL,  -- ordered array of correct fills
  bank           JSONB       NOT NULL,  -- tap-mode chips (answers + distractors)
  meaning        TEXT        NOT NULL CHECK (meaning IN ('introduce','introduce_self','imagine','suggest','represent','worth')),
  explanation    TEXT        NOT NULL,
  explanation_es TEXT,
  level          TEXT        NOT NULL CHECK (level IN ('A1','A2','B1')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row-level security: exercise data is readable by everyone
ALTER TABLE voorstellen_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read voorstellen_exercises" ON voorstellen_exercises;
CREATE POLICY "Public read voorstellen_exercises"
  ON voorstellen_exercises FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3. Allow the new exercise_type value for progress tracking
ALTER TABLE user_progress
  DROP CONSTRAINT IF EXISTS user_progress_exercise_type_check;

ALTER TABLE user_progress
  ADD CONSTRAINT user_progress_exercise_type_check
  CHECK (exercise_type IN ('verb', 'separable', 'positional', 'directional', 'from-to', 'article', 'plural', 'word-order', 'voorstellen'));
