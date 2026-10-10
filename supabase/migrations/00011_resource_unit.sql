-- Migration: Add unit column to resources table
-- Description: Allows study materials to be tagged with a unit (Unit 1, Unit 2, etc.)

ALTER TABLE resources ADD COLUMN IF NOT EXISTS unit TEXT;

COMMENT ON COLUMN resources.unit IS 'Unit number for study materials (e.g. Unit 1, Unit 2). NULL for exam papers.';
