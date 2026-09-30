-- ==============================================================================
-- PREVU DATABASE MIGRATION: 00010_live_traffic_analytics.sql
-- Description: Real-time Live Visitors & Daily Website Traffic Analytics
-- Visibility: Strictly Admin Console Only
-- ==============================================================================

-- 1. Active Visitors (Heartbeats for Real-Time Live Presence)
CREATE TABLE IF NOT EXISTS active_visitors (
    visitor_id TEXT PRIMARY KEY,
    last_path TEXT NOT NULL DEFAULT '/',
    referrer TEXT,
    device_type TEXT DEFAULT 'desktop',
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for instant live count filtering (< 2 minutes threshold)
CREATE INDEX IF NOT EXISTS idx_active_visitors_last_seen ON active_visitors (last_seen_at DESC);

-- 2. Site Page Views (Daily Views, Unique Visitors, and Historical Traffic)
CREATE TABLE IF NOT EXISTS site_page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    path TEXT NOT NULL,
    referrer TEXT,
    device_type TEXT DEFAULT 'desktop',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance indexes for rapid aggregation
CREATE INDEX IF NOT EXISTS idx_site_page_views_created_at ON site_page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_page_views_visitor_created ON site_page_views (visitor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_site_page_views_path ON site_page_views (path);

-- 3. Disable RLS or grant open write access for anonymous visitor telemetry
ALTER TABLE IF EXISTS active_visitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_page_views DISABLE ROW LEVEL SECURITY;

-- 4. Grant table permissions to anon, authenticated, and service_role
GRANT ALL ON TABLE active_visitors TO anon, authenticated, service_role;
GRANT ALL ON TABLE site_page_views TO anon, authenticated, service_role;
