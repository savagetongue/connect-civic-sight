-- Create storage bucket for incident photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('incident-photos', 'incident-photos', false);

-- Allow authenticated users to upload photos for their own incidents
CREATE POLICY "Users can upload incident photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'incident-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM incidents WHERE reporter_id = auth.uid()
  )
);

-- Allow users to view photos for incidents they can access
CREATE POLICY "Users can view incident photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'incident-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM incidents 
    WHERE is_public = true 
       OR reporter_id = auth.uid()
       OR zone_id IN (
         SELECT zone_id FROM authority_units WHERE profile_id = auth.uid()
       )
  )
);

-- Allow users to delete their own incident photos
CREATE POLICY "Users can delete their own incident photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'incident-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM incidents WHERE reporter_id = auth.uid()
  )
);