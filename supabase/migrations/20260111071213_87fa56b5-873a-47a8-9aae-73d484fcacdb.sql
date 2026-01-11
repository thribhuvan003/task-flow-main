-- Fix 1: Add DELETE policy for profiles (GDPR compliance)
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Fix 2: Split project_members ALL policy into granular policies
DROP POLICY IF EXISTS "Owners can manage project members" ON public.project_members;

CREATE POLICY "Owners can add project members"
ON public.project_members
FOR INSERT
TO authenticated
WITH CHECK (
  (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()))
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Owners can update project members"
ON public.project_members
FOR UPDATE
TO authenticated
USING (
  (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()))
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Owners can remove project members"
ON public.project_members
FOR DELETE
TO authenticated
USING (
  (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()))
  OR public.has_role(auth.uid(), 'admin')
);