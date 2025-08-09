import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockProjects, mockTasks, mockUsers } from '../../data/mockData';
import { 
  FolderOpen, 
  CheckSquare, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Target,
  Award
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getFilteredData = () => {
    if (user?.role === 'admin') {
      return {
        projects: mockProjects,
        tasks: mockTasks,
        users: mockUsers
      };
    } else if (user?.role === 'project-manager') {
      const userProjects = mockProjects.filter(p => p.managerId === user.id);
      const userTasks = mockTasks.filter(t => userProjects.some(p => p.id === t.projectId));
      return {
        projects: userProjects,
        tasks: userTasks,
        users: mockUsers.filter(u => u.role !== 'admin')
      };
    } else {
      const userTasks = mockTasks.filter(t => t.assigneeId === user?.id);
      const userProjects = mockProjects.filter(p => p.teamMembers.includes(user?.id || ''));
      return {
        projects: userProjects,
        tasks: userTasks,
        users: []
      };
    }
  };

  const { projects, tasks, users } = getFilteredData();

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'in-progress').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    overdueTasks: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
    teamMembers: users.length
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    change?: string;
  }> = ({ title, value, icon, color, change }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className="text-xs text-green-600 mt-1">{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {user?.name}!
        </h1>
        <p className="opacity-90">
          {user?.role === 'admin' 
            ? 'Manage your organization and oversee all projects'
            : user?.role === 'project-manager'
            ? 'Track your projects and manage your team'
            : 'Stay on top of your tasks and collaborate with your team'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<FolderOpen className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
          change="+12% from last month"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          color="bg-purple-50"
          change="+5% from last month"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={<CheckSquare className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
          change="+18% from last month"
        />
        {user?.role === 'admin' && (
          <StatCard
            title="Team Members"
            value={stats.teamMembers}
            icon={<Users className="w-6 h-6 text-orange-600" />}
            color="bg-orange-50"
            change="+2 new this month"
          />
        )}
        {user?.role !== 'admin' && (
          <StatCard
            title="In Progress"
            value={stats.inProgressTasks}
            icon={<Clock className="w-6 h-6 text-orange-600" />}
            color="bg-orange-50"
          />
        )}
      </div>

      {/* Recent Projects and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <FolderOpen className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-medium text-gray-900">{project.progress}%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
            <CheckSquare className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {tasks.slice(0, 4).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                {new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
                  <AlertTriangle className="w-5 h-5 text-red-500 ml-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${stats.completedTasks / stats.totalTasks * 251} 251`}
                  className="text-green-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">Task Completion</p>
            <p className="text-2xl font-bold text-green-600">{Math.round(stats.completedTasks / stats.totalTasks * 100)}%</p>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${stats.activeProjects / stats.totalProjects * 251} 251`}
                  className="text-blue-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">Active Projects</p>
            <p className="text-2xl font-bold text-blue-600">{stats.activeProjects}</p>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${stats.completedProjects / stats.totalProjects * 251} 251`}
                  className="text-purple-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">Completed Projects</p>
            <p className="text-2xl font-bold text-purple-600">{stats.completedProjects}</p>
          </div>
        </div>
      </div>
    </div>
  );
};