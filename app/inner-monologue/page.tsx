'use client';

import { useState, useMemo, useEffect } from 'react';
import { Shuffle, Volume2, ChevronDown, ChevronUp, Brain, Lightbulb, MessageCircle, Sparkles } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { thoughtPrompts, thoughtCategories, ThoughtPrompt } from '@/data/inner-monologue';
import { speak } from '@/lib/speech';

export default function InnerMonologuePage() {
  const { earnXP, recordSkill } = useGamification();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<ThoughtPrompt | null>(null);
  const [showStarters, setShowStarters] = useState(true);
  const [showPhrases, setShowPhrases] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);

  const filteredPrompts = useMemo(() => {
    if (!selectedCategory) return thoughtPrompts;
    return thoughtPrompts.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  function getRandomPrompt() {
    const prompts = selectedCategory
      ? thoughtPrompts.filter(p => p.category === selectedCategory)
      : thoughtPrompts;
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
    setShowStarters(true);
    setShowPhrases(false);
    setShowFollowUp(false);
    setPracticeMode(false);
  }

  function startPractice() {
    setPracticeMode(true);
    setShowStarters(false);
    setShowPhrases(false);
    setShowFollowUp(false);
  }

  // Award XP when moving to next prompt (completing current one)
  useEffect(() => {
    if (currentPrompt && !practiceMode) {
      earnXP('exercise_complete', undefined, { type: 'inner-monologue' });
      recordSkill('conversation', true);
    }
  }, [currentPrompt, practiceMode, earnXP, recordSkill]);

  const getCategoryInfo = (categoryId: string) => {
    return thoughtCategories.find(c => c.id === categoryId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Monólogo Interior / Inner Monologue
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Practice thinking in Spanish during everyday moments
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setSelectedCategory(null); setCurrentPrompt(null); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {thoughtCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setCurrentPrompt(null); }}
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
      {!currentPrompt ? (
        <div className="text-center py-12">
          <div className="max-w-lg mx-auto">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Train Your Inner Voice
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The key to fluency is thinking in Spanish, not translating from English.
              Practice narrating your thoughts in everyday situations.
            </p>
            <Button onClick={getRandomPrompt} className="text-lg px-8 py-3">
              <Brain className="w-5 h-5 mr-2" />
              Get a Situation
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              {filteredPrompts.length} situations available
              {selectedCategory && ` in ${getCategoryInfo(selectedCategory)?.label}`}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Prompt Card */}
          <Card>
            <CardContent>
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                  {getCategoryInfo(currentPrompt.category)?.icon}
                  {getCategoryInfo(currentPrompt.category)?.label}
                </span>
              </div>

              {/* Situation */}
              <div className="text-center py-6 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Imagine this situation:
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentPrompt.situation}
                </p>
                <p className="text-lg text-primary-500 font-medium">
                  {currentPrompt.situationSpanish}
                </p>
              </div>

              {/* Practice Mode Prompt */}
              {practiceMode && (
                <div className="py-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                    <Brain className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Think in Spanish for 30 seconds...
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    What would you think? Narrate your thoughts out loud in Spanish.
                  </p>
                  <p className="text-sm text-gray-500">
                    Click "Show Help" below if you need starter phrases
                  </p>
                </div>
              )}

              {/* Starter Thoughts */}
              <div className="mt-4">
                <button
                  onClick={() => setShowStarters(!showStarters)}
                  className="flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  {showStarters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <Lightbulb className="w-4 h-4" />
                  {practiceMode ? 'Show Help' : 'Starter Thoughts'} ({currentPrompt.starterThoughts.length})
                </button>
                {showStarters && (
                  <div className="mt-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-3">
                      💡 Ways to start your inner monologue:
                    </p>
                    <div className="space-y-2">
                      {currentPrompt.starterThoughts.map((thought, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg"
                        >
                          <button
                            onClick={() => speak(thought.spanish)}
                            className="flex-shrink-0 p-1.5 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {thought.spanish}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                              ({thought.english})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Useful Phrases */}
              <div className="mt-4">
                <button
                  onClick={() => setShowPhrases(!showPhrases)}
                  className="flex items-center gap-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:text-secondary-700"
                >
                  {showPhrases ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <MessageCircle className="w-4 h-4" />
                  Useful Phrases ({currentPrompt.usefulPhrases.length})
                </button>
                {showPhrases && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentPrompt.usefulPhrases.map((phrase, i) => (
                      <button
                        key={i}
                        onClick={() => speak(phrase.spanish)}
                        className="px-3 py-2 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 text-secondary-800 dark:text-secondary-300 rounded-lg text-sm hover:bg-secondary-100 dark:hover:bg-secondary-900/40 transition-colors"
                      >
                        <span className="font-medium">{phrase.spanish}</span>
                        <span className="text-secondary-600 dark:text-secondary-400 ml-1 text-xs">
                          ({phrase.english})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Follow-up Questions */}
              <div className="mt-4">
                <button
                  onClick={() => setShowFollowUp(!showFollowUp)}
                  className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700"
                >
                  {showFollowUp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <Sparkles className="w-4 h-4" />
                  Dig Deeper ({currentPrompt.followUpQuestions.length})
                </button>
                {showFollowUp && (
                  <div className="mt-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-3">
                      ✨ Ask yourself these questions to keep thinking:
                    </p>
                    <div className="space-y-2">
                      {currentPrompt.followUpQuestions.map((q, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg"
                        >
                          <button
                            onClick={() => speak(q.spanish)}
                            className="flex-shrink-0 p-1.5 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {q.spanish}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                              ({q.english})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {!practiceMode ? (
                  <Button onClick={startPractice} className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Start Thinking
                  </Button>
                ) : (
                  <Button
                    onClick={() => setPracticeMode(false)}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    Done Practicing
                  </Button>
                )}
                <Button onClick={getRandomPrompt} variant="secondary" className="flex items-center gap-2">
                  <Shuffle className="w-4 h-4" />
                  New Situation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardContent>
              <CardTitle className="text-lg mb-3">💡 How to Practice Inner Monologue</CardTitle>
              <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-medium text-xs">1</span>
                  <span><strong>Visualize the situation</strong> - Picture yourself in this moment</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-medium text-xs">2</span>
                  <span><strong>Think out loud in Spanish</strong> - Narrate what you'd think, even if it's simple</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-medium text-xs">3</span>
                  <span><strong>Use the starters if stuck</strong> - It's okay to peek! This builds the habit</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-medium text-xs">4</span>
                  <span><strong>Keep it simple</strong> - Short thoughts count! "Tengo hambre" is perfect</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Challenge Card */}
          <Card>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg mb-1">Daily Challenge</CardTitle>
                  <CardDescription>
                    Try to think in Spanish during ONE real situation today - while getting ready,
                    eating, or walking. Even 30 seconds builds the habit!
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Why This Works Card */}
      {!currentPrompt && (
        <Card>
          <CardContent>
            <CardTitle className="text-lg mb-3">🎯 Why Inner Monologue Works</CardTitle>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Stops the Translation Trap
                </p>
                <p>
                  When you practice thinking directly in Spanish, you bypass the slow English→Spanish
                  translation that causes hesitation.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Low-Pressure Practice
                </p>
                <p>
                  Nobody can hear your thoughts! This is the safest way to practice
                  without fear of making mistakes.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Builds Automatic Responses
                </p>
                <p>
                  The phrases you practice in your head become the phrases that
                  come out naturally in conversation.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Any Time, Any Place
                </p>
                <p>
                  You can practice this while commuting, showering, or waiting in line -
                  turn dead time into practice time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
