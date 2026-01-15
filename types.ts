export enum AppView {
  HOME = 'HOME',
  PROCESSING = 'PROCESSING',
  SUMMARY = 'SUMMARY',
  FLASHCARDS = 'FLASHCARDS',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS'
}

export interface SummaryTopic {
  title: string;
  content: string; // Markdown/Text
  learningQuestions: string[];
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
  hint: string;
}

export interface QuizChapter {
  topicName: string;
  questions: QuizQuestion[];
}

// The main data structure returned by the AI
export interface StudyMaterial {
  summary: SummaryTopic[];
  flashcards: Flashcard[];
  quiz: QuizChapter[];
}

export interface QuizState {
  currentChapterIndex: number;
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  answers: {
    questionId: string; // chapterIndex-questionIndex
    isCorrect: boolean;
  }[];
}
