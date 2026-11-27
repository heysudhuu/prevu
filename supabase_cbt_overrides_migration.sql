-- Additive-only migration for CBT Admin Subject & Question Overrides
-- Zero changes, drops, or alterations to existing tables or data.

CREATE TABLE IF NOT EXISTS public.cbt_subject_overrides (
  subject_code TEXT PRIMARY KEY,
  name TEXT,
  description TEXT,
  semester INTEGER,
  year INTEGER,
  category TEXT,
  category_label TEXT,
  credits INTEGER,
  is_ready BOOLEAN,
  badge_color TEXT,
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cbt_question_overrides (
  question_id TEXT PRIMARY KEY,
  subject_code TEXT NOT NULL,
  subject_name TEXT,
  semester INTEGER,
  category TEXT,
  topic TEXT,
  topic_name TEXT,
  part_name TEXT,
  section_name TEXT,
  passage TEXT,
  question TEXT,
  type TEXT DEFAULT 'single',
  options_json JSONB,
  correct_answers_json JSONB,
  explanation TEXT,
  difficulty TEXT DEFAULT 'easy',
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cbt_question_overrides_subject
  ON public.cbt_question_overrides (subject_code);
