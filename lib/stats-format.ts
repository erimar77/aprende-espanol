/**
 * Pure formatting helpers used by the statistics dashboard. Extracted from
 * app/dashboard/statistics/page.tsx so they can be unit-tested and reused.
 */

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

export function getDayLabel(daysAgo: number): string {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function getSourceLabel(source: string): string {
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

export function getSourceColor(source: string): string {
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
