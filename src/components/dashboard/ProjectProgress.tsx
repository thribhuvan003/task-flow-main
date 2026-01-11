import type { Project } from '@/types';
import { Progress } from '@/components/ui/progress';
import { FolderKanban } from 'lucide-react';

interface ProjectProgressProps {
  projects: Array<Project & { completed: number; total: number }>;
}

export function ProjectProgress({ projects }: ProjectProgressProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FolderKanban className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground">No projects yet</p>
        <p className="text-sm text-muted-foreground/60">Create your first project to track progress</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project, index) => {
        const percentage = project.total > 0 ? Math.round((project.completed / project.total) * 100) : 0;
        return (
          <div
            key={project.id}
            className="space-y-2 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium truncate">{project.name}</p>
              <span className="text-sm text-muted-foreground">
                {project.completed}/{project.total} tasks
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      })}
    </div>
  );
}
