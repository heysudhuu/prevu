-- ==============================================================================
-- Migration: 00008_resource_upvotes.sql
-- Description: Community Upvotes for Question Papers & Study Material
-- Supports "Senior Recommended" / "Top Rated" Badges
-- ==============================================================================

-- 1. Create resource_upvotes table
CREATE TABLE IF NOT EXISTS resource_upvotes (
    id SERIAL PRIMARY KEY,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(resource_id, user_id)
);

-- 2. Add performance index
CREATE INDEX IF NOT EXISTS idx_resource_upvotes_resource_id 
ON resource_upvotes (resource_id);

CREATE INDEX IF NOT EXISTS idx_resource_upvotes_user_id 
ON resource_upvotes (user_id);

-- 3. Grant table permissions
GRANT ALL ON TABLE resource_upvotes TO anon, authenticated, service_role;
GRANT ALL ON SEQUENCE resource_upvotes_id_seq TO anon, authenticated, service_role;
