import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockTasks, mockProjects, mockUsers } from '../../data/mockData';
import { Task } from '../../types';
import { TaskModal } from './TaskModal';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  CheckSquare, 
  Clock,
  AlertTriangle,
  Edit3,
  Eye
} from 'lucide-react';

export const TaskList: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const getFilteredTasks = () => {
    let filteredTasks = tasks;
    
    // Filter by user role
    if (user?.role === 'team-member') {
      filteredTasks = filteredTasks.filter(t => t.assigneeId === user.id);
    } else if (user?.role === 'project-manager') {
      const userProjects = mockProjects.filter(p => p.managerId === user.id);
      filteredTasks = filteredTasks.filter(t => userProjects.some(p => p.id === t.projectId));
    }

    // Apply search filter
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredTasks = filteredTasks.filter(t => t.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filteredTasks = filteredTasks.filter(t => t.priority === priorityFilter);
    }

    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
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

  const getProjectName = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    return project?.title || 'Unknown Project';
  };

  const getAssigneeName = (assigneeId: string) => {
    const assignee = mockUsers.find(u => u.id === assigneeId);
    return assignee?.name || 'Unknown';
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  const handleCreateTask = () => {
    setSelectedTask(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (modalMode === 'create') {
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Task;
      setTasks([...tasks, newTask]);
    } else if (modalMode === 'edit' && selectedTask) {
      setTasks(tasks.map(t => 
        t.id === selectedTask.id 
          ? { ...t, ...taskData, updatedAt: new Date().toISOString() }
          : t
      ));
    }
    setIsModalOpen(false);
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            {isOverdue(task.dueDate, task.status) && (
              <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          
          <div className="flex items-center space-x-2 mb-4">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ')}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleViewTask(task)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {(user?.role === 'admin' || user?.role === 'project-manager' || task.assigneeId === user?.id) && (
            <button 
              onClick={() => handleEditTask(task)}
              className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Project:</span> {getProjectName(task.projectId)}
        </div>
        
        {task.estimatedHours && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">
              {task.actualHours || 0}h / {task.estimatedHours}h
            </span>
          </div>
        )}
        
        {task.estimatedHours && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((task.actualHours || 0) / task.estimatedHours * 100, 100)}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {getAssigneeName(task.assigneeId)}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        </div>
        {task.status === 'completed' && (
          <div className="flex items-center text-green-600">
            <CheckSquare className="w-4 h-4 mr-1" />
            Done
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        {(user?.role === 'admin' || user?.role === 'project-manager') && (
          <button 
            onClick={handleCreateTask}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Start by creating your first task'
            }
          </p>
        </div>
      )}

      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        mode={modalMode}
      />
    </div>
  );
};