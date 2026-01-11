import { useTasks } from '@/hooks/useTasks';
import { useProjectsWithStats } from '@/hooks/useProjects';
import { StatCard } from '@/components/dashboard/StatCard';
import { TaskChart } from '@/components/dashboard/TaskChart';
import { RecentTasks } from '@/components/dashboard/RecentTasks';
import { ProjectProgress } from '@/components/dashboard/ProjectProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Clock, FolderKanban, TrendingUp } from 'lucide-react';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';
import type { Task } from '@/types';

export default function Dashboard() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: projects, isLoading: projectsLoading } = useProjectsWithStats();

  const isLoading = tasksLoading || projectsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your productivity overview.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate chart data
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const completedOnDay = tasks?.filter((t) => {
      const updatedAt = new Date(t.updated_at);
      return t.status === 'done' && updatedAt >= dayStart && updatedAt <= dayEnd;
    }).length || 0;

    const createdOnDay = tasks?.filter((t) => {
      const createdAt = new Date(t.created_at);
      return createdAt >= dayStart && createdAt <= dayEnd;
    }).length || 0;

    chartData.push({
      date: format(date, 'EEE'),
      completed: completedOnDay,
      created: createdOnDay,
    });
  }

  // Calculate stats
  const totalTasks = tasks?.length || 0;
  const inProgressTasks = tasks?.filter((t) => t.status === 'in_progress').length || 0;
  const completedTasks = tasks?.filter((t) => t.status === 'done').length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Recent tasks (last 5)
  const recentTasks: Task[] = (tasks || []).slice(0, 5).map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description || '',
    project_id: t.project_id,
    priority: t.priority,
    status: t.status,
    due_date: t.due_date || undefined,
    created_at: t.created_at,
    updated_at: t.updated_at,
    project: t.project ? {
      id: t.project.id,
      name: t.project.name,
      owner_id: '',
      created_at: '',
      updated_at: '',
    } : undefined,
  }));

  // Project progress data
  const projectProgressData = (projects || []).map((p) => ({
    id: p.id,
    name: p.name,
    owner_id: p.owner_id,
    created_at: p.created_at,
    updated_at: p.updated_at,
    completed: p.completed_count,
    total: p.task_count,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your productivity overview.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          subtitle="Across all projects"
          icon={CheckCircle2}
          trend={totalTasks > 0 ? { value: 12, positive: true } : undefined}
        />
        <StatCard
          title="In Progress"
          value={inProgressTasks}
          subtitle="Tasks being worked on"
          icon={Clock}
          variant="primary"
        />
        <StatCard
          title="Projects"
          value={projects?.length || 0}
          subtitle="Active projects"
          icon={FolderKanban}
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle="Overall progress"
          icon={TrendingUp}
          variant="accent"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskChart data={chartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectProgress projects={projectProgressData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentTasks tasks={recentTasks} />
        </CardContent>
      </Card>
    </div>
  );
}
