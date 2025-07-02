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
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}
