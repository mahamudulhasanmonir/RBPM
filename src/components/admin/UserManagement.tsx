import React, { useState } from 'react';
import { mockUsers } from '../../data/mockData';
import { User } from '../../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  UserCheck, 
  UserX,
  Shield,
  Activity,
  User as UserIcon
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getFilteredUsers = () => {
    let filteredUsers = users;

    // Apply search filter
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredUsers = filteredUsers.filter(u => 
        statusFilter === 'active' ? u.isActive : !u.isActive
      );
    }

    return filteredUsers;
  };

  const filteredUsers = getFilteredUsers();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'project-manager':
        return <Activity className="w-4 h-4 text-blue-600" />;
      default:
        return <UserIcon className="w-4 h-4 text-green-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'project-manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const getLastActiveText = (lastActive: string) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffInMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const UserCard: React.FC<{ user: User }> = ({ user }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <img
            src={user.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
            alt={user.name}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="flex items-center mt-2">
              {getRoleIcon(user.role)}
              <span className={`ml-1 px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                {user.role.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleUserStatus(user.id)}
            className={`p-2 rounded-lg transition-colors ${
              user.isActive 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            {user.isActive ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Department:</span>
          <span className="font-medium text-gray-900">{user.department || 'Not assigned'}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Last Active:</span>
          <span className="font-medium text-gray-900">{getLastActiveText(user.lastActive)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Joined:</span>
          <span className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.isActive).length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Managers</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'project-manager').length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="project-manager">Project Manager</option>
                <option value="team-member">Team Member</option>
              </select>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Start by adding your first user'
            }
          </p>
        </div>
      )}
    </div>
  );
};