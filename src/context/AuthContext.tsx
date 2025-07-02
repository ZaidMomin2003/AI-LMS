'use client';

import React, { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockUser = {
    uid: 'mock-user-123',
    email: 'tester@example.com',
    displayName: 'Test User',
    photoURL: null,
  } as User;

  return (
    <AuthContext.Provider value={{ user: mockUser, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
