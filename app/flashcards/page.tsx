'use client';

import { useState, useMemo, useCallback } from 'react';
import { Shuffle, RotateCcw, Trophy, Clock } from 'lucide-react';
import Card, { CardContent, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FlashCard from '@/components/ui/FlashCard';
import ProgressBar from '@/components/ui/ProgressBar';
import { getRandomNouns } from '@/data/nouns';
import { getRandomAdjectives } from '@/data/adjectives';
import { getRandomAdverbs } from '@/data/adverbs';
import { getRandomVerbs } from '@/data/verbs';
import { nouns } from '@/data/nouns';
import { adjectives } from '@/data/adjectives';
import { adverbs } from '@/data/adverbs';
import { verbs } from '@/data/verbs';
import { getWordRelations } from '@/data/word-relations';
import { useProgress } from '@/context/ProgressContext';
import { useGamification } from '@/context/GamificationContext';

import type { QualityRating } from '@/lib/sm2';

type WordType = 'nouns' | 'adjectives' | 'adverbs' | 'verbs' | 'all';
type CardMode = 'spanish-to-english' | 'english-to-spanish';
type SessionMode = 'random' | 'due';

interface FlashcardItem {
  id: string;
  spanish: string;
  english: string;
  type: 'noun' | 'verb' | 'adjective' | 'adverb';
  synonyms?: string[];
  antonyms?: string[];
}

// Helper to add word relations
const addRelations = (spanish: string) => {
  const relations = getWordRelations(spanish);
  return {
    synonyms: relations?.synonyms,
    antonyms: relations?.antonyms,
  };
};

function getWordsForType(type: WordType, count: number): FlashcardItem[] {
  let items: FlashcardItem[] = [];

  if (type === 'all' || type === 'nouns') {
    const nounItems = getRandomNouns(type === 'all' ? Math.floor(count / 4) : count).map(n => {
      const article = n.gender === 'feminine' ? 'la' : n.gender === 'masculine' ? 'el' : '';
      return {
        id: n.id,
        spanish: article ? `${article} ${n.spanish}` : n.spanish,
        english: n.english,
        type: 'noun' as const,
        ...addRelations(n.spanish),
      };
    });
    items = [...items, ...nounItems];
  }

  if (type === 'all' || type === 'adjectives') {
    const adjItems = getRandomAdjectives(type === 'all' ? Math.floor(count / 4) : count).map(a => ({
      id: a.id,
      spanish: a.spanish,
      english: a.english,
      type: 'adjective' as const,
      ...addRelations(a.spanish),
    }));
    items = [...items, ...adjItems];
  }

  if (type === 'all' || type === 'adverbs') {
    const advItems = getRandomAdverbs(type === 'all' ? Math.floor(count / 4) : count).map(a => ({
      id: a.id,
      spanish: a.spanish,
      english: a.english,
      type: 'adverb' as const,
      ...addRelations(a.spanish),
    }));
    items = [...items, ...advItems];
  }

  if (type === 'all' || type === 'verbs') {
    const verbItems = getRandomVerbs(type === 'all' ? Math.floor(count / 4) : count).map(v => ({
      id: v.id,
      spanish: v.infinitive,
      english: v.english,
      type: 'verb' as const,
      ...addRelations(v.infinitive),
    }));
    items = [...items, ...verbItems];
  }

  return items.sort(() => Math.random() - 0.5);
}

/**
 * Look up a word by its ID across all word lists and return a FlashcardItem.
 */
function lookupWord(wordId: string): FlashcardItem | null {
  // Check nouns
  const noun = nouns.find(n => n.id === wordId);
  if (noun) {
    const article = noun.gender === 'feminine' ? 'la' : noun.gender === 'masculine' ? 'el' : '';
    return {
      id: noun.id,
      spanish: article ? `${article} ${noun.spanish}` : noun.spanish,
      english: noun.english,
      type: 'noun',
      ...addRelations(noun.spanish),
    };
  }

  // Check adjectives
  const adj = adjectives.find(a => a.id === wordId);
  if (adj) {
    return {
      id: adj.id,
      spanish: adj.spanish,
      english: adj.english,
      type: 'adjective',
      ...addRelations(adj.spanish),
    };
  }

  // Check adverbs
  const adv = adverbs.find(a => a.id === wordId);
  if (adv) {
    return {
      id: adv.id,
      spanish: adv.spanish,
      english: adv.english,
      type: 'adverb',
      ...addRelations(adv.spanish),
    };
  }

  // Check verbs
  const verb = verbs.find(v => v.id === wordId);
  if (verb) {
    return {
      id: verb.id,
      spanish: verb.infinitive,
      english: verb.english,
      type: 'verb',
      ...addRelations(verb.infinitive),
    };
  }

  return null;
}

export default function FlashcardsPage() {
  const [wordType, setWordType] = useState<WordType>('all');
  const [cardMode, setCardMode] = useState<CardMode>('spanish-to-english');
  const [deckSize, setDeckSize] = useState(20);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionMode, setSessionMode] = useState<SessionMode>('random');
  const { updateFlashcardWithQuality, getCardsDueForReview, getReviewQueueStats } = useProgress();
  const { earnXP, recordSkill } = useGamification();

  const [deck, setDeck] = useState<FlashcardItem[]>([]);

  const queueStats = useMemo(() => getReviewQueueStats(), [getReviewQueueStats]);

  const startSession = useCallback(() => {
    let newDeck: FlashcardItem[];

    if (sessionMode === 'due') {
      // Build deck from due cards
      const dueIds = getCardsDueForReview();
      const dueCards = dueIds
        .map(id => lookupWord(id))
        .filter((card): card is FlashcardItem => card !== null)
        .slice(0, deckSize);

      if (dueCards.length === 0) {
        // No due cards — fall back to random
        newDeck = getWordsForType(wordType, deckSize);
      } else {
        newDeck = dueCards;
      }
    } else {
      newDeck = getWordsForType(wordType, deckSize);
    }

    setDeck(newDeck);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setSessionStarted(true);
    setSessionComplete(false);
  }, [wordType, deckSize, sessionMode, getCardsDueForReview]);

  const advanceCard = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(c => c + 1);
    } else {
      setIncorrectCount(c => c + 1);
    }

    if (currentIndex < deck.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setSessionComplete(true);
    }
  }, [currentIndex, deck.length]);

  const handleRate = useCallback((quality: 1 | 3 | 4 | 5) => {
    const currentCard = deck[currentIndex];
    updateFlashcardWithQuality(currentCard.id, currentCard.type, quality as QualityRating);
    const isCorrect = quality >= 3;
    earnXP('flashcard_review', undefined, { cardId: currentCard.id, quality });
    recordSkill('vocabulary', isCorrect);
    advanceCard(isCorrect);
  }, [currentIndex, deck, updateFlashcardWithQuality, advanceCard, earnXP, recordSkill]);

  const resetSession = () => {
    setSessionStarted(false);
    setSessionComplete(false);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
  };

  const currentCard = deck[currentIndex];
  const progress = deck.length > 0 ? ((currentIndex) / deck.length) * 100 : 0;
  const accuracy = (correctCount + incorrectCount) > 0
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tarjetas / Flashcards
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Practice vocabulary with spaced repetition
        </p>
      </div>

      {!sessionStarted ? (
        <>
          {/* Review Queue Stats */}
          {queueStats.total > 0 && (
            <Card className="border-2 border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary-500" />
                      Review Queue
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {queueStats.dueNow > 0
                        ? `${queueStats.dueNow} card${queueStats.dueNow !== 1 ? 's' : ''} due for review`
                        : 'All caught up! No cards due right now.'}
                    </p>
                  </div>
                  <div className="flex gap-3 text-center">
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{queueStats.learning}</div>
                      <div className="text-xs text-gray-500">Learning</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">{queueStats.review}</div>
                      <div className="text-xs text-gray-500">Review</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">{queueStats.mastered}</div>
                      <div className="text-xs text-gray-500">Mastered</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <CardTitle className="mb-4">Configure Your Session</CardTitle>

              <div className="space-y-6">
                {/* Session Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSessionMode('due')}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        sessionMode === 'due'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      Review Due Cards
                      {queueStats.dueNow > 0 && (
                        <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                          {queueStats.dueNow}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setSessionMode('random')}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        sessionMode === 'random'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Shuffle className="w-4 h-4" />
                      Random Practice
                    </button>
                  </div>
                </div>

                {/* Word Type (only for random mode) */}
                {sessionMode === 'random' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Word Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['all', 'nouns', 'adjectives', 'adverbs', 'verbs'] as WordType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setWordType(type)}
                          className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                            wordType === type
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {type === 'all' ? 'All Words' : type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Practice Mode
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCardMode('spanish-to-english')}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                        cardMode === 'spanish-to-english'
                          ? 'bg-secondary-400 text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Spanish → English
                    </button>
                    <button
                      onClick={() => setCardMode('english-to-spanish')}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                        cardMode === 'english-to-spanish'
                          ? 'bg-secondary-400 text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      English → Spanish
                    </button>
                  </div>
                </div>

                {/* Deck Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Cards: {deckSize}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={deckSize}
                    onChange={(e) => setDeckSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5</span>
                    <span>50</span>
                  </div>
                </div>

                <Button onClick={startSession} size="lg" className="w-full">
                  {sessionMode === 'due' ? (
                    <>
                      <Clock className="w-5 h-5 mr-2" />
                      Start Review Session
                    </>
                  ) : (
                    <>
                      <Shuffle className="w-5 h-5 mr-2" />
                      Start Practice Session
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : sessionComplete ? (
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Session Complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You practiced {deck.length} words
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-green-700 dark:text-green-400">Correct</div>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
                <div className="text-sm text-red-700 dark:text-red-400">Needs Practice</div>
              </div>
              <div className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{accuracy}%</div>
                <div className="text-sm text-primary-700 dark:text-primary-400">Accuracy</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={resetSession}>
                <RotateCcw className="w-4 h-4 mr-2" />
                New Session
              </Button>
              <Button onClick={startSession}>
                <Shuffle className="w-4 h-4 mr-2" />
                Practice Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Progress */}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Card {currentIndex + 1} of {deck.length}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600">Correct: {correctCount}</span>
                  <span className="text-red-600">Practice: {incorrectCount}</span>
                </div>
              </div>
              <ProgressBar value={currentIndex + 1} max={deck.length} color="primary" />
            </CardContent>
          </Card>

          {/* Flashcard */}
          {currentCard && (
            <div className="flex justify-center">
              <FlashCard
                key={`${currentIndex}-${currentCard.id}`}
                front={cardMode === 'spanish-to-english' ? currentCard.spanish : currentCard.english}
                back={cardMode === 'spanish-to-english' ? currentCard.english : currentCard.spanish}
                frontLabel={cardMode === 'spanish-to-english' ? 'Spanish' : 'English'}
                backLabel={cardMode === 'spanish-to-english' ? 'English' : 'Spanish'}
                synonyms={currentCard.synonyms}
                antonyms={currentCard.antonyms}
                useQualityRating={true}
                onRate={handleRate}
              />
            </div>
          )}

          {/* Word Type Badge */}
          {currentCard && (
            <p className="text-center text-sm text-gray-500">
              Type: <span className="capitalize font-medium">{currentCard.type}</span>
            </p>
          )}

          {/* End Session Button */}
          <div className="text-center">
            <Button variant="ghost" onClick={resetSession}>
              End Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
