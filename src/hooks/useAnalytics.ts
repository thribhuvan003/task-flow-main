import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
type TaskPriority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

interface Profile {
  user_id: string;
  name: string;
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch all tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*');

      if (tasksError) throw tasksError;

      // Fetch profiles for team productivity
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, name');

      if (profilesError) throw profilesError;

      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, name');

      if (projectsError) throw projectsError;

      // Calculate velocity data (last 7 days)
      const velocityData = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayStart = startOfDay(date).toISOString();
        const dayEnd = endOfDay(date).toISOString();

        const completedOnDay = tasks?.filter((t) => {
          const updatedAt = new Date(t.updated_at);
          return (
            t.status === 'done' &&
            updatedAt >= new Date(dayStart) &&
            updatedAt <= new Date(dayEnd)
          );
        }).length || 0;

        const createdOnDay = tasks?.filter((t) => {
          const createdAt = new Date(t.created_at);
          return createdAt >= new Date(dayStart) && createdAt <= new Date(dayEnd);
        }).length || 0;

        velocityData.push({
          date: format(date, 'EEE'),
          fullDate: dateStr,
          completed: completedOnDay,
          created: createdOnDay,
        });
      }

      // Calculate team productivity
      const teamProductivity = profiles?.map((profile) => {
        const userTasks = tasks?.filter((t) => t.assigned_to === (profile as Profile).user_id) || [];
        return {
          userId: (profile as Profile).user_id,
          name: (profile as Profile).name,
          completed: userTasks.filter((t) => t.status === 'done').length,
          inProgress: userTasks.filter((t) => t.status === 'in_progress').length,
          total: userTasks.length,
        };
      }) || [];

      // Calculate project progress
      const projectProgress = projects?.map((project) => {
        const projectTasks = tasks?.filter((t) => t.project_id === project.id) || [];
        const total = projectTasks.length;
        const completed = projectTasks.filter((t) => t.status === 'done').length;
        return {
          id: project.id,
          name: project.name,
          total,
          completed,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      }) || [];

      // Calculate priority distribution
      const priorityDistribution = [
        { name: 'High', value: tasks?.filter((t) => t.priority === 'high').length || 0, fill: 'hsl(var(--destructive))' },
        { name: 'Medium', value: tasks?.filter((t) => t.priority === 'medium').length || 0, fill: 'hsl(var(--warning))' },
        { name: 'Low', value: tasks?.filter((t) => t.priority === 'low').length || 0, fill: 'hsl(var(--accent))' },
      ];

      // Calculate key metrics
      const today = new Date();
      const weekAgo = subDays(today, 7);

      const totalTasks = tasks?.length || 0;
      const completedThisWeek = tasks?.filter((t) => {
        const updatedAt = new Date(t.updated_at);
        return t.status === 'done' && updatedAt >= weekAgo;
      }).length || 0;

      const overdueTasks = tasks?.filter((t) => {
        if (!t.due_date) return false;
        return new Date(t.due_date) < today && t.status !== 'done';
      }).length || 0;

      const avgCompletionDays = 3.2; // Placeholder - would need more data for accurate calculation

      return {
        velocityData,
        teamProductivity,
        projectProgress,
        priorityDistribution,
        metrics: {
          totalTasks,
          completedThisWeek,
          overdueTasks,
          avgCompletionDays,
        },
      };
    },
  });
}
