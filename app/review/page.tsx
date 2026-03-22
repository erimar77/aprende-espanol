'use client';

import { useState, useMemo } from 'react';
import { RotateCcw, TrendingUp, AlertCircle, CheckCircle, ChevronRight, Volume2, XCircle } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { nouns } from '@/data/nouns';
import { adjectives } from '@/data/adjectives';
import { adverbs } from '@/data/adverbs';
import { allVerbs } from '@/data/verbs';
import { useProgress } from '@/context/ProgressContext';
import { useGamification } from '@/context/GamificationContext';
import { speak } from '@/lib/speech';

interface ReviewItem {
  id: string;
  spanish: string;
  english: string;
  type: 'noun' | 'verb' | 'adjective' | 'adverb';
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
  status: string;
  nextReview: string;
  interval: number;
  easeFactor: number;
}

export default function ReviewPage() {
  const { flashcardProgress, updateFlashcardProgress, getReviewQueueStats } = useProgress();
  const { earnXP, recordSkill } = useGamification();
  const [reviewMode, setReviewMode] = useState<'overview' | 'practice'>('overview');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  const queueStats = useMemo(() => getReviewQueueStats(), [getReviewQueueStats]);

  // Get items that need review (due for review, low accuracy, or still learning)
  const itemsToReview = useMemo(() => {
    const items: ReviewItem[] = [];
    const now = new Date();

    Object.entries(flashcardProgress).forEach(([id, progress]) => {
      const totalAttempts = progress.correctCount + progress.incorrectCount;
      if (totalAttempts === 0) return;

      const accuracy = (progress.correctCount / totalAttempts) * 100;
      const isDue = new Date(progress.nextReview) <= now;

      // Include items that are due, have low accuracy, or are still learning
      if (isDue || accuracy < 70 || progress.status === 'learning') {
        let word = null;
        let type: 'noun' | 'verb' | 'adjective' | 'adverb' = 'noun';

        // Find the word in our data
        if (progress.wordType === 'noun') {
          const noun = nouns.find(n => n.id === id);
          if (noun) {
            const article = noun.gender === 'feminine' ? 'la' : noun.gender === 'masculine' ? 'el' : '';
            word = { spanish: article ? `${article} ${noun.spanish}` : noun.spanish, english: noun.english };
          }
          type = 'noun';
        } else if (progress.wordType === 'verb') {
          const verb = allVerbs.find(v => v.id === id);
          if (verb) {
            word = { spanish: verb.infinitive, english: verb.english };
          }
          type = 'verb';
        } else if (progress.wordType === 'adjective') {
          word = adjectives.find(a => a.id === id);
          type = 'adjective';
        } else if (progress.wordType === 'adverb') {
          word = adverbs.find(a => a.id === id);
          type = 'adverb';
        }

        if (word) {
          items.push({
            id,
            spanish: word.spanish,
            english: word.english,
            type,
            correctCount: progress.correctCount,
            incorrectCount: progress.incorrectCount,
            accuracy: Math.round(accuracy),
            status: progress.status,
            nextReview: progress.nextReview,
            interval: progress.interval,
            easeFactor: progress.easeFactor,
          });
        }
      }
    });

    // Sort: due items first (by how overdue), then by accuracy (lowest first)
    return items.sort((a, b) => {
      const aDue = new Date(a.nextReview) <= now;
      const bDue = new Date(b.nextReview) <= now;
      if (aDue && !bDue) return -1;
      if (!aDue && bDue) return 1;
      if (aDue && bDue) {
        // Both due: more overdue first
        return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
      }
      return a.accuracy - b.accuracy;
    });
  }, [flashcardProgress, getReviewQueueStats]);

  const currentItem = itemsToReview[currentIndex];

  const handleCorrect = () => {
    if (currentItem) {
      updateFlashcardProgress(currentItem.id, currentItem.type, true);
      earnXP('flashcard_review', undefined, { cardId: currentItem.id });
      recordSkill('vocabulary', true);
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    }
    nextItem();
  };

  const handleIncorrect = () => {
    if (currentItem) {
      updateFlashcardProgress(currentItem.id, currentItem.type, false);
      earnXP('flashcard_review', undefined, { cardId: currentItem.id });
      recordSkill('vocabulary', false);
      setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
    nextItem();
  };

  const nextItem = () => {
    setShowAnswer(false);
    if (currentIndex < itemsToReview.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setReviewMode('overview');
      setCurrentIndex(0);
      setSessionStats({ correct: 0, incorrect: 0 });
    }
  };

  const startPractice = () => {
    setReviewMode('practice');
    setCurrentIndex(0);
    setShowAnswer(false);
    setSessionStats({ correct: 0, incorrect: 0 });
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBg = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (accuracy >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  if (reviewMode === 'practice' && currentItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Review Practice
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentIndex + 1} of {itemsToReview.length} words
            </p>
          </div>
          <Button variant="ghost" onClick={() => setReviewMode('overview')}>
            Exit Practice
          </Button>
        </div>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Progress</span>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">Correct: {sessionStats.correct}</span>
                <span className="text-red-600">Incorrect: {sessionStats.incorrect}</span>
              </div>
            </div>
            <ProgressBar value={currentIndex + 1} max={itemsToReview.length} color="primary" />
          </CardContent>
        </Card>

        <Card className="py-12">
          <CardContent className="text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
              currentItem.type === 'noun' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              currentItem.type === 'verb' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
              currentItem.type === 'adjective' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
            }`}>
              {currentItem.type}
            </span>

            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {currentItem.spanish}
            </h2>

            <button
              onClick={() => speak(currentItem.spanish)}
              className="text-primary-500 hover:text-primary-600 mb-6"
            >
              <Volume2 className="w-6 h-6 mx-auto" />
            </button>

            {showAnswer ? (
              <>
                <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">
                  {currentItem.english}
                </p>

                <p className="text-sm text-gray-500 mb-6">
                  Previous accuracy: <span className={getAccuracyColor(currentItem.accuracy)}>{currentItem.accuracy}%</span>
                </p>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleIncorrect}
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Still Learning
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleCorrect}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Got It!
                  </Button>
                </div>
              </>
            ) : (
              <Button size="lg" onClick={() => setShowAnswer(true)}>
                Show Answer
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Repaso / Review
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Practice words that need more attention
        </p>
      </div>


      {itemsToReview.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              All Caught Up!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have any words that need review right now. Practice more flashcards to build your vocabulary!
            </p>
            <Button onClick={() => window.location.href = '/flashcards'}>
              Go to Flashcards
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* SM-2 Queue Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-orange-400">
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-orange-500">{queueStats.learning}</p>
                <p className="text-sm text-gray-500">Learning</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-400">
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-blue-500">{queueStats.review}</p>
                <p className="text-sm text-gray-500">Review</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-400">
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-green-500">{queueStats.mastered}</p>
                <p className="text-sm text-gray-500">Mastered</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-primary-400">
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-primary-500">{queueStats.dueNow}</p>
                <p className="text-sm text-gray-500">Due Now</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Words Needing Review</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {itemsToReview.length}
                  </p>
                </div>
                <Button onClick={startPractice} size="lg">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Start Review
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <CardTitle className="mb-4">Words to Review</CardTitle>
              <div className="space-y-3">
                {itemsToReview.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                        item.type === 'noun' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        item.type === 'verb' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        item.type === 'adjective' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {item.type}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.spanish}</p>
                        <p className="text-sm text-gray-500">{item.english}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'learning' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                        item.status === 'review' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        item.status === 'mastered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {item.status}
                      </span>
                      <div>
                        <div className={`text-lg font-bold ${getAccuracyColor(item.accuracy)}`}>
                          {item.accuracy}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.correctCount}✓ / {item.incorrectCount}✗
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {itemsToReview.length > 10 && (
                  <p className="text-center text-sm text-gray-500">
                    And {itemsToReview.length - 10} more words...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <CardTitle className="mb-4">
                <TrendingUp className="w-5 h-5 inline mr-2" />
                Tips for Better Retention
              </CardTitle>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Review words daily for best results</li>
                <li>• Say the words out loud when practicing</li>
                <li>• Create sentences using difficult words</li>
                <li>• Associate words with images or memories</li>
                <li>• Practice in short, frequent sessions</li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
