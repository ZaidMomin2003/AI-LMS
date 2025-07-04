'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ExamProvider } from '@/context/ExamContext';
import { RoadmapProvider } from '@/context/RoadmapContext';
import { TaskProvider } from '@/context/TaskContext';
import { TopicProvider } from '@/context/TopicContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TopicProvider>
        <TaskProvider>
          <RoadmapProvider>
            <ExamProvider>{children}</ExamProvider>
          </RoadmapProvider>
        </TaskProvider>
      </TopicProvider>
    </AuthProvider>
  );
}
