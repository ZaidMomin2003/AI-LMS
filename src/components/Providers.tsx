'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ExamProvider } from '@/context/ExamContext';
import { TopicProvider } from '@/context/TopicContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TopicProvider>
        <ExamProvider>{children}</ExamProvider>
      </TopicProvider>
    </AuthProvider>
  );
}
