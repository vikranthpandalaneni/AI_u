/*
  # Fix AI Worlds table and ensure proper schema

  1. Clean up and recreate ai_worlds table
  2. Ensure users table exists with proper structure
  3. Add all necessary policies and triggers
  4. Handle existing policies gracefully
*/

-- Drop and recreate ai_worlds table with correct schema
DROP TABLE IF EXISTS public.ai_worlds CASCADE;

-- Create the table with the final, correct schema
CREATE TABLE public.ai_worlds (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    slug text UNIQUE NOT NULL,
    domain text,
    theme jsonb DEFAULT '{"color": "blue", "mode": "light"}'::jsonb,
    features jsonb DEFAULT '{"chat": true, "voice": false, "video": false, "nft": false, "crypto": false, "events": false, "translations": false, "social": false}'::jsonb,
    pricing jsonb DEFAULT '{"free": true, "premium": false, "price": 0}'::jsonb,
    public boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT ai_worlds_pkey PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.ai_worlds ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_worlds
CREATE POLICY "Users can manage own worlds"
  ON public.ai_worlds FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public worlds are readable by everyone"
  ON public.ai_worlds FOR SELECT
  TO anon, authenticated
  USING (public = true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for ai_worlds
CREATE TRIGGER update_ai_worlds_updated_at
  BEFORE UPDATE ON ai_worlds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS ai_worlds_user_id_idx ON ai_worlds(user_id);
CREATE INDEX IF NOT EXISTS ai_worlds_slug_idx ON ai_worlds(slug);
CREATE INDEX IF NOT EXISTS ai_worlds_public_idx ON ai_worlds(public);

-- Handle users table - only create if it doesn't exist
DO $$
BEGIN
  -- Check if users table exists
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    -- Create users table
    CREATE TABLE public.users (
        id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        email text UNIQUE NOT NULL,
        name text,
        avatar_url text,
        plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now(),
        CONSTRAINT users_pkey PRIMARY KEY (id)
    );

    -- Enable RLS on users table
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

    -- Create users policies
    CREATE POLICY "Users can read own data" ON public.users
      FOR SELECT TO authenticated
      USING (auth.uid() = id);

    CREATE POLICY "Users can update own data" ON public.users
      FOR UPDATE TO authenticated
      USING (auth.uid() = id);

    CREATE POLICY "Users can insert own profile" ON public.users
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = id);

    -- Create updated_at trigger for users
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  ELSE
    -- Table exists, just ensure RLS is enabled and add missing columns if needed
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    
    -- Add missing columns if they don't exist
    DO $inner$
    BEGIN
      -- Add plan column if it doesn't exist
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'plan') THEN
        ALTER TABLE public.users ADD COLUMN plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise'));
      END IF;
      
      -- Add name column if it doesn't exist
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'name') THEN
        ALTER TABLE public.users ADD COLUMN name text;
      END IF;
      
      -- Add avatar_url column if it doesn't exist
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.users ADD COLUMN avatar_url text;
      END IF;
    END $inner$;

    -- Create policies only if they don't exist
    DO $policies$
    BEGIN
      -- Check and create "Users can read own data" policy
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can read own data'
      ) THEN
        CREATE POLICY "Users can read own data" ON public.users
          FOR SELECT TO authenticated
          USING (auth.uid() = id);
      END IF;

      -- Check and create "Users can update own data" policy
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can update own data'
      ) THEN
        CREATE POLICY "Users can update own data" ON public.users
          FOR UPDATE TO authenticated
          USING (auth.uid() = id);
      END IF;

      -- Check and create "Users can insert own profile" policy
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can insert own profile'
      ) THEN
        CREATE POLICY "Users can insert own profile" ON public.users
          FOR INSERT TO authenticated
          WITH CHECK (auth.uid() = id);
      END IF;
    END $policies$;

    -- Create trigger only if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE trigger_name = 'update_users_updated_at'
    ) THEN
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
  END IF;
END $$;