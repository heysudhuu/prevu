-- ==============================================================================
-- Migration: Add Student Profile Details, Avatar & Username Change Limit
-- ==============================================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username_changes_left INTEGER DEFAULT 3;
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_uid TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS branch TEXT DEFAULT 'BE-CSE';
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_semester INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Update existing users to have 3 username changes left if null
UPDATE users SET username_changes_left = 3 WHERE username_changes_left IS NULL;
UPDATE users SET branch = 'BE-CSE' WHERE branch IS NULL;
UPDATE users SET current_semester = 1 WHERE current_semester IS NULL;
