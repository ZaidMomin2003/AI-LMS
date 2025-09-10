
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, isFirebaseEnabled } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

async function setSessionCookie(user: User) {
    const idToken = await user.getIdToken();
    await fetch('/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: idToken,
    });
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseEnabled || !auth) {
        console.warn("Firebase is not configured. Authentication will be disabled.");
        setLoading(false);
        return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
          setSessionCookie(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
