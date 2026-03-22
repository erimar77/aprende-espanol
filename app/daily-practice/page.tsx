'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Sun,
  MessageCircle,
  Zap,
  ArrowRight,
  CheckCircle,
  Eye,
  RotateCcw,
  Award,
  Flame,
  Star,
  Bell,
  BellOff,
  Clock,
  ChevronRight,
  Volume2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGamification } from '@/context/GamificationContext';
import {
  getDailyChallenge,
  getDailyPhrases,
  getQuickFireSet,
  type MicroChallenge,
  type PhraseCard,
  type QuickFirePrompt,
} from '@/data/daily-phrases';
import { speak } from '@/lib/speech';

// ── Types ────────────────────────────────────────────────────────────────

type Stage = 'intro' | 'challenge' | 'phrases' | 'quickfire' | 'complete';

// ── Notification Helper ──────────────────────────────────────────────────

function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [reminderEnabled, setReminderEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
    const saved = localStorage.getItem('spanish_daily_reminder');
    if (saved === 'true') setReminderEnabled(true);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      setReminderEnabled(true);
      localStorage.setItem('spanish_daily_reminder', 'true');
      // Show confirmation
      new Notification('¡Perfecto! 🇪🇸', {
        body: "You'll get a daily reminder to practice Spanish.",
        icon: '/favicon.ico',
      });
    }
  }, []);

  const toggleReminder = useCallback(() => {
    if (reminderEnabled) {
      setReminderEnabled(false);
      localStorage.setItem('spanish_daily_reminder', 'false');
    } else if (permission === 'granted') {
      setReminderEnabled(true);
      localStorage.setItem('spanish_daily_reminder', 'true');
    } else {
      requestPermission();
    }
  }, [reminderEnabled, permission, requestPermission]);

  return { permission, reminderEnabled, toggleReminder };
}

// ── Schedule notification check (runs daily) ─────────────────────────────

function useDailyNotificationCheck(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const checkAndNotify = () => {
      const lastPractice = localStorage.getItem('spanish_last_daily_practice');
      const today = new Date().toISOString().slice(0, 10);
      if (lastPractice !== today) {
        // Haven't practiced today — show notification
        const hour = new Date().getHours();
        if (hour >= 9 && hour <= 21) {
          new Notification('¡Hora de practicar! 🇪🇸', {
            body: 'Your daily Spanish practice is waiting. Just 5 minutes!',
            icon: '/favicon.ico',
            tag: 'daily-spanish-reminder',
          });
        }
      }
    };

    // Check every 2 hours
    const interval = setInterval(checkAndNotify, 2 * 60 * 60 * 1000);
    // Also check once on mount (after a small delay)
    const timeout = setTimeout(checkAndNotify, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [enabled]);
}

// ── Stage 1: Micro-Challenge ─────────────────────────────────────────────

function ChallengeStage({
  challenge,
  onNext,
}: {
  challenge: MicroChallenge;
  onNext: () => void;
}) {
  const [userResponse, setUserResponse] = useState('');
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">1</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Warm-up Challenge</h2>
        <span className="text-xs text-gray-400 ml-auto">~2 min</span>
      </div>

      {/* Situation */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 dark:from-accent/20 dark:to-primary/20 rounded-lg p-4 border border-accent/20">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Situation</p>
        <p className="text-gray-800 dark:text-gray-200">{challenge.situation}</p>
      </div>

      {/* Prompt */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white mb-1">{challenge.prompt}</p>
        {challenge.keyPhrases && (
          <p className="text-xs text-gray-400 mt-2">
            Try to use: {challenge.keyPhrases.map((p, i) => (
              <span key={i} className="inline-block bg-primary/10 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded text-xs ml-1">{p}</span>
            ))}
          </p>
        )}
      </div>

      {/* User response */}
      <div>
        <textarea
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          disabled={revealed}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
          rows={3}
          placeholder="Write your response in Spanish..."
        />
      </div>

      {/* Reveal / Model answer */}
      {!revealed ? (
        <Button onClick={() => setRevealed(true)} disabled={!userResponse.trim()}>
          <Eye className="w-4 h-4 mr-2" />
          See Model Answer
        </Button>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Model Answer</p>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-gray-900 dark:text-white font-medium text-lg">{challenge.modelAnswer}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">{challenge.modelTranslation}</p>
              </div>
              <button
                onClick={() => speak(challenge.modelAnswer)}
                aria-label="Play audio of model answer"
                className="flex-shrink-0 p-2 rounded-lg bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-green-600 dark:text-green-300" />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Compare your response with the model. Don't worry about matching it exactly — there are many ways to say the same thing!
          </p>

          <div className="flex justify-end">
            <Button onClick={onNext}>
              Next Stage <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stage 2: Phrase Drill ────────────────────────────────────────────────

function PhraseDrillStage({
  phrases: phraseDeck,
  onNext,
  onResult,
}: {
  phrases: PhraseCard[];
  onNext: () => void;
  onResult: (correct: number, total: number) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const current = phraseDeck[currentIdx];

  const handleKnew = (knew: boolean) => {
    const newResults = [...results, knew];
    setResults(newResults);
    setRevealed(false);

    if (currentIdx < phraseDeck.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      setDone(true);
      onResult(
        newResults.filter(Boolean).length,
        newResults.length
      );
    }
  };

  if (done) {
    const correct = results.filter(Boolean).length;
    return (
      <div className="space-y-4 text-center animate-fade-in">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Phrases Complete!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          You knew {correct} of {results.length} phrases
        </p>
        <div className="flex justify-center gap-1">
          {results.map((r, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${r ? 'bg-green-500' : 'bg-red-400'}`}
            />
          ))}
        </div>
        <Button onClick={onNext}>
          Next Stage <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-sm font-bold text-accent">2</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Phrase Drill</h2>
        <span className="text-xs text-gray-400 ml-auto">~3 min</span>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {phraseDeck.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full ${
              i < currentIdx
                ? results[i]
                  ? 'bg-green-500'
                  : 'bg-red-400'
                : i === currentIdx
                ? 'bg-primary'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center min-h-[200px] flex flex-col items-center justify-center">
        <p className="text-xs text-gray-400 mb-4">
          {current.category.replace('-', ' ')} · {current.level}
        </p>
        <p className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          {current.english}
        </p>

        {!revealed ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Try to say it in Spanish, then reveal</p>
            <Button onClick={() => setRevealed(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Reveal
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-3">
              <p className="text-2xl font-bold text-primary">{current.spanish}</p>
              <button
                onClick={() => speak(current.spanish)}
                aria-label="Play audio of phrase"
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-primary" />
              </button>
            </div>
            <p className="text-sm text-gray-500">Did you get it right?</p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => handleKnew(false)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Not quite
              </Button>
              <Button onClick={() => handleKnew(true)}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Knew it!
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stage 3: Quick Fire ──────────────────────────────────────────────────

function QuickFireStage({
  prompts,
  onComplete,
}: {
  prompts: QuickFirePrompt[];
  onComplete: (correct: number, total: number) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const current = prompts[currentIdx];

  const handleCheck = () => {
    const isCorrect =
      userInput.trim().toLowerCase().replace(/[¿¡?!.,]/g, '') ===
      current.spanish.toLowerCase().replace(/[¿¡?!.,]/g, '');
    setChecked(true);
    setResults((r) => [...r, isCorrect]);
  };

  const handleNext = () => {
    setUserInput('');
    setChecked(false);
    if (currentIdx < prompts.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      const finalResults = results;
      setDone(true);
      onComplete(finalResults.filter(Boolean).length, finalResults.length);
    }
  };

  if (done) {
    const correct = results.filter(Boolean).length;
    return (
      <div className="space-y-4 text-center animate-fade-in">
        <Zap className="w-12 h-12 text-yellow-500 mx-auto" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Fire Complete!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {correct} of {results.length} correct
        </p>
        <div className="flex justify-center gap-1">
          {results.map((r, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${r ? 'bg-green-500' : 'bg-red-400'}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
          <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">3</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Fire</h2>
        <span className="text-xs text-gray-400 ml-auto">~2 min</span>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {prompts.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full ${
              i < currentIdx
                ? results[i]
                  ? 'bg-green-500'
                  : 'bg-red-400'
                : i === currentIdx
                ? 'bg-yellow-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Prompt */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-xs text-gray-400 mb-3">
          Translate to Spanish — {currentIdx + 1}/{prompts.length}
        </p>
        <p className="text-xl font-medium text-gray-900 dark:text-white mb-4">
          {current.english}
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={checked ? current.spanish : userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={checked}
            className={`flex-1 px-4 py-2 border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
              checked
                ? results[results.length - 1]
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                  : 'border-red-400 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            }`}
            placeholder="Type in Spanish..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (checked) handleNext();
                else if (userInput.trim()) handleCheck();
              }
            }}
            autoFocus
          />
          {!checked ? (
            <Button onClick={handleCheck} disabled={!userInput.trim()} size="sm">
              Check
            </Button>
          ) : (
            <Button onClick={handleNext} size="sm">
              Next
            </Button>
          )}
        </div>

        {checked && !results[results.length - 1] && (
          <div className="mt-3 text-sm animate-fade-in">
            <span className="text-gray-500">Correct: </span>
            <span className="font-medium text-primary">{current.spanish}</span>
            <button
              onClick={() => speak(current.spanish)}
              aria-label="Play audio of correct translation"
              className="ml-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex"
            >
              <Volume2 className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Completion Screen ────────────────────────────────────────────────────

function CompletionScreen({
  xpEarned,
  phraseScore,
  quickFireScore,
  streak,
  onRestart,
}: {
  xpEarned: number;
  phraseScore: { correct: number; total: number };
  quickFireScore: { correct: number; total: number };
  streak: number;
  onRestart: () => void;
}) {
  const totalCorrect = phraseScore.correct + quickFireScore.correct;
  const totalQuestions = phraseScore.total + quickFireScore.total;

  return (
    <div className="space-y-6 text-center">
      <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-8 text-white">
        <Award className="w-16 h-16 mx-auto mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-2">¡Práctica completa!</h2>
        <p className="opacity-90">Great job finishing today's practice!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <Star className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">+{xpEarned}</div>
          <div className="text-xs text-gray-500">XP earned</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-500">accuracy</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{streak}</div>
          <div className="text-xs text-gray-500">day streak</div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-left">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Phrase Drill</span>
            <span className="font-medium text-gray-900 dark:text-white">{phraseScore.correct}/{phraseScore.total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Quick Fire</span>
            <span className="font-medium text-gray-900 dark:text-white">{quickFireScore.correct}/{quickFireScore.total}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Practice Again
        </Button>
        <Link href="/dashboard">
          <Button>
            View Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────

export default function DailyPracticePage() {
  const [stage, setStage] = useState<Stage>('intro');
  const { earnXP, recordSkill, state } = useGamification();
  const { permission, reminderEnabled, toggleReminder } = useNotifications();

  const [xpEarned, setXpEarned] = useState(0);
  const [phraseScore, setPhraseScore] = useState({ correct: 0, total: 0 });
  const [quickFireScore, setQuickFireScore] = useState({ correct: 0, total: 0 });

  // Generate today's content
  const challenge = useMemo(() => getDailyChallenge('A2'), []);
  const phraseDeck = useMemo(() => getDailyPhrases(6), []);
  const quickFireSet = useMemo(() => getQuickFireSet(8, 'A2'), []);

  // Notification check
  useDailyNotificationCheck(reminderEnabled);

  // Has practiced today?
  const [practicedToday, setPracticedToday] = useState(false);
  useEffect(() => {
    const last = localStorage.getItem('spanish_last_daily_practice');
    const today = new Date().toISOString().slice(0, 10);
    if (last === today) setPracticedToday(true);
  }, []);

  const handleChallengeComplete = () => {
    const result = earnXP('exercise_complete', 20, { type: 'daily-challenge' });
    setXpEarned((x) => x + 20);
    recordSkill('conversation', true);
    setStage('phrases');
  };

  const handlePhrasesComplete = (correct: number, total: number) => {
    setPhraseScore({ correct, total });
    const xp = correct * 5;
    earnXP('flashcard_review', xp, { type: 'daily-phrases', correct, total });
    setXpEarned((x) => x + xp);
    for (let i = 0; i < total; i++) {
      recordSkill('vocabulary', i < correct);
    }
    setStage('quickfire');
  };

  const handleQuickFireComplete = (correct: number, total: number) => {
    setQuickFireScore({ correct, total });
    const xp = 15 + correct * 3;
    earnXP('exercise_complete', xp, { type: 'daily-quickfire', correct, total });
    setXpEarned((x) => x + xp);
    for (let i = 0; i < total; i++) {
      recordSkill('translation', i < correct);
    }
    // Mark today as practiced
    localStorage.setItem('spanish_last_daily_practice', new Date().toISOString().slice(0, 10));
    setPracticedToday(true);
    setStage('complete');
  };

  const handleRestart = () => {
    setStage('intro');
    setXpEarned(0);
    setPhraseScore({ correct: 0, total: 0 });
    setQuickFireScore({ correct: 0, total: 0 });
  };

  // ── Intro Screen ────────────────────────────────────────────────────

  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-xl mx-auto px-4">
          <div className="space-y-6">
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-8 text-white text-center">
              <Sun className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h1 className="text-2xl font-bold mb-2">Daily Practice</h1>
              <p className="opacity-90">5-10 minutes to build your Spanish</p>
            </div>

            {practicedToday && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  You already practiced today! Want to go again?
                </p>
              </div>
            )}

            {/* Three stages preview */}
            <div className="space-y-3">
              {[
                {
                  num: 1,
                  icon: <MessageCircle className="w-5 h-5" />,
                  title: 'Warm-up Challenge',
                  desc: 'Respond to a real-life situation in Spanish',
                  time: '~2 min',
                  color: 'text-primary bg-primary/10',
                },
                {
                  num: 2,
                  icon: <RotateCcw className="w-5 h-5" />,
                  title: 'Phrase Drill',
                  desc: 'Practice useful everyday phrases',
                  time: '~3 min',
                  color: 'text-accent bg-accent/10',
                },
                {
                  num: 3,
                  icon: <Zap className="w-5 h-5" />,
                  title: 'Quick Fire',
                  desc: 'Fast translation to build reflexes',
                  time: '~2 min',
                  color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
                },
              ].map((s) => (
                <div
                  key={s.num}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4"
                >
                  <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center flex-shrink-0`}>
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{s.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{s.time}</span>
                </div>
              ))}
            </div>

            {/* Start */}
            <Button
              onClick={() => setStage('challenge')}
              className="w-full"
              size="lg"
            >
              Start Practice
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>

            {/* Notification toggle */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                {reminderEnabled ? (
                  <Bell className="w-5 h-5 text-primary" aria-hidden="true" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" aria-hidden="true" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Daily Reminder</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {reminderEnabled
                      ? "You'll get a notification if you haven't practiced"
                      : 'Get reminded to practice each day'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleReminder}
                aria-label={reminderEnabled ? "Disable daily practice reminder" : "Enable daily practice reminder"}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  reminderEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    reminderEnabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            {/* Streak status */}
            {state.streak.current > 0 && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <Flame className="w-4 h-4 inline text-orange-500 mr-1" />
                {state.streak.current} day streak — keep it going!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Active stages ──────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-xl mx-auto px-4">
        {/* Stage progress bar */}
        <div className="flex gap-2 mb-6">
          {['challenge', 'phrases', 'quickfire'].map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full ${
                (stage === 'challenge' && i === 0) ||
                (stage === 'phrases' && i <= 1) ||
                (stage === 'quickfire' && i <= 2) ||
                stage === 'complete'
                  ? 'bg-primary'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {stage === 'challenge' && (
          <ChallengeStage challenge={challenge} onNext={handleChallengeComplete} />
        )}

        {stage === 'phrases' && (
          <PhraseDrillStage
            phrases={phraseDeck}
            onNext={() => setStage('quickfire')}
            onResult={handlePhrasesComplete}
          />
        )}

        {stage === 'quickfire' && (
          <QuickFireStage prompts={quickFireSet} onComplete={handleQuickFireComplete} />
        )}

        {stage === 'complete' && (
          <CompletionScreen
            xpEarned={xpEarned}
            phraseScore={phraseScore}
            quickFireScore={quickFireScore}
            streak={state.streak.current}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
