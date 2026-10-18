-- ==============================================================================
-- PREVU SUPABASE RLS & PERMISSION FIX SCRIPT
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Disable RLS on all tables so server actions can manage data without policy errors
ALTER TABLE IF EXISTS branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS exam_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS otp_verifications DISABLE ROW LEVEL SECURITY;

-- 2. Drop any restrictive existing policies
DROP POLICY IF EXISTS "Public branches are viewable by everyone" ON branches;
DROP POLICY IF EXISTS "Public exam_types are viewable by everyone" ON exam_types;
DROP POLICY IF EXISTS "Public subjects are viewable by everyone" ON subjects;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Approved resources are viewable by everyone" ON resources;
DROP POLICY IF EXISTS "Users can view their own pending/rejected resources" ON resources;
DROP POLICY IF EXISTS "Admins can view all resources" ON resources;
DROP POLICY IF EXISTS "Authenticated users can insert resources" ON resources;
DROP POLICY IF EXISTS "Admins can update resources" ON resources;

-- 3. Grant full permissions to anon and authenticated roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- 4. Storage Bucket Policies (Allow public download and upload)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow All Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;

CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resources');

CREATE POLICY "Allow All Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resources');

-- ==============================================================================
-- 5. CBT Arena & Mock Test Tables
-- ==============================================================================

CREATE TABLE IF NOT EXISTS cbt_attempts (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS cbt_questions_contributed (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS cbt_subjects_contributed (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    semester INTEGER NOT NULL DEFAULT 1,
    year INTEGER NOT NULL DEFAULT 1,
    category TEXT NOT NULL DEFAULT 'open-elective',
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    admin_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE IF EXISTS cbt_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cbt_questions_contributed DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cbt_subjects_contributed DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

