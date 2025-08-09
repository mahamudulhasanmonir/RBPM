import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Home, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  Shield,
  Activity,
  Moon,
  Sun
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'projects', label: 'Projects', icon: FolderOpen },
      { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    ];

    if (user?.role === 'admin') {
      baseItems.push(
        { id: 'users', label: 'Users', icon: Users }
      );
    } else if (user?.role === 'project-manager') {
      baseItems.push(
        { id: 'team', label: 'Team', icon: Users }
      );
    }

    // Add settings for all users
    baseItems.push({ id: 'settings', label: 'Settings', icon: Settings });
    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'project-manager':
        return <Activity className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
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

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } dark:shadow-gray-700/50`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">ProjectHub</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors mb-2 ${
                  currentPage === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle and User Section */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 mr-3" />
            ) : (
              <Moon className="w-4 h-4 mr-3" />
            )}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* User Profile Section */}
          <div className="flex items-center mb-4">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
              alt={user?.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <div className="flex items-center mt-1">
                {getRoleIcon(user?.role || '')}
                <span className={`ml-1 text-xs px-2 py-1 rounded-full ${getRoleColor(user?.role || '')}`}>
                  {user?.role?.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white capitalize">
              {currentPage}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user?.name}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};