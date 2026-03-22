'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Flame,
  Star,
  Clock,
  Target,
  Zap,
  CheckCircle,
  Brain,
  Calendar,
} from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import { useProgress } from '@/context/ProgressContext';
import { SKILL_AREAS, type SkillArea, type XPEvent } from '@/lib/gamification';

// ── Helpers ──────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

function getDayLabel(daysAgo: number): string {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function getSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    exercise_complete: 'Exercises',
    lesson_complete: 'Lessons',
    grammar_lesson_complete: 'Grammar',
    conversation_complete: 'Conversations',
    flashcard_review: 'Flashcards',
    perfect_score: 'Perfect Scores',
    worksheet_generated: 'Worksheets',
    verb_trainer: 'Verb Training',
    streak_bonus: 'Streak Bonus',
    custom: 'Other',
  };
  return labels[source] || source;
}

function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    exercise_complete: '#E85D4C',
    lesson_complete: '#1A535C',
    grammar_lesson_complete: '#F4C430',
    conversation_complete: '#2d8659',
    flashcard_review: '#7c4d8a',
    perfect_score: '#c87137',
    worksheet_generated: '#4a90d9',
    verb_trainer: '#d94a7b',
    streak_bonus: '#ff8c00',
    custom: '#888',
  };
  return colors[source] || '#888';
}

// ── Summary Stat Card ────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sublabel,
  color = 'text-primary',
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  color?: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`${color}`}>{icon}</div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      {sublabel && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sublabel}</div>
      )}
    </div>
  );
}

// ── XP Activity Chart (Last 14 Days) ─────────────────────────────────────

function XPActivityChart({ xpHistory }: { xpHistory: XPEvent[] }) {
  const dailyXP = useMemo(() => {
    const days: { label: string; xp: number; date: string }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayXP = xpHistory
        .filter((e) => e.timestamp.slice(0, 10) === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);
      days.push({ label: getDayLabel(i), xp: dayXP, date: dateStr });
    }
    return days;
  }, [xpHistory]);

  const maxXP = Math.max(...dailyXP.map((d) => d.xp), 10);
  const chartHeight = 160;
  const barWidth = 100 / 14;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 col-span-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        XP Activity — Last 14 Days
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Daily XP earned from all activities
      </p>

      <div className="relative">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-[160px] absolute left-0 top-0 text-xs text-gray-400 dark:text-gray-500 -ml-1 w-10 text-right pr-2">
          <span>{maxXP}</span>
          <span>{Math.round(maxXP / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-12">
          <svg
            viewBox={`0 0 100 ${chartHeight}`}
            className="w-full"
            style={{ height: `${chartHeight}px` }}
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="0.3" className="text-gray-200 dark:text-gray-700" />
            <line x1="0" y1={chartHeight / 2} x2="100" y2={chartHeight / 2} stroke="currentColor" strokeWidth="0.3" className="text-gray-200 dark:text-gray-700" />
            <line x1="0" y1={chartHeight} x2="100" y2={chartHeight} stroke="currentColor" strokeWidth="0.3" className="text-gray-200 dark:text-gray-700" />

            {dailyXP.map((day, i) => {
              const barHeight = maxXP > 0 ? (day.xp / maxXP) * chartHeight : 0;
              const x = i * barWidth + barWidth * 0.15;
              const w = barWidth * 0.7;
              const y = chartHeight - barHeight;

              return (
                <g key={i}>
                  <rect
                    x={`${x}%`}
                    y={y}
                    width={`${w}%`}
                    height={barHeight}
                    rx="1"
                    className={day.xp > 0 ? 'fill-primary/80 dark:fill-primary/70' : 'fill-gray-200 dark:fill-gray-700'}
                  />
                  {day.xp > 0 && (
                    <text
                      x={`${x + w / 2}%`}
                      y={y - 4}
                      textAnchor="middle"
                      className="fill-gray-600 dark:fill-gray-400"
                      fontSize="6"
                    >
                      {day.xp}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-1">
            {dailyXP.map((day, i) => (
              <div
                key={i}
                className="text-[10px] text-gray-400 dark:text-gray-500 text-center"
                style={{ width: `${barWidth}%` }}
              >
                {i % 2 === 0 ? day.label : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── XP by Source (Donut Chart) ───────────────────────────────────────────

function XPBySourceChart({ xpHistory }: { xpHistory: XPEvent[] }) {
  const sourceData = useMemo(() => {
    const grouped: Record<string, number> = {};
    xpHistory.forEach((e) => {
      grouped[e.source] = (grouped[e.source] || 0) + e.amount;
    });
    return Object.entries(grouped)
      .map(([source, amount]) => ({
        source,
        amount,
        label: getSourceLabel(source),
        color: getSourceColor(source),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [xpHistory]);

  const total = sourceData.reduce((sum, d) => sum + d.amount, 0);

  if (total === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          XP by Source
        </h3>
        <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
          No XP earned yet — start learning!
        </div>
      </div>
    );
  }

  // Build donut segments
  let cumulativePercent = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-accent" />
        XP by Source
      </h3>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-32 h-32">
            {sourceData.map((d) => {
              const pct = d.amount / total;
              const dashLength = pct * circumference;
              const dashOffset = -cumulativePercent * circumference;
              cumulativePercent += pct;

              return (
                <circle
                  key={d.source}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={d.color}
                  strokeWidth="12"
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-500"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              );
            })}
            <text x="50" y="47" textAnchor="middle" className="fill-gray-900 dark:fill-white" fontSize="12" fontWeight="bold">
              {total}
            </text>
            <text x="50" y="58" textAnchor="middle" className="fill-gray-500" fontSize="6">
              total XP
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {sourceData.slice(0, 6).map((d) => (
            <div key={d.source} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-gray-700 dark:text-gray-300 truncate">{d.label}</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400 font-medium ml-2">
                {d.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Skill Accuracy Breakdown ─────────────────────────────────────────────

function SkillAccuracyChart() {
  const { getSkillInfo } = useGamification();

  const skills: { area: SkillArea; meta: (typeof SKILL_AREAS)[SkillArea] }[] = [
    { area: 'vocabulary', meta: SKILL_AREAS.vocabulary },
    { area: 'grammar', meta: SKILL_AREAS.grammar },
    { area: 'conjugation', meta: SKILL_AREAS.conjugation },
    { area: 'translation', meta: SKILL_AREAS.translation },
    { area: 'conversation', meta: SKILL_AREAS.conversation },
    { area: 'reading', meta: SKILL_AREAS.reading },
  ];

  const getBarColor = (accuracy: number) => {
    if (accuracy >= 85) return 'bg-green-500';
    if (accuracy >= 70) return 'bg-blue-500';
    if (accuracy >= 50) return 'bg-yellow-500';
    if (accuracy > 0) return 'bg-orange-500';
    return 'bg-gray-300 dark:bg-gray-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary" />
        Skill Accuracy
      </h3>

      <div className="space-y-4">
        {skills.map(({ area, meta }) => {
          const info = getSkillInfo(area);
          return (
            <div key={area}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {meta.label}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {info.accuracy}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBarColor(info.accuracy)} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(info.accuracy, 2)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {info.attempts} attempts
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        {[
          { color: 'bg-green-500', label: 'Strong (85%+)' },
          { color: 'bg-blue-500', label: 'Good (70%+)' },
          { color: 'bg-yellow-500', label: 'Practice (50%+)' },
          { color: 'bg-orange-500', label: 'Weak (<50%)' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Test Score History ───────────────────────────────────────────────────

function TestScoreHistory() {
  const { progress } = useProgress();
  const scores = progress.testScores;

  if (scores.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 col-span-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Test Scores
        </h3>
        <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
          No tests completed yet — take a practice test to see your results here!
        </div>
      </div>
    );
  }

  const recentScores = scores.slice(-10);
  const avgScore = Math.round(
    recentScores.reduce((sum, s) => sum + (s.score / s.totalQuestions) * 100, 0) / recentScores.length
  );
  const totalTime = recentScores.reduce((sum, s) => sum + s.timeSpent, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 col-span-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Test Scores
        </h3>
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Avg: <strong className="text-gray-900 dark:text-white">{avgScore}%</strong></span>
          <span>Time: <strong className="text-gray-900 dark:text-white">{formatTime(totalTime)}</strong></span>
        </div>
      </div>

      {/* Score bars */}
      <div className="space-y-3">
        {recentScores.map((score, i) => {
          const pct = Math.round((score.score / score.totalQuestions) * 100);
          const barColor =
            pct >= 90 ? 'bg-green-500' : pct >= 70 ? 'bg-blue-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-20 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {formatDate(score.completedAt)}
              </div>
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-300`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="w-16 text-right text-sm font-semibold text-gray-900 dark:text-white">
                {score.score}/{score.totalQuestions}
              </div>
              <div className="w-12 text-right text-xs text-gray-400">
                {formatTime(score.timeSpent)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Activity Heatmap (Last 8 Weeks) ─────────────────────────────────────

function ActivityHeatmap({ xpHistory }: { xpHistory: XPEvent[] }) {
  const weeks = useMemo(() => {
    const dayMap: Record<string, number> = {};
    xpHistory.forEach((e) => {
      const date = e.timestamp.slice(0, 10);
      dayMap[date] = (dayMap[date] || 0) + e.amount;
    });

    // Build 8 weeks of data ending today
    const grid: { date: string; xp: number; dayOfWeek: number }[][] = [];
    const today = new Date();

    for (let w = 7; w >= 0; w--) {
      const week: { date: string; xp: number; dayOfWeek: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (w * 7 + (6 - d)));
        const dateStr = date.toISOString().slice(0, 10);
        week.push({
          date: dateStr,
          xp: dayMap[dateStr] || 0,
          dayOfWeek: date.getDay(),
        });
      }
      grid.push(week);
    }

    return grid;
  }, [xpHistory]);

  const maxDayXP = Math.max(...weeks.flat().map((d) => d.xp), 1);

  const getIntensity = (xp: number) => {
    if (xp === 0) return 'bg-gray-100 dark:bg-gray-700';
    const ratio = xp / maxDayXP;
    if (ratio > 0.75) return 'bg-primary/90 dark:bg-primary/80';
    if (ratio > 0.5) return 'bg-primary/60 dark:bg-primary/50';
    if (ratio > 0.25) return 'bg-primary/35 dark:bg-primary/30';
    return 'bg-primary/15 dark:bg-primary/15';
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 col-span-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Activity — Last 8 Weeks
      </h3>

      <div className="flex gap-2">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pr-2">
          {dayLabels.map((label, i) => (
            <div
              key={i}
              className="h-4 w-7 text-[10px] text-gray-400 dark:text-gray-500 flex items-center"
            >
              {i % 2 === 1 ? label : ''}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-1 flex-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 flex-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`h-4 rounded-sm ${getIntensity(day.xp)} transition-all`}
                  title={`${day.date}: ${day.xp} XP`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-3">
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mr-1">Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700" />
        <div className="w-3 h-3 rounded-sm bg-primary/15 dark:bg-primary/15" />
        <div className="w-3 h-3 rounded-sm bg-primary/35 dark:bg-primary/30" />
        <div className="w-3 h-3 rounded-sm bg-primary/60 dark:bg-primary/50" />
        <div className="w-3 h-3 rounded-sm bg-primary/90 dark:bg-primary/80" />
        <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">More</span>
      </div>
    </div>
  );
}

// ── Recent Activity Feed ─────────────────────────────────────────────────

function RecentActivityFeed({ xpHistory }: { xpHistory: XPEvent[] }) {
  const recentEvents = useMemo(() => {
    return [...xpHistory].reverse().slice(0, 15);
  }, [xpHistory]);

  const getEventIcon = (source: string) => {
    switch (source) {
      case 'lesson_complete':
        return <BookOpen className="w-4 h-4 text-teal-500" />;
      case 'grammar_lesson_complete':
        return <BookOpen className="w-4 h-4 text-yellow-600" />;
      case 'conversation_complete':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'flashcard_review':
        return <Brain className="w-4 h-4 text-purple-500" />;
      case 'perfect_score':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'verb_trainer':
        return <TrendingUp className="w-4 h-4 text-pink-500" />;
      case 'streak_bonus':
        return <Flame className="w-4 h-4 text-orange-500" />;
      default:
        return <Zap className="w-4 h-4 text-primary" />;
    }
  };

  if (recentEvents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          Recent Activity
        </h3>
        <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
          Your activity will appear here as you learn!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-400" />
        Recent Activity
      </h3>

      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {recentEvents.map((event, i) => {
          const time = new Date(event.timestamp);
          const timeStr = time.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          });

          return (
            <div key={i} className="flex items-center gap-3 py-1.5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {getEventIcon(event.source)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {getSourceLabel(event.source)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{timeStr}</div>
              </div>
              <div className="flex-shrink-0 text-sm font-bold text-primary">
                +{event.amount} XP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Learning Summary Card ────────────────────────────────────────────────

function LearningSummaryCard() {
  const { progress } = useProgress();
  const { state } = useGamification();

  const flashcardCards = Object.values(progress.flashcardProgress);
  const mastered = flashcardCards.filter((c) => c.status === 'mastered').length;
  const learning = flashcardCards.filter((c) => c.status === 'learning').length;
  const reviewing = flashcardCards.filter((c) => c.status === 'review').length;
  const total = flashcardCards.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-accent" />
        Learning Summary
      </h3>

      <div className="space-y-4">
        {/* Flashcard breakdown */}
        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Flashcard Status</div>
          {total > 0 ? (
            <>
              <div className="flex h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {mastered > 0 && (
                  <div
                    className="bg-green-500 transition-all"
                    style={{ width: `${(mastered / total) * 100}%` }}
                  />
                )}
                {reviewing > 0 && (
                  <div
                    className="bg-blue-500 transition-all"
                    style={{ width: `${(reviewing / total) * 100}%` }}
                  />
                )}
                {learning > 0 && (
                  <div
                    className="bg-yellow-500 transition-all"
                    style={{ width: `${(learning / total) * 100}%` }}
                  />
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{mastered} mastered</span>
                <span>{reviewing} reviewing</span>
                <span>{learning} learning</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No flashcards yet</p>
          )}
        </div>

        {/* Progress items */}
        <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Lessons Completed</span>
            <span className="font-semibold text-gray-900 dark:text-white">{progress.lessonsCompleted.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Conversations Done</span>
            <span className="font-semibold text-gray-900 dark:text-white">{progress.conversationsCompleted.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Words Learned</span>
            <span className="font-semibold text-gray-900 dark:text-white">{progress.totalWordsLearned}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Verbs Practiced</span>
            <span className="font-semibold text-gray-900 dark:text-white">{progress.totalVerbsLearned}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Achievements Earned</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {state.earnedAchievements.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────

export default function StatisticsPage() {
  const { state, level, getTodayXP } = useGamification();
  const { progress } = useProgress();

  // Computed summary stats
  const todayXP = getTodayXP();
  const totalTestTime = progress.testScores.reduce((sum, s) => sum + s.timeSpent, 0);
  const avgTestScore =
    progress.testScores.length > 0
      ? Math.round(
          progress.testScores.reduce((sum, s) => sum + (s.score / s.totalQuestions) * 100, 0) /
            progress.testScores.length
        )
      : 0;

  // 7-day XP total
  const sevenDayXP = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return state.xpHistory
      .filter((e) => new Date(e.timestamp) >= cutoff)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [state.xpHistory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Detailed Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Deep analytics on your learning patterns, accuracy trends, and progress
          </p>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Star className="w-5 h-5" />}
            label="Total XP"
            value={state.totalXP.toLocaleString()}
            sublabel={`Level ${level.current.level} — ${level.current.title}`}
            color="text-primary"
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="This Week"
            value={sevenDayXP.toLocaleString()}
            sublabel={`Today: ${todayXP} XP`}
            color="text-accent"
          />
          <StatCard
            icon={<Flame className="w-5 h-5" />}
            label="Current Streak"
            value={`${state.streak.current} days`}
            sublabel={`Best: ${state.streak.longest} days`}
            color="text-orange-500"
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5" />}
            label="Avg Test Score"
            value={avgTestScore > 0 ? `${avgTestScore}%` : '—'}
            sublabel={
              progress.testScores.length > 0
                ? `${progress.testScores.length} tests · ${formatTime(totalTestTime)}`
                : 'No tests taken yet'
            }
            color="text-green-500"
          />
        </div>

        {/* Main analytics grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* XP Activity (full width) */}
          <XPActivityChart xpHistory={state.xpHistory} />

          {/* Activity Heatmap (full width) */}
          <ActivityHeatmap xpHistory={state.xpHistory} />

          {/* XP by Source */}
          <XPBySourceChart xpHistory={state.xpHistory} />

          {/* Skill Accuracy */}
          <SkillAccuracyChart />

          {/* Test Scores (full width) */}
          <TestScoreHistory />

          {/* Recent Activity */}
          <RecentActivityFeed xpHistory={state.xpHistory} />

          {/* Learning Summary */}
          <LearningSummaryCard />
        </div>
      </div>
    </div>
  );
}
