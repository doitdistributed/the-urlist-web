-- Add a position column to the links table for ordering
ALTER TABLE links ADD COLUMN IF NOT EXISTS position INTEGER;

-- When creating a new link, position should be set to the next available value (e.g., max(position) + 1 for the list)
