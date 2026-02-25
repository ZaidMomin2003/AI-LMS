
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
  keyVocabulary: string;
  keyDefinitions: string;
  keyFormulasOrPoints: string;
  summary: string;
  exampleWithExplanation: string;
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
  ownerId?: string;
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
  date: string; // Storing as ISO string
}

export interface PomodoroSession {
  topic: string;
  sessions: number;
  completedAt: string;
}

export interface OnboardingProfileData {
  name?: string;
  goal?: string;
  challenge?: string;
  firstMove?: string;
  examEve?: string;
  studySession?: string;
  superpower?: string;
  achillesHeel?: string;
  materialPref?: string;
}

export interface ProfileData extends OnboardingProfileData {
  // Fields from the main personalization form
  studying?: string;
  aiName?: string; // This is the name the user wants to be called by the AI
  educationLevel?: string;
  contentStyle?: string;
  
  phoneNumber?: string;
  country?: string;
  grade?: string;
  referralSource?: string;
  captureCount?: number;
  receivedTopicsCount?: number;
}


export interface Subscription {
  plan: string;
  status: 'active' | 'inactive';
  expiryDate: string;
  gracePeriodEnds?: string;
}
