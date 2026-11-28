-- ============================================================================
-- Live Visitors & Daily Traffic Analytics Tables Migration
-- Run this in your Supabase SQL Editor to stop 404 logs on active_visitors
-- and site_page_views and enable persistent traffic telemetry.
-- Safe to re-run (idempotent, zero data loss).
-- ============================================================================

CREATE TABLE IF NOT EXISTS active_visitors (
    visitor_id TEXT PRIMARY KEY,
    last_path TEXT NOT NULL DEFAULT '/',
    referrer TEXT,
    device_type TEXT DEFAULT 'desktop',
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_active_visitors_last_seen ON active_visitors (last_seen_at DESC);

CREATE TABLE IF NOT EXISTS site_page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    path TEXT NOT NULL,
    referrer TEXT,
    device_type TEXT DEFAULT 'desktop',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_site_page_views_created_at ON site_page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_page_views_visitor_created ON site_page_views (visitor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_site_page_views_path ON site_page_views (path);

GRANT ALL ON TABLE active_visitors TO anon, authenticated, service_role;
GRANT ALL ON TABLE site_page_views TO anon, authenticated, service_role;
ALTER TABLE IF EXISTS active_visitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_page_views DISABLE ROW LEVEL SECURITY;
