import { describe, it, expect } from 'vitest';
import { calculateSM2, binaryToQuality, getCardPriority, QualityRating } from './sm2';

const baseInput = {
  easeFactor: 2.5,
  interval: 0,
  repetition: 0,
  correctCount: 0,
  incorrectCount: 0,
};

describe('calculateSM2', () => {
  describe('failure responses (quality < 3)', () => {
    it.each([0, 1, 2] as QualityRating[])('quality %i resets to learning phase', q => {
      const r = calculateSM2({ ...baseInput, quality: q, repetition: 5, interval: 30 });
      expect(r.interval).toBe(0);
      expect(r.repetition).toBe(0);
      expect(r.status).toBe('learning');
    });

    it('failure puts nextReview about 10 minutes in the future', () => {
      const before = Date.now();
      const r = calculateSM2({ ...baseInput, quality: 1 });
      const dueMs = new Date(r.nextReview).getTime();
      const minutes = (dueMs - before) / 60_000;
      expect(minutes).toBeGreaterThan(9);
      expect(minutes).toBeLessThan(11);
    });
  });

  describe('success responses (quality >= 3)', () => {
    it('first successful rep gives interval 1', () => {
      const r = calculateSM2({ ...baseInput, quality: 4, repetition: 0 });
      expect(r.interval).toBe(1);
      expect(r.repetition).toBe(1);
    });

    it('second successful rep gives interval 6', () => {
      const r = calculateSM2({ ...baseInput, quality: 4, repetition: 1, interval: 1 });
      expect(r.interval).toBe(6);
      expect(r.repetition).toBe(2);
    });

    it('subsequent reps multiply interval by ease factor', () => {
      const r = calculateSM2({ ...baseInput, quality: 4, repetition: 2, interval: 6, easeFactor: 2.5 });
      // 6 * (2.5 + small delta) ≈ 15-16
      expect(r.interval).toBeGreaterThanOrEqual(15);
      expect(r.interval).toBeLessThanOrEqual(17);
      expect(r.repetition).toBe(3);
    });
  });

  describe('ease factor', () => {
    it('clamps to a minimum of 1.3', () => {
      const r = calculateSM2({ ...baseInput, quality: 0, easeFactor: 1.3 });
      expect(r.easeFactor).toBe(1.3);
    });

    it('decreases on a poor response', () => {
      const r = calculateSM2({ ...baseInput, quality: 1, easeFactor: 2.5 });
      expect(r.easeFactor).toBeLessThan(2.5);
    });

    it('increases or holds steady on quality 5', () => {
      const r = calculateSM2({ ...baseInput, quality: 5, easeFactor: 2.5 });
      expect(r.easeFactor).toBeGreaterThanOrEqual(2.5);
    });

    it('rounds to two decimal places', () => {
      const r = calculateSM2({ ...baseInput, quality: 4, easeFactor: 2.5 });
      const decimals = r.easeFactor.toString().split('.')[1] ?? '';
      expect(decimals.length).toBeLessThanOrEqual(2);
    });
  });

  describe('status transitions', () => {
    it('marks "review" once repetition >= 2 with quality >= 3', () => {
      const r = calculateSM2({ ...baseInput, quality: 4, repetition: 1, interval: 1 });
      expect(r.status).toBe('review');
    });

    it('marks "mastered" with repetition >= 5, interval >= 21, accuracy >= 0.9', () => {
      const r = calculateSM2({
        ...baseInput,
        quality: 4,
        repetition: 5,
        interval: 30,
        correctCount: 10,
        incorrectCount: 1,
      });
      expect(r.status).toBe('mastered');
    });

    it('keeps "learning" if accuracy is too low', () => {
      const r = calculateSM2({
        ...baseInput,
        quality: 4,
        repetition: 6,
        interval: 30,
        correctCount: 6,
        incorrectCount: 4, // 70% accuracy — below 90% threshold
      });
      expect(r.status).toBe('review'); // not 'mastered' because accuracy < 90%
    });
  });
});

describe('binaryToQuality', () => {
  it('maps true → 4 (Got It)', () => {
    expect(binaryToQuality(true)).toBe(4);
  });

  it('maps false → 1 (Again)', () => {
    expect(binaryToQuality(false)).toBe(1);
  });
});

describe('getCardPriority', () => {
  const baseCard = {
    nextReview: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // tomorrow
    status: 'review',
    correctCount: 5,
    incorrectCount: 2,
    easeFactor: 2.5,
    interval: 7,
  };

  it('overdue cards have a lower (= higher priority) score than future ones', () => {
    const futureCard = { ...baseCard };
    const overdueCard = {
      ...baseCard,
      nextReview: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), // 2 days ago
    };
    expect(getCardPriority(overdueCard)).toBeLessThan(getCardPriority(futureCard));
  });

  it('learning status applies a -100 priority boost', () => {
    const reviewCard = { ...baseCard, status: 'review' };
    const learningCard = { ...baseCard, status: 'learning' };
    const delta = getCardPriority(reviewCard) - getCardPriority(learningCard);
    expect(delta).toBeCloseTo(100, 0);
  });

  it('lower accuracy → lower (= higher priority) score', () => {
    const highAcc = { ...baseCard, correctCount: 9, incorrectCount: 1 };
    const lowAcc = { ...baseCard, correctCount: 1, incorrectCount: 9 };
    expect(getCardPriority(lowAcc)).toBeLessThan(getCardPriority(highAcc));
  });

  it('lower ease factor → lower (= higher priority) score', () => {
    const easy = { ...baseCard, easeFactor: 2.5 };
    const hard = { ...baseCard, easeFactor: 1.3 };
    expect(getCardPriority(hard)).toBeLessThan(getCardPriority(easy));
  });
});
