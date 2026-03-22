'use client';

import {
  createContext,
  useContext,
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

export interface AuthContextType {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isAdmin: boolean;
  isApproved: boolean;
  signIn: (provider: 'google' | 'github' | 'discord') => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Auth is disabled - return unauthenticated state
  // To enable auth, configure OAuth providers in .env.local and restore NextAuth
  const value: AuthContextType = {
    user: null,
    status: 'unauthenticated',
    isAdmin: false,
    isApproved: false,
    signIn: async () => {
      console.log('Auth is disabled. Configure OAuth providers to enable.');
    },
    signOut: async () => {
      console.log('Auth is disabled.');
    },
    refreshSession: async () => {
      console.log('Auth is disabled.');
    },
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
