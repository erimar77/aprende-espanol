'use client';

import { useState, useMemo } from 'react';
import { Shuffle, Volume2, ChevronRight, Check, Lightbulb } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { sentencePatterns, categories, SentencePattern } from '@/data/sentence-patterns';
import { speak } from '@/lib/speech';
import { useGamification } from '@/context/GamificationContext';

export default function SentenceBuilderPage() {
  const { earnXP, recordSkill } = useGamification();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<SentencePattern | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showExample, setShowExample] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const filteredPatterns = useMemo(() => {
    if (!selectedCategory) return sentencePatterns;
    return sentencePatterns.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const constructedSentence = useMemo(() => {
    if (!selectedPattern) return '';

    let sentence = selectedPattern.pattern;
    selectedPattern.slots.forEach(slot => {
      const selected = selectedOptions[slot.id];
      if (selected) {
        sentence = sentence.replace('___', selected);
      }
    });
    return sentence;
  }, [selectedPattern, selectedOptions]);

  const allSlotsFilled = useMemo(() => {
    if (!selectedPattern) return false;
    return selectedPattern.slots.every(slot => selectedOptions[slot.id]);
  }, [selectedPattern, selectedOptions]);

  function selectPattern(pattern: SentencePattern) {
    setSelectedPattern(pattern);
    setSelectedOptions({});
    setShowExample(false);
    setIsComplete(false);
  }

  function selectOption(slotId: string, option: string) {
    setSelectedOptions(prev => ({ ...prev, [slotId]: option }));
    setIsComplete(false);
  }

  function handleComplete() {
    setIsComplete(true);
    speak(constructedSentence);
    earnXP('exercise_complete', undefined, { type: 'sentence-builder' });
    recordSkill('grammar', true);
  }

  function handleShuffle() {
    if (!selectedPattern) return;
    const newOptions: Record<string, string> = {};
    selectedPattern.slots.forEach(slot => {
      const randomIndex = Math.floor(Math.random() * slot.options.length);
      newOptions[slot.id] = slot.options[randomIndex].spanish;
    });
    setSelectedOptions(newOptions);
    setIsComplete(false);
  }

  function resetBuilder() {
    setSelectedPattern(null);
    setSelectedOptions({});
    setShowExample(false);
    setIsComplete(false);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Constructor de Oraciones / Sentence Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Practice building sentences with common Spanish patterns
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.icon} {cat.labelEnglish}
          </button>
        ))}
      </div>

      {/* Pattern Selection or Builder */}
      {!selectedPattern ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatterns.map(pattern => (
            <Card
              key={pattern.id}
              hover
              className="cursor-pointer"
              onClick={() => selectPattern(pattern)}
            >
              <CardContent>
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pattern.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    pattern.difficulty === 'elementary' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {pattern.difficulty}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {pattern.pattern}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {pattern.patternEnglish}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={resetBuilder}
            className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
          >
            ← Back to patterns
          </button>

          {/* Current Pattern */}
          <Card>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Pattern:</p>
                <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
                  {selectedPattern.patternEnglish}
                </p>
              </div>

              {/* Constructed Sentence Display */}
              <div className={`p-6 rounded-xl mb-6 text-center transition-all ${
                isComplete
                  ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                  : 'bg-gray-50 dark:bg-gray-800'
              }`}>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {constructedSentence.includes('___') ? (
                    constructedSentence.split('___').map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <span className="inline-block w-24 mx-1 border-b-2 border-dashed border-primary-400" />
                        )}
                      </span>
                    ))
                  ) : (
                    constructedSentence
                  )}
                </p>
                {isComplete && (
                  <div className="flex items-center justify-center gap-2 mt-3 text-green-600 dark:text-green-400">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">¡Muy bien!</span>
                  </div>
                )}
              </div>

              {/* Slot Selection */}
              <div className="space-y-4">
                {selectedPattern.slots.map((slot, index) => (
                  <div key={slot.id}>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {index + 1}. Choose {slot.labelEnglish}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {slot.options.map(option => (
                        <button
                          key={option.spanish}
                          onClick={() => selectOption(slot.id, option.spanish)}
                          className={`px-3 py-2 rounded-lg text-sm transition-all ${
                            selectedOptions[slot.id] === option.spanish
                              ? 'bg-primary-500 text-white'
                              : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
                          }`}
                        >
                          <span className="font-medium">{option.spanish}</span>
                          <span className="text-xs ml-1 opacity-70">({option.english})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={handleComplete}
                  disabled={!allSlotsFilled}
                  className="flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  Complete & Listen
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleShuffle}
                  className="flex items-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  Random Fill
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowExample(!showExample)}
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showExample ? 'Hide' : 'Show'} Examples
                </Button>
              </div>

              {/* Examples */}
              {showExample && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                    💡 Examples:
                  </p>
                  <ul className="space-y-2">
                    {selectedPattern.examples.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <button
                          onClick={() => speak(ex.spanish)}
                          className="text-yellow-600 hover:text-yellow-700 mt-0.5"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{ex.spanish}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{ex.english}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
