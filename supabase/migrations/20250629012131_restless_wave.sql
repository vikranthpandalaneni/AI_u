/*
  # Create world events table

  1. New Tables
    - `world_events`
      - `id` (uuid, primary key)
      - `world_id` (uuid, foreign key to ai_worlds)
      - `event_type` (text, type of event)
      - `title` (text, not null)
      - `description` (text, optional)
      - `start_time` (timestamptz, optional)
      - `end_time` (timestamptz, optional)
      - `river_id` (text, optional River platform ID)
      - `ticket_price` (numeric, default 0)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `world_events` table
    - Add policy for world owners to manage events
    - Add policy for public access to events of public worlds
*/

CREATE TABLE IF NOT EXISTS world_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES ai_worlds(id) ON DELETE CASCADE NOT NULL,
  event_type text DEFAULT 'meetup' CHECK (event_type IN ('meetup', 'workshop', 'conference')),
  title text NOT NULL,
  description text,
  start_time timestamptz,
  end_time timestamptz,
  river_id text,
  ticket_price numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE world_events ENABLE ROW LEVEL SECURITY;

-- World owners can manage their world events
CREATE POLICY "World owners can manage world events"
  ON world_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = world_events.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

-- Anyone can read events from public worlds
CREATE POLICY "Public world events are readable"
  ON world_events
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = world_events.world_id 
      AND ai_worlds.public = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS world_events_world_id_idx ON world_events(world_id);
CREATE INDEX IF NOT EXISTS world_events_start_time_idx ON world_events(start_time);
CREATE INDEX IF NOT EXISTS world_events_event_type_idx ON world_events(event_type);