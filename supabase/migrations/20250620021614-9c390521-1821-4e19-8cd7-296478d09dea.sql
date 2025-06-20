
-- Add missing columns to the revisoes table
ALTER TABLE revisoes 
ADD COLUMN titulo text,
ADD COLUMN deleted_at timestamp with time zone;

-- Create an index on deleted_at for better performance when filtering
CREATE INDEX idx_revisoes_deleted_at ON revisoes(deleted_at);
