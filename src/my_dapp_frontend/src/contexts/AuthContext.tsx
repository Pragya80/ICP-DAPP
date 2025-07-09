import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import backendService from '../services/backendService';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRegistered: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (name: string, role: UserRole, email?: string, company?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  updateUserRole: (newRole: UserRole) => Promise<{ success: boolean; user?: User; error?: string }>;
  backendService: typeof backendService;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use mainnet Internet Identity for now (more reliable for development)
const identityProvider = 'https://identity.ic0.app';

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
      const authClient = await AuthClient.create();
      const isAuthenticated = await authClient.isAuthenticated();

      let user = null;
      let isRegistered = false;

      if (isAuthenticated) {
        // Initialize backend service
        await backendService.initialize();
        
        // Try to get current user from backend
        try {
          const backendUser = await backendService.getCurrentUser();
          if (backendUser.length > 0) {
            user = backendUser[0];
            isRegistered = true;
          }
        } catch (error) {
          console.log('User not registered in backend yet');
        }
      }

      setState({
        authClient,
        isAuthenticated,
        user,
        isLoading: false,
        isRegistered
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
      
      await state.authClient.login({
        identityProvider,
        onSuccess: async () => {
          // Initialize backend service after login
          await backendService.initialize();
          
          // Check if user is registered in backend
          try {
            const backendUser = await backendService.getCurrentUser();
            if (backendUser.length > 0) {
              setState(prev => ({
                ...prev,
                isAuthenticated: true,
                user: backendUser[0],
                isRegistered: true,
                isLoading: false
              }));
            } else {
              setState(prev => ({
                ...prev,
                isAuthenticated: true,
                isRegistered: false,
                isLoading: false
              }));
            }
          } catch (error) {
            setState(prev => ({
              ...prev,
              isAuthenticated: true,
              isRegistered: false,
              isLoading: false
            }));
          }
        }
      });
    } catch (error) {
      console.error('Login failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const registerUser = async (name: string, role: UserRole, email?: string, company?: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const result = await backendService.registerUser(name, role, email, company);
      
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
      console.error('Registration failed:', error);
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