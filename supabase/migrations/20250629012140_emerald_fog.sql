/*
  # Create NFT identities table

  1. New Tables
    - `nft_identities`
      - `id` (uuid, primary key)
      - `world_id` (uuid, foreign key to ai_worlds)
      - `owner_wallet` (text, optional wallet address)
      - `nft_metadata` (jsonb, NFT metadata)
      - `mint_date` (timestamptz, default now)

  2. Security
    - Enable RLS on `nft_identities` table
    - Add policy for world owners to manage NFTs
    - Add policy for public access to NFTs of public worlds
*/

CREATE TABLE IF NOT EXISTS nft_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES ai_worlds(id) ON DELETE CASCADE NOT NULL,
  owner_wallet text,
  nft_metadata jsonb DEFAULT '{}'::jsonb,
  mint_date timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE nft_identities ENABLE ROW LEVEL SECURITY;

-- World owners can manage NFTs for their worlds
CREATE POLICY "World owners can manage world NFTs"
  ON nft_identities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = nft_identities.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

-- Anyone can read NFTs from public worlds
CREATE POLICY "Public world NFTs are readable"
  ON nft_identities
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = nft_identities.world_id 
      AND ai_worlds.public = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS nft_identities_world_id_idx ON nft_identities(world_id);
CREATE INDEX IF NOT EXISTS nft_identities_owner_wallet_idx ON nft_identities(owner_wallet);