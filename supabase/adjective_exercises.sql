-- Migration: adjectives section (inflection, vocabulary, degrees, opposites).
-- Safe to run on the existing database (idempotent). Paste into the Supabase
-- SQL editor, then seed rows with `npm run migrate-adjectives`.

-- 1. One table for all four adjective sub-exercises, tagged by `kind`.
CREATE TABLE IF NOT EXISTS adjective_exercises (
  id             TEXT        PRIMARY KEY,
  kind           TEXT        NOT NULL CHECK (kind IN ('inflection','vocab','degree','opposite')),
  prompt         TEXT        NOT NULL,
  gloss_en       TEXT,
  gloss_es       TEXT,
  answer         TEXT        NOT NULL,
  answer_es      TEXT,
  options        JSONB       NOT NULL,
  options_es     JSONB,
  explanation    TEXT        NOT NULL,
  explanation_es TEXT,
  level          TEXT        NOT NULL CHECK (level IN ('A1','A2','B1')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row-level security: exercise data is readable by everyone
ALTER TABLE adjective_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read adjective_exercises" ON adjective_exercises;
CREATE POLICY "Public read adjective_exercises"
  ON adjective_exercises FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3. Allow the new exercise_type value for progress tracking
ALTER TABLE user_progress
  DROP CONSTRAINT IF EXISTS user_progress_exercise_type_check;

ALTER TABLE user_progress
  ADD CONSTRAINT user_progress_exercise_type_check
  CHECK (exercise_type IN ('verb', 'separable', 'positional', 'directional', 'from-to', 'article', 'plural', 'word-order', 'voorstellen', 'negation', 'preposition', 'time-prep', 'expression', 'adjective'));
