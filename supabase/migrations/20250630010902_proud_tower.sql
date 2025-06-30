-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('world-assets', 'world-assets', true),
  ('user-files', 'user-files', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "World owners can upload world assets" ON storage.objects;
DROP POLICY IF EXISTS "World owners can update world assets" ON storage.objects;
DROP POLICY IF EXISTS "World owners can delete world assets" ON storage.objects;
DROP POLICY IF EXISTS "World assets are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "User files are publicly accessible" ON storage.objects;

-- Avatars bucket policies
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- World assets bucket policies
CREATE POLICY "World owners can upload world assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'world-assets' AND
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id::text = (storage.foldername(name))[1]
      AND ai_worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "World owners can update world assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'world-assets' AND
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id::text = (storage.foldername(name))[1]
      AND ai_worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "World owners can delete world assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'world-assets' AND
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id::text = (storage.foldername(name))[1]
      AND ai_worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "World assets are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'world-assets');

-- User files bucket policies
CREATE POLICY "Users can upload their own files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'user-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'user-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'user-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "User files are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'user-files');