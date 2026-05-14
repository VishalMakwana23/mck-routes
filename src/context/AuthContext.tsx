import React, { createContext, useContext, useState } from 'react';
// import { supabase } from '../services/supabaseClient';
// import type { Session, User } from '@supabase/supabase-js';

const STATIC_EMAIL = 'demo@ziing.ai';
const STATIC_PASSWORD = 'eQ25U#{17"^8';

const staticUser = {
  id: 'static-user-id',
  email: STATIC_EMAIL,
} as any;

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getCurrentUser: () => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading] = useState(false);

  const login = async (email: string, password: string) => {
    if (email === STATIC_EMAIL && password === STATIC_PASSWORD) {
      setUser(staticUser);
      setSession({ user: staticUser });
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = async () => {
    setUser(null);
    setSession(null);
  };

  const getCurrentUser = () => {
    return user;
  };

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
