'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Timer,
  Volume2,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Brain,
  Zap,
  MessageSquare,
  Puzzle,
  Check,
  X,
  Clock,
  Flame,
} from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { quickResponses, QuickResponse } from '@/data/quick-responses';
import { thoughtPrompts, ThoughtPrompt } from '@/data/inner-monologue';
import { sentencePatterns, SentencePattern } from '@/data/sentence-patterns';
import { speak } from '@/lib/speech';
import { useGamification } from '@/context/GamificationContext';

type WorkshopDuration = 5 | 10 | 20;
type WorkshopState = 'select' | 'active' | 'paused' | 'complete';
type ActivityType = 'quick-response' | 'inner-monologue' | 'sentence-builder';

interface Activity {
  type: ActivityType;
  data: QuickResponse | ThoughtPrompt | SentencePattern;
}

// Estimated time per activity type (in seconds)
const ACTIVITY_TIMES = {
  'quick-response': 20, // 5s timer + reveal + self-assessment
  'inner-monologue': 45, // 30s thinking + review
  'sentence-builder': 35, // Building and reviewing
};

export default function WorkshopPage() {
  const { earnXP } = useGamification();
  const [duration, setDuration] = useState<WorkshopDuration>(10);
  const [workshopState, setWorkshopState] = useState<WorkshopState>('select');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityPhase, setActivityPhase] = useState<'prompt' | 'reveal'>('prompt');
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [score, setScore] = useState({ completed: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  // Generate a mixed set of activities for the workshop
  const generateActivities = useCallback((minutes: number) => {
    const totalSeconds = minutes * 60;
    const activities: Activity[] = [];
    let timeAllocated = 0;

    // Shuffle function
    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    // Get shuffled pools of each type
    const quickPool = shuffle(quickResponses);
    const thoughtPool = shuffle(thoughtPrompts);
    const sentencePool = shuffle(sentencePatterns);

    let quickIdx = 0, thoughtIdx = 0, sentenceIdx = 0;

    // Alternate between activity types to create variety
    const typeOrder: ActivityType[] = ['quick-response', 'sentence-builder', 'inner-monologue'];
    let typeIdx = 0;

    while (timeAllocated < totalSeconds - 15) { // Leave 15s buffer
      const type = typeOrder[typeIdx % typeOrder.length];
      typeIdx++;

      let activity: Activity | null = null;

      switch (type) {
        case 'quick-response':
          if (quickIdx < quickPool.length) {
            activity = { type, data: quickPool[quickIdx++] };
          }
          break;
        case 'inner-monologue':
          if (thoughtIdx < thoughtPool.length) {
            activity = { type, data: thoughtPool[thoughtIdx++] };
          }
          break;
        case 'sentence-builder':
          if (sentenceIdx < sentencePool.length) {
            activity = { type, data: sentencePool[sentenceIdx++] };
          }
          break;
      }

      if (activity) {
        activities.push(activity);
        timeAllocated += ACTIVITY_TIMES[type];
      }
    }

    return activities;
  }, []);

  // Start the workshop
  const startWorkshop = useCallback(() => {
    const acts = generateActivities(duration);
    setActivities(acts);
    setCurrentActivityIndex(0);
    setTimeRemaining(duration * 60);
    setWorkshopState('active');
    setActivityPhase('prompt');
    setPhaseTimer(getPhaseTime('prompt', acts[0]?.type));
    setScore({ completed: 0, total: acts.length });
    setStreak(0);
  }, [duration, generateActivities]);

  // Get phase time based on activity type
  function getPhaseTime(phase: 'prompt' | 'reveal', type?: ActivityType): number {
    if (!type) return 0;
    if (phase === 'prompt') {
      switch (type) {
        case 'quick-response': return 5;
        case 'inner-monologue': return 30;
        case 'sentence-builder': return 20;
      }
    }
    return 15; // reveal phase
  }

  // Main timer effect
  useEffect(() => {
    if (workshopState !== 'active') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setWorkshopState('complete');
          return 0;
        }
        return prev - 1;
      });

      setPhaseTimer(prev => {
        if (prev <= 1) {
          // Auto-advance to reveal phase
          if (activityPhase === 'prompt') {
            setActivityPhase('reveal');
            return 15;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [workshopState, activityPhase]);

  // Move to next activity
  const nextActivity = useCallback((knew: boolean) => {
    if (knew) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setScore(prev => ({
      ...prev,
      completed: prev.completed + 1,
    }));

    if (currentActivityIndex < activities.length - 1) {
      const nextIdx = currentActivityIndex + 1;
      setCurrentActivityIndex(nextIdx);
      setActivityPhase('prompt');
      setPhaseTimer(getPhaseTime('prompt', activities[nextIdx]?.type));
    } else {
      setWorkshopState('complete');
    }
  }, [currentActivityIndex, activities]);

  // Award XP when workshop completes
  useEffect(() => {
    if (workshopState === 'complete' && score.completed > 0 && activities.length > 0) {
      earnXP('lesson_complete', undefined, { type: 'workshop' });
    }
  }, [workshopState, score.completed, activities.length, earnXP]);

  // Skip to reveal
  const skipToReveal = () => {
    setActivityPhase('reveal');
    setPhaseTimer(15);
  };

  // Pause/Resume
  const togglePause = () => {
    setWorkshopState(prev => prev === 'active' ? 'paused' : 'active');
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentActivity = activities[currentActivityIndex];

  // Get activity icon
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'quick-response': return <Zap className="w-5 h-5" />;
      case 'inner-monologue': return <Brain className="w-5 h-5" />;
      case 'sentence-builder': return <Puzzle className="w-5 h-5" />;
    }
  };

  const getActivityLabel = (type: ActivityType) => {
    switch (type) {
      case 'quick-response': return 'Quick Response';
      case 'inner-monologue': return 'Inner Monologue';
      case 'sentence-builder': return 'Sentence Pattern';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Taller de Fluidez / Fluency Workshop
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Mixed practice session to challenge all your skills
        </p>
      </div>

      {/* Duration Selection */}
      {workshopState === 'select' && (
        <>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏋️</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              How much time do you have?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Choose your session length. You'll get a mix of quick responses,
              thinking exercises, and sentence building challenges.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {([5, 10, 20] as WorkshopDuration[]).map(mins => (
                <button
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    duration === mins
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className={`text-4xl font-bold ${
                    duration === mins ? 'text-primary-500' : 'text-gray-900 dark:text-white'
                  }`}>
                    {mins}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">minutes</div>
                  {duration === mins && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <Button onClick={startWorkshop} className="text-lg px-8 py-3">
              <Play className="w-5 h-5 mr-2" />
              Start {duration}-Minute Workshop
            </Button>

            {/* What's included */}
            <div className="mt-8 grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="font-medium text-yellow-700 dark:text-yellow-400">Quick Responses</p>
                <p className="text-yellow-600 dark:text-yellow-500 text-xs">Instant reactions</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <Brain className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="font-medium text-purple-700 dark:text-purple-400">Inner Monologue</p>
                <p className="text-purple-600 dark:text-purple-500 text-xs">Think in Spanish</p>
              </div>
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <Puzzle className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                <p className="font-medium text-primary-700 dark:text-primary-400">Sentence Patterns</p>
                <p className="text-primary-600 dark:text-primary-500 text-xs">Build fluency</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Active Workshop */}
      {(workshopState === 'active' || workshopState === 'paused') && currentActivity && (
        <div className="space-y-4">
          {/* Top Bar: Time + Progress */}
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                <span className={`text-2xl font-bold ${
                  timeRemaining < 60 ? 'text-red-500' : 'text-gray-900 dark:text-white'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              {streak >= 3 && (
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold">{streak} streak!</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentActivityIndex + 1} / {activities.length}
              </span>
              <Button
                variant="secondary"
                onClick={togglePause}
                className="!p-2"
              >
                {workshopState === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${((currentActivityIndex) / activities.length) * 100}%` }}
            />
          </div>

          {/* Paused Overlay */}
          {workshopState === 'paused' && (
            <Card>
              <CardContent className="text-center py-8">
                <Pause className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <CardTitle>Workshop Paused</CardTitle>
                <CardDescription className="mb-4">
                  Take a break. Click resume when you're ready to continue.
                </CardDescription>
                <Button onClick={togglePause}>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Activity Card */}
          {workshopState === 'active' && (
            <Card>
              <CardContent className="py-6">
                {/* Activity Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    currentActivity.type === 'quick-response'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      : currentActivity.type === 'inner-monologue'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                      : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  }`}>
                    {getActivityIcon(currentActivity.type)}
                    {getActivityLabel(currentActivity.type)}
                  </span>
                  <span className={`text-2xl font-bold ${
                    phaseTimer <= 3 ? 'text-red-500 animate-pulse' : 'text-gray-400'
                  }`}>
                    {phaseTimer}s
                  </span>
                </div>

                {/* Quick Response Activity */}
                {currentActivity.type === 'quick-response' && (
                  <QuickResponseActivity
                    data={currentActivity.data as QuickResponse}
                    phase={activityPhase}
                    onSkip={skipToReveal}
                    onNext={nextActivity}
                  />
                )}

                {/* Inner Monologue Activity */}
                {currentActivity.type === 'inner-monologue' && (
                  <InnerMonologueActivity
                    data={currentActivity.data as ThoughtPrompt}
                    phase={activityPhase}
                    onSkip={skipToReveal}
                    onNext={nextActivity}
                  />
                )}

                {/* Sentence Builder Activity */}
                {currentActivity.type === 'sentence-builder' && (
                  <SentenceBuilderActivity
                    data={currentActivity.data as SentencePattern}
                    phase={activityPhase}
                    onSkip={skipToReveal}
                    onNext={nextActivity}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Complete State */}
      {workshopState === 'complete' && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ¡Excelente trabajo! 🎉
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              You completed the {duration}-minute workshop!
            </p>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl font-bold text-primary-500">{score.completed}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Activities</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl font-bold text-green-500">{duration}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-3xl font-bold text-orange-500">{streak}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Best Streak</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={startWorkshop}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Do Another Workshop
              </Button>
              <Button
                variant="secondary"
                onClick={() => setWorkshopState('select')}
              >
                Change Duration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Quick Response Sub-component
function QuickResponseActivity({
  data,
  phase,
  onSkip,
  onNext,
}: {
  data: QuickResponse;
  phase: 'prompt' | 'reveal';
  onSkip: () => void;
  onNext: (knew: boolean) => void;
}) {
  if (phase === 'prompt') {
    return (
      <div className="text-center py-4">
        <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {data.situation}
        </p>
        <p className="text-lg text-primary-500 mb-6">
          {data.situationSpanish}
        </p>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl mb-4">
          <p className="font-medium text-yellow-800 dark:text-yellow-300">
            ¿Qué dirías? / What would you say?
          </p>
        </div>
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Show answer →
        </button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
        {data.situation}
      </p>
      <div className="space-y-2 mb-6">
        {data.expectedResponses.map((r, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <button
              onClick={() => speak(r.spanish)}
              className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{r.spanish}</p>
              <p className="text-sm text-gray-500">{r.english}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-3">
        <Button onClick={() => onNext(true)} className="bg-green-500 hover:bg-green-600">
          <Check className="w-4 h-4 mr-1" /> Got it!
        </Button>
        <Button variant="secondary" onClick={() => onNext(false)}>
          <X className="w-4 h-4 mr-1" /> Learning
        </Button>
      </div>
    </div>
  );
}

// Inner Monologue Sub-component
function InnerMonologueActivity({
  data,
  phase,
  onSkip,
  onNext,
}: {
  data: ThoughtPrompt;
  phase: 'prompt' | 'reveal';
  onSkip: () => void;
  onNext: (knew: boolean) => void;
}) {
  if (phase === 'prompt') {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500 mb-2">Imagine this situation:</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {data.situation}
        </p>
        <p className="text-lg text-primary-500 mb-6">
          {data.situationSpanish}
        </p>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl mb-4">
          <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="font-medium text-purple-800 dark:text-purple-300">
            Think out loud in Spanish for 30 seconds...
          </p>
        </div>
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Show helpers →
        </button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
        {data.situation}
      </p>
      <div className="space-y-2 mb-6">
        {data.starterThoughts.slice(0, 3).map((t, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <button
              onClick={() => speak(t.spanish)}
              className="p-2 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{t.spanish}</p>
              <p className="text-sm text-gray-500">{t.english}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-3">
        <Button onClick={() => onNext(true)} className="bg-green-500 hover:bg-green-600">
          <Check className="w-4 h-4 mr-1" /> Practiced!
        </Button>
        <Button variant="secondary" onClick={() => onNext(false)}>
          <ChevronRight className="w-4 h-4 mr-1" /> Next
        </Button>
      </div>
    </div>
  );
}

// Sentence Builder Sub-component
function SentenceBuilderActivity({
  data,
  phase,
  onSkip,
  onNext,
}: {
  data: SentencePattern;
  phase: 'prompt' | 'reveal';
  onSkip: () => void;
  onNext: (knew: boolean) => void;
}) {
  const exampleSentence = useMemo(() => {
    // Use an example if available, otherwise build from slots
    if (data.examples && data.examples.length > 0) {
      const randomExample = data.examples[Math.floor(Math.random() * data.examples.length)];
      return randomExample.spanish;
    }
    // Fallback: generate from slots
    const slots = data.slots.map(slot => {
      const randomOption = slot.options[Math.floor(Math.random() * slot.options.length)];
      return randomOption.spanish;
    });
    return slots.join(' ');
  }, [data]);

  if (phase === 'prompt') {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500 mb-2">Pattern:</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {data.pattern}
        </p>
        <p className="text-lg text-primary-500 mb-4">
          {data.patternEnglish}
        </p>
        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl mb-4">
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">
            Build a sentence using this pattern!
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Say it out loud in Spanish.
          </p>
        </div>
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Show example →
        </button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
        {data.patternEnglish}
      </p>
      <p className="text-center text-sm text-gray-400 mb-4 font-mono">
        {data.pattern}
      </p>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-6">
        <p className="text-sm text-green-600 dark:text-green-400 mb-2">Example:</p>
        <button
          onClick={() => speak(exampleSentence)}
          className="group"
        >
          <p className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-500">
            {exampleSentence}
            <Volume2 className="w-4 h-4 inline ml-2 opacity-50 group-hover:opacity-100" />
          </p>
        </button>
      </div>
      <div className="flex justify-center gap-3">
        <Button onClick={() => onNext(true)} className="bg-green-500 hover:bg-green-600">
          <Check className="w-4 h-4 mr-1" /> Built one!
        </Button>
        <Button variant="secondary" onClick={() => onNext(false)}>
          <ChevronRight className="w-4 h-4 mr-1" /> Next
        </Button>
      </div>
    </div>
  );
}
