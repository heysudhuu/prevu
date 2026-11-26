-- Prevu Platform Feedback & Ratings Table
-- Captures 5-10 second post-CBT exam & post-download PYQ/Notes ratings and improvement suggestions.

CREATE TABLE IF NOT EXISTS public.platform_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  username text,
  context_type text NOT NULL CHECK (context_type IN ('cbt_exam', 'resource_download', 'general')),
  target_id text NOT NULL,
  target_title text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  liked boolean NOT NULL DEFAULT true,
  tags text[] NOT NULL DEFAULT '{}',
  suggestion text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_feedback_context_created
  ON public.platform_feedback (context_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_platform_feedback_target
  ON public.platform_feedback (target_id);
