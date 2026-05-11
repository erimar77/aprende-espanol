import { describe, it, expect } from 'vitest';
import {
  awardXP,
  getLevelForXP,
  getNextLevel,
  getLevelProgress,
  updateStreak,
  checkAchievements,
  recordSkillResult,
  getSkillAccuracy,
  getSkillStrength,
  DEFAULT_GAMIFICATION_STATE,
  XP_REWARDS,
  LEVELS,
  type GamificationState,
  type StreakState,
  type AchievementContext,
  type SkillStats,
} from './gamification';

const ctx: AchievementContext = {
  lessonsCompleted: [],
  conversationsCompleted: [],
  wordsLearned: 0,
  verbsLearned: 0,
  flashcardCount: 0,
};

const fresh = (): GamificationState => structuredClone(DEFAULT_GAMIFICATION_STATE);

const todayStr = () => new Date().toISOString().slice(0, 10);
const dateNDaysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

describe('getLevelForXP', () => {
  it('returns level 1 for 0 XP', () => {
    expect(getLevelForXP(0).level).toBe(1);
  });

  it('returns highest level whose threshold is at or below the given XP', () => {
    expect(getLevelForXP(99).level).toBe(1);
    expect(getLevelForXP(100).level).toBe(2);
    expect(getLevelForXP(299).level).toBe(2);
    expect(getLevelForXP(300).level).toBe(3);
  });

  it('caps at the highest defined level', () => {
    expect(getLevelForXP(99_999).level).toBe(LEVELS[LEVELS.length - 1].level);
  });
});

describe('getNextLevel', () => {
  it('returns the next level when one exists', () => {
    expect(getNextLevel(0)?.level).toBe(2);
    expect(getNextLevel(300)?.level).toBe(4);
  });

  it('returns null at the top level', () => {
    expect(getNextLevel(99_999)).toBeNull();
  });
});

describe('getLevelProgress', () => {
  it('reports correct progress mid-level', () => {
    // Between L2 (100) and L3 (300): at 200 XP, 100/200 = 50%
    const p = getLevelProgress(200);
    expect(p.current.level).toBe(2);
    expect(p.next?.level).toBe(3);
    expect(p.progressPercent).toBe(50);
    expect(p.xpToNext).toBe(100);
  });

  it('caps at 100% when no next level', () => {
    const p = getLevelProgress(99_999);
    expect(p.next).toBeNull();
    expect(p.progressPercent).toBe(100);
  });
});

describe('awardXP', () => {
  it('adds the default reward when no amount specified', () => {
    const next = awardXP(fresh(), 'lesson_complete');
    expect(next.state.totalXP).toBe(XP_REWARDS.lesson_complete);
  });

  it('uses the override amount when provided', () => {
    const next = awardXP(fresh(), 'custom', 42);
    expect(next.state.totalXP).toBe(42);
  });

  it('appends an event to xpHistory', () => {
    const next = awardXP(fresh(), 'flashcard_review');
    expect(next.state.xpHistory.length).toBe(1);
    expect(next.state.xpHistory[0].source).toBe('flashcard_review');
  });

  it('reports leveledUp when crossing a threshold', () => {
    const state = { ...fresh(), totalXP: 99 };
    const next = awardXP(state, 'custom', 5); // crosses 100 → L2
    expect(next.leveledUp).toBe(true);
  });

  it('does not report leveledUp when staying in the same level', () => {
    const state = { ...fresh(), totalXP: 50 };
    const next = awardXP(state, 'custom', 5);
    expect(next.leveledUp).toBe(false);
  });

  it('caps xpHistory at 100 events', () => {
    let state = fresh();
    for (let i = 0; i < 105; i++) state = awardXP(state, 'flashcard_review').state;
    expect(state.xpHistory.length).toBe(100);
  });

  it('rolls dailyGoal over on a new day', () => {
    const state: GamificationState = {
      ...fresh(),
      dailyGoal: { targetXP: 50, currentXP: 30, date: dateNDaysAgo(1) },
    };
    const next = awardXP(state, 'custom', 10);
    expect(next.state.dailyGoal.date).toBe(todayStr());
    expect(next.state.dailyGoal.currentXP).toBe(10);
  });

  it('accumulates dailyGoal on the same day', () => {
    const state: GamificationState = {
      ...fresh(),
      dailyGoal: { targetXP: 50, currentXP: 30, date: todayStr() },
    };
    const next = awardXP(state, 'custom', 15);
    expect(next.state.dailyGoal.currentXP).toBe(45);
  });
});

describe('updateStreak', () => {
  const base: StreakState = { current: 0, longest: 0, lastPracticeDate: null, freezesAvailable: 0, freezesUsed: 0 };

  it('starts a streak from scratch', () => {
    const next = updateStreak(base);
    expect(next.current).toBe(1);
    expect(next.longest).toBe(1);
    expect(next.lastPracticeDate).toBe(todayStr());
  });

  it('does not double-count same-day practice', () => {
    const state = { ...base, current: 5, longest: 5, lastPracticeDate: todayStr() };
    const next = updateStreak(state);
    expect(next).toEqual(state);
  });

  it('extends streak on consecutive day', () => {
    const state = { ...base, current: 4, longest: 4, lastPracticeDate: dateNDaysAgo(1) };
    const next = updateStreak(state);
    expect(next.current).toBe(5);
    expect(next.longest).toBe(5);
  });

  it('resets streak when a day is missed and no freeze available', () => {
    const state = { ...base, current: 10, longest: 10, lastPracticeDate: dateNDaysAgo(3), freezesAvailable: 0 };
    const next = updateStreak(state);
    expect(next.current).toBe(1);
    expect(next.longest).toBe(10); // longest is preserved
  });

  it('consumes a freeze when a day is missed', () => {
    const state = { ...base, current: 10, longest: 10, lastPracticeDate: dateNDaysAgo(2), freezesAvailable: 2 };
    const next = updateStreak(state);
    expect(next.current).toBe(10); // streak preserved
    expect(next.freezesAvailable).toBe(1);
    expect(next.freezesUsed).toBe(1);
  });
});

describe('checkAchievements', () => {
  it('awards milestone first_steps after first XP event', () => {
    const state = awardXP(fresh(), 'lesson_complete').state;
    const { newAchievements, updatedEarned } = checkAchievements(state, ctx);
    const ids = newAchievements.map(a => a.id);
    expect(ids).toContain('first_steps');
    expect(updatedEarned).toContain('first_steps');
  });

  it('is idempotent — already-earned achievements are not re-awarded', () => {
    const state: GamificationState = { ...fresh(), totalXP: 200, xpHistory: [{ source: 'lesson_complete', amount: 200, timestamp: new Date().toISOString() }], earnedAchievements: ['first_steps', 'century'] };
    const { newAchievements } = checkAchievements(state, ctx);
    expect(newAchievements.map(a => a.id)).not.toContain('first_steps');
    expect(newAchievements.map(a => a.id)).not.toContain('century');
  });

  it('grants vocab_50 / vocab_100 from the wordsLearned context, not from any internal counter', () => {
    const state = { ...fresh(), totalXP: 0 };
    const { newAchievements } = checkAchievements(state, { ...ctx, wordsLearned: 100 });
    const ids = newAchievements.map(a => a.id);
    expect(ids).toContain('vocab_50');
    expect(ids).toContain('vocab_100');
  });

  it('grants grammar_guru on 24 lessons with the gram prefix', () => {
    const lessons = Array.from({ length: 24 }, (_, i) => `gram${String(i + 1).padStart(3, '0')}`);
    const { newAchievements } = checkAchievements(fresh(), { ...ctx, lessonsCompleted: lessons });
    expect(newAchievements.map(a => a.id)).toContain('grammar_guru');
  });

  it('does not grant grammar_guru on lessons that do not start with gram', () => {
    const lessons = Array.from({ length: 24 }, (_, i) => `other-${i}`);
    const { newAchievements } = checkAchievements(fresh(), { ...ctx, lessonsCompleted: lessons });
    expect(newAchievements.map(a => a.id)).not.toContain('grammar_guru');
  });
});

describe('recordSkillResult / getSkillAccuracy / getSkillStrength', () => {
  it('records a single attempt', () => {
    const stats = recordSkillResult({}, 'vocabulary', true);
    expect(stats.vocabulary.totalAttempts).toBe(1);
    expect(stats.vocabulary.correctAttempts).toBe(1);
  });

  it('keeps only the last 20 recent results', () => {
    let stats: Record<string, SkillStats> = {};
    for (let i = 0; i < 25; i++) stats = recordSkillResult(stats, 'vocabulary', i % 2 === 0);
    expect(stats.vocabulary.recentResults.length).toBe(20);
  });

  it('getSkillAccuracy returns 0 for an empty skill', () => {
    expect(getSkillAccuracy({ area: 'vocabulary', totalAttempts: 0, correctAttempts: 0, lastPracticed: null, recentResults: [] })).toBe(0);
  });

  it('getSkillStrength reports "new" with fewer than 3 attempts', () => {
    const stats: SkillStats = { area: 'vocabulary', totalAttempts: 2, correctAttempts: 2, lastPracticed: null, recentResults: [true, true] };
    expect(getSkillStrength(stats)).toBe('new');
  });

  it('getSkillStrength reports "strong" at ≥85% over recent window', () => {
    const stats: SkillStats = {
      area: 'vocabulary',
      totalAttempts: 10,
      correctAttempts: 9,
      lastPracticed: null,
      recentResults: Array.from({ length: 10 }, (_, i) => i !== 0), // 9/10 = 90%
    };
    expect(getSkillStrength(stats)).toBe('strong');
  });

  it('getSkillStrength reports "weak" below 50%', () => {
    const stats: SkillStats = {
      area: 'vocabulary',
      totalAttempts: 10,
      correctAttempts: 3,
      lastPracticed: null,
      recentResults: [true, true, true, false, false, false, false, false, false, false],
    };
    expect(getSkillStrength(stats)).toBe('weak');
  });
});
