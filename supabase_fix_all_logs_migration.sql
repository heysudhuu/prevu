-- ==============================================================================
-- PREVU: MASTER IDEMPOTENT SUPABASE LOG-ERROR & SCHEMA SYNC MIGRATION
-- Safe to run multiple times on a live database — ZERO data loss, ZERO drops.
-- Fixes every 404 / 400 / 42703 / RPC error seen in Supabase Edge & Postgres logs.
-- Run in Supabase Dashboard -> SQL Editor -> New query
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. RESOURCES TABLE: Missing `resource_category` & metadata columns
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.resources
  ADD COLUMN IF NOT EXISTS resource_category TEXT DEFAULT 'exam_paper',
  ADD COLUMN IF NOT EXISTS unit TEXT,
  ADD COLUMN IF NOT EXISTS resource_format TEXT DEFAULT 'file',
  ADD COLUMN IF NOT EXISTS external_url TEXT,
  ADD COLUMN IF NOT EXISTS bundle_scope TEXT DEFAULT 'subject',
  ADD COLUMN IF NOT EXISTS channel_name TEXT,
  ADD COLUMN IF NOT EXISTS youtube_id TEXT;

CREATE INDEX IF NOT EXISTS idx_resources_status_created
  ON public.resources (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_category
  ON public.resources (resource_category);

-- ------------------------------------------------------------------------------
-- 2. PAPER COMMENTS / STUDENT DOUBTS: Missing moderation & status columns
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.paper_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  parent_id UUID REFERENCES public.paper_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE IF EXISTS public.paper_comments
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS resolved_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'paper_comments_status_check'
  ) THEN
    ALTER TABLE public.paper_comments
      ADD CONSTRAINT paper_comments_status_check
      CHECK (status IN ('open', 'answered', 'resolved', 'hidden'));
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_paper_comments_resource_created
  ON public.paper_comments (resource_id, created_at);
CREATE INDEX IF NOT EXISTS idx_paper_comments_parent_id
  ON public.paper_comments (parent_id);
CREATE INDEX IF NOT EXISTS idx_paper_comments_status_created
  ON public.paper_comments (status, created_at DESC);

-- ------------------------------------------------------------------------------
-- 3. LIVE TRAFFIC ANALYTICS TABLES: `active_visitors` & `site_page_views`
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.active_visitors (
  visitor_id TEXT PRIMARY KEY,
  last_path TEXT DEFAULT '/',
  user_agent TEXT DEFAULT '',
  device_type TEXT DEFAULT 'desktop',
  is_authenticated BOOLEAN DEFAULT FALSE,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.site_page_views (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '/',
  is_authenticated BOOLEAN DEFAULT FALSE,
  device_type TEXT DEFAULT 'desktop',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_active_visitors_last_seen
  ON public.active_visitors (last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_page_views_created_at
  ON public.site_page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_page_views_visitor_created
  ON public.site_page_views (visitor_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. CBT TABLES: `cbt_questions_contributed`, `cbt_subjects_contributed`,
--    `cbt_subject_overrides`, `cbt_question_overrides`, `cbt_attempts`
-- ------------------------------------------------------------------------------
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, subject_code)
);

CREATE TABLE IF NOT EXISTS public.cbt_questions_contributed (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  semester INTEGER NOT NULL DEFAULT 1,
  category TEXT NOT NULL DEFAULT 'open-elective',
  question TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'single',
  options_json JSONB NOT NULL,
  correct_answers TEXT[] NOT NULL,
  explanation TEXT,
  unit_tag TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_cbt_questions_contributed_status
  ON public.cbt_questions_contributed (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cbt_questions_contributed_subject
  ON public.cbt_questions_contributed (subject_code, status);

CREATE TABLE IF NOT EXISTS public.cbt_subjects_contributed (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  semester INTEGER NOT NULL DEFAULT 1,
  year INTEGER NOT NULL DEFAULT 1,
  category TEXT NOT NULL DEFAULT 'open-elective',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

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

-- ------------------------------------------------------------------------------
-- 5. ADMIN CONSOLE TABLES: `reports` & `audit_logs`
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
  reporter_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  reporter_email TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  reason TEXT NOT NULL,
  notes TEXT,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  assigned_admin_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE IF EXISTS public.reports
  ADD COLUMN IF NOT EXISTS reporter_email TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS details TEXT,
  ADD COLUMN IF NOT EXISTS assigned_admin_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

CREATE INDEX IF NOT EXISTS idx_reports_status_created
  ON public.reports (status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id TEXT,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_type
  ON public.audit_logs (target_type, created_at DESC);

-- ------------------------------------------------------------------------------
-- 6. UPVOTES TABLES: `resource_upvotes`, `request_upvotes`, `paper_requests.upvotes`
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resource_upvotes (
  id SERIAL PRIMARY KEY,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(resource_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_resource_upvotes_resource_id
  ON public.resource_upvotes (resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_upvotes_user_id
  ON public.resource_upvotes (user_id);

ALTER TABLE IF EXISTS public.paper_requests
  ADD COLUMN IF NOT EXISTS upvotes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'pyq',
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS bounty_xp INTEGER DEFAULT 50;

CREATE TABLE IF NOT EXISTS public.request_upvotes (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL REFERENCES public.paper_requests(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(request_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_request_upvotes_request_id
  ON public.request_upvotes (request_id);
CREATE INDEX IF NOT EXISTS idx_request_upvotes_user_id
  ON public.request_upvotes (user_id);

-- ------------------------------------------------------------------------------
-- 7. MISSING RPC FUNCTIONS: `get_resource_upvote_counts` & `increment_download_count`
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_resource_upvote_counts()
RETURNS TABLE(resource_id UUID, upvote_count BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ru.resource_id, COUNT(*)::BIGINT AS upvote_count
  FROM public.resource_upvotes ru
  GROUP BY ru.resource_id;
$$;

CREATE OR REPLACE FUNCTION public.increment_download_count(resource_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.resources
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = resource_id;
$$;

-- ------------------------------------------------------------------------------
-- 8. DISABLE RLS ON SERVER-ACTION TABLES, GRANT ACCESS & RELOAD SCHEMA CACHE
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.paper_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.active_visitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_page_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cbt_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cbt_questions_contributed DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cbt_subjects_contributed DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cbt_subject_overrides DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cbt_question_overrides DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.resource_upvotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.request_upvotes DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_resource_upvote_counts() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.increment_download_count(UUID) TO anon, authenticated, service_role;

-- Refresh PostgREST schema cache immediately so 404/42703 stop right away
NOTIFY pgrst, 'reload schema';
