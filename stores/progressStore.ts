import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LessonProgress {
  completed: boolean;
  lastVisited: number;
  quizScore?: number;
}

export interface PracticeStats {
  totalAttempts: number;
  correctMemos: number;
  totalTimeMs: number;
  bestTimeMs: number | null;
}

interface ProgressState {
  // Lesson progress keyed by route slug
  lessons: Record<string, LessonProgress>;
  // Memo trainer stats
  memoStats: {
    sessionsCompleted: number;
    totalPairs: number;
    correctRecalls: number;
  };
  // Full practice stats
  practiceStats: PracticeStats;
  // User settings
  letterScheme: 'speffz';
  notation: 'sign';
  
  // Actions
  markLessonComplete: (slug: string, quizScore?: number) => void;
  visitLesson: (slug: string) => void;
  recordMemoSession: (pairs: number, correct: number) => void;
  recordPracticeAttempt: (correct: boolean, timeMs: number) => void;
  resetProgress: () => void;
}

const initialState = {
  lessons: {},
  memoStats: {
    sessionsCompleted: 0,
    totalPairs: 0,
    correctRecalls: 0,
  },
  practiceStats: {
    totalAttempts: 0,
    correctMemos: 0,
    totalTimeMs: 0,
    bestTimeMs: null,
  },
  letterScheme: 'speffz' as const,
  notation: 'sign' as const,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,
      markLessonComplete: (slug, quizScore) => {
        set((state) => ({
          lessons: {
            ...state.lessons,
            [slug]: {
              completed: true,
              lastVisited: Date.now(),
              quizScore,
            },
          },
        }));
      },
      visitLesson: (slug) => {
        set((state) => ({
          lessons: {
            ...state.lessons,
            [slug]: {
              ...state.lessons[slug],
              completed: state.lessons[slug]?.completed ?? false,
              lastVisited: Date.now(),
            },
          },
        }));
      },
      recordMemoSession: (pairs, correct) => {
        set((state) => ({
          memoStats: {
            sessionsCompleted: state.memoStats.sessionsCompleted + 1,
            totalPairs: state.memoStats.totalPairs + pairs,
            correctRecalls: state.memoStats.correctRecalls + correct,
          },
        }));
      },
      recordPracticeAttempt: (correct, timeMs) => {
        set((state) => ({
          practiceStats: {
            totalAttempts: state.practiceStats.totalAttempts + 1,
            correctMemos: state.practiceStats.correctMemos + (correct ? 1 : 0),
            totalTimeMs: state.practiceStats.totalTimeMs + timeMs,
            bestTimeMs: correct
              ? state.practiceStats.bestTimeMs === null
                ? timeMs
                : Math.min(state.practiceStats.bestTimeMs, timeMs)
              : state.practiceStats.bestTimeMs,
          },
        }));
      },
      resetProgress: () => {
        set(initialState);
      },
    }),
    {
      name: 'cube-bld-progress',
    }
  )
);
