import { create } from 'zustand';
import type { Task, Project } from '@/types';

interface TaskState {
  tasks: Task[];
  projects: Project[];
  selectedProject: string | null;
  isLoading: boolean;
  setTasks: (tasks: Task[]) => void;
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (projectId: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  projects: [],
  selectedProject: null,
  isLoading: true,
  setTasks: (tasks) => set({ tasks }),
  setProjects: (projects) => set({ projects }),
  setSelectedProject: (selectedProject) => set({ selectedProject }),
  setIsLoading: (isLoading) => set({ isLoading }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    })),
  removeTask: (taskId) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) })),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (projectId, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, ...updates } : p
      ),
    })),
}));
