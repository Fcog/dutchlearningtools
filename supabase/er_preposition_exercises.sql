-- Migration: er + preposition (voornaamwoordelijke bijwoorden) exercise type.
-- Safe to run on the existing database (idempotent). Paste into the Supabase
-- SQL editor, then seed rows with `npm run migrate-er-prepositions`.

-- 1. The exercise table
CREATE TABLE IF NOT EXISTS er_preposition_exercises (
  id             TEXT        PRIMARY KEY,
  dutch          TEXT        NOT NULL,
  english        TEXT        NOT NULL,
  translation_es TEXT,
  answer         TEXT        NOT NULL,
  options        JSONB       NOT NULL,
  usage          TEXT        NOT NULL CHECK (usage IN ('place','prepositional')),
  explanation    TEXT        NOT NULL,
  explanation_es TEXT,
  level          TEXT        NOT NULL CHECK (level IN ('A1','A2','B1')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row-level security: exercise data is readable by everyone
ALTER TABLE er_preposition_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read er_preposition_exercises" ON er_preposition_exercises;
CREATE POLICY "Public read er_preposition_exercises"
  ON er_preposition_exercises FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3. Allow the new exercise_type value for progress tracking.
--    NOTE: this CHECK must list EVERY existing exercise type plus the new one —
--    re-adding a shorter list fails with error 23514 on existing rows.
ALTER TABLE user_progress
  DROP CONSTRAINT IF EXISTS user_progress_exercise_type_check;

ALTER TABLE user_progress
  ADD CONSTRAINT user_progress_exercise_type_check
  CHECK (exercise_type IN ('verb', 'separable', 'positional', 'directional', 'from-to', 'article', 'plural', 'word-order', 'voorstellen', 'negation', 'preposition', 'time-prep', 'expression', 'adjective', 'diminutive', 'er-preposition'));
