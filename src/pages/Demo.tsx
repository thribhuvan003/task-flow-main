import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Bell, Search, Menu, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import type { Task, TaskStatus } from '@/types';

// Demo data with correct field names
const demoTasks: Task[] = [
  {
    id: 'demo-1',
    title: 'Design homepage mockup',
    description: 'Create wireframes and high-fidelity mockups for the new homepage',
    project_id: 'demo-project-1',
    priority: 'high',
    status: 'in_progress',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['design', 'ui'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: { id: 'demo-project-1', name: 'Website Redesign', owner_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    id: 'demo-2',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated deployment workflow',
    project_id: 'demo-project-1',
    priority: 'medium',
    status: 'todo',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['devops'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: { id: 'demo-project-1', name: 'Website Redesign', owner_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    id: 'demo-3',
    title: 'Implement responsive navigation',
    description: 'Build mobile-friendly navigation component',
    project_id: 'demo-project-1',
    priority: 'high',
    status: 'todo',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['frontend', 'mobile'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: { id: 'demo-project-1', name: 'Website Redesign', owner_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    id: 'demo-4',
    title: 'User authentication flow',
    description: 'Implement login, signup, and password reset',
    project_id: 'demo-project-2',
    priority: 'high',
    status: 'review',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['auth', 'security'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: { id: 'demo-project-2', name: 'Mobile App', owner_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    id: 'demo-5',
    title: 'Performance optimization',
    description: 'Optimize images and bundle size',
    project_id: 'demo-project-1',
    priority: 'medium',
    status: 'done',
    due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['performance'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: { id: 'demo-project-1', name: 'Website Redesign', owner_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
  {
    id: 'demo-6',
    title: 'Analytics dashboard setup',
    description: 'Configure tracking and reporting',
    project_id: 'demo-project-3',
    priority: 'medium',
    status: 'done',
    due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['analytics'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: { id: 'demo-project-3', name: 'Marketing Campaign', owner_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  },
];

const demoUser = {
  name: 'Demo User',
  email: 'demo@taskflow.app',
  avatar: null,
};

export default function Demo() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(demoTasks);

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto",
        "transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <AppSidebar 
          user={demoUser}
          onSignOut={() => window.location.href = '/'}
          onNavigate={() => setMobileMenuOpen(false)}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Demo banner */}
        <Alert className="rounded-none border-x-0 border-t-0 bg-accent/10 border-accent/20">
          <Info className="h-4 w-4 text-accent" />
          <AlertDescription className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm">
              <strong>Demo Mode:</strong> You're exploring TaskFlow with sample data. Changes won't be saved.
            </span>
            <Link to="/auth">
              <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                Sign Up Free
              </Button>
            </Link>
          </AlertDescription>
        </Alert>

        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 lg:px-6 py-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-10 bg-muted/50" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                3
              </span>
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
              <p className="text-muted-foreground">Drag and drop tasks between columns to update their status</p>
            </div>
            
            <KanbanBoard 
              tasks={tasks}
              onTaskStatusChange={handleTaskStatusChange}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
