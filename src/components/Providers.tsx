
'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ExamProvider } from '@/context/ExamContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { RoadmapProvider } from '@/context/RoadmapContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { TaskProvider } from '@/context/TaskContext';
import { TopicProvider } from '@/context/TopicContext';
import { PomodoroProvider } from '@/context/PomodoroContext';
import { SubjectProvider } from '@/context/SubjectContext';
import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <AuthProvider>
          <ProfileProvider>
            <SubscriptionProvider>
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
            </SubscriptionProvider>
          </ProfileProvider>
        </AuthProvider>
    </ThemeProvider>
  );
}
