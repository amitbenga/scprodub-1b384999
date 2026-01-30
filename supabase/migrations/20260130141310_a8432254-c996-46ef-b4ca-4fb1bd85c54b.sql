-- ============================================
-- 1. STORAGE: Public uploads, admin-only reads
-- ============================================

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow public uploads to actor-submissions" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from actor-submissions" ON storage.objects;

-- Allow anyone to upload to actor-submissions bucket
CREATE POLICY "Public can upload to actor-submissions"
ON storage.objects
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'actor-submissions');

-- Only admins can read/view files
CREATE POLICY "Admins can read actor-submissions"
ON storage.objects
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  bucket_id = 'actor-submissions' AND
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'
  )
);

-- ============================================
-- 2. DATABASE CONSTRAINTS for actor_submissions
-- ============================================

-- Email format validation
ALTER TABLE public.actor_submissions
ADD CONSTRAINT valid_email_format 
CHECK (normalized_email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$');

-- Birth year range
ALTER TABLE public.actor_submissions
ADD CONSTRAINT valid_birth_year_range 
CHECK (birth_year >= 1940 AND birth_year <= 2010);

-- Phone length (at least 9 digits)
ALTER TABLE public.actor_submissions
ADD CONSTRAINT valid_phone_length 
CHECK (length(regexp_replace(normalized_phone, '[^0-9]', '', 'g')) >= 9);

-- Gender values (Hebrew and English)
ALTER TABLE public.actor_submissions
ADD CONSTRAINT valid_gender_values 
CHECK (gender IN ('male', 'female', 'זכר', 'נקבה'));

-- VAT status values (Hebrew and English)
ALTER TABLE public.actor_submissions
ADD CONSTRAINT valid_vat_status_values 
CHECK (vat_status IN ('ptor', 'murshe', 'artist_salary', 'עוסק פטור', 'עוסק מורשה', 'שכר אמנים'));

-- Text length limits
ALTER TABLE public.actor_submissions
ADD CONSTRAINT max_full_name_length CHECK (length(full_name) <= 200);

ALTER TABLE public.actor_submissions
ADD CONSTRAINT max_notes_length CHECK (length(notes) <= 2000);

ALTER TABLE public.actor_submissions
ADD CONSTRAINT max_skills_other_length CHECK (length(skills_other) <= 500);

ALTER TABLE public.actor_submissions
ADD CONSTRAINT max_languages_other_length CHECK (length(languages_other) <= 500);

-- ============================================
-- 3. FIX RLS POLICIES - Remove allow_all, make PERMISSIVE
-- ============================================

-- ACTORS table
DROP POLICY IF EXISTS "allow_all_actors" ON public.actors;
DROP POLICY IF EXISTS "Authenticated users can read actors" ON public.actors;
DROP POLICY IF EXISTS "Admins can insert actors" ON public.actors;
DROP POLICY IF EXISTS "Admins can update actors" ON public.actors;
DROP POLICY IF EXISTS "Admins can delete actors" ON public.actors;

CREATE POLICY "Authenticated users can read actors"
ON public.actors AS PERMISSIVE FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins can insert actors"
ON public.actors AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update actors"
ON public.actors AS PERMISSIVE FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete actors"
ON public.actors AS PERMISSIVE FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- CASTING_PROJECTS table
DROP POLICY IF EXISTS "allow_all_casting_projects" ON public.casting_projects;
DROP POLICY IF EXISTS "Authenticated users can read projects" ON public.casting_projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.casting_projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.casting_projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.casting_projects;

CREATE POLICY "Authenticated users can read projects"
ON public.casting_projects AS PERMISSIVE FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins can insert projects"
ON public.casting_projects AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update projects"
ON public.casting_projects AS PERMISSIVE FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete projects"
ON public.casting_projects AS PERMISSIVE FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- FOLDERS table
DROP POLICY IF EXISTS "allow_all_folders" ON public.folders;
DROP POLICY IF EXISTS "Authenticated users can read folders" ON public.folders;
DROP POLICY IF EXISTS "Admins can manage folders" ON public.folders;

CREATE POLICY "Authenticated users can read folders"
ON public.folders AS PERMISSIVE FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins can insert folders"
ON public.folders AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update folders"
ON public.folders AS PERMISSIVE FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete folders"
ON public.folders AS PERMISSIVE FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- FOLDER_ACTORS table
DROP POLICY IF EXISTS "allow_all_folder_actors" ON public.folder_actors;
DROP POLICY IF EXISTS "Authenticated users can read folder_actors" ON public.folder_actors;
DROP POLICY IF EXISTS "Admins can manage folder_actors" ON public.folder_actors;

CREATE POLICY "Authenticated users can read folder_actors"
ON public.folder_actors AS PERMISSIVE FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins can manage folder_actors"
ON public.folder_actors AS PERMISSIVE FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- PROJECT_ACTORS table
DROP POLICY IF EXISTS "allow_all_project_actors" ON public.project_actors;
DROP POLICY IF EXISTS "Authenticated users can read project_actors" ON public.project_actors;
DROP POLICY IF EXISTS "Admins can manage project_actors" ON public.project_actors;

CREATE POLICY "Authenticated users can read project_actors"
ON public.project_actors AS PERMISSIVE FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins can manage project_actors"
ON public.project_actors AS PERMISSIVE FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- FAVORITES table - user-scoped
DROP POLICY IF EXISTS "allow_all_favorites" ON public.favorites;

CREATE POLICY "Users can manage own favorites"
ON public.favorites AS PERMISSIVE FOR ALL TO authenticated
USING (user_id = auth.uid()::text)
WITH CHECK (user_id = auth.uid()::text);

-- PROJECT_ROLES table
DROP POLICY IF EXISTS "Allow public access to project_roles" ON public.project_roles;

CREATE POLICY "Authenticated users can read project_roles"
ON public.project_roles AS PERMISSIVE FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins can manage project_roles"
ON public.project_roles AS PERMISSIVE FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- PROJECT_SCRIPTS table
DROP POLICY IF EXISTS "allow_all_project_scripts" ON public.project_scripts;

CREATE POLICY "Authenticated users can read project_scripts"
ON public.project_scripts AS PERMISSIVE FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins can manage project_scripts"
ON public.project_scripts AS PERMISSIVE FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- SCRIPT_EXTRACTED_ROLES table
DROP POLICY IF EXISTS "allow_all_script_extracted_roles" ON public.script_extracted_roles;

CREATE POLICY "Authenticated users can read script_extracted_roles"
ON public.script_extracted_roles AS PERMISSIVE FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins can manage script_extracted_roles"
ON public.script_extracted_roles AS PERMISSIVE FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- SCRIPT_CASTING_WARNINGS table
DROP POLICY IF EXISTS "allow_all_script_casting_warnings" ON public.script_casting_warnings;

CREATE POLICY "Authenticated users can read script_casting_warnings"
ON public.script_casting_warnings AS PERMISSIVE FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins can manage script_casting_warnings"
ON public.script_casting_warnings AS PERMISSIVE FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- 4. FIX ACTOR_SUBMISSIONS RLS - ensure PERMISSIVE
-- ============================================
DROP POLICY IF EXISTS "Public can submit forms" ON public.actor_submissions;
DROP POLICY IF EXISTS "Only admins can read submissions" ON public.actor_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.actor_submissions;
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.actor_submissions;

CREATE POLICY "Public can submit forms"
ON public.actor_submissions AS PERMISSIVE FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read submissions"
ON public.actor_submissions AS PERMISSIVE FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update submissions"
ON public.actor_submissions AS PERMISSIVE FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete submissions"
ON public.actor_submissions AS PERMISSIVE FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- 5. USER_PROFILES - ensure PERMISSIVE
-- ============================================
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

CREATE POLICY "Users can read own profile"
ON public.user_profiles AS PERMISSIVE FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.user_profiles AS PERMISSIVE FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- ============================================
-- 6. SECURITY: Set search_path on function
-- ============================================
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;