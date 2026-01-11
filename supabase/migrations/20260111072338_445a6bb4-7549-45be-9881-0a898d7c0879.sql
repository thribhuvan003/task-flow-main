-- Fix: Use NEW.user_id instead of NEW.id for the auth user reference
CREATE OR REPLACE FUNCTION public.seed_demo_data_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  project1_id uuid;
  project2_id uuid;
  project3_id uuid;
BEGIN
  -- Create demo projects using user_id (auth user), not id (profile id)
  INSERT INTO public.projects (id, name, description, owner_id)
  VALUES 
    (gen_random_uuid(), 'Website Redesign', 'Complete overhaul of company website with modern UI/UX', NEW.user_id)
  RETURNING id INTO project1_id;
  
  INSERT INTO public.projects (id, name, description, owner_id)
  VALUES 
    (gen_random_uuid(), 'Mobile App Development', 'Build cross-platform mobile application', NEW.user_id)
  RETURNING id INTO project2_id;
  
  INSERT INTO public.projects (id, name, description, owner_id)
  VALUES 
    (gen_random_uuid(), 'Marketing Campaign', 'Q1 digital marketing initiative', NEW.user_id)
  RETURNING id INTO project3_id;

  -- Add user as project member for all projects
  INSERT INTO public.project_members (project_id, user_id)
  VALUES 
    (project1_id, NEW.user_id),
    (project2_id, NEW.user_id),
    (project3_id, NEW.user_id);

  -- Create demo tasks for Website Redesign
  INSERT INTO public.tasks (title, description, project_id, assigned_to, priority, status, due_date, tags)
  VALUES 
    ('Design homepage mockup', 'Create wireframes and high-fidelity mockups for the new homepage', project1_id, NEW.user_id, 'high', 'in_progress', CURRENT_DATE + interval '7 days', ARRAY['design', 'ui']),
    ('Set up CI/CD pipeline', 'Configure automated deployment workflow', project1_id, NEW.user_id, 'medium', 'todo', CURRENT_DATE + interval '14 days', ARRAY['devops']),
    ('Implement responsive navigation', 'Build mobile-friendly navigation component', project1_id, NEW.user_id, 'high', 'todo', CURRENT_DATE + interval '5 days', ARRAY['frontend', 'mobile']),
    ('Write unit tests', 'Add test coverage for core components', project1_id, NEW.user_id, 'low', 'todo', CURRENT_DATE + interval '21 days', ARRAY['testing']),
    ('Performance optimization', 'Optimize images and bundle size', project1_id, NEW.user_id, 'medium', 'done', CURRENT_DATE - interval '2 days', ARRAY['performance']);

  -- Create demo tasks for Mobile App
  INSERT INTO public.tasks (title, description, project_id, assigned_to, priority, status, due_date, tags)
  VALUES 
    ('User authentication flow', 'Implement login, signup, and password reset', project2_id, NEW.user_id, 'high', 'in_progress', CURRENT_DATE + interval '3 days', ARRAY['auth', 'security']),
    ('Push notifications', 'Set up Firebase Cloud Messaging', project2_id, NEW.user_id, 'medium', 'todo', CURRENT_DATE + interval '10 days', ARRAY['notifications']),
    ('Offline mode support', 'Add local storage and sync functionality', project2_id, NEW.user_id, 'high', 'todo', CURRENT_DATE + interval '18 days', ARRAY['offline', 'sync']),
    ('App store submission', 'Prepare assets and submit to stores', project2_id, NEW.user_id, 'low', 'todo', CURRENT_DATE + interval '30 days', ARRAY['release']),
    ('Beta testing feedback', 'Review and address beta tester issues', project2_id, NEW.user_id, 'medium', 'done', CURRENT_DATE - interval '5 days', ARRAY['testing', 'feedback']);

  -- Create demo tasks for Marketing Campaign
  INSERT INTO public.tasks (title, description, project_id, assigned_to, priority, status, due_date, tags)
  VALUES 
    ('Social media content calendar', 'Plan posts for next month', project3_id, NEW.user_id, 'high', 'in_progress', CURRENT_DATE + interval '2 days', ARRAY['social', 'content']),
    ('Email newsletter design', 'Create template for weekly updates', project3_id, NEW.user_id, 'medium', 'todo', CURRENT_DATE + interval '8 days', ARRAY['email', 'design']),
    ('Analytics dashboard setup', 'Configure tracking and reporting', project3_id, NEW.user_id, 'medium', 'done', CURRENT_DATE - interval '3 days', ARRAY['analytics']),
    ('Influencer outreach', 'Contact potential brand ambassadors', project3_id, NEW.user_id, 'low', 'todo', CURRENT_DATE + interval '15 days', ARRAY['partnerships']);

  RETURN NEW;
END;
$$;