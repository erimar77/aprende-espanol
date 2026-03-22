import { Word, Verb } from '@/lib/types';
import { nouns } from '@/data/nouns';
import { verbs } from '@/data/verbs';
import { adjectives } from '@/data/adjectives';
import { adverbs } from '@/data/adverbs';

/**
 * Get a random subset of words from a specific category
 */
export function getWorksheetData(
  wordType: 'nouns' | 'adjectives' | 'adverbs' | 'mixed',
  count: number
): Word[] {
  let pool: Word[] = [];

  if (wordType === 'mixed') {
    // Combine all word types and pick randomly
    pool = [...nouns, ...adjectives, ...adverbs];
  } else if (wordType === 'nouns') {
    pool = nouns;
  } else if (wordType === 'adjectives') {
    pool = adjectives;
  } else if (wordType === 'adverbs') {
    pool = adverbs;
  }

  return getRandomSubset(pool, count);
}

/**
 * Get random verbs with their full conjugation data for conjugation exercises
 */
export function getVerbsForConjugation(count: number): Verb[] {
  return getRandomSubset(verbs, count);
}

/**
 * Generate fill-in-the-blank sentences from words that have example sentences
 */
export function generateFillBlankSentences(
  words: Word[],
  count: number
): Array<{
  id: string;
  sentence: string;
  sentenceSpanish: string;
  blankWord: string;
  blankWordEnglish: string;
}> {
  const wordsWithExamples = words.filter((w) => w.example && w.exampleTranslation);
  const selected = getRandomSubset(wordsWithExamples, Math.min(count, wordsWithExamples.length));

  return selected.map((word) => ({
    id: word.id,
    sentence: word.example!.replace(word.spanish, '______'),
    sentenceSpanish: word.exampleTranslation!,
    blankWord: word.spanish,
    blankWordEnglish: word.english,
  }));
}

/**
 * Generate simple translation prompts from a set of words
 */
export function generateTranslationPrompts(
  words: Word[],
  count: number
): Array<{
  id: string;
  spanish: string;
  english: string;
  type: 'spanish-to-english' | 'english-to-spanish';
}> {
  const selected = getRandomSubset(words, Math.min(count, words.length));
  const prompts: Array<{
    id: string;
    spanish: string;
    english: string;
    type: 'spanish-to-english' | 'english-to-spanish';
  }> = [];

  selected.forEach((word) => {
    // Add Spanish to English variant
    prompts.push({
      id: `${word.id}-se`,
      spanish: word.spanish,
      english: word.english,
      type: 'spanish-to-english',
    });

    // Add English to Spanish variant
    prompts.push({
      id: `${word.id}-es`,
      spanish: word.spanish,
      english: word.english,
      type: 'english-to-spanish',
    });
  });

  // Shuffle and return up to count items
  return shuffleArray(prompts).slice(0, count);
}

/**
 * Helper function: Get a random subset from an array
 */
function getRandomSubset<T>(arr: T[], count: number): T[] {
  const shuffled = shuffleArray([...arr]);
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * Helper function: Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
