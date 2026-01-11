import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project, TaskPriority } from '@/types';

export interface TaskFiltersState {
  projectId: string | null;
  priority: TaskPriority | null;
  dueDateBefore: Date | null;
  dueDateAfter: Date | null;
}

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onFiltersChange: (filters: TaskFiltersState) => void;
  projects: Project[];
}

export function TaskFilters({ filters, onFiltersChange, projects }: TaskFiltersProps) {
  const activeFilterCount = [
    filters.projectId,
    filters.priority,
    filters.dueDateBefore,
    filters.dueDateAfter,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({
      projectId: null,
      priority: null,
      dueDateBefore: null,
      dueDateAfter: null,
    });
  };

  const updateFilter = <K extends keyof TaskFiltersState>(key: K, value: TaskFiltersState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">Filters:</span>
      </div>

      {/* Project Filter */}
      <Select
        value={filters.projectId || 'all'}
        onValueChange={(value) => updateFilter('projectId', value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-[160px] h-9 bg-card">
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select
        value={filters.priority || 'all'}
        onValueChange={(value) => updateFilter('priority', value === 'all' ? null : value as TaskPriority)}
      >
        <SelectTrigger className="w-[130px] h-9 bg-card">
          <SelectValue placeholder="All Priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              High
            </div>
          </SelectItem>
          <SelectItem value="medium">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-warning" />
              Medium
            </div>
          </SelectItem>
          <SelectItem value="low">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Low
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Due Date After Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 justify-start text-left font-normal bg-card",
              !filters.dueDateAfter && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.dueDateAfter ? (
              <>From: {format(filters.dueDateAfter, "MMM d")}</>
            ) : (
              <span>Due From</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.dueDateAfter || undefined}
            onSelect={(date) => updateFilter('dueDateAfter', date || null)}
            initialFocus
          />
          {filters.dueDateAfter && (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => updateFilter('dueDateAfter', null)}
              >
                Clear
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Due Date Before Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 justify-start text-left font-normal bg-card",
              !filters.dueDateBefore && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.dueDateBefore ? (
              <>To: {format(filters.dueDateBefore, "MMM d")}</>
            ) : (
              <span>Due Until</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.dueDateBefore || undefined}
            onSelect={(date) => updateFilter('dueDateBefore', date || null)}
            initialFocus
          />
          {filters.dueDateBefore && (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => updateFilter('dueDateBefore', null)}
              >
                Clear
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Active Filters Badge & Clear Button */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="h-6">
            {activeFilterCount} active
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
