'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Timer, Volume2, ChevronRight, RotateCcw, Zap, Trophy, Brain, Check, X } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { quickResponses, responseCategories, QuickResponse } from '@/data/quick-responses';
import { speak } from '@/lib/speech';
import { useGamification } from '@/context/GamificationContext';

type DrillState = 'ready' | 'thinking' | 'reveal' | 'complete';
type TimeLimit = 3 | 5 | 7;

export default function QuickResponsePage() {
  const { earnXP, recordSkill } = useGamification();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentDrill, setCurrentDrill] = useState<QuickResponse | null>(null);
  const [drillState, setDrillState] = useState<DrillState>('ready');
  const [timeLimit, setTimeLimit] = useState<TimeLimit>(5);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });
  const [userKnew, setUserKnew] = useState<boolean | null>(null);
  const [usedDrills, setUsedDrills] = useState<Set<string>>(new Set());

  const filteredDrills = useMemo(() => {
    if (!selectedCategory) return quickResponses;
    return quickResponses.filter(d => d.category === selectedCategory);
  }, [selectedCategory]);

  const availableDrills = useMemo(() => {
    return filteredDrills.filter(d => !usedDrills.has(d.id));
  }, [filteredDrills, usedDrills]);

  const getRandomDrill = useCallback(() => {
    const drills = availableDrills.length > 0 ? availableDrills : filteredDrills;
    if (drills.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * drills.length);
    return drills[randomIndex];
  }, [availableDrills, filteredDrills]);

  const startDrill = useCallback(() => {
    const drill = getRandomDrill();
    if (!drill) return;

    setCurrentDrill(drill);
    setDrillState('thinking');
    setTimeRemaining(timeLimit);
    setUserKnew(null);
    setUsedDrills(prev => new Set(prev).add(drill.id));
  }, [getRandomDrill, timeLimit]);

  // Timer effect
  useEffect(() => {
    if (drillState !== 'thinking') return;

    if (timeRemaining <= 0) {
      setDrillState('reveal');
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [drillState, timeRemaining]);

  const handleKnewIt = (knew: boolean) => {
    setUserKnew(knew);
    setScore(prev => ({
      correct: prev.correct + (knew ? 1 : 0),
      attempted: prev.attempted + 1
    }));
    earnXP('exercise_complete');
    recordSkill('vocabulary', knew);
  };

  const nextDrill = () => {
    startDrill();
  };

  const resetSession = () => {
    setDrillState('ready');
    setCurrentDrill(null);
    setScore({ correct: 0, attempted: 0 });
    setUsedDrills(new Set());
    setUserKnew(null);
  };

  const getCategoryInfo = (categoryId: string) => {
    return responseCategories.find(c => c.id === categoryId);
  };

  const percentage = score.attempted > 0
    ? Math.round((score.correct / score.attempted) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Respuestas Rápidas / Quick Response Drills
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Build automaticity by reacting instantly to situations
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setSelectedCategory(null); resetSession(); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {responseCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); resetSession(); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Ready State */}
      {drillState === 'ready' && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">⚡</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Train Your Brain to React Fast
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You'll see a situation and have {timeLimit} seconds to think of what you'd say in Spanish.
              Don't overthink - trust your instincts!
            </p>

            {/* Time Limit Selector */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm text-gray-600 dark:text-gray-400">Time per drill:</span>
              {([3, 5, 7] as TimeLimit[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTimeLimit(t)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeLimit === t
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {t}s
                </button>
              ))}
            </div>

            <Button onClick={startDrill} className="text-lg px-8 py-3">
              <Zap className="w-5 h-5 mr-2" />
              Start Drill
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              {filteredDrills.length} scenarios available
              {selectedCategory && ` in ${getCategoryInfo(selectedCategory)?.label}`}
            </p>
          </div>
        </div>
      )}

      {/* Thinking State */}
      {drillState === 'thinking' && currentDrill && (
        <div className="space-y-6">
          {/* Timer Bar */}
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-1000 ease-linear rounded-full ${
                timeRemaining <= 2 ? 'bg-red-500' : timeRemaining <= 3 ? 'bg-yellow-500' : 'bg-primary-500'
              }`}
              style={{ width: `${(timeRemaining / timeLimit) * 100}%` }}
            />
          </div>

          {/* Main Drill Card */}
          <Card>
            <CardContent className="text-center py-8">
              {/* Category Badge */}
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 mb-4`}>
                {getCategoryInfo(currentDrill.category)?.icon}
                {getCategoryInfo(currentDrill.category)?.label}
              </span>

              {/* Timer */}
              <div className={`text-5xl font-bold mb-6 ${
                timeRemaining <= 2 ? 'text-red-500 animate-pulse' : 'text-primary-500'
              }`}>
                {timeRemaining}
              </div>

              {/* Situation */}
              <div className="max-w-lg mx-auto">
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentDrill.situation}
                </p>
                <p className="text-lg text-primary-500 font-medium">
                  {currentDrill.situationSpanish}
                </p>
              </div>

              {/* Thinking prompt */}
              <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <Brain className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                  ¿Qué dirías? / What would you say?
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  Say it out loud in Spanish!
                </p>
              </div>

              {/* Skip button */}
              <button
                onClick={() => setDrillState('reveal')}
                className="mt-6 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Skip to answer →
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reveal State */}
      {drillState === 'reveal' && currentDrill && (
        <div className="space-y-6">
          {/* Score Bar */}
          {score.attempted > 0 && (
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <Check className="w-4 h-4" />
                {score.correct} knew it
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 dark:text-gray-400">
                {score.attempted} attempted
              </span>
              <span className="text-gray-400">|</span>
              <span className={`font-medium ${percentage >= 70 ? 'text-green-600' : percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                {percentage}%
              </span>
            </div>
          )}

          {/* Main Reveal Card */}
          <Card>
            <CardContent className="py-8">
              {/* Category Badge */}
              <div className="text-center mb-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300`}>
                  {getCategoryInfo(currentDrill.category)?.icon}
                  {getCategoryInfo(currentDrill.category)?.label}
                </span>
              </div>

              {/* Situation Recap */}
              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {currentDrill.situation}
                </p>
                <p className="text-primary-500 font-medium">
                  {currentDrill.situationSpanish}
                </p>
              </div>

              {/* Expected Responses */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-4 text-center">
                  ✅ Good responses:
                </p>
                <div className="space-y-3">
                  {currentDrill.expectedResponses.map((response, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg"
                    >
                      <button
                        onClick={() => speak(response.spanish)}
                        className="flex-shrink-0 p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <div className="flex-grow">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {response.spanish}
                          {response.formal && (
                            <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                              formal
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {response.english}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {currentDrill.tip && (
                  <p className="mt-4 text-sm text-green-700 dark:text-green-400 text-center italic">
                    💡 {currentDrill.tip}
                  </p>
                )}
              </div>

              {/* Self-Assessment */}
              {userKnew === null ? (
                <div className="text-center">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Did you think of something similar?
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={() => handleKnewIt(true)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Yes, I knew it!
                    </Button>
                    <Button
                      onClick={() => handleKnewIt(false)}
                      variant="secondary"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Not quite
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    userKnew
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  }`}>
                    {userKnew ? (
                      <>
                        <Trophy className="w-5 h-5" />
                        <span className="font-medium">¡Muy bien!</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        <span className="font-medium">Now you know!</span>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                    <Button onClick={nextDrill}>
                      <ChevronRight className="w-4 h-4 mr-1" />
                      Next Drill
                    </Button>
                    <Button variant="secondary" onClick={resetSession}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Start Over
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress */}
          {availableDrills.length === 0 && (
            <Card>
              <CardContent className="text-center py-6">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <CardTitle>You've completed all drills!</CardTitle>
                <CardDescription>
                  Click "Start Over" to practice again
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tips Card */}
      {drillState === 'ready' && (
        <Card>
          <CardContent>
            <CardTitle className="text-lg mb-3">🧠 Why Quick Response Drills?</CardTitle>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Build Automaticity
                </p>
                <p>
                  When you practice responding quickly, phrases become automatic - no translation needed.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Reduce "Blank Mind"
                </p>
                <p>
                  Timed practice creates mild pressure, helping you stay calm in real conversations.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Trust Your Instincts
                </p>
                <p>
                  You know more than you think! These drills help you access what you've learned faster.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Real Situations
                </p>
                <p>
                  Practice the exact scenarios you'll encounter in real Spanish conversations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
