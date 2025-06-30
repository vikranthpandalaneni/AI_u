/*
  # Complete AI Universe Database Schema

  1. New Tables
    - `users` - User profiles extending auth.users
    - `ai_worlds` - AI-powered worlds/applications
    - `subscriptions` - User subscriptions to worlds
    - `world_events` - Events hosted in worlds
    - `nft_identities` - NFT identities for worlds
    - `analytics_events` - Analytics tracking
    - `translations` - Multi-language content
    - `meme_entries` - Social content entries

  2. Security
    - Enable RLS on all tables
    - Create comprehensive policies for data access
    - Secure storage bucket configuration

  3. Performance
    - Add indexes for common queries
    - Automatic timestamp triggers
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- CORE TABLES
-- =============================================

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    name text,
    avatar_url text,
    plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- AI Worlds table
CREATE TABLE IF NOT EXISTS public.ai_worlds (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    slug text UNIQUE NOT NULL,
    domain text,
    theme jsonb DEFAULT '{"mode": "light", "color": "blue"}'::jsonb,
    features jsonb DEFAULT '{"nft": false, "chat": true, "video": false, "voice": false, "crypto": false, "events": false, "social": false, "translations": false}'::jsonb,
    pricing jsonb DEFAULT '{"free": true, "price": 0, "premium": false}'::jsonb,
    public boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT ai_worlds_pkey PRIMARY KEY (id)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    world_id uuid NOT NULL REFERENCES public.ai_worlds(id) ON DELETE CASCADE,
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
    amount numeric(10,2) DEFAULT 0 NOT NULL,
    started_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    CONSTRAINT subscriptions_pkey PRIMARY KEY (id)
);

-- World Events table
CREATE TABLE IF NOT EXISTS public.world_events (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    world_id uuid NOT NULL REFERENCES public.ai_worlds(id) ON DELETE CASCADE,
    event_type text DEFAULT 'meetup' CHECK (event_type IN ('meetup', 'workshop', 'conference')),
    title text NOT NULL,
    description text,
    start_time timestamptz,
    end_time timestamptz,
    river_id text,
    ticket_price numeric(10,2) DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT world_events_pkey PRIMARY KEY (id)
);

-- NFT Identities table
CREATE TABLE IF NOT EXISTS public.nft_identities (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    world_id uuid NOT NULL REFERENCES public.ai_worlds(id) ON DELETE CASCADE,
    owner_wallet text,
    nft_metadata jsonb DEFAULT '{}'::jsonb,
    mint_date timestamptz DEFAULT now(),
    CONSTRAINT nft_identities_pkey PRIMARY KEY (id)
);

-- Analytics Events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    world_id uuid NOT NULL REFERENCES public.ai_worlds(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_name text NOT NULL,
    properties jsonb DEFAULT '{}'::jsonb,
    timestamp timestamptz DEFAULT now(),
    CONSTRAINT analytics_events_pkey PRIMARY KEY (id)
);

-- Translations table
CREATE TABLE IF NOT EXISTS public.translations (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    world_id uuid NOT NULL REFERENCES public.ai_worlds(id) ON DELETE CASCADE,
    language_code text NOT NULL,
    content jsonb DEFAULT '{}'::jsonb,
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT translations_pkey PRIMARY KEY (id),
    CONSTRAINT translations_world_id_language_code_key UNIQUE (world_id, language_code)
);

-- Meme Entries table
CREATE TABLE IF NOT EXISTS public.meme_entries (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    world_id uuid NOT NULL REFERENCES public.ai_worlds(id) ON DELETE CASCADE,
    reddit_post_id text,
    type text DEFAULT 'text' CHECK (type IN ('text', 'image', 'video')),
    content text NOT NULL,
    upvotes integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT meme_entries_pkey PRIMARY KEY (id)
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nft_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meme_entries ENABLE ROW LEVEL SECURITY;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Users table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Users can read own data'
    ) THEN
        CREATE POLICY "Users can read own data" ON public.users
          FOR SELECT TO authenticated
          USING (auth.uid() = id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Users can update own data'
    ) THEN
        CREATE POLICY "Users can update own data" ON public.users
          FOR UPDATE TO authenticated
          USING (auth.uid() = id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Users can insert own profile'
    ) THEN
        CREATE POLICY "Users can insert own profile" ON public.users
          FOR INSERT TO authenticated
          WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- AI Worlds table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'ai_worlds' AND policyname = 'Users can manage own worlds'
    ) THEN
        CREATE POLICY "Users can manage own worlds" ON public.ai_worlds
          FOR ALL TO authenticated
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'ai_worlds' AND policyname = 'Public worlds are readable by everyone'
    ) THEN
        CREATE POLICY "Public worlds are readable by everyone" ON public.ai_worlds
          FOR SELECT TO anon, authenticated
          USING (public = true);
    END IF;
END $$;

-- Subscriptions table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscriptions' AND policyname = 'Users can read own subscriptions'
    ) THEN
        CREATE POLICY "Users can read own subscriptions" ON public.subscriptions
          FOR SELECT TO authenticated
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscriptions' AND policyname = 'Users can manage own subscriptions'
    ) THEN
        CREATE POLICY "Users can manage own subscriptions" ON public.subscriptions
          FOR ALL TO authenticated
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- World Events table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'world_events' AND policyname = 'Users can read public world events'
    ) THEN
        CREATE POLICY "Users can read public world events" ON public.world_events
          FOR SELECT TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM public.ai_worlds 
              WHERE ai_worlds.id = world_events.world_id 
              AND ai_worlds.public = true
            )
          );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'world_events' AND policyname = 'World owners can manage events'
    ) THEN
        CREATE POLICY "World owners can manage events" ON public.world_events
          FOR ALL TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM public.ai_worlds 
              WHERE ai_worlds.id = world_events.world_id 
              AND ai_worlds.user_id = auth.uid()
            )
          );
    END IF;
END $$;

-- NFT Identities table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'nft_identities' AND policyname = 'Users can read NFT identities'
    ) THEN
        CREATE POLICY "Users can read NFT identities" ON public.nft_identities
          FOR SELECT TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM public.ai_worlds 
              WHERE ai_worlds.id = nft_identities.world_id 
              AND (ai_worlds.public = true OR ai_worlds.user_id = auth.uid())
            )
          );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'nft_identities' AND policyname = 'World owners can manage NFTs'
    ) THEN
        CREATE POLICY "World owners can manage NFTs" ON public.nft_identities
          FOR ALL TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM public.ai_worlds 
              WHERE ai_worlds.id = nft_identities.world_id 
              AND ai_worlds.user_id = auth.uid()
            )
          );
    END IF;
END $$;

-- Analytics Events table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'analytics_events' AND policyname = 'Users can track their own events'
    ) THEN
        CREATE POLICY "Users can track their own events" ON public.analytics_events
          FOR INSERT TO authenticated
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'analytics_events' AND policyname = 'World owners can read analytics'
    ) THEN
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
    END IF;
END $$;

-- Translations table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'translations' AND policyname = 'Users can read translations'
    ) THEN
        CREATE POLICY "Users can read translations" ON public.translations
          FOR SELECT TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM public.ai_worlds 
              WHERE ai_worlds.id = translations.world_id 
              AND (ai_worlds.public = true OR ai_worlds.user_id = auth.uid())
            )
          );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'translations' AND policyname = 'World owners can manage translations'
    ) THEN
        CREATE POLICY "World owners can manage translations" ON public.translations
          FOR ALL TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM public.ai_worlds 
              WHERE ai_worlds.id = translations.world_id 
              AND ai_worlds.user_id = auth.uid()
            )
          );
    END IF;
END $$;

-- Meme Entries table policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'meme_entries' AND policyname = 'Users can read meme entries'
    ) THEN
        CREATE POLICY "Users can read meme entries" ON public.meme_entries
          FOR SELECT TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM public.ai_worlds 
              WHERE ai_worlds.id = meme_entries.world_id 
              AND (ai_worlds.public = true OR ai_worlds.user_id = auth.uid())
            )
          );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'meme_entries' AND policyname = 'World owners can manage memes'
    ) THEN
        CREATE POLICY "World owners can manage memes" ON public.meme_entries
          FOR ALL TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM public.ai_worlds 
              WHERE ai_worlds.id = meme_entries.world_id 
              AND ai_worlds.user_id = auth.uid()
            )
          );
    END IF;
END $$;

-- =============================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- =============================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_ai_worlds_updated_at ON public.ai_worlds;
DROP TRIGGER IF EXISTS update_translations_updated_at ON public.translations;

-- Create new triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_worlds_updated_at
  BEFORE UPDATE ON public.ai_worlds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON public.translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);

-- AI Worlds table indexes
CREATE INDEX IF NOT EXISTS ai_worlds_user_id_idx ON public.ai_worlds(user_id);
CREATE INDEX IF NOT EXISTS ai_worlds_slug_idx ON public.ai_worlds(slug);
CREATE INDEX IF NOT EXISTS ai_worlds_public_idx ON public.ai_worlds(public);

-- Subscriptions table indexes
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_world_id_idx ON public.subscriptions(world_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_expires_at_idx ON public.subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS subscriptions_user_world_idx ON public.subscriptions(user_id, world_id);

-- World Events table indexes
CREATE INDEX IF NOT EXISTS world_events_world_id_idx ON public.world_events(world_id);
CREATE INDEX IF NOT EXISTS world_events_start_time_idx ON public.world_events(start_time);
CREATE INDEX IF NOT EXISTS world_events_event_type_idx ON public.world_events(event_type);
CREATE INDEX IF NOT EXISTS world_events_world_id_user_idx ON public.world_events(world_id);

-- NFT Identities table indexes
CREATE INDEX IF NOT EXISTS nft_identities_world_id_idx ON public.nft_identities(world_id);
CREATE INDEX IF NOT EXISTS nft_identities_owner_wallet_idx ON public.nft_identities(owner_wallet);
CREATE INDEX IF NOT EXISTS nft_identities_world_owner_idx ON public.nft_identities(world_id, owner_wallet);

-- Analytics Events table indexes
CREATE INDEX IF NOT EXISTS analytics_events_world_id_idx ON public.analytics_events(world_id);
CREATE INDEX IF NOT EXISTS analytics_events_user_id_idx ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS analytics_events_timestamp_idx ON public.analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS analytics_events_event_name_idx ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS analytics_events_world_user_idx ON public.analytics_events(world_id, user_id);

-- Translations table indexes
CREATE INDEX IF NOT EXISTS translations_world_id_idx ON public.translations(world_id);
CREATE INDEX IF NOT EXISTS translations_language_code_idx ON public.translations(language_code);
CREATE INDEX IF NOT EXISTS translations_world_lang_idx ON public.translations(world_id, language_code);

-- Meme Entries table indexes
CREATE INDEX IF NOT EXISTS meme_entries_world_id_idx ON public.meme_entries(world_id);
CREATE INDEX IF NOT EXISTS meme_entries_created_at_idx ON public.meme_entries(created_at);
CREATE INDEX IF NOT EXISTS meme_entries_upvotes_idx ON public.meme_entries(upvotes);
CREATE INDEX IF NOT EXISTS meme_entries_type_idx ON public.meme_entries(type);
CREATE INDEX IF NOT EXISTS meme_entries_reddit_post_id_idx ON public.meme_entries(reddit_post_id);
CREATE INDEX IF NOT EXISTS meme_entries_world_type_idx ON public.meme_entries(world_id, type);