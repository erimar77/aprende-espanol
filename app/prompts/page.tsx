'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Shuffle, Volume2, ChevronDown, ChevronUp, Timer, Mic, RotateCcw } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import Card, { CardContent, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { conversationPrompts, promptCategories, ConversationPrompt } from '@/data/conversation-prompts';
import { speak } from '@/lib/speech';

export default function ConversationPromptsPage() {
  const { earnXP, recordSkill } = useGamification();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<ConversationPrompt | null>(null);
  const [showHelpers, setShowHelpers] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timerInterval, setTimerIntervalState] = useState<NodeJS.Timeout | null>(null);
  const [promptChanged, setPromptChanged] = useState(false);

  const filteredPrompts = useMemo(() => {
    if (!selectedCategory) return conversationPrompts;
    return conversationPrompts.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const getRandomPrompt = useCallback(() => {
    const prompts = selectedCategory
      ? conversationPrompts.filter(p => p.category === selectedCategory)
      : conversationPrompts;
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
    setShowHelpers(false);
    setShowVocab(false);
    stopTimer();
    setPromptChanged(true);
  }, [selectedCategory]);

  function startTimer(seconds: number = 60) {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    setTimeRemaining(seconds);
    setTimerActive(true);
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerIntervalState(interval);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    setTimerActive(false);
    setTimeRemaining(60);
    setTimerIntervalState(null);
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const getCategoryInfo = (categoryId: string) => {
    return promptCategories.find(c => c.id === categoryId);
  };

  // Award XP when moving to next prompt (completing current one)
  useEffect(() => {
    if (promptChanged && currentPrompt) {
      earnXP('exercise_complete', undefined, { type: 'conversation-prompt' });
      recordSkill('conversation', true);
      setPromptChanged(false);
    }
  }, [promptChanged, currentPrompt, earnXP, recordSkill]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Temas de Conversación / Conversation Prompts
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Practice speaking with random topics and guiding questions
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
          All Topics
        </button>
        {promptCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setCurrentPrompt(null); }}
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

      {/* Main Content */}
      {!currentPrompt ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🎲</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Ready to practice?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Click the button below to get a random conversation topic. Try to speak for at least 30-60 seconds!
            </p>
            <Button onClick={getRandomPrompt} className="text-lg px-8 py-3">
              <Shuffle className="w-5 h-5 mr-2" />
              Get Random Topic
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              {filteredPrompts.length} topics available
              {selectedCategory && ` in ${getCategoryInfo(selectedCategory)?.labelEnglish}`}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Prompt Card */}
          <Card>
            <CardContent>
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  getCategoryInfo(currentPrompt.category)?.color
                } text-white`}>
                  {getCategoryInfo(currentPrompt.category)?.icon}
                  {getCategoryInfo(currentPrompt.category)?.labelEnglish}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  currentPrompt.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  currentPrompt.difficulty === 'elementary' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {currentPrompt.difficulty}
                </span>
              </div>

              {/* Main Prompt */}
              <div className="text-center py-6">
                <button
                  onClick={() => speak(currentPrompt.promptSpanish)}
                  className="group"
                >
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                    {currentPrompt.promptSpanish}
                    <Volume2 className="w-5 h-5 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                </button>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {currentPrompt.promptEnglish}
                </p>
              </div>

              {/* Timer Section */}
              <div className="flex items-center justify-center gap-4 py-4 border-y border-gray-200 dark:border-gray-700">
                {timerActive ? (
                  <>
                    <div className={`text-3xl font-mono font-bold ${
                      timeRemaining <= 10 ? 'text-red-500' : 'text-primary-500'
                    }`}>
                      {formatTime(timeRemaining)}
                    </div>
                    <Button variant="secondary" onClick={stopTimer}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Start a timer:</span>
                    <Button variant="secondary" onClick={() => startTimer(30)}>30s</Button>
                    <Button variant="secondary" onClick={() => startTimer(60)}>1 min</Button>
                    <Button variant="secondary" onClick={() => startTimer(120)}>2 min</Button>
                  </>
                )}
              </div>

              {/* Helper Questions */}
              <div className="mt-4">
                <button
                  onClick={() => setShowHelpers(!showHelpers)}
                  className="flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  {showHelpers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  💡 Need help? See guiding questions ({currentPrompt.helperQuestions.length})
                </button>
                {showHelpers && (
                  <div className="mt-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Try answering these questions:
                    </p>
                    <ul className="space-y-2">
                      {currentPrompt.helperQuestions.map((q, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <button
                            onClick={() => speak(q.spanish)}
                            className="text-primary-500 hover:text-primary-600 mt-0.5 flex-shrink-0"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{q.spanish}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{q.english}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Useful Vocabulary */}
              <div className="mt-4">
                <button
                  onClick={() => setShowVocab(!showVocab)}
                  className="flex items-center gap-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:text-secondary-700"
                >
                  {showVocab ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  📚 Useful vocabulary ({currentPrompt.usefulVocab.length} words)
                </button>
                {showVocab && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentPrompt.usefulVocab.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => speak(v.spanish)}
                        className="px-3 py-1.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 rounded-lg text-sm hover:bg-secondary-200 dark:hover:bg-secondary-900/50 transition-colors"
                      >
                        <span className="font-medium">{v.spanish}</span>
                        <span className="text-secondary-600 dark:text-secondary-400 ml-1">({v.english})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Example Response */}
              {currentPrompt.exampleResponse && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                    ✨ Example response:
                  </p>
                  <button
                    onClick={() => speak(currentPrompt.exampleResponse!)}
                    className="text-left group"
                  >
                    <p className="text-gray-900 dark:text-white italic group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      "{currentPrompt.exampleResponse}"
                      <Volume2 className="w-4 h-4 inline ml-2 opacity-50 group-hover:opacity-100" />
                    </p>
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={getRandomPrompt} className="flex items-center gap-2">
                  <Shuffle className="w-4 h-4" />
                  Next Topic
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => { setCurrentPrompt(null); stopTimer(); }}
                >
                  Back to Categories
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardContent>
              <CardTitle className="text-lg mb-3">💪 Speaking Tips</CardTitle>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Don't worry about mistakes - just keep talking!</li>
                <li>• Use filler words like "bueno...", "pues...", "entonces..." to sound natural</li>
                <li>• If you don't know a word, describe it or use a simpler word</li>
                <li>• Try to speak for the full timer duration</li>
                <li>• Record yourself and listen back to improve</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
