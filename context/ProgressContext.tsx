'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
  getProgress,
  saveProgress,
  updateFlashcardProgress as updateCard,
  updateFlashcardProgressWithQuality as updateCardQuality,
  getFlashcardsDueForReview as getDueCards,
  getReviewQueueStats as getQueueStats,
  markLessonComplete as markLesson,
  markConversationComplete as markConversation,
  unlockConversation as unlock,
  isConversationUnlocked as checkUnlocked,
  addTestScore as addScore,
  resetProgress as reset,
} from '@/lib/storage';
import { getNextConversation } from '@/data/conversations';
import { UserProgress, FlashcardProgress, TestScore } from '@/lib/types';
import type { QualityRating } from '@/lib/sm2';

interface ProgressContextType {
  progress: UserProgress;
  flashcardProgress: Record<string, FlashcardProgress>;
  updateFlashcardProgress: (wordId: string, wordType: 'noun' | 'verb' | 'adjective' | 'adverb', correct: boolean) => FlashcardProgress;
  updateFlashcardWithQuality: (wordId: string, wordType: 'noun' | 'verb' | 'adjective' | 'adverb', quality: QualityRating) => FlashcardProgress;
  getCardsDueForReview: () => string[];
  getReviewQueueStats: () => { dueNow: number; learning: number; review: number; mastered: number; total: number };
  markLessonComplete: (lessonId: string) => void;
  markGrammarLessonComplete: (lessonId: string) => void;
  markConversationComplete: (conversationId: string) => void;
  addTestScore: (score: TestScore) => void;
  resetProgress: () => void;
  isLessonComplete: (lessonId: string) => boolean;
  isGrammarLessonComplete: (lessonId: string) => boolean;
  isConversationComplete: (conversationId: string) => boolean;
  isConversationUnlocked: (conversationId: string) => boolean;
  unlockNextConversation: (completedId: string) => void;
  getWordProgress: (wordId: string) => FlashcardProgress | undefined;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>({
    lessonsCompleted: [],
    conversationsCompleted: [],
    unlockedConversations: ['conv001'],
    testScores: [],
    flashcardProgress: {},
    streakDays: 0,
    lastActive: new Date().toISOString(),
  });

  useEffect(() => {
    const savedProgress = getProgress();
    setProgress(savedProgress);
  }, []);

  const updateFlashcardProgress = useCallback((
    wordId: string,
    wordType: 'noun' | 'verb' | 'adjective' | 'adverb',
    correct: boolean
  ): FlashcardProgress => {
    const { card, progress: updated } = updateCard(wordId, wordType, correct);
    setProgress(updated);
    return card;
  }, []);

  const updateFlashcardWithQuality = useCallback((
    wordId: string,
    wordType: 'noun' | 'verb' | 'adjective' | 'adverb',
    quality: QualityRating
  ): FlashcardProgress => {
    const { card, progress: updated } = updateCardQuality(wordId, wordType, quality);
    setProgress(updated);
    return card;
  }, []);

  const getCardsDueForReview = useCallback(() => {
    return getDueCards();
  }, []);

  const getReviewQueueStats = useCallback(() => {
    return getQueueStats();
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    const updated = markLesson(lessonId);
    setProgress(updated);
  }, []);

  const markConversationComplete = useCallback((conversationId: string) => {
    markConversation(conversationId);
    // Automatically unlock the next conversation when completing one
    const nextConversation = getNextConversation(conversationId);
    let updated: UserProgress;
    if (nextConversation) {
      updated = unlock(nextConversation.id);
    } else {
      updated = getProgress();
    }
    setProgress(updated);
  }, []);

  const unlockNextConversation = useCallback((completedId: string) => {
    const nextConversation = getNextConversation(completedId);
    if (nextConversation) {
      const updated = unlock(nextConversation.id);
      setProgress(updated);
    }
  }, []);

  const isConversationUnlocked = useCallback((conversationId: string) => {
    // Check if conversation exists and is unlocked
    return checkUnlocked(conversationId);
  }, []);

  const markGrammarLessonComplete = useCallback((lessonId: string) => {
    const current = getProgress();
    if (!current.lessonsCompleted.includes(`grammar-${lessonId}`)) {
      current.lessonsCompleted.push(`grammar-${lessonId}`);
      saveProgress(current);
      setProgress(current);
    }
  }, []);

  const addTestScore = useCallback((score: TestScore) => {
    const updated = addScore(score.testId, score.score, score.totalQuestions, score.timeSpent);
    setProgress(updated);
  }, []);

  const resetProgressHandler = useCallback(() => {
    const updated = reset();
    setProgress(updated);
  }, []);

  const isLessonComplete = useCallback((lessonId: string) => {
    return progress.lessonsCompleted.includes(lessonId);
  }, [progress.lessonsCompleted]);

  const isGrammarLessonComplete = useCallback((lessonId: string) => {
    return progress.lessonsCompleted.includes(`grammar-${lessonId}`);
  }, [progress.lessonsCompleted]);

  const isConversationComplete = useCallback((conversationId: string) => {
    return progress.conversationsCompleted.includes(conversationId);
  }, [progress.conversationsCompleted]);

  const getWordProgress = useCallback((wordId: string) => {
    return progress.flashcardProgress[wordId];
  }, [progress.flashcardProgress]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        flashcardProgress: progress.flashcardProgress,
        updateFlashcardProgress,
        updateFlashcardWithQuality,
        getCardsDueForReview,
        getReviewQueueStats,
        markLessonComplete,
        markGrammarLessonComplete,
        markConversationComplete,
        addTestScore,
        resetProgress: resetProgressHandler,
        isLessonComplete,
        isGrammarLessonComplete,
        isConversationComplete,
        isConversationUnlocked,
        unlockNextConversation,
        getWordProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
