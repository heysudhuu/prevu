-- ==============================================================================
-- Migration: Add Bookmarks & Paper Requests Tables for Dashboard
-- ==============================================================================

-- 1. Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, resource_id)
);

-- 2. Paper Requests (Bounty Board)
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

-- 3. Disable RLS for server action access
ALTER TABLE IF EXISTS bookmarks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS paper_requests DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
