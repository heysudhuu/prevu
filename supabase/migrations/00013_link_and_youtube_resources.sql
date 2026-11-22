-- ==============================================================================
-- Migration: 00013_link_and_youtube_resources.sql
-- Description: Adds Google Drive cloud links, semester all-in-one bundles, and
--              curated subject YouTube video/playlist recommendations to resources.
-- ==============================================================================

ALTER TABLE resources 
  ADD COLUMN IF NOT EXISTS resource_format TEXT DEFAULT 'file',
  ADD COLUMN IF NOT EXISTS external_url TEXT,
  ADD COLUMN IF NOT EXISTS bundle_scope TEXT DEFAULT 'subject',
  ADD COLUMN IF NOT EXISTS channel_name TEXT,
  ADD COLUMN IF NOT EXISTS youtube_id TEXT;

CREATE INDEX IF NOT EXISTS idx_resources_resource_format ON resources(resource_format);
CREATE INDEX IF NOT EXISTS idx_resources_bundle_scope ON resources(bundle_scope);

COMMENT ON COLUMN resources.resource_format IS 'Format: file (PDF/Image), gdrive (Google Drive folder/file), youtube (Video/Playlist lecture), external_link';
COMMENT ON COLUMN resources.external_url IS 'External link (e.g. drive.google.com folder URL or youtube.com URL)';
COMMENT ON COLUMN resources.bundle_scope IS 'Scope: subject (subject-specific) or semester_bundle (all-in-one semester bundle)';
COMMENT ON COLUMN resources.channel_name IS 'Channel or educator name for YouTube lectures (e.g. Gate Smashers, Neso Academy)';
COMMENT ON COLUMN resources.youtube_id IS 'Clean YouTube video or playlist ID for embedded playback';
