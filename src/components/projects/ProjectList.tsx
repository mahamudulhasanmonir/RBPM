import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockProjects, mockUsers } from '../../data/mockData';
import { Project } from '../../types';
import { ProjectModal } from './ProjectModal';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  TrendingUp, 
  Clock,
  DollarSign,
  Edit3,
  Eye
} from 'lucide-react';

export const ProjectList: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const getFilteredProjects = () => {
    let filteredProjects = projects;
    
    // Filter by user role
    if (user?.role === 'project-manager') {
      filteredProjects = filteredProjects.filter(p => p.managerId === user.id);
    } else if (user?.role === 'team-member') {
      filteredProjects = filteredProjects.filter(p => p.teamMembers.includes(user.id));
    }

    // Apply search filter
    if (searchTerm) {
      filteredProjects = filteredProjects.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredProjects = filteredProjects.filter(p => p.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filteredProjects = filteredProjects.filter(p => p.priority === priorityFilter);
    }

    return filteredProjects;
  };

  const filteredProjects = getFilteredProjects();

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

  const getManagerName = (managerId: string) => {
    const manager = mockUsers.find(u => u.id === managerId);
    return manager?.name || 'Unknown';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleCreateProject = () => {
    setSelectedProject(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveProject = (projectData: Partial<Project>) => {
    if (modalMode === 'create') {
      const newProject: Project = {
        id: Date.now().toString(),
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: 0
      } as Project;
      setProjects([...projects, newProject]);
    } else if (modalMode === 'edit' && selectedProject) {
      setProjects(projects.map(p => 
        p.id === selectedProject.id 
          ? { ...p, ...projectData, updatedAt: new Date().toISOString() }
          : p
      ));
    }
    setIsModalOpen(false);
  };

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
          
          <div className="flex items-center space-x-2 mb-4">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace('-', ' ')}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleViewProject(project)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {(user?.role === 'admin' || user?.role === 'project-manager') && (
            <button 
              onClick={() => handleEditProject(project)}
              className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {getManagerName(project.managerId)}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(project.endDate).toLocaleDateString()}
          </div>
        </div>
        {project.budget && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-1" />
            {project.budget.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        {(user?.role === 'admin' || user?.role === 'project-manager') && (
          <button 
            onClick={handleCreateProject}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
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
                placeholder="Search projects..."
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
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Start by creating your first project'
            }
          </p>
        </div>
      )}

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        mode={modalMode}
      />
    </div>
  );
};