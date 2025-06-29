/*
  # Create subscriptions table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `world_id` (uuid, foreign key to ai_worlds)
      - `status` (text, subscription status)
      - `amount` (numeric, subscription amount)
      - `started_at` (timestamptz, default now)
      - `expires_at` (timestamptz, optional)

  2. Security
    - Enable RLS on `subscriptions` table
    - Add policy for users to read their own subscriptions
    - Add policy for world owners to read subscriptions to their worlds
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  world_id uuid REFERENCES ai_worlds(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
  amount numeric(10,2) NOT NULL DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- World owners can read subscriptions to their worlds
CREATE POLICY "World owners can read world subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = subscriptions.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_world_id_idx ON subscriptions(world_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);