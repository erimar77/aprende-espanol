'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
  getProgress,
  saveProgress,
  updateFlashcardProgress as updateCard,
  markLessonComplete as markLesson,
  markConversationComplete as markConversation,
  unlockConversation as unlock,
  isConversationUnlocked as checkUnlocked,
  addTestScore as addScore,
  resetProgress as reset,
} from '@/lib/storage';
import { getConversationById, getNextConversation } from '@/data/conversations';
import { UserProgress, FlashcardProgress, TestScore } from '@/lib/types';

interface ProgressContextType {
  progress: UserProgress;
  flashcardProgress: Record<string, FlashcardProgress>;
  updateFlashcardProgress: (wordId: string, wordType: 'noun' | 'verb' | 'adjective' | 'adverb', correct: boolean) => FlashcardProgress;
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
    totalWordsLearned: 0,
    totalVerbsLearned: 0,
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
    const updated = updateCard(wordId, wordType, correct);
    setProgress(getProgress());
    return updated;
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    markLesson(lessonId);
    setProgress(getProgress());
  }, []);

  const markConversationComplete = useCallback((conversationId: string) => {
    markConversation(conversationId);
    // Automatically unlock the next conversation when completing one
    const nextConversation = getNextConversation(conversationId);
    if (nextConversation) {
      unlock(nextConversation.id);
    }
    setProgress(getProgress());
  }, []);

  const unlockNextConversation = useCallback((completedId: string) => {
    const nextConversation = getNextConversation(completedId);
    if (nextConversation) {
      unlock(nextConversation.id);
      setProgress(getProgress());
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
      setProgress(getProgress());
    }
  }, []);

  const addTestScore = useCallback((score: TestScore) => {
    addScore(score.testId, score.score, score.totalQuestions, score.timeSpent);
    setProgress(getProgress());
  }, []);

  const resetProgressHandler = useCallback(() => {
    reset();
    setProgress(getProgress());
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
