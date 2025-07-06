'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ExamProvider } from '@/context/ExamContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { RoadmapProvider } from '@/context/RoadmapContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { TaskProvider } from '@/context/TaskContext';
import { TopicProvider } from '@/context/TopicContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <SubscriptionProvider>
          <TopicProvider>
            <TaskProvider>
              <RoadmapProvider>
                <ExamProvider>{children}</ExamProvider>
              </RoadmapProvider>
            </TaskProvider>
          </TopicProvider>
        </SubscriptionProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
