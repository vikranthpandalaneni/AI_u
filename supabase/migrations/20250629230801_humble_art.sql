/*
  # Add pricing column to ai_worlds table

  1. Changes
    - Add `pricing` column (jsonb) to `ai_worlds` table
    - Set default pricing structure for existing worlds

  2. Notes
    - This allows flexible pricing models (free, premium, custom)
    - Existing worlds will get default free pricing
*/

-- Add pricing column to ai_worlds table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_worlds' AND column_name = 'pricing'
  ) THEN
    ALTER TABLE ai_worlds ADD COLUMN pricing jsonb DEFAULT '{"free": true, "premium": false, "price": 0}'::jsonb;
  END IF;
END $$;

-- Update existing worlds to have default pricing if they don't have it
UPDATE ai_worlds 
SET pricing = '{"free": true, "premium": false, "price": 0}'::jsonb 
WHERE pricing IS NULL;