import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
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
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password123') {
      const updatedUser = { ...user, lastActive: new Date().toISOString() };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};