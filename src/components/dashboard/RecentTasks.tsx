import type { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

interface RecentTasksProps {
  tasks: Task[];
}

const statusIcons = {
  todo: Circle,
  in_progress: Clock,
  review: AlertCircle,
  done: CheckCircle2,
};

const priorityColors = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-success/10 text-success border-success/20',
};

export function RecentTasks({ tasks }: RecentTasksProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground">No tasks yet</p>
        <p className="text-sm text-muted-foreground/60">Create your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const StatusIcon = statusIcons[task.status];
        return (
          <div
            key={task.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <StatusIcon
              className={cn(
                'h-5 w-5 shrink-0',
                task.status === 'done' && 'text-success',
                task.status === 'in_progress' && 'text-primary',
                task.status === 'review' && 'text-warning',
                task.status === 'todo' && 'text-muted-foreground'
              )}
            />
            <div className="flex-1 min-w-0">
              <p className={cn('font-medium truncate', task.status === 'done' && 'line-through text-muted-foreground')}>
                {task.title}
              </p>
              {task.project && (
                <p className="text-sm text-muted-foreground truncate">{task.project.name}</p>
              )}
            </div>
            <Badge variant="outline" className={cn('shrink-0', priorityColors[task.priority])}>
              {task.priority}
            </Badge>
            {task.due_date && (
              <span className="text-sm text-muted-foreground shrink-0">
                {format(new Date(task.due_date), 'MMM d')}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
