-- Migration to add advanced learning fields to revisoes table
-- This adds fields needed for the graduated penalty system

-- Add new columns to revisoes table
ALTER TABLE revisoes 
ADD COLUMN consecutive_difficult integer DEFAULT 0,
ADD COLUMN consecutive_easy integer DEFAULT 0,
ADD COLUMN total_easy_history integer DEFAULT 0,
ADD COLUMN visual_progress real,
ADD COLUMN is_protected boolean DEFAULT false,
ADD COLUMN last_review_date timestamp with time zone,
ADD COLUMN last_difficulty text;

-- Update existing records to have default values
UPDATE revisoes 
SET 
  consecutive_difficult = 0,
  consecutive_easy = 0,
  total_easy_history = 0,
  is_protected = false
WHERE 
  consecutive_difficult IS NULL 
  OR consecutive_easy IS NULL 
  OR total_easy_history IS NULL 
  OR is_protected IS NULL;

-- Create indexes for performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_revisoes_last_review_date ON revisoes(last_review_date);
CREATE INDEX IF NOT EXISTS idx_revisoes_visual_progress ON revisoes(visual_progress);
CREATE INDEX IF NOT EXISTS idx_revisoes_consecutive_difficult ON revisoes(consecutive_difficult);
CREATE INDEX IF NOT EXISTS idx_revisoes_is_protected ON revisoes(is_protected);

-- Add comments for documentation
COMMENT ON COLUMN revisoes.consecutive_difficult IS 'Number of consecutive difficult reviews';
COMMENT ON COLUMN revisoes.consecutive_easy IS 'Number of consecutive easy reviews';
COMMENT ON COLUMN revisoes.total_easy_history IS 'Total number of easy reviews in history';
COMMENT ON COLUMN revisoes.visual_progress IS 'Visual progress percentage (can be different from step-based progress)';
COMMENT ON COLUMN revisoes.is_protected IS 'Whether the learning entry has protection from penalties';
COMMENT ON COLUMN revisoes.last_review_date IS 'Date of the last review';
COMMENT ON COLUMN revisoes.last_difficulty IS 'Difficulty level of the last review (easy, medium, hard)'; 