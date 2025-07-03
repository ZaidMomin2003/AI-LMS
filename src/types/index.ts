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

export interface KanbanTask {
  id: string;
  content: string;
  columnId: 'todo' | 'in-progress' | 'done';
}
