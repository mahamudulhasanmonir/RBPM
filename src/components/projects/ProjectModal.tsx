import React, { useState } from 'react';
import { Project, User } from '../../types';
import { mockUsers } from '../../data/mockData';
import { X, Calendar, User as UserIcon, DollarSign } from 'lucide-react';

interface ProjectModalProps {
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<Project>) => void;
  mode: 'view' | 'edit' | 'create';
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'planning',
    priority: project?.priority || 'medium',
    managerId: project?.managerId || '',
    teamMembers: project?.teamMembers || [],
    startDate: project?.startDate || new Date().toISOString().split('T')[0],
    endDate: project?.endDate || '',
    budget: project?.budget || 0,
    progress: project?.progress || 0
  });

  const isReadOnly = mode === 'view';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave(formData);
    }
  };

  const handleTeamMemberToggle = (userId: string) => {
    if (isReadOnly) return;
    
    const currentMembers = formData.teamMembers || [];
    const updatedMembers = currentMembers.includes(userId)
      ? currentMembers.filter(id => id !== userId)
      : [...currentMembers, userId];
    
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Create New Project' : 
             mode === 'edit' ? 'Edit Project' : 'Project Details'}
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
                Project Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter project title"
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
                placeholder="Enter project description"
                required
                disabled={isReadOnly}
              />
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
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
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
                Project Manager
              </label>
              {isReadOnly ? (
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                  {mockUsers.find(u => u.id === formData.managerId)?.name || 'Not assigned'}
                </div>
              ) : (
                <select
                  value={formData.managerId}
                  onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Manager</option>
                  {mockUsers.filter(u => u.role === 'project-manager' || u.role === 'admin').map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isReadOnly}
                />
              </div>
            </div>

            {mode !== 'create' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress ({formData.progress}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                  className="w-full"
                  disabled={isReadOnly}
                />
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${formData.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Team Members
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockUsers.filter(u => u.role === 'team-member' || u.role === 'project-manager').map(user => (
                <div
                  key={user.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.teamMembers?.includes(user.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  } ${isReadOnly ? 'cursor-default' : ''}`}
                  onClick={() => handleTeamMemberToggle(user.id)}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.role.replace('-', ' ')}</p>
                  </div>
                  {formData.teamMembers?.includes(user.id) && (
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
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
                {mode === 'create' ? 'Create Project' : 'Save Changes'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};