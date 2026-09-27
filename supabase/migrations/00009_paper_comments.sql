-- ==============================================================================
-- Migration: 00009_paper_comments.sql
-- Description: Discussion & Doubts Thread for Question Papers & Study Material
-- Zero Destructive Changes: No DROP TABLE, No TRUNCATE
-- ==============================================================================

-- 1. Create paper_comments table
CREATE TABLE IF NOT EXISTS paper_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    parent_id UUID REFERENCES paper_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Indexes for fast retrieval by paper/resource and user
CREATE INDEX IF NOT EXISTS idx_paper_comments_resource_id 
ON paper_comments (resource_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_paper_comments_user_id 
ON paper_comments (user_id);

CREATE INDEX IF NOT EXISTS idx_paper_comments_parent_id 
ON paper_comments (parent_id);

-- 3. Disable RLS or open for server action access
ALTER TABLE IF EXISTS paper_comments DISABLE ROW LEVEL SECURITY;

-- 4. Grant table permissions
GRANT ALL ON TABLE paper_comments TO anon, authenticated, service_role;
