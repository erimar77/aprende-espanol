/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Based on the SuperMemo SM-2 algorithm by Piotr Woźniak.
 *
 * Quality ratings (0-5):
 *   0 - Complete blackout, no recognition
 *   1 - Incorrect, but recognized the answer when shown
 *   2 - Incorrect, but the answer seemed easy to recall
 *   3 - Correct, but with significant difficulty
 *   4 - Correct, with some hesitation
 *   5 - Perfect, instant recall
 *
 * For our UI, we map user actions to quality ratings:
 *   "Again"       → 1 (saw the answer, didn't know it)
 *   "Hard"        → 3 (correct but difficult)
 *   "Got It"      → 4 (correct with some thought)
 *   "Easy"        → 5 (instant recall)
 */

export type QualityRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface SM2Result {
  easeFactor: number;
  interval: number;       // days
  nextReview: string;     // ISO date string
  status: 'new' | 'learning' | 'review' | 'mastered';
  repetition: number;     // successful repetitions in a row
}

export interface SM2Input {
  quality: QualityRating;
  easeFactor: number;
  interval: number;
  repetition: number;
  correctCount: number;
  incorrectCount: number;
}

/**
 * Core SM-2 algorithm. Calculates the next review schedule based on
 * the quality of the response.
 */
export function calculateSM2(input: SM2Input): SM2Result {
  const { quality, correctCount, incorrectCount } = input;
  let { easeFactor, interval, repetition } = input;

  const now = new Date();

  // Calculate new ease factor using SM-2 formula:
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  // Minimum ease factor is 1.3
  const newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  if (quality >= 3) {
    // Correct response
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * newEaseFactor);
    }
    repetition += 1;
  } else {
    // Incorrect response — reset to learning phase
    repetition = 0;
    interval = 0;
  }

  // Calculate next review date
  let nextReviewMs: number;
  if (interval === 0) {
    // Learning phase: review again in 10 minutes
    nextReviewMs = now.getTime() + 10 * 60 * 1000;
  } else if (interval === 1) {
    // First successful review: 1 day
    nextReviewMs = now.getTime() + 24 * 60 * 60 * 1000;
  } else {
    nextReviewMs = now.getTime() + interval * 24 * 60 * 60 * 1000;
  }

  // Determine status
  const totalCorrect = correctCount + (quality >= 3 ? 1 : 0);
  const totalIncorrect = incorrectCount + (quality < 3 ? 1 : 0);
  const totalAttempts = totalCorrect + totalIncorrect;
  const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;

  let status: SM2Result['status'];
  if (interval >= 21 && accuracy >= 0.9 && repetition >= 5) {
    status = 'mastered';
  } else if (repetition >= 2 && quality >= 3) {
    status = 'review';
  } else {
    status = 'learning';
  }

  return {
    easeFactor: Math.round(newEaseFactor * 100) / 100, // 2 decimal places
    interval,
    nextReview: new Date(nextReviewMs).toISOString(),
    status,
    repetition,
  };
}

/**
 * Maps the simple "correct/incorrect" binary to quality ratings.
 * Used for backward compatibility with components that don't yet
 * use the full quality rating buttons.
 */
export function binaryToQuality(correct: boolean): QualityRating {
  return correct ? 4 : 1;
}

/**
 * Determines priority score for a card in the review queue.
 * Lower score = higher priority (should be reviewed first).
 *
 * Factors:
 *  - Overdue cards get highest priority
 *  - Learning cards come before review cards
 *  - Lower accuracy cards come first
 */
export function getCardPriority(card: {
  nextReview: string;
  status: string;
  correctCount: number;
  incorrectCount: number;
  easeFactor: number;
  interval: number;
}): number {
  const now = Date.now();
  const dueDate = new Date(card.nextReview).getTime();
  const overdueDays = (now - dueDate) / (24 * 60 * 60 * 1000);

  const totalAttempts = card.correctCount + card.incorrectCount;
  const accuracy = totalAttempts > 0 ? card.correctCount / totalAttempts : 0.5;

  // Base priority: overdue items first (negative = overdue = high priority)
  let priority = -overdueDays;

  // Learning cards get priority boost (-100)
  if (card.status === 'learning') {
    priority -= 100;
  }

  // Lower accuracy = higher priority (subtract more)
  priority -= (1 - accuracy) * 50;

  // Lower ease factor = more difficult = higher priority
  priority -= (2.5 - card.easeFactor) * 10;

  return priority;
}
