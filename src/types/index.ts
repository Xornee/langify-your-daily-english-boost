// User roles
export type UserRole = 'USER' | 'TEACHER' | 'ADMIN';

// Industry contexts
export type IndustryContext = 'it' | 'finance' | 'office' | 'general';

// Language options
export type InterfaceLanguage = 'pl' | 'en';

// Task types
export type TaskType = 'FLASHCARD' | 'MULTIPLE_CHOICE' | 'GAP_FILL';

// Level types
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferredInterfaceLanguage: InterfaceLanguage;
  industryContext: IndustryContext;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  industryTag: IndustryContext;
  level: Level;
  createdBy: string;
  lessonsCount: number;
  estimatedMinutes: number;
  imageUrl?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  orderInCourse: number;
  estimatedMinutes: number;
  tasksCount: number;
}

export interface Task {
  id: string;
  lessonId: string;
  type: TaskType;
  questionText: string;
  questionExtra?: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  vocabularyId?: string;
  orderInLesson: number;
}

export interface VocabularyItem {
  id: string;
  englishWordOrPhrase: string;
  translation: string;
  exampleSentence: string;
  industryTag?: IndustryContext;
  audioUrl?: string;
}

export interface UserVocabularyItem {
  id: string;
  userId: string;
  vocabularyItemId: string;
  vocabularyItem: VocabularyItem;
  addedManually: boolean;
  strength: number;
  lastSeenAt: Date;
}

export interface LessonAttempt {
  id: string;
  userId: string;
  lessonId: string;
  startedAt: Date;
  completedAt?: Date;
  scorePercent: number;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
}

export interface DailyGoal {
  userId: string;
  targetXpPerDay: number;
  targetLessonsPerDay: number;
}

export interface UserDailyStats {
  id: string;
  userId: string;
  date: string;
  xpEarned: number;
  lessonsCompleted: number;
  goalMet: boolean;
}

export interface UserStats {
  totalXp: number;
  totalLessonsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  todayXp: number;
  todayLessonsCompleted: number;
  goalMet: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatarUrl?: string;
  points: number;
  rank: number;
}
