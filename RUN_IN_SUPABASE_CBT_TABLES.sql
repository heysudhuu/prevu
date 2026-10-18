-- ==============================================================================
-- RUN IN SUPABASE SQL EDITOR: Create CBT Arena Tables & Policies
-- Link: https://supabase.com/dashboard/project/ceqhxxvaioegvqfaszgx/sql/new
-- ==============================================================================

-- 1. Table for student CBT Mock Test attempts and latest scores (Leaderboard)
CREATE TABLE IF NOT EXISTS public.cbt_attempts (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    allotted_minutes INTEGER NOT NULL DEFAULT 0,
    attempts_count INTEGER NOT NULL DEFAULT 1,
    answers_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, subject_code)
);

-- Foreign key to users table (if users table has matching IDs)
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cbt_attempts_user_id_fkey'
  ) THEN 
    ALTER TABLE public.cbt_attempts 
    ADD CONSTRAINT cbt_attempts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN OTHERS THEN 
  NULL;
END $$;

-- 2. Indexes for fast leaderboard querying
CREATE INDEX IF NOT EXISTS idx_cbt_attempts_subject_score 
ON public.cbt_attempts (subject_code, percentage DESC, time_spent_seconds ASC);

-- 3. RLS Policies
ALTER TABLE public.cbt_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view cbt attempts" ON public.cbt_attempts;
CREATE POLICY "Public can view cbt attempts" 
ON public.cbt_attempts FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Service role and users can manage attempts" ON public.cbt_attempts;
CREATE POLICY "Service role and users can manage attempts" 
ON public.cbt_attempts FOR ALL 
USING (true)
WITH CHECK (true);

-- 4. Grant table & sequence access
GRANT ALL ON TABLE public.cbt_attempts TO anon, authenticated, service_role;
GRANT ALL ON SEQUENCE public.cbt_attempts_id_seq TO anon, authenticated, service_role;

-- 5. Seed historical attempt for Nisha so existing standings are retained
INSERT INTO public.cbt_attempts (user_id, subject_code, score, total_questions, percentage, time_spent_seconds, attempts_count, updated_at)
VALUES 
  ('ulPFdjy9zlTAArZnIpD4WiPzsHm2', 'APT-301', 5, 15, 33.3, 79, 1, '2026-10-18 05:04:09.684+00')
ON CONFLICT (user_id, subject_code) 
DO UPDATE SET 
  score = EXCLUDED.score,
  total_questions = EXCLUDED.total_questions,
  percentage = EXCLUDED.percentage,
  time_spent_seconds = EXCLUDED.time_spent_seconds,
  attempts_count = EXCLUDED.attempts_count,
  updated_at = EXCLUDED.updated_at;
