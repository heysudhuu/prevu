-- ============================================================================
-- Non-Destructive Student Doubts & Admin Moderation Migration
-- Run in Supabase SQL Editor. Safe to re-run (idempotent, zero data loss).
-- ============================================================================

-- 1. Ensure base paper_comments table exists
CREATE TABLE IF NOT EXISTS paper_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    parent_id UUID REFERENCES paper_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add moderation, resolution & pinning columns non-destructively
ALTER TABLE paper_comments
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS resolved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now());

-- 3. Ensure valid status values without blocking existing rows
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'paper_comments_status_check'
  ) THEN
    ALTER TABLE paper_comments
      ADD CONSTRAINT paper_comments_status_check
      CHECK (status IN ('open', 'answered', 'resolved', 'hidden'));
  END IF;
END $$;

-- 4. Indexes for per-document lookups and Admin Doubts Console filtering
CREATE INDEX IF NOT EXISTS idx_paper_comments_resource_id ON paper_comments (resource_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_paper_comments_user_id ON paper_comments (user_id);
CREATE INDEX IF NOT EXISTS idx_paper_comments_parent_id ON paper_comments (parent_id);
CREATE INDEX IF NOT EXISTS idx_paper_comments_status_created ON paper_comments (status, created_at DESC);

ALTER TABLE IF EXISTS paper_comments DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE paper_comments TO anon, authenticated, service_role;
