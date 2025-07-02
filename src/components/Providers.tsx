'use client';

import { AuthProvider } from '@/context/AuthContext';
import { TopicProvider } from '@/context/TopicContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TopicProvider>
        {children}
      </TopicProvider>
    </AuthProvider>
  );
}
