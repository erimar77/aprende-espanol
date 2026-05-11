'use client';

import { useState, useMemo, useEffect } from 'react';
import { Volume2, Shuffle, RotateCcw, ChevronRight, Sparkles, BookOpen, Pencil } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { wordTypeLabels, MadLibStory } from '@/data/madlibs';
import { speak } from '@/lib/speech';
import { useGamification } from '@/context/GamificationContext';

type Phase = 'select' | 'fill' | 'story';

export default function MadLibsPage() {
  const { earnXP } = useGamification();
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedStory, setSelectedStory] = useState<MadLibStory | null>(null);
  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, { spanish: string; english: string }>>({});
  const [useCustom, setUseCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customEnglish, setCustomEnglish] = useState('');
  const [madLibStories, setMadLibStories] = useState<MadLibStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [xpAwarded, setXpAwarded] = useState(false);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const module = await import('@/data/madlibs');
        setMadLibStories(module.madLibStories);
      } catch (error) {
        console.error('Failed to load mad lib stories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStories();
  }, []);

  const startStory = (story: MadLibStory) => {
    setSelectedStory(story);
    setPhase('fill');
    setCurrentBlankIndex(0);
    setSelections({});
    setUseCustom(false);
    setCustomInput('');
    setCustomEnglish('');
    setXpAwarded(false);
  };

  const currentBlank = selectedStory?.blanks[currentBlankIndex];

  const selectWord = (spanish: string, english: string) => {
    if (!currentBlank) return;
    const newSelections = { ...selections, [currentBlank.id]: { spanish, english } };
    setSelections(newSelections);

    if (selectedStory && currentBlankIndex < selectedStory.blanks.length - 1) {
      setCurrentBlankIndex(prev => prev + 1);
      setUseCustom(false);
      setCustomInput('');
      setCustomEnglish('');
    } else {
      setPhase('story');
      if (!xpAwarded) {
        earnXP('exercise_complete', undefined, { type: 'madlibs' });
        setXpAwarded(true);
      }
    }
  };

  const submitCustom = () => {
    if (customInput.trim()) {
      selectWord(customInput.trim(), customEnglish.trim() || customInput.trim());
    }
  };

  const randomFill = () => {
    if (!selectedStory) return;
    const newSelections: Record<string, { spanish: string; english: string }> = {};
    selectedStory.blanks.forEach(blank => {
      const randomOption = blank.options[Math.floor(Math.random() * blank.options.length)];
      newSelections[blank.id] = randomOption;
    });
    setSelections(newSelections);
    setPhase('story');
  };

  // Build the final story with filled-in words
  const filledStory = useMemo(() => {
    if (!selectedStory) return { spanish: '', english: '' };

    let spanish = selectedStory.template;
    let english = selectedStory.templateEnglish;

    Object.entries(selections).forEach(([id, word]) => {
      spanish = spanish.replace(`{${id}}`, word.spanish);
      english = english.replace(`{${id}}`, word.english);
    });

    return { spanish, english };
  }, [selectedStory, selections]);

  const goBack = () => {
    if (currentBlankIndex > 0) {
      setCurrentBlankIndex(prev => prev - 1);
      setUseCustom(false);
      setCustomInput('');
      setCustomEnglish('');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Palabras Locas / Mad Libs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Fill in the blanks to create hilarious stories in Spanish
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading stories...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Palabras Locas / Mad Libs
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Fill in the blanks to create hilarious stories in Spanish
        </p>
      </div>

      {/* Story Selection */}
      {phase === 'select' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {madLibStories.map(story => (
              <Card
                key={story.id}
                hover
                className="cursor-pointer"
                onClick={() => startStory(story)}
              >
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">📝</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      story.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {story.difficulty}
                    </span>
                  </div>
                  <CardTitle>{story.title}</CardTitle>
                  <p className="text-sm text-primary-500 font-medium mb-1">{story.titleSpanish}</p>
                  <CardDescription>{story.blanks.length} words to fill in</CardDescription>
                  {/* Word types preview */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {story.blanks.map(blank => (
                      <span
                        key={blank.id}
                        className={`text-xs px-1.5 py-0.5 rounded ${wordTypeLabels[blank.type].color}`}
                      >
                        {wordTypeLabels[blank.type].english}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info */}
          <Card>
            <CardContent>
              <CardTitle className="text-lg mb-3">🎯 Why Mad Libs?</CardTitle>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Learn Parts of Speech</p>
                  <p>Each blank is labeled with its type — noun, verb, adjective — so you naturally learn grammar categories.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white mb-1">Build Vocabulary</p>
                  <p>Pick from curated options or write your own words. Either way, you're learning new Spanish words in a fun context.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fill Phase */}
      {phase === 'fill' && selectedStory && currentBlank && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Word {currentBlankIndex + 1} of {selectedStory.blanks.length}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={randomFill}>
                <Shuffle className="w-4 h-4 mr-1" /> Random Fill All
              </Button>
              <button
                onClick={() => { setPhase('select'); setSelectedStory(null); }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all"
              style={{ width: `${(currentBlankIndex / selectedStory.blanks.length) * 100}%` }}
            />
          </div>

          {/* Current Blank Card */}
          <Card>
            <CardContent className="py-6">
              <div className="text-center mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${wordTypeLabels[currentBlank.type].color}`}>
                  {wordTypeLabels[currentBlank.type].spanish} / {wordTypeLabels[currentBlank.type].english}
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Choose a {wordTypeLabels[currentBlank.type].english}:
                </h2>
                <p className="text-primary-500">
                  Elige un(a) {wordTypeLabels[currentBlank.type].spanish}:
                </p>
              </div>

              {/* Options Grid */}
              {!useCustom && (
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  {currentBlank.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => selectWord(option.spanish, option.english)}
                      className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group"
                    >
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-primary-500">
                        {option.spanish}
                      </p>
                      <p className="text-sm text-gray-500">{option.english}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Custom Input Toggle */}
              {!useCustom ? (
                <button
                  onClick={() => setUseCustom(true)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 mx-auto"
                >
                  <Pencil className="w-4 h-4" />
                  Write your own word
                </button>
              ) : (
                <div className="max-w-md mx-auto space-y-3">
                  <input
                    type="text"
                    value={customInput}
                    onChange={e => setCustomInput(e.target.value)}
                    placeholder="Spanish word..."
                    autoFocus
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    onKeyDown={e => e.key === 'Enter' && submitCustom()}
                  />
                  <input
                    type="text"
                    value={customEnglish}
                    onChange={e => setCustomEnglish(e.target.value)}
                    placeholder="English meaning (optional)..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    onKeyDown={e => e.key === 'Enter' && submitCustom()}
                  />
                  <div className="flex gap-2">
                    <Button onClick={submitCustom} disabled={!customInput.trim()} className="flex-1">
                      Use This Word
                    </Button>
                    <Button variant="secondary" onClick={() => setUseCustom(false)}>
                      Back to Options
                    </Button>
                  </div>
                </div>
              )}

              {/* Back button */}
              {currentBlankIndex > 0 && (
                <div className="text-center mt-4">
                  <button
                    onClick={goBack}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    ← Change previous word
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Already selected words */}
          {Object.keys(selections).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedStory.blanks.slice(0, currentBlankIndex).map(blank => {
                const sel = selections[blank.id];
                return sel ? (
                  <span
                    key={blank.id}
                    className={`px-2 py-1 rounded-lg text-xs ${wordTypeLabels[blank.type].color}`}
                  >
                    {sel.spanish}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}

      {/* Story Reveal */}
      {phase === 'story' && selectedStory && (
        <div className="space-y-6">
          <Card>
            <CardContent className="py-8">
              <div className="text-center mb-6">
                <Sparkles className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedStory.titleSpanish}
                </h2>
                <p className="text-gray-500">{selectedStory.title}</p>
              </div>

              {/* Spanish Story */}
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">En español:</span>
                  <button
                    onClick={() => speak(filledStory.spanish, 0.85)}
                    className="p-2 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-lg leading-relaxed text-gray-900 dark:text-white">
                  {selectedStory.template.split(/\{(\w+)\}/).map((part, i) => {
                    const sel = selections[part];
                    if (sel) {
                      return (
                        <span key={i} className="font-bold text-primary-600 dark:text-primary-400 underline decoration-2 decoration-primary-300">
                          {sel.spanish}
                        </span>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </p>
              </div>

              {/* English Translation */}
              <details className="mb-6">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  Show English translation
                </summary>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    {selectedStory.templateEnglish.split(/\{(\w+)\}/).map((part, i) => {
                      const sel = selections[part];
                      if (sel) {
                        return (
                          <span key={i} className="font-bold text-primary-600 dark:text-primary-400">
                            {sel.english}
                          </span>
                        );
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </p>
                </div>
              </details>

              {/* Words Used */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Words you used:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStory.blanks.map(blank => {
                    const sel = selections[blank.id];
                    return sel ? (
                      <span
                        key={blank.id}
                        className={`px-3 py-1.5 rounded-lg text-sm ${wordTypeLabels[blank.type].color}`}
                      >
                        <span className="font-medium">{sel.spanish}</span>
                        <span className="opacity-75 ml-1">({wordTypeLabels[blank.type].english})</span>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => startStory(selectedStory)}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
                <Button variant="secondary" onClick={() => { setPhase('select'); setSelectedStory(null); }}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  More Stories
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
