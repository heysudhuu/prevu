-- ==============================================================================
-- Migration: 00012_cbt_arena.sql
-- Description: Tables for Prevu CBT Arena (Mock Testing Simulator & Crowdsourced Questions)
-- Zero Destructive Changes: No DROP TABLE, No TRUNCATE
-- ==============================================================================

-- 1. Table for student CBT Mock Test attempts and latest scores (Leaderboard)
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

-- 2. Table for crowdsourced student-contributed MCQs (Subject to Admin Moderation)
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
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    admin_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table for crowdsourced student-proposed subjects (Subject to Admin Moderation)
CREATE TABLE IF NOT EXISTS cbt_subjects_contributed (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    semester INTEGER NOT NULL DEFAULT 1,
    year INTEGER NOT NULL DEFAULT 1,
    category TEXT NOT NULL DEFAULT 'open-elective',
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    admin_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Indexes for fast leaderboard querying and moderation lookups
CREATE INDEX IF NOT EXISTS idx_cbt_attempts_subject_score 
ON cbt_attempts (subject_code, percentage DESC, time_spent_seconds ASC);

CREATE INDEX IF NOT EXISTS idx_cbt_questions_status 
ON cbt_questions_contributed (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cbt_subjects_status 
ON cbt_subjects_contributed (status, created_at DESC);

-- 5. Permissions
GRANT ALL ON TABLE cbt_attempts TO anon, authenticated, service_role;
GRANT ALL ON SEQUENCE cbt_attempts_id_seq TO anon, authenticated, service_role;

GRANT ALL ON TABLE cbt_questions_contributed TO anon, authenticated, service_role;
GRANT ALL ON SEQUENCE cbt_questions_contributed_id_seq TO anon, authenticated, service_role;

GRANT ALL ON TABLE cbt_subjects_contributed TO anon, authenticated, service_role;
GRANT ALL ON SEQUENCE cbt_subjects_contributed_id_seq TO anon, authenticated, service_role;
