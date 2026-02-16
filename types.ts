
export type Difficulty = 'Novice Low' | 'Novice Mid' | 'Novice High' | 'Intermediate Low';

export enum ExerciseType {
  SENTENCE_BUILDER = 'SENTENCE_BUILDER',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRANSLATION = 'TRANSLATION',
  INTERPERSONAL_CHAT = 'INTERPERSONAL_CHAT',
  MATCHING = 'MATCHING',
  DRAG_AND_DROP = 'DRAG_AND_DROP',
  SPEAKING = 'SPEAKING'
}

export interface Word {
  nalibo: string;
  english: string;
  ipa?: string;
  category?: string;
  pronunciation_guide?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  correctAnswer: string;
  grammarFocus: string; // References the lesson focus
  options?: string[];
  words?: Word[];
  pairs?: { left: string; right: string }[]; // For Matching
}

export interface Lesson {
  id: string;
  title: string;
  level: Difficulty;
  icon: string; // Map icon
  canDoStatements: string[];
  storySegment: string;
  grammarFocus: string;
  linguisticNote: {
    title: string;
    description: string;
  };
  comparisonNote: string;
  vocab: Word[];
  exercises: Exercise[];
}

export interface UserProgress {
  currentLessonId: string;
  completedLessons: string[];
  xp: number;
  gems: number;
  lives: number;
  streak: number;
  proficiencyLevel: Difficulty;
}

export interface User {
  username: string;
  password?: string; // NOTE: Storing plain text passwords is not secure. For simulation only.
  apiKey?: string;
  progress: UserProgress;
}
