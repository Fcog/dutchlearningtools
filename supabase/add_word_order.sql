-- Change exercise_id from UUID to TEXT so text-based IDs (article/plural/word-order) work.
-- Existing UUID values are valid strings, so this is safe.
ALTER TABLE user_progress ALTER COLUMN exercise_id TYPE TEXT;

-- Create word_order_sentences table
CREATE TABLE IF NOT EXISTS word_order_sentences (
  id             TEXT        PRIMARY KEY,
  words          JSONB       NOT NULL,  -- ordered array of strings (correct sentence)
  english        TEXT        NOT NULL,
  translation_es TEXT,
  rule           TEXT        NOT NULL CHECK (rule IN ('v2', 'v2-fronting', 'subordinate', 'modal', 'perfect')),
  explanation    TEXT        NOT NULL,
  explanation_es TEXT,
  level          TEXT        NOT NULL CHECK (level IN ('A1', 'A2', 'B1')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE word_order_sentences ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read word_order_sentences"
  ON word_order_sentences FOR SELECT
  TO anon, authenticated
  USING (true);

-- Update user_progress exercise_type constraint to include 'word-order'
ALTER TABLE user_progress
  DROP CONSTRAINT IF EXISTS user_progress_exercise_type_check;

ALTER TABLE user_progress
  ADD CONSTRAINT user_progress_exercise_type_check
  CHECK (exercise_type IN ('verb', 'separable', 'positional', 'article', 'plural', 'word-order'));
