-- Drop problematic policies that allow public read access
DROP POLICY IF EXISTS "Allow public access to actor_submissions" ON public.actor_submissions;
DROP POLICY IF EXISTS "Allow public insert to actor_submissions" ON public.actor_submissions;
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.actor_submissions;
DROP POLICY IF EXISTS "Authenticated users can read submissions" ON public.actor_submissions;

-- Create secure INSERT policy for public form submissions
CREATE POLICY "Public can submit forms"
ON public.actor_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create SELECT policy restricted to admins only
CREATE POLICY "Only admins can read submissions"
ON public.actor_submissions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'
  )
);