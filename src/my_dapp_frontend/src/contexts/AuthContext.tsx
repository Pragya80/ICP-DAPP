import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import backendService from '../services/backendService';
import type { User, UserRole } from '@shared/types';

// 1. Use env variable for identity provider
const IDENTITY_PROVIDER = import.meta.env.VITE_IDENTITY_PROVIDER || 'http://127.0.0.1:4943/?canisterId=uxrrr-q7777-77774-qaaaq-cai';

// 5. Type safety for backend responses
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
  testMode: boolean;
  switchToTestMode: () => void;
  switchTestPrincipal: (role: keyof typeof TEST_PRINCIPALS) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TEST_PRINCIPALS = {
  manufacturer: 'test-manufacturer-principal-123',
  distributor: 'test-distributor-principal-456', 
  retailer: 'test-retailer-principal-789',
  customer: 'test-customer-principal-101'
};

interface AuthProviderProps {
  children: ReactNode;
}

// Singleton AuthClient management (like the SvelteKit pattern)
let authClient: AuthClient | null = null;

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState({
    authClient: null as AuthClient | null,
    isAuthenticated: false,
    user: null as User | null,
    isLoading: true,
    isRegistered: false,
    principalId: null as string | null,
    testMode: false,
    error: null as string | null
  });

  useEffect(() => {
    initializeAuth();
    // 7. Cleanup auth client
    return () => {
      setState(prev => ({ ...prev, authClient: null }));
    };
  }, []);

  const initializeAuth = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (state.testMode) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Use singleton pattern for AuthClient
      authClient = authClient ?? (await AuthClient.create());
      const isAuthenticated = await authClient.isAuthenticated();

      let principalId = null;
      let currentUser = null;

      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        principalId = identity.getPrincipal().toString();
        
        try {
          currentUser = await backendService.getCurrentUser();
        } catch (error) {
          // User not registered
        }
      }

      setState(prev => ({
        ...prev,
        authClient,
        isAuthenticated,
        user: currentUser,
        isLoading: false,
        isRegistered: !!currentUser,
        principalId,
        error: null
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to initialize authentication.' 
      }));
    }
  };

  const switchToTestMode = () => {
    backendService.setTestMode(TEST_PRINCIPALS.manufacturer);
    setState(prev => ({
      ...prev,
      testMode: true,
      isLoading: false,
      authClient: null,
      isAuthenticated: false,
      user: null,
      isRegistered: false,
      principalId: TEST_PRINCIPALS.manufacturer,
      error: null
    }));
  };

  const switchTestPrincipal = (role: keyof typeof TEST_PRINCIPALS) => {
    if (!state.testMode) return;
    
    const newPrincipalId = TEST_PRINCIPALS[role];
    backendService.setTestMode(newPrincipalId);
    
    setState(prev => ({
      ...prev,
      principalId: newPrincipalId,
      user: null,
      isRegistered: false,
      isAuthenticated: false,
      error: null
    }));
  };

  // 2. Remove window.location.reload(), update state instead
  const login = async () => {
    if (state.testMode) {
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: true, 
        principalId: TEST_PRINCIPALS.manufacturer, 
        error: null 
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Use singleton pattern
      authClient = authClient ?? (await AuthClient.create());
      
      await new Promise<void>((resolve, reject) => {
        authClient!.login({
          identityProvider: IDENTITY_PROVIDER,
          onSuccess: () => {
            resolve();
          },
          onError: (error) => {
            setState(prev => ({ ...prev, error: 'Login failed.' }));
            reject(error);
          }
        });
      });

      // After login, re-initialize state
      await initializeAuth();
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: 'Login error.' }));
    }
  };

  const logout = async () => {
    if (state.testMode) {
      backendService.clearTestMode();
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: false, 
        user: null, 
        isRegistered: false, 
        principalId: null, 
        error: null 
      }));
      return;
    }

    try {
      // Use singleton pattern for logout
      const client: AuthClient = authClient ?? (await AuthClient.create());
      await client.logout();
      
      // Reset authClient to null (like the SvelteKit pattern)
      authClient = null;
      
      setState(prev => ({ 
        ...prev, 
        authClient: null, 
        isAuthenticated: false, 
        user: null, 
        isRegistered: false, 
        principalId: null, 
        error: null 
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Logout failed.' }));
    }
  };

  // 3. Add error state, 5. Type safety
  const registerUser = async (name: string, role: UserRole, email: string = '', company: string = ''): Promise<RegisterUserResult> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (state.testMode) {
        const mockUser: User = {
          user_principal: state.principalId || TEST_PRINCIPALS.manufacturer,
          name,
          role,
          email,
          company,
          is_active: true,
          created_at: BigInt(Date.now() * 1000000)
        };

        setState(prev => ({ 
          ...prev, 
          user: mockUser, 
          isRegistered: true, 
          isLoading: false, 
          error: null 
        }));
        return { success: true, user: mockUser };
      }

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
    isAuthenticated: state.isAuthenticated,
    isRegistered: state.isRegistered,
    isLoading: state.isLoading,
    principalId: state.principalId,
    error: state.error,
    login,
    logout,
    registerUser,
    backendService,
    testMode: state.testMode,
    switchToTestMode,
    switchTestPrincipal
  };

  return (
    <AuthContext.Provider value={value}>
      {/* 4. Test mode banner */}
      {state.testMode && (
        <div style={{ background: '#fbbf24', color: '#78350f', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
          Test Mode Active
        </div>
      )}
      {/* 3. Error banner */}
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