/*
  # Create AI worlds table

  1. New Tables
    - `ai_worlds`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text, not null)
      - `description` (text, optional)
      - `slug` (text, unique, not null)
      - `domain` (text, optional)
      - `theme` (jsonb, default theme object)
      - `features` (jsonb, default empty object)
      - `public` (boolean, default true)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `ai_worlds` table
    - Add policy for users to manage their own worlds
    - Add policy for public access to public worlds
*/

CREATE TABLE IF NOT EXISTS ai_worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  domain text,
  theme jsonb DEFAULT '{"color": "blue", "mode": "light"}'::jsonb,
  features jsonb DEFAULT '{}'::jsonb,
  public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_worlds ENABLE ROW LEVEL SECURITY;

-- Users can manage their own worlds
CREATE POLICY "Users can manage own worlds"
  ON ai_worlds
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Anyone can read public worlds
CREATE POLICY "Public worlds are readable by everyone"
  ON ai_worlds
  FOR SELECT
  TO anon, authenticated
  USING (public = true);

-- Create updated_at trigger
CREATE TRIGGER update_ai_worlds_updated_at
  BEFORE UPDATE ON ai_worlds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS ai_worlds_user_id_idx ON ai_worlds(user_id);
CREATE INDEX IF NOT EXISTS ai_worlds_slug_idx ON ai_worlds(slug);
CREATE INDEX IF NOT EXISTS ai_worlds_public_idx ON ai_worlds(public);