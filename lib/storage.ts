'use client';

import { UserProgress, FlashcardProgress } from './types';
import { calculateSM2, binaryToQuality, getCardPriority, QualityRating } from './sm2';

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

/**
 * Update flashcard progress using SM-2 algorithm with quality rating.
 * This is the primary function — accepts a quality rating (0-5).
 */
export function updateFlashcardProgressWithQuality(
  wordId: string,
  wordType: 'noun' | 'verb' | 'adjective' | 'adverb',
  quality: QualityRating
): { card: FlashcardProgress; progress: UserProgress } {
  const progress = getProgress();
  const existing = progress.flashcardProgress[wordId];
  const now = new Date();

  const currentCorrect = existing?.correctCount ?? 0;
  const currentIncorrect = existing?.incorrectCount ?? 0;

  const sm2Result = calculateSM2({
    quality,
    easeFactor: existing?.easeFactor ?? 2.5,
    interval: existing?.interval ?? 0,
    repetition: existing?.repetition ?? 0,
    correctCount: currentCorrect,
    incorrectCount: currentIncorrect,
  });

  const updated: FlashcardProgress = {
    wordId,
    wordType,
    correctCount: currentCorrect + (quality >= 3 ? 1 : 0),
    incorrectCount: currentIncorrect + (quality < 3 ? 1 : 0),
    lastReviewed: now.toISOString(),
    nextReview: sm2Result.nextReview,
    easeFactor: sm2Result.easeFactor,
    interval: sm2Result.interval,
    repetition: sm2Result.repetition,
    status: sm2Result.status,
  };

  progress.flashcardProgress[wordId] = updated;
  saveProgress(progress);
  return { card: updated, progress };
}

/**
 * Backward-compatible wrapper: maps boolean correct/incorrect to quality ratings.
 * correct → quality 4 ("Got It"), incorrect → quality 1 ("Again")
 */
export function updateFlashcardProgress(
  wordId: string,
  wordType: 'noun' | 'verb' | 'adjective' | 'adverb',
  correct: boolean
): { card: FlashcardProgress; progress: UserProgress } {
  return updateFlashcardProgressWithQuality(wordId, wordType, binaryToQuality(correct));
}

/**
 * Returns word IDs that are due for review, sorted by priority.
 * Cards that are most overdue or struggling come first.
 */
export function getFlashcardsDueForReview(): string[] {
  const progress = getProgress();
  const now = new Date();

  return Object.entries(progress.flashcardProgress)
    .filter(([, card]) => new Date(card.nextReview) <= now)
    .sort(([, a], [, b]) => getCardPriority(a) - getCardPriority(b))
    .map(([id]) => id);
}

/**
 * Returns summary stats about the review queue.
 */
export function getReviewQueueStats(): {
  dueNow: number;
  learning: number;
  review: number;
  mastered: number;
  total: number;
} {
  const progress = getProgress();
  const now = new Date();
  const cards = Object.values(progress.flashcardProgress);

  return {
    dueNow: cards.filter(c => new Date(c.nextReview) <= now).length,
    learning: cards.filter(c => c.status === 'learning').length,
    review: cards.filter(c => c.status === 'review').length,
    mastered: cards.filter(c => c.status === 'mastered').length,
    total: cards.length,
  };
}

export function markLessonComplete(lessonId: string): UserProgress {
  const progress = getProgress();
  if (!progress.lessonsCompleted.includes(lessonId)) {
    progress.lessonsCompleted.push(lessonId);
    saveProgress(progress);
  }
  return progress;
}

export function markConversationComplete(conversationId: string): UserProgress {
  const progress = getProgress();
  if (!progress.conversationsCompleted.includes(conversationId)) {
    progress.conversationsCompleted.push(conversationId);
    saveProgress(progress);
  }
  return progress;
}

export function unlockConversation(conversationId: string): UserProgress {
  const progress = getProgress();
  // Initialize unlockedConversations if it doesn't exist (for existing users)
  if (!progress.unlockedConversations) {
    progress.unlockedConversations = ['conv001'];
  }
  if (!progress.unlockedConversations.includes(conversationId)) {
    progress.unlockedConversations.push(conversationId);
    saveProgress(progress);
  }
  return progress;
}

export function isConversationUnlocked(conversationId: string): boolean {
  const progress = getProgress();
  // Initialize unlockedConversations if it doesn't exist (for existing users)
  if (!progress.unlockedConversations) {
    return conversationId === 'conv001';
  }
  return progress.unlockedConversations.includes(conversationId);
}

export function addTestScore(testId: string, score: number, totalQuestions: number, timeSpent: number): UserProgress {
  const progress = getProgress();
  progress.testScores.push({
    testId,
    score,
    totalQuestions,
    completedAt: new Date().toISOString(),
    timeSpent,
  });
  saveProgress(progress);
  return progress;
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

export function resetProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;

  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(DEFAULT_PROGRESS));
  } catch (error) {
    console.error('Failed to reset progress:', error);
  }
  return DEFAULT_PROGRESS;
}
