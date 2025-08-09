import { Project, Task, User } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform Redesign',
    description: 'Complete redesign of the company e-commerce platform with modern UI/UX',
    status: 'in-progress',
    priority: 'high',
    managerId: '2',
    teamMembers: ['2', '3'],
    startDate: '2024-01-15',
    endDate: '2024-04-30',
    progress: 65,
    budget: 50000,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Development of companion mobile app for iOS and Android',
    status: 'planning',
    priority: 'medium',
    managerId: '2',
    teamMembers: ['3'],
    startDate: '2024-02-01',
    endDate: '2024-06-30',
    progress: 25,
    budget: 75000,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z'
  },
  {
    id: '3',
    title: 'Database Migration',
    description: 'Migration from legacy database to modern cloud solution',
    status: 'completed',
    priority: 'urgent',
    managerId: '2',
    teamMembers: ['2', '3'],
    startDate: '2023-12-01',
    endDate: '2024-01-15',
    progress: 100,
    budget: 25000,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design System Implementation',
    description: 'Create and implement consistent design system across all components',
    projectId: '1',
    assigneeId: '3',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-02-15',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    estimatedHours: 40,
    actualHours: 28
  },
  {
    id: '2',
    title: 'API Integration',
    description: 'Integrate third-party payment and shipping APIs',
    projectId: '1',
    assigneeId: '3',
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-02-10',
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    estimatedHours: 24,
    actualHours: 26
  },
  {
    id: '3',
    title: 'User Authentication Setup',
    description: 'Set up secure user authentication system',
    projectId: '2',
    assigneeId: '3',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-02-20',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    estimatedHours: 16,
    actualHours: 0
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    department: 'IT',
    createdAt: '2024-01-01T00:00:00Z',
    lastActive: new Date().toISOString(),
    isActive: true
  },
  {
    id: '2',
    email: 'pm@company.com',
    name: 'Project Manager',
    role: 'project-manager',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    department: 'Development',
    createdAt: '2024-01-02T00:00:00Z',
    lastActive: new Date().toISOString(),
    isActive: true
  },
  {
    id: '3',
    email: 'developer@company.com',
    name: 'Team Member',
    role: 'team-member',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    department: 'Development',
    createdAt: '2024-01-03T00:00:00Z',
    lastActive: new Date().toISOString(),
    isActive: true
  },
  {
    id: '4',
    email: 'designer@company.com',
    name: 'UI Designer',
    role: 'team-member',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    department: 'Design',
    createdAt: '2024-01-04T00:00:00Z',
    lastActive: '2024-01-18T00:00:00Z',
    isActive: true
  }
];