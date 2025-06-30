/*
  # Comprehensive Row Level Security Setup

  1. Security Policies
    - Ensure all tables have proper RLS policies
    - Users can only access their own data
    - Public data is accessible to all authenticated users
    - Anonymous users can only read public content

  2. Tables Covered
    - users: User profiles and account data
    - ai_worlds: AI world configurations
    - subscriptions: User subscriptions to worlds
    - world_events: Events within worlds
    - nft_identities: NFT ownership data
    - analytics_events: User analytics tracking
    - translations: Multi-language content
    - meme_entries: Community meme content

  3. Additional Indexes
    - Performance optimization for common queries
    - Foreign key relationships
*/

-- Ensure RLS is enabled on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nft_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meme_entries ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

DROP POLICY IF EXISTS "Users can manage own worlds" ON public.ai_worlds;
DROP POLICY IF EXISTS "Public worlds are readable by everyone" ON public.ai_worlds;

DROP POLICY IF EXISTS "Users can read own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can manage own subscriptions" ON public.subscriptions;

DROP POLICY IF EXISTS "Users can read world events" ON public.world_events;
DROP POLICY IF EXISTS "World owners can manage events" ON public.world_events;

DROP POLICY IF EXISTS "Users can read NFT identities" ON public.nft_identities;
DROP POLICY IF EXISTS "Users can manage own NFTs" ON public.nft_identities;

DROP POLICY IF EXISTS "Users can track their own events" ON public.analytics_events;
DROP POLICY IF EXISTS "World owners can read analytics" ON public.analytics_events;

DROP POLICY IF EXISTS "Users can read translations" ON public.translations;
DROP POLICY IF EXISTS "World owners can manage translations" ON public.translations;

DROP POLICY IF EXISTS "Users can read meme entries" ON public.meme_entries;
DROP POLICY IF EXISTS "World owners can manage memes" ON public.meme_entries;

-- Users table policies
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- AI Worlds table policies
CREATE POLICY "Users can manage own worlds" ON public.ai_worlds
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public worlds are readable by everyone" ON public.ai_worlds
  FOR SELECT TO anon, authenticated
  USING (public = true);

-- Subscriptions table policies
CREATE POLICY "Users can read own subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own subscriptions" ON public.subscriptions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- World Events table policies
CREATE POLICY "Users can read public world events" ON public.world_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_worlds 
      WHERE ai_worlds.id = world_events.world_id 
      AND ai_worlds.public = true
    )
  );

CREATE POLICY "World owners can manage events" ON public.world_events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_worlds 
      WHERE ai_worlds.id = world_events.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

-- NFT Identities table policies
CREATE POLICY "Users can read NFT identities" ON public.nft_identities
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_worlds 
      WHERE ai_worlds.id = nft_identities.world_id 
      AND (ai_worlds.public = true OR ai_worlds.user_id = auth.uid())
    )
  );

CREATE POLICY "World owners can manage NFTs" ON public.nft_identities
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_worlds 
      WHERE ai_worlds.id = nft_identities.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

-- Analytics Events table policies
CREATE POLICY "Users can track their own events" ON public.analytics_events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "World owners can read analytics" ON public.analytics_events
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.ai_worlds 
      WHERE ai_worlds.id = analytics_events.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

-- Translations table policies
CREATE POLICY "Users can read translations" ON public.translations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_worlds 
      WHERE ai_worlds.id = translations.world_id 
      AND (ai_worlds.public = true OR ai_worlds.user_id = auth.uid())
    )
  );

CREATE POLICY "World owners can manage translations" ON public.translations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_worlds 
      WHERE ai_worlds.id = translations.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

-- Meme Entries table policies
CREATE POLICY "Users can read meme entries" ON public.meme_entries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_worlds 
      WHERE ai_worlds.id = meme_entries.world_id 
      AND (ai_worlds.public = true OR ai_worlds.user_id = auth.uid())
    )
  );

CREATE POLICY "World owners can manage memes" ON public.meme_entries
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_worlds 
      WHERE ai_worlds.id = meme_entries.world_id 
      AND ai_worlds.user_id = auth.uid()
    )
  );

-- Add missing foreign key constraints for data integrity
ALTER TABLE public.world_events 
ADD CONSTRAINT world_events_world_id_fkey 
FOREIGN KEY (world_id) REFERENCES public.ai_worlds(id) ON DELETE CASCADE;

ALTER TABLE public.nft_identities 
ADD CONSTRAINT nft_identities_world_id_fkey 
FOREIGN KEY (world_id) REFERENCES public.ai_worlds(id) ON DELETE CASCADE;

ALTER TABLE public.translations 
ADD CONSTRAINT translations_world_id_fkey 
FOREIGN KEY (world_id) REFERENCES public.ai_worlds(id) ON DELETE CASCADE;

ALTER TABLE public.meme_entries 
ADD CONSTRAINT meme_entries_world_id_fkey 
FOREIGN KEY (world_id) REFERENCES public.ai_worlds(id) ON DELETE CASCADE;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS subscriptions_expires_at_idx ON public.subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS world_events_start_time_idx ON public.world_events(start_time);
CREATE INDEX IF NOT EXISTS analytics_events_timestamp_idx ON public.analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS meme_entries_created_at_idx ON public.meme_entries(created_at);
CREATE INDEX IF NOT EXISTS translations_language_code_idx ON public.translations(language_code);