export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'project-manager' | 'team-member';
  avatar?: string;
  department?: string;
  createdAt: string;
  lastActive: string;
  isActive: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  managerId: string;
  teamMembers: string[];
  startDate: string;
  endDate: string;
  progress: number;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  teamMembers: number;
}