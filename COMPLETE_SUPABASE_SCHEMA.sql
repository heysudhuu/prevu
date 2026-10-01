-- ==============================================================================
-- PREVU COMPLETE SUPABASE DATABASE SETUP SCRIPT
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Create Enums if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE resource_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Branches Table
CREATE TABLE IF NOT EXISTS branches (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- 3. Exam Types Table
CREATE TABLE IF NOT EXISTS exam_types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- 4. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL
);

-- 5. Users Table (Compatible with Firebase Auth UIDs)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE,
    avatar_url TEXT,
    username_changes_left INTEGER DEFAULT 3,
    student_uid TEXT,
    branch TEXT DEFAULT 'BE-CSE',
    current_semester INTEGER DEFAULT 1,
    phone_number TEXT,
    email TEXT,
    google_id TEXT,
    cu_email TEXT,
    cu_verified BOOLEAN DEFAULT false,
    role user_role DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migration helpers if table already existed
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username_changes_left INTEGER DEFAULT 3;
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_uid TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS branch TEXT DEFAULT 'BE-CSE';
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_semester INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Create case-insensitive index on username
CREATE INDEX IF NOT EXISTS idx_users_username_lower ON users(LOWER(username));

-- 6. Resources Table
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE SET NULL,
    exam_year INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_hash TEXT,
    uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    status resource_status DEFAULT 'pending',
    admin_note TEXT,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. OTP Verifications Table
CREATE TABLE IF NOT EXISTS otp_verifications (
    id SERIAL PRIMARY KEY,
    user_id TEXT,
    cu_email TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, resource_id)
);

-- 8b. Resource Upvotes Table (Student Recommendations)
CREATE TABLE IF NOT EXISTS resource_upvotes (
    id SERIAL PRIMARY KEY,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(resource_id, user_id)
);

-- 9. Paper Requests Table (Bounty Board)
CREATE TABLE IF NOT EXISTS paper_requests (
    id SERIAL PRIMARY KEY,
    requested_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    subject_name TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    exam_year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    note TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Student Suggestions Table (Idea Box)
CREATE TABLE IF NOT EXISTS suggestions (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    name TEXT,
    email TEXT,
    category TEXT NOT NULL DEFAULT 'idea',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Disable RLS & Grant full permissions to allow Server Actions to insert/update
ALTER TABLE IF EXISTS branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS exam_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS otp_verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookmarks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS paper_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS suggestions DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- 9. Seed Initial Default Data (Branch & Exam Types)
INSERT INTO branches (name) VALUES ('BE-CSE') ON CONFLICT (name) DO NOTHING;

INSERT INTO exam_types (name) VALUES 
    ('MST1'), 
    ('MST2'), 
    ('EST') 
ON CONFLICT (name) DO NOTHING;

-- Seed Sample Subjects for Year 1
DO $$
DECLARE
    cse_branch_id INTEGER;
BEGIN
    SELECT id INTO cse_branch_id FROM branches WHERE name = 'BE-CSE' LIMIT 1;
    
    INSERT INTO subjects (branch_id, year, semester, name, code) VALUES
        (cse_branch_id, 1, 1, 'Communication Skills', '22PCH105'),
        (cse_branch_id, 1, 1, 'Engineering Chemistry', '22PCH101'),
        (cse_branch_id, 1, 1, 'Mathematics 1', '22MTH101'),
        (cse_branch_id, 1, 1, 'Programming for Problem Solving (C)', '22CS101'),
        (cse_branch_id, 1, 2, 'Data Structures & Algorithms', '22CS201')
    ON CONFLICT DO NOTHING;
END $$;

-- 10. Setup Storage Bucket for Uploaded Files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Public Access & Uploads
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow All Uploads" ON storage.objects;

CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resources');

CREATE POLICY "Allow All Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resources');

-- 11. Resource Upvotes & Peer Recommendations
CREATE TABLE IF NOT EXISTS resource_upvotes (
    id SERIAL PRIMARY KEY,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(resource_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_resource_upvotes_resource_id ON resource_upvotes (resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_upvotes_user_id ON resource_upvotes (user_id);
ALTER TABLE IF EXISTS resource_upvotes DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE resource_upvotes TO anon, authenticated, service_role;
GRANT ALL ON SEQUENCE resource_upvotes_id_seq TO anon, authenticated, service_role;

-- 12. Paper Comments & Doubt Threads
CREATE TABLE IF NOT EXISTS paper_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    parent_id UUID REFERENCES paper_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_paper_comments_resource_id ON paper_comments (resource_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_paper_comments_user_id ON paper_comments (user_id);
CREATE INDEX IF NOT EXISTS idx_paper_comments_parent_id ON paper_comments (parent_id);
ALTER TABLE IF EXISTS paper_comments DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE paper_comments TO anon, authenticated, service_role;

-- 13. Live Visitors & Daily Website Traffic Analytics (Admin Only)
CREATE TABLE IF NOT EXISTS active_visitors (
    visitor_id TEXT PRIMARY KEY,
    last_path TEXT NOT NULL DEFAULT '/',
    referrer TEXT,
    device_type TEXT DEFAULT 'desktop',
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_active_visitors_last_seen ON active_visitors (last_seen_at DESC);

CREATE TABLE IF NOT EXISTS site_page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    path TEXT NOT NULL,
    referrer TEXT,
    device_type TEXT DEFAULT 'desktop',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_site_page_views_created_at ON site_page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_page_views_visitor_created ON site_page_views (visitor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_site_page_views_path ON site_page_views (path);

GRANT ALL ON TABLE active_visitors TO anon, authenticated, service_role;
GRANT ALL ON TABLE site_page_views TO anon, authenticated, service_role;
ALTER TABLE IF EXISTS active_visitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_page_views DISABLE ROW LEVEL SECURITY;

-- 14. Community Request Enhancements & Peer Help Responses
ALTER TABLE IF EXISTS paper_requests 
  ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'pyq',
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS bounty_xp INTEGER DEFAULT 50;

CREATE TABLE IF NOT EXISTS request_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id INTEGER NOT NULL REFERENCES paper_requests(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    response_type TEXT NOT NULL DEFAULT 'material', -- 'pyq', 'study_material', 'doubt_answer'
    message TEXT,
    file_path TEXT,
    file_name TEXT,
    file_type TEXT,
    external_link TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    admin_note TEXT,
    reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_request_responses_request_id ON request_responses(request_id);
CREATE INDEX IF NOT EXISTS idx_request_responses_user_id ON request_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_request_responses_status ON request_responses(status);

CREATE TABLE IF NOT EXISTS student_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'request_update',
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_student_notifications_user_id ON student_notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_notifications_unread ON student_notifications(user_id, is_read);

ALTER TABLE IF EXISTS request_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS student_notifications DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE request_responses TO anon, authenticated, service_role;
GRANT ALL ON TABLE student_notifications TO anon, authenticated, service_role;



