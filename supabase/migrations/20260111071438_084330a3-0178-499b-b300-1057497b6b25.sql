-- Drop existing SELECT policy and recreate with explicit unauthenticated denial
DROP POLICY IF EXISTS "Users can view own profile or team members" ON public.profiles;

-- Create restrictive policy that explicitly requires authentication
-- Using RESTRICTIVE ensures this check must pass alongside any other policies
CREATE POLICY "Users can view own profile or team members"
ON public.profiles
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR public.shares_project_with(auth.uid(), user_id)
    OR public.has_role(auth.uid(), 'admin')
  )
);