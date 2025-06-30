/*
  # Comprehensive Database Schema Fixes

  1. Database Structure
    - Fix user profiles and world ownership relationships
    - Add missing foreign key constraints
    - Ensure proper RLS policies

  2. Security
    - Comprehensive Row Level Security policies
    - Proper data access controls
    - User ownership validation

  3. Performance
    - Add missing indexes
    - Optimize query performance
*/

-- Ensure ai_worlds table has proper foreign key to auth.users
DO $$
BEGIN
  -- Drop existing foreign key if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'ai_worlds_user_id_fkey' 
    AND table_name = 'ai_worlds'
  ) THEN
    ALTER TABLE ai_worlds DROP CONSTRAINT ai_worlds_user_id_fkey;
  END IF;
  
  -- Add proper foreign key constraint
  ALTER TABLE ai_worlds 
  ADD CONSTRAINT ai_worlds_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- Fix subscriptions table foreign keys
DO $$
BEGIN
  -- Fix world_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'subscriptions_world_id_fkey' 
    AND table_name = 'subscriptions'
  ) THEN
    ALTER TABLE subscriptions 
    ADD CONSTRAINT subscriptions_world_id_fkey 
    FOREIGN KEY (world_id) REFERENCES ai_worlds(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Fix world_events table foreign keys
DO $$
BEGIN
  -- Fix world_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'world_events_world_id_fkey' 
    AND table_name = 'world_events'
  ) THEN
    ALTER TABLE world_events 
    ADD CONSTRAINT world_events_world_id_fkey 
    FOREIGN KEY (world_id) REFERENCES ai_worlds(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Fix nft_identities table foreign keys
DO $$
BEGIN
  -- Fix world_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'nft_identities_world_id_fkey' 
    AND table_name = 'nft_identities'
  ) THEN
    ALTER TABLE nft_identities 
    ADD CONSTRAINT nft_identities_world_id_fkey 
    FOREIGN KEY (world_id) REFERENCES ai_worlds(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Fix translations table foreign keys
DO $$
BEGIN
  -- Fix world_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'translations_world_id_fkey' 
    AND table_name = 'translations'
  ) THEN
    ALTER TABLE translations 
    ADD CONSTRAINT translations_world_id_fkey 
    FOREIGN KEY (world_id) REFERENCES ai_worlds(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Fix meme_entries table foreign keys
DO $$
BEGIN
  -- Fix world_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'meme_entries_world_id_fkey' 
    AND table_name = 'meme_entries'
  ) THEN
    ALTER TABLE meme_entries 
    ADD CONSTRAINT meme_entries_world_id_fkey 
    FOREIGN KEY (world_id) REFERENCES ai_worlds(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Comprehensive RLS Policies for all tables

-- World Events Policies
DROP POLICY IF EXISTS "World owners can manage world events" ON world_events;
DROP POLICY IF EXISTS "Public world events are readable" ON world_events;

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
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = world_events.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read events from public worlds"
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

-- NFT Identities Policies
DROP POLICY IF EXISTS "World owners can manage world NFTs" ON nft_identities;
DROP POLICY IF EXISTS "Public world NFTs are readable" ON nft_identities;

CREATE POLICY "World owners can manage NFTs"
  ON nft_identities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = nft_identities.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = nft_identities.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read NFTs from public worlds"
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

-- Translations Policies
DROP POLICY IF EXISTS "World owners can manage world translations" ON translations;
DROP POLICY IF EXISTS "Public world translations are readable" ON translations;

CREATE POLICY "World owners can manage translations"
  ON translations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = translations.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = translations.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read translations from public worlds"
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

-- Meme Entries Policies
DROP POLICY IF EXISTS "World owners can manage world memes" ON meme_entries;
DROP POLICY IF EXISTS "Public world memes are readable" ON meme_entries;

CREATE POLICY "World owners can manage memes"
  ON meme_entries
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = meme_entries.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id = meme_entries.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read memes from public worlds"
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

-- Analytics Events Policies
DROP POLICY IF EXISTS "World owners can read world analytics" ON analytics_events;

CREATE POLICY "World owners can read analytics"
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

-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS world_events_world_id_user_idx ON world_events(world_id);
CREATE INDEX IF NOT EXISTS subscriptions_user_world_idx ON subscriptions(user_id, world_id);
CREATE INDEX IF NOT EXISTS analytics_events_world_user_idx ON analytics_events(world_id, user_id);
CREATE INDEX IF NOT EXISTS nft_identities_world_owner_idx ON nft_identities(world_id, owner_wallet);
CREATE INDEX IF NOT EXISTS translations_world_lang_idx ON translations(world_id, language_code);
CREATE INDEX IF NOT EXISTS meme_entries_world_type_idx ON meme_entries(world_id, type);

-- Add performance indexes for common queries
CREATE INDEX IF NOT EXISTS ai_worlds_public_created_idx ON ai_worlds(public, created_at DESC) WHERE public = true;
CREATE INDEX IF NOT EXISTS world_events_start_time_idx ON world_events(start_time) WHERE start_time IS NOT NULL;
CREATE INDEX IF NOT EXISTS analytics_events_timestamp_idx ON analytics_events(timestamp DESC);