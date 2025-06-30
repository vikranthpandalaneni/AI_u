-- First, drop the existing table to ensure a clean slate
DROP TABLE IF EXISTS public.ai_worlds CASCADE;

-- Then, create the table with the final, correct schema
CREATE TABLE public.ai_worlds (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    slug text UNIQUE NOT NULL,
    domain text,
    theme jsonb DEFAULT '{"color": "blue", "mode": "light"}'::jsonb,
    features jsonb DEFAULT '{}'::jsonb,
    pricing jsonb DEFAULT '{"free": true, "premium": false, "price": 0}'::jsonb,
    public boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT ai_worlds_pkey PRIMARY KEY (id)
);

-- Re-create policies for Row Level Security
ALTER TABLE public.ai_worlds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own worlds"
  ON public.ai_worlds FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public worlds are readable by everyone"
  ON public.ai_worlds FOR SELECT
  TO anon, authenticated
  USING (public = true);

-- Re-create the trigger to update the 'updated_at' timestamp on any change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_worlds_updated_at
  BEFORE UPDATE ON ai_worlds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS ai_worlds_user_id_idx ON ai_worlds(user_id);
CREATE INDEX IF NOT EXISTS ai_worlds_slug_idx ON ai_worlds(slug);