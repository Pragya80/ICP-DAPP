import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import backendService from '../services/backendService';
import type { User, UserRole } from '@shared/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRegistered: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (name: string, role: UserRole, email: string, company: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  updateUserRole: (newRole: UserRole) => Promise<{ success: boolean; user?: User; error?: string }>;
  backendService: typeof backendService;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use local Internet Identity for development
const identityProvider = 'http://127.0.0.1:4943/?canisterId=uxrrr-q7777-77774-qaaaq-cai';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState({
    authClient: undefined as AuthClient | undefined,
    isAuthenticated: false,
    user: null as User | null,
    isLoading: true,
    isRegistered: false
  });

  // Initialize auth client
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // For testing, skip authentication and go directly to registration
      const authClient = await AuthClient.create();
      
      // Initialize backend service
      await backendService.initialize();
      
      setState({
        authClient,
        isAuthenticated: true, // Skip authentication for testing
        user: null,
        isLoading: false,
        isRegistered: false // Start with not registered
      });
    } catch (error) {
      console.error('Failed to initialize auth client:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async () => {
    if (!state.authClient) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // For testing, skip actual login and go directly to registration
      await backendService.initialize();
      
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        isRegistered: false, // Go to registration after login
        isLoading: false
      }));
    } catch (error) {
      console.error('Login failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const registerUser = async (name: string, role: UserRole, email: string, company: string) => {
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

  const updateUserRole = async (newRole: UserRole) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const result = await backendService.updateUserRole(newRole);
      
      if ('Ok' in result) {
        setState(prev => ({
          ...prev,
          user: result.Ok,
          isLoading: false
        }));
        return { success: true, user: result.Ok };
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: result.Err };
      }
    } catch (error) {
      console.error('Role update failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const logout = async () => {
    if (state.authClient) {
      await state.authClient.logout();
      initializeAuth();
    }
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isRegistered: state.isRegistered,
    isLoading: state.isLoading,
    login,
    logout,
    registerUser,
    updateUserRole,
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