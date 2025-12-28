'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';
import { apiClient } from './api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (name: string, role: 'user' | 'firefighter') => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { user } = await apiClient.me();
      setUser(user);
    } catch (error) {
      setUser(null);
      apiClient.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (name: string, role: 'user' | 'firefighter') => {
    const session = await apiClient.login(name, role);
    setUser(session.user);
  };

  const logout = async () => {
    await apiClient.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refetch: fetchUser }}
    >
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
