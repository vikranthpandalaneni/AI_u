/*
  # Create translations table

  1. New Tables
    - `translations`
      - `id` (uuid, primary key)
      - `world_id` (uuid, foreign key to ai_worlds)
      - `language_code` (text, not null)
      - `content` (jsonb, translated content)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `translations` table
    - Add policy for world owners to manage translations
    - Add policy for public access to translations of public worlds
*/

CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES ai_worlds(id) ON DELETE CASCADE NOT NULL,
  language_code text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(world_id, language_code)
);

-- Enable RLS
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- World owners can manage translations for their worlds
CREATE POLICY "World owners can manage world translations"
  ON translations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = translations.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

-- Anyone can read translations from public worlds
CREATE POLICY "Public world translations are readable"
  ON translations
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = translations.world_id 
      AND ai_worlds.public = true
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS translations_world_id_idx ON translations(world_id);
CREATE INDEX IF NOT EXISTS translations_language_code_idx ON translations(language_code);