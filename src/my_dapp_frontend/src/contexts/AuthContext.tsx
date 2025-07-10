import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import backendService from '../services/backendService';
import type { User, UserRole } from '@shared/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRegistered: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (name: string, role: UserRole, email?: string, company?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  backendService: typeof backendService;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState({
    isAuthenticated: false,
    user: null as User | null,
    isLoading: true,
    isRegistered: false
  });

  // Initialize and check for existing user
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if user is already registered
      const currentUser = await backendService.getCurrentUser();
      
      if (currentUser) {
        setState({
          isAuthenticated: true,
          user: currentUser,
          isLoading: false,
          isRegistered: true
        });
      } else {
        setState({
          isAuthenticated: true, // For testing, assume authenticated
          user: null,
          isLoading: false,
          isRegistered: false
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setState({
        isAuthenticated: true, // For testing, assume authenticated
        user: null,
        isLoading: false,
        isRegistered: false
      });
    }
  };

  const login = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // For testing, skip actual login and check for existing user
      const currentUser = await backendService.getCurrentUser();
      
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: currentUser,
        isRegistered: !!currentUser,
        isLoading: false
      }));
    } catch (error) {
      console.error('Login failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const registerUser = async (name: string, role: UserRole, email: string = '', company: string = '') => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      console.log('AuthContext: Registering user with:', { name, role, email, company });
      const result = await backendService.registerUser(name, role, email, company);
      console.log('AuthContext: Registration result:', result);
      
      if ('Ok' in result) {
        setState(prev => ({
          ...prev,
          user: result.Ok,
          isRegistered: true,
          isLoading: false
        }));
        return { success: true, user: result.Ok };
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error('AuthContext: Registration failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const logout = async () => {
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      isRegistered: false
    });
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isRegistered: state.isRegistered,
    isLoading: state.isLoading,
    login,
    logout,
    registerUser,
    backendService
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 