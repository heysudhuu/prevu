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
