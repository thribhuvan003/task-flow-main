// Core application types

export type UserRole = 'admin' | 'manager' | 'member';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  task_count?: number;
  completed_count?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  assigned_to?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  // Joined data
  project?: Project;
  assignee?: User;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_url: string;
  file_name: string;
  uploaded_by: string;
  created_at: string;
}

// Analytics types
export interface TaskVelocity {
  date: string;
  completed: number;
}

export interface TeamProductivity {
  user_id: string;
  user_name: string;
  completed: number;
  in_progress: number;
}

export interface ProjectProgress {
  project_id: string;
  project_name: string;
  total: number;
  completed: number;
  percentage: number;
}
