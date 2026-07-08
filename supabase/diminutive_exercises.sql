-- Migration: diminutives (verkleinwoorden) exercise type.
-- Safe to run on the existing database (idempotent). Paste into the Supabase
-- SQL editor, then seed rows with `npm run migrate-diminutives`.

-- 1. The exercise table
CREATE TABLE IF NOT EXISTS diminutive_exercises (
  id             TEXT        PRIMARY KEY,
  dutch          TEXT        NOT NULL,
  english        TEXT        NOT NULL,
  translation_es TEXT,
  answer         TEXT        NOT NULL,
  options        JSONB       NOT NULL,
  category       TEXT        NOT NULL CHECK (category IN ('je','tje','etje','pje','kje','irregular')),
  explanation    TEXT        NOT NULL,
  explanation_es TEXT,
  level          TEXT        NOT NULL CHECK (level IN ('A1','A2','B1')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row-level security: exercise data is readable by everyone
ALTER TABLE diminutive_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read diminutive_exercises" ON diminutive_exercises;
CREATE POLICY "Public read diminutive_exercises"
  ON diminutive_exercises FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3. Allow the new exercise_type value for progress tracking (full list).
ALTER TABLE user_progress
  DROP CONSTRAINT IF EXISTS user_progress_exercise_type_check;

ALTER TABLE user_progress
  ADD CONSTRAINT user_progress_exercise_type_check
  CHECK (exercise_type IN ('verb', 'separable', 'positional', 'directional', 'from-to', 'article', 'plural', 'word-order', 'voorstellen', 'negation', 'preposition', 'time-prep', 'expression', 'adjective', 'diminutive'));
