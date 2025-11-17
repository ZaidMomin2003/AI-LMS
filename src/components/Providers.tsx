
'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ExamProvider } from '@/context/ExamContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { RoadmapProvider } from '@/context/RoadmapContext';
import { TaskProvider } from '@/context/TaskContext';
import { TopicProvider } from '@/context/TopicContext';
import { PomodoroProvider } from '@/context/PomodoroContext';
import { SubjectProvider } from '@/context/SubjectContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
          <SubjectProvider>
            <TopicProvider>
              <TaskProvider>
                <RoadmapProvider>
                  <PomodoroProvider>
                    <ExamProvider>{children}</ExamProvider>
                  </PomodoroProvider>
                </RoadmapProvider>
              </TaskProvider>
            </TopicProvider>
          </SubjectProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
