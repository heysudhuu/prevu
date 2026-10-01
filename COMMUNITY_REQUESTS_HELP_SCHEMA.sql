-- ==============================================================================
-- PREVU: COMMUNITY REQUESTS, PEER-TO-PEER HELP & ADMIN APPROVAL WORKFLOW
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Ensure paper_requests table has request_type & title columns
ALTER TABLE IF EXISTS paper_requests 
  ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'pyq',
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS bounty_xp INTEGER DEFAULT 50;

-- 2. Create request_responses table for batchmate contributions (PYQs, Notes, Doubt solutions)
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

-- 3. Create student_notifications table for student-specific updates
CREATE TABLE IF NOT EXISTS student_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'request_update', -- 'pending_approval', 'batchmate_helped', 'approved', 'rejected'
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_student_notifications_user_id ON student_notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_notifications_unread ON student_notifications(user_id, is_read);

-- 4. Disable RLS & Grant permissions for public schema access via Server Actions
ALTER TABLE IF EXISTS request_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS student_notifications DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE request_responses TO anon, authenticated, service_role;
GRANT ALL ON TABLE student_notifications TO anon, authenticated, service_role;
