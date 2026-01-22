'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'USER' | 'ADMIN';
  approved: boolean;
}

interface AuthContextType {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isAdmin: boolean;
  isApproved: boolean;
  signIn: (provider: 'google' | 'github', userData: { email: string; name: string; image?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth');
      const data = await response.json();

      if (data.user) {
        setUser(data.user);
        setStatus('authenticated');
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  const signIn = useCallback(async (
    provider: 'google' | 'github',
    userData: { email: string; name: string; image?: string }
  ) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          ...userData,
          providerId: userData.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Sign in failed');
      }

      const data = await response.json();
      setUser(data.user);
      setStatus('authenticated');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      setUser(null);
      setStatus('unauthenticated');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const value: AuthContextType = {
    user,
    status,
    isAdmin: user?.role === 'ADMIN',
    isApproved: user?.approved ?? false,
    signIn,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
