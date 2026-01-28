-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Public can submit forms" ON public.actor_submissions;

-- Create a PERMISSIVE INSERT policy (correct syntax - AS PERMISSIVE goes before FOR)
CREATE POLICY "Public can submit forms"
ON public.actor_submissions
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);