
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

export interface StudyNotes {
  introduction: string;
  coreConcepts: string;
  examples: string;
  keyFormulas: string;
  keyTerms: string;
}

export interface Topic {
  id: string;
  title: string;
  subject: string;
  createdAt: Date;
  notes: StudyNotes;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  isBookmarked?: boolean;
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

export type SubscriptionPlan = 'Hobby' | 'Sage Mode';

export interface UserSubscription {
  planName: SubscriptionPlan;
  status: 'active' | 'inactive';
  priceId?: string;
  paymentId?: string;
  orderId?: string;
  expiresAt?: string;
}

export interface PomodoroSession {
  topic: string;
  sessions: number;
  completedAt: string;
}
