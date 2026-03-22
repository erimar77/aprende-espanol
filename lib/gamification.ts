/**
 * Gamification Engine
 *
 * Extensible framework for XP, levels, streaks, achievements, and adaptive
 * recommendations. Each subsystem is independent and pluggable — new
 * achievements, XP sources, or recommendation rules can be added without
 * touching existing code.
 *
 * Data is stored as a `GamificationState` object, persisted alongside the
 * existing UserProgress in localStorage.
 */

// ── Types ─────────────────────────────────────────────────────────────

/** Every XP-granting action in the app */
export type XPSourceType =
  | 'exercise_complete'
  | 'lesson_complete'
  | 'grammar_lesson_complete'
  | 'conversation_complete'
  | 'flashcard_review'
  | 'perfect_score'
  | 'worksheet_generated'
  | 'verb_trainer'
  | 'streak_bonus'
  | 'custom';

export interface XPEvent {
  source: XPSourceType;
  amount: number;
  timestamp: string;
  metadata?: Record<string, unknown>; // e.g. { lessonId: 'gram022', score: 100 }
}

export interface LevelInfo {
  level: number;
  title: string;
  titleSpanish: string;
  xpRequired: number; // total XP to reach this level
}

export interface StreakState {
  current: number;
  longest: number;
  lastPracticeDate: string | null; // ISO date string (date only, no time)
  freezesAvailable: number;
  freezesUsed: number;
}

export interface DailyGoal {
  targetXP: number;
  currentXP: number;
  date: string; // ISO date string (date only)
}

export interface Achievement {
  id: string;
  title: string;
  titleSpanish: string;
  description: string;
  icon: string; // lucide icon name
  category: AchievementCategory;
  earnedAt?: string;
}

export type AchievementCategory =
  | 'milestone'
  | 'streak'
  | 'mastery'
  | 'exploration'
  | 'special';

/** Tracks performance per skill area for adaptive recommendations */
export interface SkillStats {
  area: SkillArea;
  totalAttempts: number;
  correctAttempts: number;
  lastPracticed: string | null;
  /** Recent accuracy (last 20 attempts) for trend detection */
  recentResults: boolean[];
}

export type SkillArea =
  | 'vocabulary'
  | 'grammar'
  | 'conjugation'
  | 'listening'
  | 'translation'
  | 'conversation'
  | 'reading';

export interface Recommendation {
  area: SkillArea;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  href: string;
  label: string;
}

/** The full gamification state persisted to localStorage */
export interface GamificationState {
  totalXP: number;
  xpHistory: XPEvent[];       // last 100 events for analytics
  streak: StreakState;
  dailyGoal: DailyGoal;
  earnedAchievements: string[]; // achievement IDs
  skillStats: Record<string, SkillStats>;
  settings: GamificationSettings;
}

export interface GamificationSettings {
  dailyXPTarget: number;
  notificationsEnabled: boolean;
  showXPAnimations: boolean;
}


// ── Defaults ──────────────────────────────────────────────────────────

export const DEFAULT_GAMIFICATION_STATE: GamificationState = {
  totalXP: 0,
  xpHistory: [],
  streak: {
    current: 0,
    longest: 0,
    lastPracticeDate: null,
    freezesAvailable: 0,
    freezesUsed: 0,
  },
  dailyGoal: {
    targetXP: 50,
    currentXP: 0,
    date: todayString(),
  },
  earnedAchievements: [],
  skillStats: {},
  settings: {
    dailyXPTarget: 50,
    notificationsEnabled: true,
    showXPAnimations: true,
  },
};


// ── XP Configuration (pluggable) ──────────────────────────────────────

/**
 * XP rewards per action. Modify or extend this map to change XP values.
 * External code can also pass custom amounts via awardXP().
 */
export const XP_REWARDS: Record<XPSourceType, number> = {
  exercise_complete: 15,
  lesson_complete: 50,
  grammar_lesson_complete: 40,
  conversation_complete: 60,
  flashcard_review: 10,
  perfect_score: 25,       // bonus on top of base
  worksheet_generated: 10,
  verb_trainer: 20,
  streak_bonus: 15,        // per milestone (7-day, 30-day, etc.)
  custom: 0,
};


// ── Level System (pluggable) ──────────────────────────────────────────

/**
 * Level thresholds and titles. Add more levels by extending this array.
 * The system automatically finds the correct level for any XP total.
 */
export const LEVELS: LevelInfo[] = [
  { level: 1,  title: 'Beginner',       titleSpanish: 'Principiante',  xpRequired: 0 },
  { level: 2,  title: 'Explorer',       titleSpanish: 'Explorador',    xpRequired: 100 },
  { level: 3,  title: 'Traveler',       titleSpanish: 'Viajero',       xpRequired: 300 },
  { level: 4,  title: 'Conversant',     titleSpanish: 'Conversador',   xpRequired: 600 },
  { level: 5,  title: 'Speaker',        titleSpanish: 'Hablante',      xpRequired: 1000 },
  { level: 6,  title: 'Storyteller',    titleSpanish: 'Narrador',      xpRequired: 1600 },
  { level: 7,  title: 'Scholar',        titleSpanish: 'Erudito',       xpRequired: 2400 },
  { level: 8,  title: 'Expert',         titleSpanish: 'Experto',       xpRequired: 3500 },
  { level: 9,  title: 'Master',         titleSpanish: 'Maestro',       xpRequired: 5000 },
  { level: 10, title: 'Virtuoso',       titleSpanish: 'Virtuoso',      xpRequired: 7000 },
];

export function getLevelForXP(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(xp: number): LevelInfo | null {
  const current = getLevelForXP(xp);
  const next = LEVELS.find(l => l.level === current.level + 1);
  return next ?? null;
}

export function getLevelProgress(xp: number): { current: LevelInfo; next: LevelInfo | null; progressPercent: number; xpToNext: number } {
  const current = getLevelForXP(xp);
  const next = getNextLevel(xp);
  if (!next) return { current, next: null, progressPercent: 100, xpToNext: 0 };

  const xpInLevel = xp - current.xpRequired;
  const xpNeeded = next.xpRequired - current.xpRequired;
  return {
    current,
    next,
    progressPercent: Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)),
    xpToNext: next.xpRequired - xp,
  };
}


// ── Achievement Registry (pluggable) ──────────────────────────────────

/**
 * Achievement definitions. To add a new achievement:
 * 1. Add the definition to ACHIEVEMENTS
 * 2. Add a check function to ACHIEVEMENT_CHECKS
 * That's it — the engine picks it up automatically.
 */

export interface AchievementCheck {
  (state: GamificationState, context: AchievementContext): boolean;
}

export interface AchievementContext {
  lessonsCompleted: string[];
  conversationsCompleted: string[];
  totalWordsLearned: number;
  totalVerbsLearned: number;
  flashcardCount: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── Milestone ───
  { id: 'first_steps',      title: 'First Steps',        titleSpanish: 'Primeros Pasos',      description: 'Complete your first exercise',       icon: 'Footprints',     category: 'milestone' },
  { id: 'century',          title: 'Century',             titleSpanish: 'Centenario',           description: 'Earn 100 XP',                        icon: 'Star',           category: 'milestone' },
  { id: 'five_hundred',     title: 'Rising Star',         titleSpanish: 'Estrella Naciente',    description: 'Earn 500 XP',                        icon: 'TrendingUp',     category: 'milestone' },
  { id: 'thousand',         title: 'Dedicated Learner',   titleSpanish: 'Estudiante Dedicado',  description: 'Earn 1,000 XP',                      icon: 'Award',          category: 'milestone' },
  { id: 'five_thousand',    title: 'XP Legend',            titleSpanish: 'Leyenda de XP',       description: 'Earn 5,000 XP',                      icon: 'Crown',          category: 'milestone' },

  // ── Streak ───
  { id: 'streak_3',         title: 'Getting Started',     titleSpanish: 'Empezando',            description: '3-day practice streak',              icon: 'Flame',          category: 'streak' },
  { id: 'streak_7',         title: 'Week Warrior',        titleSpanish: 'Guerrero Semanal',     description: '7-day practice streak',              icon: 'Flame',          category: 'streak' },
  { id: 'streak_14',        title: 'Two-Week Titan',      titleSpanish: 'Titán de Dos Semanas', description: '14-day practice streak',             icon: 'Flame',          category: 'streak' },
  { id: 'streak_30',        title: 'Monthly Master',      titleSpanish: 'Maestro Mensual',      description: '30-day practice streak',             icon: 'Flame',          category: 'streak' },
  { id: 'streak_100',       title: 'Unstoppable',         titleSpanish: 'Imparable',            description: '100-day practice streak',            icon: 'Zap',            category: 'streak' },

  // ── Mastery ───
  { id: 'perfect_score',    title: 'Perfection',          titleSpanish: 'Perfección',           description: 'Get a perfect score on any exercise', icon: 'CheckCircle',   category: 'mastery' },
  { id: 'vocab_50',         title: 'Word Collector',      titleSpanish: 'Coleccionista',        description: 'Learn 50 vocabulary words',           icon: 'BookOpen',      category: 'mastery' },
  { id: 'vocab_100',        title: 'Walking Dictionary',  titleSpanish: 'Diccionario Andante',  description: 'Learn 100 vocabulary words',          icon: 'Library',       category: 'mastery' },
  { id: 'verbs_10',         title: 'Verb Explorer',       titleSpanish: 'Explorador de Verbos', description: 'Practice 10 different verbs',         icon: 'Repeat',        category: 'mastery' },
  { id: 'grammar_guru',     title: 'Grammar Guru',        titleSpanish: 'Gurú de Gramática',    description: 'Complete all grammar lessons',        icon: 'GraduationCap', category: 'mastery' },

  // ── Exploration ───
  { id: 'first_convo',      title: 'Conversationalist',   titleSpanish: 'Conversador',          description: 'Complete your first conversation',    icon: 'MessageCircle', category: 'exploration' },
  { id: 'five_lessons',     title: 'Bookworm',            titleSpanish: 'Ratón de Biblioteca',  description: 'Complete 5 lessons',                  icon: 'Book',          category: 'exploration' },
  { id: 'ten_lessons',      title: 'Scholar',             titleSpanish: 'Erudito',              description: 'Complete 10 lessons',                 icon: 'Scroll',        category: 'exploration' },
  { id: 'flashcard_master', title: 'Flashcard Master',    titleSpanish: 'Maestro de Tarjetas',  description: 'Review 100 flashcards',               icon: 'Layers',        category: 'exploration' },

  // ── Special ───
  { id: 'night_owl',        title: 'Night Owl',           titleSpanish: 'Búho Nocturno',        description: 'Practice after 11 PM',                icon: 'Moon',          category: 'special' },
  { id: 'early_bird',       title: 'Early Bird',          titleSpanish: 'Madrugador',           description: 'Practice before 7 AM',                icon: 'Sunrise',       category: 'special' },
  { id: 'weekend_warrior',  title: 'Weekend Warrior',     titleSpanish: 'Guerrero de Fin de Semana', description: 'Practice on both Saturday and Sunday', icon: 'Calendar', category: 'special' },
];

/**
 * Achievement check functions. Each returns true when the achievement
 * should be awarded. Add new entries here to register new achievements.
 */
export const ACHIEVEMENT_CHECKS: Record<string, AchievementCheck> = {
  first_steps:      (s) => s.xpHistory.length >= 1,
  century:          (s) => s.totalXP >= 100,
  five_hundred:     (s) => s.totalXP >= 500,
  thousand:         (s) => s.totalXP >= 1000,
  five_thousand:    (s) => s.totalXP >= 5000,

  streak_3:         (s) => s.streak.longest >= 3,
  streak_7:         (s) => s.streak.longest >= 7,
  streak_14:        (s) => s.streak.longest >= 14,
  streak_30:        (s) => s.streak.longest >= 30,
  streak_100:       (s) => s.streak.longest >= 100,

  perfect_score:    (s) => s.xpHistory.some(e => e.source === 'perfect_score'),
  vocab_50:         (_s, ctx) => ctx.totalWordsLearned >= 50,
  vocab_100:        (_s, ctx) => ctx.totalWordsLearned >= 100,
  verbs_10:         (_s, ctx) => ctx.totalVerbsLearned >= 10,
  grammar_guru:     (_s, ctx) => ctx.lessonsCompleted.filter(l => l.startsWith('grammar-')).length >= 24,

  first_convo:      (_s, ctx) => ctx.conversationsCompleted.length >= 1,
  five_lessons:     (_s, ctx) => ctx.lessonsCompleted.length >= 5,
  ten_lessons:      (_s, ctx) => ctx.lessonsCompleted.length >= 10,
  flashcard_master: (_s, ctx) => ctx.flashcardCount >= 100,

  night_owl:        (s) => s.xpHistory.some(e => { const h = new Date(e.timestamp).getHours(); return h >= 23; }),
  early_bird:       (s) => s.xpHistory.some(e => { const h = new Date(e.timestamp).getHours(); return h < 7; }),
  weekend_warrior:  (s) => {
    const days = new Set(s.xpHistory.map(e => { const d = new Date(e.timestamp); return `${d.getDay()}-${d.toISOString().slice(0, 10)}`; }));
    const sats = [...days].filter(d => d.startsWith('6-'));
    const suns = [...days].filter(d => d.startsWith('0-'));
    return sats.length > 0 && suns.length > 0;
  },
};


// ── Core Engine Functions ─────────────────────────────────────────────

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Award XP and return the updated state + any newly earned achievements.
 * This is the primary entry point — call this whenever the user does something.
 */
export function awardXP(
  state: GamificationState,
  source: XPSourceType,
  amount?: number,
  metadata?: Record<string, unknown>
): { state: GamificationState; newAchievements: Achievement[]; leveledUp: boolean } {
  const xp = amount ?? XP_REWARDS[source];
  const prevLevel = getLevelForXP(state.totalXP);

  const event: XPEvent = {
    source,
    amount: xp,
    timestamp: new Date().toISOString(),
    metadata,
  };

  const newState: GamificationState = {
    ...state,
    totalXP: state.totalXP + xp,
    xpHistory: [...state.xpHistory, event].slice(-100), // keep last 100
    dailyGoal: {
      ...state.dailyGoal,
      currentXP: state.dailyGoal.date === todayString()
        ? state.dailyGoal.currentXP + xp
        : xp, // new day, reset
      date: todayString(),
      targetXP: state.settings.dailyXPTarget,
    },
  };

  // Update streak
  newState.streak = updateStreak(newState.streak);

  const newLevel = getLevelForXP(newState.totalXP);
  const leveledUp = newLevel.level > prevLevel.level;

  return { state: newState, newAchievements: [], leveledUp };
}

/**
 * Update streak based on today's date.
 * Call on every XP award — it handles day transitions.
 */
export function updateStreak(streak: StreakState): StreakState {
  const today = todayString();
  const yesterday = yesterdayString();

  if (streak.lastPracticeDate === today) {
    // Already practiced today, no change
    return streak;
  }

  if (streak.lastPracticeDate === yesterday || streak.lastPracticeDate === null) {
    // Consecutive day or first day — extend streak
    const newCurrent = streak.current + 1;
    return {
      ...streak,
      current: newCurrent,
      longest: Math.max(streak.longest, newCurrent),
      lastPracticeDate: today,
    };
  }

  // Missed a day — check for freeze
  if (streak.freezesAvailable > 0) {
    return {
      ...streak,
      lastPracticeDate: today,
      freezesAvailable: streak.freezesAvailable - 1,
      freezesUsed: streak.freezesUsed + 1,
    };
  }

  // Streak broken — reset to 1
  return {
    ...streak,
    current: 1,
    lastPracticeDate: today,
  };
}

/**
 * Check all achievements and return any newly earned ones.
 * Idempotent — already-earned achievements won't be re-awarded.
 */
export function checkAchievements(
  state: GamificationState,
  context: AchievementContext
): { newAchievements: Achievement[]; updatedEarned: string[] } {
  const newAchievements: Achievement[] = [];
  const updatedEarned = [...state.earnedAchievements];

  for (const achievement of ACHIEVEMENTS) {
    if (updatedEarned.includes(achievement.id)) continue;
    const check = ACHIEVEMENT_CHECKS[achievement.id];
    if (check && check(state, context)) {
      newAchievements.push({ ...achievement, earnedAt: new Date().toISOString() });
      updatedEarned.push(achievement.id);
    }
  }

  return { newAchievements, updatedEarned };
}


// ── Skill Stats & Adaptive Recommendations ────────────────────────────

/**
 * Record a practice result for a skill area.
 */
export function recordSkillResult(
  stats: Record<string, SkillStats>,
  area: SkillArea,
  correct: boolean
): Record<string, SkillStats> {
  const existing = stats[area] ?? {
    area,
    totalAttempts: 0,
    correctAttempts: 0,
    lastPracticed: null,
    recentResults: [],
  };

  const recent = [...existing.recentResults, correct].slice(-20);

  return {
    ...stats,
    [area]: {
      ...existing,
      totalAttempts: existing.totalAttempts + 1,
      correctAttempts: existing.correctAttempts + (correct ? 1 : 0),
      lastPracticed: new Date().toISOString(),
      recentResults: recent,
    },
  };
}

/**
 * Calculate accuracy for a skill area (0-100).
 * Uses recent results if available, falls back to overall.
 */
export function getSkillAccuracy(stats: SkillStats): number {
  if (stats.recentResults.length >= 5) {
    const correct = stats.recentResults.filter(Boolean).length;
    return Math.round((correct / stats.recentResults.length) * 100);
  }
  if (stats.totalAttempts === 0) return 0;
  return Math.round((stats.correctAttempts / stats.totalAttempts) * 100);
}

/**
 * Get skill strength label.
 */
export function getSkillStrength(stats: SkillStats): 'strong' | 'good' | 'needs_practice' | 'weak' | 'new' {
  if (stats.totalAttempts < 3) return 'new';
  const acc = getSkillAccuracy(stats);
  if (acc >= 85) return 'strong';
  if (acc >= 70) return 'good';
  if (acc >= 50) return 'needs_practice';
  return 'weak';
}

/** Skill area metadata for display */
export const SKILL_AREAS: Record<SkillArea, { label: string; labelSpanish: string; icon: string; href: string }> = {
  vocabulary:    { label: 'Vocabulary',    labelSpanish: 'Vocabulario',   icon: 'BookOpen',       href: '/vocabulary' },
  grammar:       { label: 'Grammar',       labelSpanish: 'Gramática',    icon: 'FileText',       href: '/grammar' },
  conjugation:   { label: 'Conjugation',   labelSpanish: 'Conjugación',  icon: 'Repeat',         href: '/verb-trainer' },
  listening:     { label: 'Listening',     labelSpanish: 'Escuchar',     icon: 'Headphones',     href: '/conversations' },
  translation:   { label: 'Translation',   labelSpanish: 'Traducción',   icon: 'Languages',      href: '/practice' },
  conversation:  { label: 'Conversation',  labelSpanish: 'Conversación', icon: 'MessageCircle',  href: '/conversations' },
  reading:       { label: 'Reading',       labelSpanish: 'Lectura',      icon: 'Book',           href: '/stories' },
};

/**
 * Generate adaptive study recommendations based on skill stats.
 * Returns up to 3 recommendations sorted by priority.
 */
export function getRecommendations(stats: Record<string, SkillStats>): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const allAreas: SkillArea[] = ['vocabulary', 'grammar', 'conjugation', 'translation', 'conversation', 'reading'];

  for (const area of allAreas) {
    const skill = stats[area];
    const meta = SKILL_AREAS[area];

    if (!skill || skill.totalAttempts === 0) {
      // Never practiced — suggest exploring
      recommendations.push({
        area,
        reason: `You haven't tried ${meta.label.toLowerCase()} yet!`,
        priority: 'medium',
        href: meta.href,
        label: `Explore ${meta.label}`,
      });
      continue;
    }

    const strength = getSkillStrength(skill);
    const daysSince = skill.lastPracticed
      ? Math.floor((Date.now() - new Date(skill.lastPracticed).getTime()) / 86400000)
      : 999;

    if (strength === 'weak') {
      recommendations.push({
        area,
        reason: `Your ${meta.label.toLowerCase()} accuracy is low — extra practice will help!`,
        priority: 'high',
        href: meta.href,
        label: `Practice ${meta.label}`,
      });
    } else if (strength === 'needs_practice') {
      recommendations.push({
        area,
        reason: `${meta.label} could use some more work.`,
        priority: 'medium',
        href: meta.href,
        label: `Review ${meta.label}`,
      });
    } else if (daysSince >= 7) {
      recommendations.push({
        area,
        reason: `It's been ${daysSince} days since you practiced ${meta.label.toLowerCase()}.`,
        priority: 'medium',
        href: meta.href,
        label: `Refresh ${meta.label}`,
      });
    }
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations.slice(0, 3);
}


// ── Storage ───────────────────────────────────────────────────────────

const GAMIFICATION_KEY = 'spanish_gamification';

export function loadGamificationState(): GamificationState {
  if (typeof window === 'undefined') return DEFAULT_GAMIFICATION_STATE;
  try {
    const raw = localStorage.getItem(GAMIFICATION_KEY);
    if (!raw) return DEFAULT_GAMIFICATION_STATE;
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle schema evolution
    return { ...DEFAULT_GAMIFICATION_STATE, ...parsed };
  } catch {
    return DEFAULT_GAMIFICATION_STATE;
  }
}

export function saveGamificationState(state: GamificationState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save gamification state:', e);
  }
}

export function resetGamificationState(): GamificationState {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GAMIFICATION_KEY);
  }
  return DEFAULT_GAMIFICATION_STATE;
}
