
-- Create storage bucket for actor submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('actor-submissions', 'actor-submissions', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public uploads
CREATE POLICY "Allow public uploads to actor-submissions"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'actor-submissions');

-- Policy to allow public reads
CREATE POLICY "Allow public reads from actor-submissions"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'actor-submissions');
