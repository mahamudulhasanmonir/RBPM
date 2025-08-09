import React from 'react';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoginForm } from './components/auth/LoginForm';
import { Layout } from './components/common/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProjectList } from './components/projects/ProjectList';
import { TaskList } from './components/tasks/TaskList';
import { UserManagement } from './components/admin/UserManagement';
import { Settings } from './components/settings/Settings';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <ProjectList />;
      case 'tasks':
        return <TaskList />;
      case 'users':
        return user?.role === 'admin' ? <UserManagement /> : <Dashboard />;
      case 'team':
        return user?.role === 'project-manager' ? <UserManagement /> : <Dashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;