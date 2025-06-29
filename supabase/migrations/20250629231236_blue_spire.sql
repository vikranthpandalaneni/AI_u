/*
  # Create storage buckets

  1. Storage Buckets
    - `avatars` - User profile pictures
    - `world-assets` - World-related files (images, videos, etc.)
    - `nft-assets` - NFT metadata and images
    - `user-files` - User personal file storage

  2. Security
    - Enable RLS on storage buckets
    - Add policies for authenticated users to manage their own files
    - Add policies for public access to public world assets
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('world-assets', 'world-assets', true),
  ('nft-assets', 'nft-assets', true),
  ('user-files', 'user-files', false)
ON CONFLICT (id) DO NOTHING;

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

-- NFT assets bucket policies
CREATE POLICY "World owners can upload NFT assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'nft-assets' AND
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id::text = (storage.foldername(name))[1]
      AND ai_worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "World owners can update NFT assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'nft-assets' AND
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id::text = (storage.foldername(name))[1]
      AND ai_worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "World owners can delete NFT assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'nft-assets' AND
    EXISTS (
      SELECT 1 FROM ai_worlds 
      WHERE ai_worlds.id::text = (storage.foldername(name))[1]
      AND ai_worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "NFT assets are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'nft-assets');

-- User files bucket policies
CREATE POLICY "Users can upload their own files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'user-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
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