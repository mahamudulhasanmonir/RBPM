import React, { useState } from 'react';
import { Task, Project } from '../../types';
import { mockUsers, mockProjects } from '../../data/mockData';
import { X, Calendar, User as UserIcon, Clock } from 'lucide-react';

interface TaskModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  mode: 'view' | 'edit' | 'create';
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: task?.title || '',
    description: task?.description || '',
    projectId: task?.projectId || '',
    assigneeId: task?.assigneeId || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate || '',
    estimatedHours: task?.estimatedHours || 0,
    actualHours: task?.actualHours || 0
  });

  const isReadOnly = mode === 'view';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave(formData);
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Create New Task' : 
             mode === 'edit' ? 'Edit Task' : 'Task Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter task title"
                required
                disabled={isReadOnly}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter task description"
                required
                disabled={isReadOnly}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              {isReadOnly ? (
                <div className="flex items-center">
                  <span className="text-gray-900">
                    {mockProjects.find(p => p.id === formData.projectId)?.title || 'Not assigned'}
                  </span>
                </div>
              ) : (
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Project</option>
                  {mockProjects.map(project => (
                    <option key={project.id} value={project.id}>{project.title}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              {isReadOnly ? (
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                  {mockUsers.find(u => u.id === formData.assigneeId)?.name || 'Not assigned'}
                </div>
              ) : (
                <select
                  value={formData.assigneeId}
                  onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Assignee</option>
                  {mockUsers.filter(u => u.role === 'team-member' || u.role === 'project-manager').map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              {isReadOnly ? (
                <span className={`inline-flex px-3 py-2 text-sm rounded-lg ${getStatusColor(formData.status || '')}`}>
                  {formData.status?.replace('-', ' ')}
                </span>
              ) : (
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              {isReadOnly ? (
                <span className={`inline-flex px-3 py-2 text-sm rounded-lg ${getPriorityColor(formData.priority || '')}`}>
                  {formData.priority}
                </span>
              ) : (
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Hours
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                  step="0.5"
                  disabled={isReadOnly}
                />
              </div>
            </div>

            {mode !== 'create' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Hours
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.actualHours}
                    onChange={(e) => setFormData({ ...formData, actualHours: Number(e.target.value) })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                    step="0.5"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {mode === 'create' ? 'Create Task' : 'Save Changes'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};