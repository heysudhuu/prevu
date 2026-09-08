-- ==============================================================================
-- PREVU PRODUCTION SUPABASE SECURITY & RLS POLICIES SCRIPT
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Enable Row Level Security (RLS) on all tables
ALTER TABLE IF EXISTS branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS exam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS paper_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS otp_verifications ENABLE ROW LEVEL SECURITY;

-- 2. Create Comments Table if not exists (for Phase 5 Discussion Threads)
CREATE TABLE IF NOT EXISTS paper_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE NOT NULL,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    comment TEXT NOT NULL,
    parent_id UUID REFERENCES paper_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE IF EXISTS paper_comments ENABLE ROW LEVEL SECURITY;

-- 3. Clean up any existing policies to avoid duplicates
DROP POLICY IF EXISTS "Public branches are viewable by everyone" ON branches;
DROP POLICY IF EXISTS "Public exam_types are viewable by everyone" ON exam_types;
DROP POLICY IF EXISTS "Public subjects are viewable by everyone" ON subjects;
DROP POLICY IF EXISTS "Approved resources are viewable by everyone" ON resources;
DROP POLICY IF EXISTS "Public user profile info is viewable by everyone" ON users;
DROP POLICY IF EXISTS "Public paper requests viewable by everyone" ON paper_requests;
DROP POLICY IF EXISTS "Comments viewable by everyone" ON paper_comments;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow All Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;

-- 4. Granular SELECT (Read-Only) Policies for Public / Anon Access
-- Academic taxonomy is public
CREATE POLICY "Public branches are viewable by everyone"
ON branches FOR SELECT
USING (true);

CREATE POLICY "Public exam_types are viewable by everyone"
ON exam_types FOR SELECT
USING (true);

CREATE POLICY "Public subjects are viewable by everyone"
ON subjects FOR SELECT
USING (true);

-- Only approved resources can be read publicly
CREATE POLICY "Approved resources are viewable by everyone"
ON resources FOR SELECT
USING (status = 'approved');

-- Basic user profile info (name, username, role, cu_verified, avatar) is readable for resource author cards
CREATE POLICY "Public user profile info is viewable by everyone"
ON users FOR SELECT
USING (true);

-- Paper requests (bounty board) are viewable publicly
CREATE POLICY "Public paper requests viewable by everyone"
ON paper_requests FOR SELECT
USING (true);

-- Paper comments are viewable publicly
CREATE POLICY "Comments viewable by everyone"
ON paper_comments FOR SELECT
USING (true);

-- 5. Revoke dangerous blanket mutations from anon role
-- Server actions operate under service_role which bypasses RLS, so anon does NOT need INSERT/UPDATE/DELETE
REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE INSERT, UPDATE, DELETE ON ALL SEQUENCES IN SCHEMA public FROM anon;

-- Grant SELECT only to anon & authenticated on public tables
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- 6. Secure Storage Bucket Policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

-- Public can only READ from resources bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resources');

-- Only service_role can INSERT / DELETE objects (handled via server actions)
CREATE POLICY "Service Role Uploads Only"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'resources');

CREATE POLICY "Service Role Deletes Only"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'resources');

-- 7. High-Performance Indexes for Browse & Search
CREATE INDEX IF NOT EXISTS idx_resources_status_created ON resources(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_subject_id ON resources(subject_id);
CREATE INDEX IF NOT EXISTS idx_resources_exam_type_id ON resources(exam_type_id);
CREATE INDEX IF NOT EXISTS idx_resources_exam_year ON resources(exam_year);
CREATE INDEX IF NOT EXISTS idx_subjects_branch_sem ON subjects(branch_id, semester);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON subjects(code);
CREATE INDEX IF NOT EXISTS idx_subjects_name ON subjects(name);
CREATE INDEX IF NOT EXISTS idx_paper_comments_resource ON paper_comments(resource_id, created_at ASC);
