-- Migration: Add username support for users
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create an index for case-insensitive username lookups
CREATE INDEX IF NOT EXISTS idx_users_username_lower ON users(LOWER(username));
