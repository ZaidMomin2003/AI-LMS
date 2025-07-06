'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ExamProvider } from '@/context/ExamContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { RoadmapProvider } from '@/context/RoadmapContext';
import { TaskProvider } from '@/context/TaskContext';
import { TopicProvider } from '@/context/TopicContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <TopicProvider>
          <TaskProvider>
            <RoadmapProvider>
              <ExamProvider>{children}</ExamProvider>
            </RoadmapProvider>
          </TaskProvider>
        </TopicProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
