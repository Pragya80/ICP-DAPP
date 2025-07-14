import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import backendService from '../services/backendService';
import type { User, UserRole } from '@shared/types';

// Type safety for backend responses
interface RegisterUserResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRegistered: boolean;
  isLoading: boolean;
  principalId: string | null;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (name: string, role: UserRole, email?: string, company?: string) => Promise<RegisterUserResult>;
  backendService: typeof backendService;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState({
    user: null as User | null,
    isLoading: true,
    isRegistered: false,
    error: null as string | null
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // For development, always consider user as authenticated
      try {
        const currentUser = await backendService.getCurrentUser();
        setState(prev => ({
          ...prev,
          user: currentUser,
          isRegistered: true,
          isLoading: false,
          error: null
        }));
      } catch (error) {
        // User not registered, but still authenticated for demo
        setState(prev => ({
          ...prev,
          user: null,
          isRegistered: false,
          isLoading: false,
          error: null
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to initialize authentication.' 
      }));
    }
  };

  const login = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      // For demo, login is always successful
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: 'Login failed.' }));
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ 
        ...prev, 
        user: null, 
        isRegistered: false, 
        error: null 
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Logout failed.' }));
    }
  };

  const registerUser = async (name: string, role: UserRole, email: string = '', company: string = ''): Promise<RegisterUserResult> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await backendService.registerUser(name, role, email, company);
      
      if ('Ok' in result) {
        setState(prev => ({ 
          ...prev, 
          user: result.Ok, 
          isRegistered: true, 
          isLoading: false, 
          error: null 
        }));
        return { success: true, user: result.Ok };
      } else {
        setState(prev => ({ ...prev, isLoading: false, error: result.Err }));
        return { success: false, error: result.Err };
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: 'Registration failed.' }));
      return { success: false, error: 'Registration failed.' };
    }
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: true, // Always authenticated for demo
    isRegistered: state.isRegistered,
    isLoading: state.isLoading,
    principalId: "2vxsx-fae", // Dummy principal
    error: state.error,
    login,
    logout,
    registerUser,
    backendService
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Error banner */}
      {state.error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
          {state.error}
        </div>
      )}
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