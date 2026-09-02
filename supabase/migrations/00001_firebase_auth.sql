-- Phase 2: Firebase Auth Migration
-- WARNING: This will delete all existing users and resources!

-- 1. Drop RLS policies that rely on auth.uid()
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own pending/rejected resources" ON resources;
DROP POLICY IF EXISTS "Admins can view all resources" ON resources;
DROP POLICY IF EXISTS "Authenticated users can insert resources" ON resources;
DROP POLICY IF EXISTS "Admins can update resources" ON resources;

-- 2. Drop the auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Clear users and resources
DELETE FROM resources;
DELETE FROM users;

-- 4. Alter users.id to TEXT and drop auth.users FK
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE users ALTER COLUMN id TYPE TEXT USING id::text;

-- 5. Alter resources.uploaded_by to TEXT
ALTER TABLE resources DROP CONSTRAINT IF EXISTS resources_uploaded_by_fkey;
ALTER TABLE resources ALTER COLUMN uploaded_by TYPE TEXT USING uploaded_by::text;
ALTER TABLE resources ADD CONSTRAINT resources_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL;

-- Note: RLS is now broken for these tables. Next.js Server Actions with Service Role Key must be used for authorization.
