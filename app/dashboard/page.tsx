'use client';

import Link from 'next/link';
import {
  Star,
  Flame,
  Target,
  Trophy,
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  CheckCircle,
  Lock,
  ArrowRight,
  BarChart3,
  Swords,
  Map,
  Users,
  ShoppingBag,
  Clock,
} from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import { SKILL_AREAS } from '@/lib/gamification';

// ── Level & XP Card ──────────────────────────────────────────────────────

function LevelXPCard() {
  const { level, state } = useGamification();

  return (
    <div className="bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg p-8 text-white dark:from-primary/90 dark:to-accent/90 col-span-full" role="region" aria-label="Current level and XP progress">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold opacity-90 uppercase tracking-wider">
            {level.current.titleSpanish}
          </h2>
          <h3 className="text-3xl font-bold mt-1">{level.current.title}</h3>
        </div>
        <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur" aria-label={`Level ${level.current.level}`}>
          <div className="text-center">
            <div className="text-3xl font-bold">{level.current.level}</div>
            <div className="text-xs opacity-75">Level</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress to next level</span>
            <span className="text-sm opacity-90">
              {level.progressPercent}%
            </span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${level.progressPercent}%` }}
            />
          </div>
          <div className="text-xs mt-1 opacity-75">
            {level.xpToNext} XP until level {level.current.level + 1}
          </div>
        </div>

        {/* Total XP */}
        <div className="text-sm opacity-90">
          <span className="font-semibold">{state.totalXP}</span> total XP earned
        </div>
      </div>
    </div>
  );
}

// ── Daily Goal Card ──────────────────────────────────────────────────────

function DailyGoalCard() {
  const { state, isDailyGoalMet, getTodayXP } = useGamification();
  const todayXP = getTodayXP();
  const isMet = isDailyGoalMet();
  const progress = Math.min(
    (todayXP / state.dailyGoal.targetXP) * 100,
    100
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6" role="region" aria-label="Daily goal progress">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-accent" aria-hidden="true" />
          Daily Goal
        </h3>
        {isMet && (
          <CheckCircle className="w-6 h-6 text-green-500 animate-pulse" />
        )}
      </div>

      <div className="space-y-4">
        {/* Circular progress */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(progress / 100) * 2 * Math.PI * 54} ${2 * Math.PI * 54}`}
                strokeLinecap="round"
                className="text-primary transition-all duration-500 -rotate-90 origin-center"
                style={{
                  transform: `rotate(-90deg)`,
                  transformOrigin: '50% 50%',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {todayXP}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                /{state.dailyGoal.targetXP}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          {isMet ? (
            <span className="font-semibold text-green-600 dark:text-green-400">
              ✓ Daily goal completed!
            </span>
          ) : (
            <span>
              {state.dailyGoal.targetXP - todayXP} XP remaining
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Streak Card ──────────────────────────────────────────────────────────

function StreakCard() {
  const { state } = useGamification();
  const { streak } = state;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6" role="region" aria-label="Current streak status">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-500" aria-hidden="true" />
        Streak
      </h3>

      <div className="space-y-4">
        {/* Current streak */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            Current Streak
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
              {streak.current}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              days
            </div>
          </div>
        </div>

        {/* Longest streak */}
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Longest Streak
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {streak.longest}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">days</div>
          </div>
        </div>

        {/* Freezes */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Freezes Available
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i < streak.freezesAvailable
                    ? 'bg-blue-400'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skills Radar Card ────────────────────────────────────────────────────

function SkillsRadarCard() {
  const { getSkillInfo } = useGamification();

  const skillAreas: Array<keyof typeof SKILL_AREAS> = [
    'vocabulary',
    'grammar',
    'conjugation',
    'translation',
    'conversation',
    'reading',
  ];

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'needs_practice':
        return 'bg-yellow-500';
      case 'weak':
        return 'bg-orange-500';
      default:
        return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  const getStrengthLabel = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'Strong';
      case 'good':
        return 'Good';
      case 'needs_practice':
        return 'Practice';
      case 'weak':
        return 'Weak';
      default:
        return 'New';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 col-span-full" role="region" aria-label="Skills overview">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" aria-hidden="true" />
        Skills Overview
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillAreas.map((area) => {
          const info = getSkillInfo(area);
          const skillMeta = SKILL_AREAS[area];

          return (
            <div key={area} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {skillMeta.label}
                </label>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {info.accuracy}%
                </span>
              </div>

              {/* Strength bar */}
              <div className="flex gap-2 items-center">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor(info.strength)} transition-all duration-300`}
                    style={{ width: `${info.accuracy}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-12">
                  {getStrengthLabel(info.strength)}
                </span>
              </div>

              {/* Attempts */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {info.attempts} {info.attempts === 1 ? 'attempt' : 'attempts'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Recommendations Card ─────────────────────────────────────────────────

function RecommendationsCard() {
  const { recommendations } = useGamification();

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const priorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40';
      case 'medium':
        return 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40';
      default:
        return 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40';
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 col-span-full" role="region" aria-label="Learning recommendations">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" aria-hidden="true" />
          Recommendations
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Great job! You're doing well across all areas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 col-span-full" role="region" aria-label="Learning recommendations">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-accent" aria-hidden="true" />
        Recommendations
      </h3>

      <div className="space-y-3">
        {recommendations.slice(0, 3).map((rec, idx) => (
          <Link
            key={idx}
            href={rec.href}
            className={`block border rounded-lg p-4 transition-all hover:shadow-md ${priorityColor(rec.priority)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${priorityBadge(rec.priority)}`}>
                    {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {rec.label}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {rec.reason}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Achievements Grid ────────────────────────────────────────────────────

function AchievementsGrid() {
  const { getAllAchievements } = useGamification();
  const achievements = getAllAchievements();

  // Group by category
  const categories = {
    milestone: achievements.filter((a) => a.category === 'milestone'),
    streak: achievements.filter((a) => a.category === 'streak'),
    mastery: achievements.filter((a) => a.category === 'mastery'),
    exploration: achievements.filter((a) => a.category === 'exploration'),
    special: achievements.filter((a) => a.category === 'special'),
  };

  const categoryLabels = {
    milestone: 'Milestones',
    streak: 'Streaks',
    mastery: 'Mastery',
    exploration: 'Exploration',
    special: 'Special',
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Star: <Star className="w-6 h-6" />,
      Trophy: <Trophy className="w-6 h-6" />,
      Award: <Award className="w-6 h-6" />,
      Flame: <Flame className="w-6 h-6" />,
      Zap: <Zap className="w-6 h-6" />,
      BookOpen: <BookOpen className="w-6 h-6" />,
      CheckCircle: <CheckCircle className="w-6 h-6" />,
    };
    return iconMap[iconName] || <Trophy className="w-6 h-6" />;
  };

  return (
    <div className="col-span-full" role="region" aria-label="Achievements">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" aria-hidden="true" />
        Achievements
      </h2>

      <div className="space-y-8">
        {Object.entries(categories).map(([category, cats]) => {
          if (cats.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cats.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative rounded-xl p-4 text-center transition-all ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 dark:from-primary/20 dark:to-accent/20'
                        : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 opacity-50'
                    }`}
                  >
                    {!achievement.earned && (
                      <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-400" />
                    )}

                    <div
                      className={`flex justify-center mb-2 ${
                        achievement.earned
                          ? 'text-primary'
                          : 'text-gray-400'
                      }`}
                    >
                      {getIconComponent(achievement.icon)}
                    </div>

                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                      {achievement.title}
                    </h4>

                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your Spanish learning journey
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Level & XP (full width) */}
          <LevelXPCard />

          {/* Daily Goal */}
          <DailyGoalCard />

          {/* Streak */}
          <StreakCard />

          {/* Skills Radar (full width) */}
          <SkillsRadarCard />

          {/* Recommendations (full width) */}
          <RecommendationsCard />

          {/* Achievements (full width) */}
          <AchievementsGrid />
        </div>

        {/* Detailed Statistics Link */}
        <div className="mt-12 mb-8">
          <Link
            href="/dashboard/statistics"
            className="block bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border border-primary/20 dark:border-primary/30 rounded-xl p-6 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Detailed Statistics
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Deep analytics on your learning patterns, accuracy trends, and weekly progress
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Coming Soon
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            These features are on the way — check back soon!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <Swords className="w-6 h-6" />,
                title: 'Weekly Challenges',
                description: 'Timed challenges with bonus XP rewards. Complete special tasks each week to earn exclusive badges.',
              },
              {
                icon: <Map className="w-6 h-6" />,
                title: 'Learning Path',
                description: 'A guided curriculum that adapts to your level. Follow a structured path from A1 to B2 and beyond.',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Leaderboard',
                description: 'See how you stack up against other learners. Compete for the top spot each week.',
              },
              {
                icon: <ShoppingBag className="w-6 h-6" />,
                title: 'Reward Shop',
                description: 'Spend earned XP on streak freezes, custom themes, avatar items, and bonus content.',
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Adaptive Difficulty',
                description: 'Exercises that automatically adjust to your skill level — harder when you\'re strong, gentler when you\'re struggling.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="relative bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-5 opacity-75"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    Coming Soon
                  </span>
                </div>
                <div className="text-gray-400 dark:text-gray-500 mb-3">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
