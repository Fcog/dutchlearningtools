-- ── Verb conjugation ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS verbs (
  id          TEXT PRIMARY KEY,
  infinitive  TEXT    NOT NULL,
  english     TEXT    NOT NULL,
  level       TEXT    NOT NULL CHECK (level IN ('A1','A2','B1')),
  auxiliary   TEXT    NOT NULL CHECK (auxiliary IN ('hebben','zijn')),
  conjugation JSONB   NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercises (
  id             UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  verb_id        TEXT    NOT NULL REFERENCES verbs(id) ON DELETE CASCADE,
  dutch          TEXT    NOT NULL,
  english        TEXT    NOT NULL,
  answer         TEXT    NOT NULL,
  tense          TEXT    NOT NULL CHECK (tense IN ('present','past','perfect')),
  translation_es TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (verb_id, dutch)
);

-- ── Separable verbs ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS separable_verb_sets (
  id             UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  infinitive     TEXT    NOT NULL UNIQUE,
  english        TEXT    NOT NULL,
  translation_es TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS separable_exercises (
  id             UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  verb_set_id    UUID    NOT NULL REFERENCES separable_verb_sets(id) ON DELETE CASCADE,
  dutch          TEXT    NOT NULL,
  english        TEXT    NOT NULL,
  answer         TEXT    NOT NULL,
  context        TEXT    NOT NULL CHECK (context IN ('main','perfect','subordinate','modal')),
  translation_es TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (verb_set_id, context)
);

-- ── Positional verbs ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS positional_exercises (
  id             UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  dutch          TEXT    NOT NULL UNIQUE,
  english        TEXT    NOT NULL,
  verb           TEXT    NOT NULL CHECK (verb IN ('zijn','zitten','liggen','staan')),
  answer         TEXT    NOT NULL,
  explanation    TEXT    NOT NULL,
  explanation_es TEXT,
  level          TEXT    NOT NULL CHECK (level IN ('A1','A2','B1')),
  translation_es TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── User progress ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_progress (
  id            UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id   UUID    NOT NULL,
  exercise_type TEXT    NOT NULL CHECK (exercise_type IN ('verb','separable','positional')),
  correct_count INT     NOT NULL DEFAULT 0,
  total_count   INT     NOT NULL DEFAULT 0,
  last_seen     TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, exercise_id)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row-level security ─────────────────────────────────────────────────────

ALTER TABLE verbs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises            ENABLE ROW LEVEL SECURITY;
ALTER TABLE separable_verb_sets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE separable_exercises  ENABLE ROW LEVEL SECURITY;
ALTER TABLE positional_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress        ENABLE ROW LEVEL SECURITY;

-- Exercise data: readable by everyone (anon + authenticated)
CREATE POLICY "public read" ON verbs                FOR SELECT USING (true);
CREATE POLICY "public read" ON exercises            FOR SELECT USING (true);
CREATE POLICY "public read" ON separable_verb_sets  FOR SELECT USING (true);
CREATE POLICY "public read" ON separable_exercises  FOR SELECT USING (true);
CREATE POLICY "public read" ON positional_exercises FOR SELECT USING (true);

-- Progress: each user sees and writes only their own rows
CREATE POLICY "own rows"   ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own update" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
