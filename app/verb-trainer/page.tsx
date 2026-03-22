'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Volume2,
  Check,
  X,
  ChevronRight,
  RotateCcw,
  Trophy,
  Lightbulb,
  Eye,
  EyeOff,
  Flame,
  BookOpen,
  Zap,
  Brain,
} from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  verbContextGroups,
  getAllSentences,
  tenseLabels,
  VerbSentence,
  Tense,
  VerbContextGroup,
} from '@/data/verb-trainer';
import { speak } from '@/lib/speech';
import { useGamification } from '@/context/GamificationContext';

type Mode = 'select' | 'learn' | 'drill' | 'results';
type DrillType = 'fill-blank' | 'all-verbs' | 'single-verb';

interface DrillResult {
  sentence: VerbSentence;
  userAnswer: string;
  correct: boolean;
}

export default function VerbTrainerPage() {
  const { earnXP, recordSkill } = useGamification();
  const [mode, setMode] = useState<Mode>('select');
  const [drillType, setDrillType] = useState<DrillType>('fill-blank');
  const [selectedVerb, setSelectedVerb] = useState<VerbContextGroup | null>(null);
  const [selectedTense, setSelectedTense] = useState<Tense | 'all'>('present');

  // Drill state
  const [sentences, setSentences] = useState<VerbSentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<DrillResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showTip, setShowTip] = useState(false);

  // Generate drill sentences
  const startDrill = useCallback((type: DrillType, verb?: VerbContextGroup, tense?: Tense | 'all') => {
    let pool: VerbSentence[] = [];

    if (type === 'single-verb' && verb) {
      pool = verb.sentences;
      if (tense && tense !== 'all') {
        const filtered = pool.filter(s => s.tense === tense);
        pool = filtered.length > 0 ? filtered : pool;
      }
    } else {
      pool = getAllSentences();
      if (tense && tense !== 'all') {
        const filtered = pool.filter(s => s.tense === tense);
        pool = filtered.length > 0 ? filtered : pool;
      }
    }

    // Shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    // Take up to 15 for a session
    const selected = shuffled.slice(0, Math.min(15, shuffled.length));

    setSentences(selected);
    setCurrentIndex(0);
    setUserInput('');
    setShowAnswer(false);
    setResults([]);
    setStreak(0);
    setBestStreak(0);
    setShowHint(false);
    setShowTip(false);
    setMode('drill');
    setDrillType(type);
  }, []);

  const currentSentence = sentences[currentIndex];

  const checkAnswer = () => {
    if (!currentSentence) return;

    const correct = userInput.trim().toLowerCase() === currentSentence.answer.toLowerCase();

    const result: DrillResult = {
      sentence: currentSentence,
      userAnswer: userInput.trim(),
      correct,
    };

    setResults(prev => [...prev, result]);
    setShowAnswer(true);

    // Track skill and award XP per answer
    recordSkill('conjugation', correct);
    earnXP('verb_trainer', undefined, { verbId: currentSentence.verbId, correct });

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const nextSentence = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setShowAnswer(false);
      setShowHint(false);
      setShowTip(false);
    } else {
      setMode('results');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showAnswer) {
        nextSentence();
      } else if (userInput.trim()) {
        checkAnswer();
      }
    }
  };

  const correctCount = results.filter(r => r.correct).length;
  const percentage = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  const getVerbGroupForSentence = (s: VerbSentence) => {
    return verbContextGroups.find(g => g.verbId === s.verbId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Entrenador de Verbos / Verb Trainer
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Learn verbs through real sentences, not just tables
        </p>
      </div>

      {/* Selection Mode */}
      {mode === 'select' && (
        <div className="space-y-8">
          {/* Quick Start Options */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              hover
              className="cursor-pointer border-2 border-green-200 dark:border-green-800"
              onClick={() => startDrill('all-verbs', undefined, 'present')}
            >
              <CardContent className="text-center py-6">
                <div className="inline-flex p-3 rounded-xl bg-green-100 dark:bg-green-900/30 mb-3">
                  <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Quick Drill</CardTitle>
                <CardDescription>
                  Random verbs, present tense. Jump right in!
                </CardDescription>
              </CardContent>
            </Card>

            <Card
              hover
              className="cursor-pointer border-2 border-blue-200 dark:border-blue-800"
              onClick={() => startDrill('all-verbs', undefined, 'all')}
            >
              <CardContent className="text-center py-6">
                <div className="inline-flex p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 mb-3">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Mixed Tenses</CardTitle>
                <CardDescription>
                  All verbs, all tenses. A real challenge!
                </CardDescription>
              </CardContent>
            </Card>

            <Card
              hover
              className="cursor-pointer border-2 border-purple-200 dark:border-purple-800"
              onClick={() => {/* scroll to verb list below */}}
            >
              <CardContent className="text-center py-6">
                <div className="inline-flex p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 mb-3">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Pick a Verb</CardTitle>
                <CardDescription>
                  Focus on one verb at a time. See below.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Tense Filter for general drill */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Drill by Tense
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(tenseLabels) as Tense[]).map(tense => (
                <button
                  key={tense}
                  onClick={() => startDrill('all-verbs', undefined, tense)}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left"
                >
                  <p className="font-bold text-gray-900 dark:text-white">
                    {tenseLabels[tense].spanish}
                  </p>
                  <p className="text-sm text-primary-500">{tenseLabels[tense].english}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {tenseLabels[tense].description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Individual Verb Cards */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Focus on One Verb
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {verbContextGroups.map(group => (
                <button
                  key={group.verbId}
                  onClick={() => {
                    setSelectedVerb(group);
                    startDrill('single-verb', group, 'all');
                  }}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-500">
                      {group.infinitive}
                    </p>
                    <span className="text-xs text-gray-400">{group.sentences.length} sentences</span>
                  </div>
                  <p className="text-sm text-primary-500">{group.english}</p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{group.tip}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Drill Mode */}
      {mode === 'drill' && currentSentence && (
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentIndex + 1} / {sentences.length}
              </span>
              {streak >= 3 && (
                <span className="flex items-center gap-1 text-orange-500 text-sm font-medium">
                  <Flame className="w-4 h-4" /> {streak} streak!
                </span>
              )}
            </div>
            <button
              onClick={() => setMode('select')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${(currentIndex / sentences.length) * 100}%` }}
            />
          </div>

          {/* Main Drill Card */}
          <Card>
            <CardContent className="py-8">
              {/* Verb Info */}
              {(() => {
                const group = getVerbGroupForSentence(currentSentence);
                return group ? (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium">
                        {group.infinitive} — {group.english}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                        {tenseLabels[currentSentence.tense].spanish}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowTip(!showTip)}
                      className="text-xs text-gray-500 hover:text-primary-500 flex items-center gap-1"
                    >
                      <Lightbulb className="w-3 h-3" />
                      Tip
                    </button>
                  </div>
                ) : null;
              })()}

              {/* Tip */}
              {showTip && (() => {
                const group = getVerbGroupForSentence(currentSentence);
                return group ? (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-300">
                    💡 {group.tip}
                  </div>
                ) : null;
              })()}

              {/* Sentence with Blank */}
              <div className="text-center mb-6">
                <p className="text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
                  {currentSentence.template.split('___').map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="inline-block mx-1 border-b-4 border-primary-500 min-w-[100px]">
                          {showAnswer ? (
                            <span className={results[results.length - 1]?.correct ? 'text-green-600' : 'text-red-500'}>
                              {currentSentence.answer}
                            </span>
                          ) : (
                            <span className="text-primary-300">{'     '}</span>
                          )}
                        </span>
                      )}
                    </span>
                  ))}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-3">
                  {currentSentence.english}
                </p>
              </div>

              {/* Hint */}
              {currentSentence.hint && !showAnswer && (
                <div className="text-center mb-4">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-sm text-gray-500 hover:text-primary-500 flex items-center gap-1 mx-auto"
                  >
                    {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showHint ? 'Hide hint' : 'Show hint'}
                  </button>
                  {showHint && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 italic">
                      {currentSentence.hint}
                    </p>
                  )}
                </div>
              )}

              {/* Input */}
              {!showAnswer ? (
                <div className="max-w-sm mx-auto">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type the conjugated verb..."
                    autoFocus
                    className="w-full px-4 py-3 text-center text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={checkAnswer}
                      disabled={!userInput.trim()}
                      className="flex-1"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Check
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => { setUserInput(''); setShowAnswer(true); setStreak(0); setResults(prev => [...prev, { sentence: currentSentence, userAnswer: '', correct: false }]); }}
                    >
                      Show Answer
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Press Enter to check
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  {/* Result Feedback */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                    results[results.length - 1]?.correct
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {results[results.length - 1]?.correct ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span className="font-medium">¡Correcto!</span>
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5" />
                        <span className="font-medium">
                          The answer is: <strong>{currentSentence.answer}</strong>
                        </span>
                      </>
                    )}
                  </div>

                  {/* User's wrong answer */}
                  {!results[results.length - 1]?.correct && results[results.length - 1]?.userAnswer && (
                    <p className="text-sm text-gray-500 mb-4">
                      You wrote: <span className="line-through text-red-400">{results[results.length - 1]?.userAnswer}</span>
                    </p>
                  )}

                  {/* Listen Button */}
                  <div className="mb-4">
                    <button
                      onClick={() => speak(currentSentence.template.replace('___', currentSentence.answer))}
                      className="inline-flex items-center gap-2 px-4 py-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    >
                      <Volume2 className="w-5 h-5" />
                      Listen to the full sentence
                    </button>
                  </div>

                  <Button onClick={nextSentence}>
                    {currentIndex < sentences.length - 1 ? (
                      <>
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        See Results <Trophy className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    Press Enter to continue
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Mode */}
      {mode === 'results' && (
        <div className="space-y-6">
          {/* Score Card */}
          <Card>
            <CardContent className="text-center py-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                percentage >= 80 ? 'bg-green-100 dark:bg-green-900/30' :
                percentage >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                'bg-red-100 dark:bg-red-900/30'
              }`}>
                <Trophy className={`w-10 h-10 ${
                  percentage >= 80 ? 'text-green-600' :
                  percentage >= 50 ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {percentage >= 80 ? '¡Excelente!' : percentage >= 50 ? '¡Buen trabajo!' : '¡Sigue practicando!'}
              </h2>

              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto my-6">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-2xl font-bold text-green-500">{correctCount}</div>
                  <div className="text-xs text-gray-500">Correct</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-2xl font-bold text-primary-500">{percentage}%</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-2xl font-bold text-orange-500">{bestStreak}</div>
                  <div className="text-xs text-gray-500">Best Streak</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => startDrill(drillType, selectedVerb ?? undefined, selectedTense)}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="secondary" onClick={() => setMode('select')}>
                  Choose Different Verbs
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Review Missed */}
          {results.filter(r => !r.correct).length > 0 && (
            <Card>
              <CardContent>
                <CardTitle className="text-lg mb-4">📝 Review What You Missed</CardTitle>
                <div className="space-y-3">
                  {results.filter(r => !r.correct).map((result, i) => {
                    const group = getVerbGroupForSentence(result.sentence);
                    return (
                      <div key={i} className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-primary-500">
                            {group?.infinitive} ({group?.english})
                          </span>
                          <button
                            onClick={() => speak(result.sentence.template.replace('___', result.sentence.answer))}
                            className="p-1 text-gray-400 hover:text-primary-500"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-900 dark:text-white">
                          {result.sentence.template.replace('___', '')}
                          <strong className="text-green-600">{result.sentence.answer}</strong>
                          {result.sentence.template.split('___')[1]}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{result.sentence.english}</p>
                        {result.userAnswer && (
                          <p className="text-sm text-red-500 mt-1">
                            Your answer: <span className="line-through">{result.userAnswer}</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Correct */}
          {results.filter(r => r.correct).length > 0 && (
            <Card>
              <CardContent>
                <CardTitle className="text-lg mb-4">✅ You Got These Right!</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {results.filter(r => r.correct).map((result, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm"
                    >
                      {result.sentence.answer}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
