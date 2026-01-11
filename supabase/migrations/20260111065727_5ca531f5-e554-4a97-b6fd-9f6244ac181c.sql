-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a security definer function to check if users share a project
CREATE OR REPLACE FUNCTION public.shares_project_with(_viewer_id UUID, _profile_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- Check if both users are members of the same project
    SELECT 1 
    FROM public.project_members pm1
    JOIN public.project_members pm2 ON pm1.project_id = pm2.project_id
    WHERE pm1.user_id = _viewer_id 
      AND pm2.user_id = _profile_user_id
    UNION
    -- Check if viewer owns a project that the other user is a member of
    SELECT 1
    FROM public.projects p
    JOIN public.project_members pm ON p.id = pm.project_id
    WHERE p.owner_id = _viewer_id 
      AND pm.user_id = _profile_user_id
    UNION
    -- Check if the other user owns a project that viewer is a member of
    SELECT 1
    FROM public.projects p
    JOIN public.project_members pm ON p.id = pm.project_id
    WHERE p.owner_id = _profile_user_id 
      AND pm.user_id = _viewer_id
    UNION
    -- Check if both are owners of the same project (edge case)
    SELECT 1
    FROM public.projects p1
    JOIN public.projects p2 ON p1.id = p2.id
    WHERE p1.owner_id = _viewer_id 
      AND p2.owner_id = _profile_user_id
  )
$$;

-- Create new restrictive policy: users can only see their own profile or team members
CREATE POLICY "Users can view own profile or team members"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR public.shares_project_with(auth.uid(), user_id)
  OR public.has_role(auth.uid(), 'admin')
);