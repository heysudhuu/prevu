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
