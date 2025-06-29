/*
  # Create analytics events table

  1. New Tables
    - `analytics_events`
      - `id` (uuid, primary key)
      - `world_id` (uuid, foreign key to ai_worlds)
      - `user_id` (uuid, foreign key to users)
      - `event_name` (text, not null)
      - `properties` (jsonb, event properties)
      - `timestamp` (timestamptz, default now)

  2. Security
    - Enable RLS on `analytics_events` table
    - Add policy for world owners to read analytics for their worlds
    - Add policy for users to track their own events
*/

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES ai_worlds(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  event_name text NOT NULL,
  properties jsonb DEFAULT '{}'::jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- World owners can read analytics for their worlds
CREATE POLICY "World owners can read world analytics"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = analytics_events.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

-- Users can insert their own analytics events
CREATE POLICY "Users can track their own events"
  ON analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS analytics_events_world_id_idx ON analytics_events(world_id);
CREATE INDEX IF NOT EXISTS analytics_events_user_id_idx ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS analytics_events_timestamp_idx ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS analytics_events_event_name_idx ON analytics_events(event_name);