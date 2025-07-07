
export interface KeyTerm {
  term: string;
  definition: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface Topic {
  id: string;
  title: string;
  createdAt: Date;
  notes: string;
  keyTerms: KeyTerm[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export type TaskPriority = 'Easy' | 'Moderate' | 'Hard';

export interface KanbanTask {
  id: string;
  content: string;
  columnId: 'todo' | 'in-progress' | 'done';
  priority: TaskPriority;
  points: number;
}

export interface ExamDetails {
  name: string;
  syllabus: string;
  date: string; // Storing as ISO string
}

export type SubscriptionPlan = 'Hobby' | 'Rapid Student' | 'Scholar Subscription' | 'Sage Mode';

export interface UserSubscription {
  planName: SubscriptionPlan;
  status: 'active' | 'inactive';
  stripeSessionId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface PomodoroSession {
  topic: string;
  sessions: number;
  completedAt: string;
}
