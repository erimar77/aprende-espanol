'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import {
  GamificationState,
  Achievement,
  XPSourceType,
  SkillArea,
  Recommendation,
  LevelInfo,
  DEFAULT_GAMIFICATION_STATE,
  awardXP,
  checkAchievements,
  recordSkillResult,
  getRecommendations,
  getLevelProgress,
  getLevelForXP,
  getSkillStrength,
  getSkillAccuracy,
  loadGamificationState,
  saveGamificationState,
  resetGamificationState,
  ACHIEVEMENTS,
  SKILL_AREAS,
  XP_REWARDS,
} from '@/lib/gamification';
import { useProgress } from './ProgressContext';

// ── Context Interface ─────────────────────────────────────────────────

interface GamificationContextType {
  // State
  state: GamificationState;
  level: ReturnType<typeof getLevelProgress>;
  recommendations: Recommendation[];

  // Actions
  earnXP: (source: XPSourceType, amount?: number, metadata?: Record<string, unknown>) => {
    xpEarned: number;
    newAchievements: Achievement[];
    leveledUp: boolean;
  };
  recordSkill: (area: SkillArea, correct: boolean) => void;
  setDailyGoal: (targetXP: number) => void;

  // Queries
  getAchievement: (id: string) => (Achievement & { earned: boolean; earnedAt?: string }) | undefined;
  getAllAchievements: () => (Achievement & { earned: boolean; earnedAt?: string })[];
  getSkillInfo: (area: SkillArea) => { accuracy: number; strength: string; attempts: number };
  isDailyGoalMet: () => boolean;
  getTodayXP: () => number;

  // Reset
  resetGamification: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [gamState, setGamState] = useState<GamificationState>(DEFAULT_GAMIFICATION_STATE);
  const [loaded, setLoaded] = useState(false);
  const { progress } = useProgress();

  // Load from localStorage on mount
  useEffect(() => {
    setGamState(loadGamificationState());
    setLoaded(true);
  }, []);

  // Persist on change (skip initial default state)
  const prevState = useRef(gamState);
  useEffect(() => {
    if (loaded && gamState !== prevState.current) {
      saveGamificationState(gamState);
      prevState.current = gamState;
    }
  }, [gamState, loaded]);

  // Build context for achievement checks from existing progress.
  // wordsLearned / verbsLearned are derived from per-card SM-2 status so the
  // counters can't drift from reality (every "learned" word is a card with
  // status === 'review' or 'mastered').
  const buildAchievementContext = useCallback(() => {
    const cards = Object.values(progress.flashcardProgress);
    const learned = cards.filter(c => c.status === 'review' || c.status === 'mastered');
    return {
      lessonsCompleted: progress.lessonsCompleted,
      conversationsCompleted: progress.conversationsCompleted,
      wordsLearned: learned.length,
      verbsLearned: learned.filter(c => c.wordType === 'verb').length,
      flashcardCount: cards.length,
    };
  }, [progress]);

  // ── Core Action: Award XP ────────────────────────────────────────────

  const earnXP = useCallback((
    source: XPSourceType,
    amount?: number,
    metadata?: Record<string, unknown>
  ) => {
    const result = awardXP(gamState, source, amount, metadata);
    let updatedState = result.state;

    // Check achievements after XP award
    const achievementCtx = buildAchievementContext();
    const { newAchievements, updatedEarned } = checkAchievements(updatedState, achievementCtx);
    updatedState = { ...updatedState, earnedAchievements: updatedEarned };

    setGamState(updatedState);

    return {
      xpEarned: amount ?? XP_REWARDS[source] ?? 0,
      newAchievements,
      leveledUp: result.leveledUp,
    };
  }, [gamState, buildAchievementContext]);

  // ── Record Skill Result ──────────────────────────────────────────────

  const recordSkill = useCallback((area: SkillArea, correct: boolean) => {
    setGamState(prev => ({
      ...prev,
      skillStats: recordSkillResult(prev.skillStats, area, correct),
    }));
  }, []);

  // ── Settings ─────────────────────────────────────────────────────────

  const setDailyGoal = useCallback((targetXP: number) => {
    setGamState(prev => ({
      ...prev,
      settings: { ...prev.settings, dailyXPTarget: targetXP },
      dailyGoal: { ...prev.dailyGoal, targetXP },
    }));
  }, []);

  // ── Queries ──────────────────────────────────────────────────────────

  const getAchievement = useCallback((id: string) => {
    const def = ACHIEVEMENTS.find(a => a.id === id);
    if (!def) return undefined;
    const earned = gamState.earnedAchievements.includes(id);
    return { ...def, earned, earnedAt: earned ? undefined : undefined };
  }, [gamState.earnedAchievements]);

  const getAllAchievements = useCallback(() => {
    return ACHIEVEMENTS.map(a => ({
      ...a,
      earned: gamState.earnedAchievements.includes(a.id),
    }));
  }, [gamState.earnedAchievements]);

  const getSkillInfo = useCallback((area: SkillArea) => {
    const stats = gamState.skillStats[area];
    if (!stats) return { accuracy: 0, strength: 'new', attempts: 0 };
    return {
      accuracy: getSkillAccuracy(stats),
      strength: getSkillStrength(stats),
      attempts: stats.totalAttempts,
    };
  }, [gamState.skillStats]);

  const isDailyGoalMet = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (gamState.dailyGoal.date !== today) return false;
    return gamState.dailyGoal.currentXP >= gamState.dailyGoal.targetXP;
  }, [gamState.dailyGoal]);

  const getTodayXP = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (gamState.dailyGoal.date !== today) return 0;
    return gamState.dailyGoal.currentXP;
  }, [gamState.dailyGoal]);

  const resetGamification = useCallback(() => {
    const fresh = resetGamificationState();
    setGamState(fresh);
  }, []);

  // ── Computed Values ──────────────────────────────────────────────────

  const level = getLevelProgress(gamState.totalXP);
  const recommendations = getRecommendations(gamState.skillStats);

  return (
    <GamificationContext.Provider
      value={{
        state: gamState,
        level,
        recommendations,
        earnXP,
        recordSkill,
        setDailyGoal,
        getAchievement,
        getAllAchievements,
        getSkillInfo,
        isDailyGoalMet,
        getTodayXP,
        resetGamification,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
