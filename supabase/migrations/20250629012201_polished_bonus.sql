/*
  # Create meme entries table

  1. New Tables
    - `meme_entries`
      - `id` (uuid, primary key)
      - `world_id` (uuid, foreign key to ai_worlds)
      - `reddit_post_id` (text, optional Reddit post ID)
      - `type` (text, meme type)
      - `content` (text, not null)
      - `upvotes` (integer, default 0)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `meme_entries` table
    - Add policy for world owners to manage memes
    - Add policy for public access to memes of public worlds
*/

CREATE TABLE IF NOT EXISTS meme_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES ai_worlds(id) ON DELETE CASCADE NOT NULL,
  reddit_post_id text,
  type text DEFAULT 'text' CHECK (type IN ('text', 'image', 'video')),
  content text NOT NULL,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE meme_entries ENABLE ROW LEVEL SECURITY;

-- World owners can manage memes for their worlds
CREATE POLICY "World owners can manage world memes"
  ON meme_entries
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = meme_entries.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

-- Anyone can read memes from public worlds
CREATE POLICY "Public world memes are readable"
  ON meme_entries
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = meme_entries.world_id 
      AND ai_worlds.public = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS meme_entries_world_id_idx ON meme_entries(world_id);
CREATE INDEX IF NOT EXISTS meme_entries_reddit_post_id_idx ON meme_entries(reddit_post_id);
CREATE INDEX IF NOT EXISTS meme_entries_type_idx ON meme_entries(type);
CREATE INDEX IF NOT EXISTS meme_entries_upvotes_idx ON meme_entries(upvotes);