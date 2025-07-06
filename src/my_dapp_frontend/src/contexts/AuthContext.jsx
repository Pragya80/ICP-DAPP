import { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

const AuthContext = createContext();

// Use mainnet Internet Identity for now (more reliable for development)
const identityProvider = 'https://identity.ic0.app';

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    authClient: undefined,
    isAuthenticated: false,
    user: null,
    isLoading: true
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
      if (isAuthenticated) {
        // Create user object based on principal
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal();
        user = {
          principal: principal.toString(),
          name: `User-${principal.toString().slice(0, 8)}`,
          role: 'customer', // Default role
          isActive: true
        };
      }

      setState({
        authClient,
        isAuthenticated,
        user,
        isLoading: false
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
        onSuccess: initializeAuth
      });
    } catch (error) {
      console.error('Login failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const logout = async () => {
    if (state.authClient) {
      await state.authClient.logout();
      initializeAuth();
    }
  };

  const updateUserRole = (newRole) => {
    if (state.user) {
      const updatedUser = { ...state.user, role: newRole };
      setState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
    updateUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}