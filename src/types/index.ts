
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
  createdAt: string; // Ensure this is a string for serialization
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

export type SubscriptionPlan = 'Hobby' | 'Weekly Pass' | 'Annual Pro';

export interface UserSubscription {
  planName: SubscriptionPlan;
  status: 'active' | 'inactive' | 'trialing' | 'canceled' | 'past_due' | 'unpaid';
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  paypalOrderId?: string;
}

export interface PomodoroSession {
  topic: string;
  sessions: number;
  completedAt: string; // Ensure this is a string for serialization
}

export interface School {
  id: string;
  name: string;
  adminEmail: string;
  totalLicenses: number;
  usedLicenses: number;
  inviteCode: string;
  createdAt: string; // Ensure this is a string for serialization
}
