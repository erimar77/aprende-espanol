'use client';

import { UserProgress, FlashcardProgress } from './types';

const STORAGE_KEYS = {
  PROGRESS: 'spanish_learning_progress',
  THEME: 'spanish_learning_theme',
  SELECTED_TEACHER: 'spanish_learning_teacher',
} as const;

const DEFAULT_PROGRESS: UserProgress = {
  lessonsCompleted: [],
  conversationsCompleted: [],
  unlockedConversations: ['conv001'], // First conversation always unlocked
  testScores: [],
  flashcardProgress: {},
  streakDays: 0,
  lastActive: new Date().toISOString(),
  totalWordsLearned: 0,
  totalVerbsLearned: 0,
};

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!stored) return DEFAULT_PROGRESS;
    return JSON.parse(stored);
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function updateFlashcardProgress(
  wordId: string,
  wordType: 'noun' | 'verb' | 'adjective' | 'adverb',
  correct: boolean
): FlashcardProgress {
  const progress = getProgress();
  const existing = progress.flashcardProgress[wordId];

  // Spaced repetition algorithm (SM-2 simplified)
  const now = new Date();

  if (!existing) {
    const newProgress: FlashcardProgress = {
      wordId,
      wordType,
      correctCount: correct ? 1 : 0,
      incorrectCount: correct ? 0 : 1,
      lastReviewed: now.toISOString(),
      nextReview: new Date(now.getTime() + (correct ? 24 * 60 * 60 * 1000 : 10 * 60 * 1000)).toISOString(),
      easeFactor: 2.5,
      interval: correct ? 1 : 0,
      status: 'learning',
    };

    progress.flashcardProgress[wordId] = newProgress;
    saveProgress(progress);
    return newProgress;
  }

  // Update existing progress
  let { easeFactor, interval } = existing;

  if (correct) {
    existing.correctCount++;
    if (interval === 0) {
      interval = 1;
    } else if (interval === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    easeFactor = Math.max(1.3, easeFactor + 0.1);
  } else {
    existing.incorrectCount++;
    interval = 0;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  }

  existing.easeFactor = easeFactor;
  existing.interval = interval;
  existing.lastReviewed = now.toISOString();
  existing.nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000).toISOString();

  // Update status
  if (existing.correctCount >= 5 && existing.incorrectCount === 0) {
    existing.status = 'mastered';
  } else if (existing.correctCount >= 3) {
    existing.status = 'review';
  } else {
    existing.status = 'learning';
  }

  progress.flashcardProgress[wordId] = existing;
  saveProgress(progress);
  return existing;
}

export function getFlashcardsDueForReview(): string[] {
  const progress = getProgress();
  const now = new Date();

  return Object.entries(progress.flashcardProgress)
    .filter(([_, card]) => new Date(card.nextReview) <= now)
    .map(([id]) => id);
}

export function markLessonComplete(lessonId: string): void {
  const progress = getProgress();
  if (!progress.lessonsCompleted.includes(lessonId)) {
    progress.lessonsCompleted.push(lessonId);
    saveProgress(progress);
  }
}

export function markConversationComplete(conversationId: string): void {
  const progress = getProgress();
  if (!progress.conversationsCompleted.includes(conversationId)) {
    progress.conversationsCompleted.push(conversationId);
    saveProgress(progress);
  }
}

export function unlockConversation(conversationId: string): void {
  const progress = getProgress();
  // Initialize unlockedConversations if it doesn't exist (for existing users)
  if (!progress.unlockedConversations) {
    progress.unlockedConversations = ['conv001'];
  }
  if (!progress.unlockedConversations.includes(conversationId)) {
    progress.unlockedConversations.push(conversationId);
    saveProgress(progress);
  }
}

export function isConversationUnlocked(conversationId: string): boolean {
  const progress = getProgress();
  // Initialize unlockedConversations if it doesn't exist (for existing users)
  if (!progress.unlockedConversations) {
    return conversationId === 'conv001';
  }
  return progress.unlockedConversations.includes(conversationId);
}

export function addTestScore(testId: string, score: number, totalQuestions: number, timeSpent: number): void {
  const progress = getProgress();
  progress.testScores.push({
    testId,
    score,
    totalQuestions,
    completedAt: new Date().toISOString(),
    timeSpent,
  });
  saveProgress(progress);
}

export function getTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored === 'dark' || stored === 'light') return stored;

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

export function setTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}

export function getSelectedTeacher(): string {
  if (typeof window === 'undefined') return 'maria';

  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_TEACHER) || 'maria';
  } catch {
    return 'maria';
  }
}

export function setSelectedTeacher(teacherId: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_TEACHER, teacherId);
  } catch (error) {
    console.error('Failed to save teacher selection:', error);
  }
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(DEFAULT_PROGRESS));
  } catch (error) {
    console.error('Failed to reset progress:', error);
  }
}
