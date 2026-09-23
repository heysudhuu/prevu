-- ==============================================================================
-- Migration: 00007_student_experience.sql
-- Description: Additive enhancements for Student Experience & Community Features
-- Zero Destructive Changes: No DROP TABLE, No TRUNCATE
-- ==============================================================================

-- 1. Add upvotes counter to paper_requests if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'paper_requests' AND column_name = 'upvotes'
  ) THEN
    ALTER TABLE paper_requests ADD COLUMN upvotes INTEGER DEFAULT 0;
  END IF;
END $$;

-- 2. Create request_upvotes table for tracking which user upvoted which request
CREATE TABLE IF NOT EXISTS request_upvotes (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES paper_requests(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(request_id, user_id)
);

-- 3. Composite performance index on resources for rapid coverage lookups
CREATE INDEX IF NOT EXISTS idx_resources_coverage 
ON resources (subject_id, exam_type_id, exam_year) 
WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS idx_resources_subject_status 
ON resources (subject_id, status);

CREATE INDEX IF NOT EXISTS idx_paper_requests_status_upvotes 
ON paper_requests (status, upvotes DESC);

-- 4. Grant permissions
GRANT ALL ON TABLE request_upvotes TO anon, authenticated, service_role;
GRANT ALL ON SEQUENCE request_upvotes_id_seq TO anon, authenticated, service_role;
