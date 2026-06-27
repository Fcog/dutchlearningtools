-- Create plural_nouns table
CREATE TABLE IF NOT EXISTS plural_nouns (
  id              TEXT PRIMARY KEY,
  singular        TEXT NOT NULL,
  article         TEXT NOT NULL CHECK (article IN ('de', 'het')),
  plural          TEXT NOT NULL,
  plural_type     TEXT NOT NULL CHECK (plural_type IN ('en', 's', 'eren', 'irregular')),
  english         TEXT NOT NULL,
  translation_es  TEXT,
  tip             TEXT,
  tip_es          TEXT,
  level           TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE plural_nouns ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read plural_nouns"
  ON plural_nouns FOR SELECT
  TO anon, authenticated
  USING (true);

-- Update user_progress exercise_type constraint to include 'plural'
ALTER TABLE user_progress
  DROP CONSTRAINT IF EXISTS user_progress_exercise_type_check;

ALTER TABLE user_progress
  ADD CONSTRAINT user_progress_exercise_type_check
  CHECK (exercise_type IN ('verb', 'separable', 'positional', 'article', 'plural'));
