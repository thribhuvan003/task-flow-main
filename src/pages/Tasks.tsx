import { useState, useMemo } from 'react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { TaskFilters, type TaskFiltersState } from '@/components/tasks/TaskFilters';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, CheckSquare } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';

export default function Tasks() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filters, setFilters] = useState<TaskFiltersState>({
    projectId: null,
    priority: null,
    dueDateBefore: null,
    dueDateAfter: null,
  });

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateTask.mutateAsync({ id: taskId, status: newStatus });
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask.mutateAsync(taskId);
  };

  const handleSubmit = async (data: any) => {
    if (editingTask) {
      await updateTask.mutateAsync({
        id: editingTask.id,
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        due_date: data.due_date ? data.due_date.toISOString().split('T')[0] : null,
      });
    } else {
      await createTask.mutateAsync({
        title: data.title,
        description: data.description,
        project_id: data.project_id,
        priority: data.priority,
        status: data.status || 'todo',
        due_date: data.due_date ? data.due_date.toISOString().split('T')[0] : undefined,
      });
    }
    setDialogOpen(false);
    setEditingTask(undefined);
  };

  const isLoading = tasksLoading || projectsLoading;

  // Transform tasks to match expected format
  const transformedTasks: Task[] = (tasks || []).map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description || '',
    project_id: t.project_id,
    assigned_to: t.assigned_to || undefined,
    priority: t.priority,
    status: t.status,
    due_date: t.due_date || undefined,
    tags: t.tags || [],
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

  // Apply filters
  const filteredTasks = useMemo(() => {
    return transformedTasks.filter((task) => {
      // Project filter
      if (filters.projectId && task.project_id !== filters.projectId) {
        return false;
      }

      // Priority filter
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Due date range filter
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        
        if (filters.dueDateAfter && dueDate < filters.dueDateAfter) {
          return false;
        }
        
        if (filters.dueDateBefore && dueDate > filters.dueDateBefore) {
          return false;
        }
      } else {
        // If task has no due date and we're filtering by date, exclude it
        if (filters.dueDateAfter || filters.dueDateBefore) {
          return false;
        }
      }

      return true;
    });
  }, [transformedTasks, filters]);

  const transformedProjects = (projects || []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || undefined,
    owner_id: p.owner_id,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }));

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">Manage and organize your tasks</p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" /> New Task
          </Button>
        </div>
        <Skeleton className="h-10 w-full max-w-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Check if there are no projects
  if (projects?.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your tasks</p>
        </div>
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/20">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <CheckSquare className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Create a project first</h3>
          <p className="text-muted-foreground text-center mb-4">
            You need at least one project to start creating tasks.
            <br />Head to the Projects page to create your first project.
          </p>
          <Button asChild>
            <a href="/projects">Go to Projects</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your tasks with drag-and-drop</p>
        </div>
        <Button onClick={handleAddTask} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
        projects={transformedProjects} 
      />

      {/* Show message if no tasks match filters */}
      {filteredTasks.length === 0 && transformedTasks.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No tasks match your current filters.</p>
          <Button 
            variant="link" 
            onClick={() => setFilters({ projectId: null, priority: null, dueDateBefore: null, dueDateAfter: null })}
          >
            Clear all filters
          </Button>
        </div>
      )}

      <KanbanBoard
        tasks={filteredTasks}
        onTaskStatusChange={handleStatusChange}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        projects={transformedProjects}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
