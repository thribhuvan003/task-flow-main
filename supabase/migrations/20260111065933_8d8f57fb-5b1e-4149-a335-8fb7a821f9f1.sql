-- Fix 1: Drop existing policy and recreate with explicit authentication requirement
DROP POLICY IF EXISTS "Users can view own profile or team members" ON public.profiles;

-- Create new policy that explicitly requires authentication first
CREATE POLICY "Users can view own profile or team members"
ON public.profiles
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

-- Fix 2: Add explicit INSERT policy for user_roles to prevent privilege escalation
-- First drop the existing ALL policy for admins and create more specific ones
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Admins can select all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert roles (prevents self-assignment)
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update roles
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete roles
CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));