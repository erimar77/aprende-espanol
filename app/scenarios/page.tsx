'use client';

import { useState, useMemo, useEffect } from 'react';
import { Volume2, ChevronRight, RotateCcw, Play, Trophy, AlertCircle, MessageSquare, Sparkles } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { scenarios, Scenario, ScenarioNode } from '@/data/scenarios';
import { speak } from '@/lib/speech';

type GameState = 'select' | 'playing' | 'ended';

export default function ScenariosPage() {
  const { earnXP, recordSkill } = useGamification();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [gameState, setGameState] = useState<GameState>('select');
  const [history, setHistory] = useState<{ nodeId: string; choiceId: string }[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filteredScenarios = useMemo(() => {
    if (!selectedDifficulty) return scenarios;
    return scenarios.filter(s => s.difficulty === selectedDifficulty);
  }, [selectedDifficulty]);

  const currentNode: ScenarioNode | undefined = useMemo(() => {
    if (!selectedScenario) return undefined;
    return selectedScenario.nodes.find(n => n.id === currentNodeId);
  }, [selectedScenario, currentNodeId]);

  function startScenario(scenario: Scenario) {
    setSelectedScenario(scenario);
    setCurrentNodeId('start');
    setGameState('playing');
    setHistory([]);
  }

  function makeChoice(choiceId: string, nextNodeId: string) {
    setHistory(prev => [...prev, { nodeId: currentNodeId, choiceId }]);

    const nextNode = selectedScenario?.nodes.find(n => n.id === nextNodeId);
    if (nextNode?.isEnding) {
      setGameState('ended');
    }
    setCurrentNodeId(nextNodeId);
  }

  // Award XP when scenario ends
  useEffect(() => {
    if (gameState === 'ended') {
      earnXP('conversation_complete', undefined, { type: 'scenario' });
      recordSkill('conversation', true);
    }
  }, [gameState, earnXP, recordSkill]);

  function restartScenario() {
    setCurrentNodeId('start');
    setGameState('playing');
    setHistory([]);
  }

  function backToSelection() {
    setSelectedScenario(null);
    setGameState('select');
    setHistory([]);
    setCurrentNodeId('start');
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'elementary': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'intermediate': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Simulaciones / Scenario Simulations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Immersive role-play scenarios to practice real conversations
        </p>
      </div>

      {/* Scenario Selection */}
      {gameState === 'select' && (
        <>
          {/* Difficulty Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedDifficulty
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setSelectedDifficulty('beginner')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedDifficulty === 'beginner'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              🌱 Beginner
            </button>
            <button
              onClick={() => setSelectedDifficulty('elementary')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedDifficulty === 'elementary'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              🌿 Elementary
            </button>
            <button
              onClick={() => setSelectedDifficulty('intermediate')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedDifficulty === 'intermediate'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              🌳 Intermediate
            </button>
          </div>

          {/* Scenario Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScenarios.map(scenario => (
              <Card
                key={scenario.id}
                hover
                className="cursor-pointer"
                onClick={() => startScenario(scenario)}
              >
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{scenario.icon}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(scenario.difficulty)}`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-lg mb-1">{scenario.title}</CardTitle>
                  <p className="text-sm text-primary-500 font-medium mb-2">{scenario.titleSpanish}</p>
                  <CardDescription>{scenario.description}</CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary-500">
                    <Play className="w-4 h-4" />
                    <span>Start scenario</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Card */}
          <Card>
            <CardContent>
              <CardTitle className="text-lg mb-3">🎭 How Scenarios Work</CardTitle>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    Read & Respond
                  </p>
                  <p>
                    You'll see what someone says to you, and choose how to respond in Spanish.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    Branching Paths
                  </p>
                  <p>
                    Your choices shape the conversation - different responses lead to different outcomes.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    Safe Practice
                  </p>
                  <p>
                    Make mistakes without consequences! Try different approaches to see what works.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Active Scenario */}
      {gameState === 'playing' && selectedScenario && currentNode && (
        <div className="space-y-6">
          {/* Scenario Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedScenario.icon}</span>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">{selectedScenario.title}</h2>
                <p className="text-sm text-gray-500">{selectedScenario.setting}</p>
              </div>
            </div>
            <button
              onClick={backToSelection}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ← Back to scenarios
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MessageSquare className="w-4 h-4" />
            <span>{history.length + 1} exchanges</span>
          </div>

          {/* Main Dialogue Card */}
          <Card>
            <CardContent className="py-8">
              {/* Speaker */}
              <div className="flex items-center gap-2 mb-4">
                {currentNode.speaker === 'them' ? (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                    🗣️ Them
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium">
                    📝 Narrator
                  </span>
                )}
              </div>

              {/* Dialogue */}
              <div className="text-center py-6">
                <button
                  onClick={() => speak(currentNode.spanish)}
                  className="group"
                >
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors">
                    {currentNode.spanish}
                    <Volume2 className="w-5 h-5 inline ml-2 opacity-50 group-hover:opacity-100" />
                  </p>
                </button>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {currentNode.english}
                </p>
              </div>

              {/* Response Options */}
              {currentNode.options && (
                <div className="space-y-3 mt-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-4">
                    ¿Qué dices? / What do you say?
                  </p>
                  {currentNode.options.map((option, index) => (
                    <button
                      key={option.id}
                      onClick={() => makeChoice(option.id, option.nextNodeId)}
                      className="w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 rounded-xl transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-medium text-sm">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <div className="flex-grow">
                          <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {option.spanish}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {option.english}
                          </p>
                          {option.feedback && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 italic">
                              💡 {option.feedback}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(option.spanish);
                          }}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scenario Ended */}
      {gameState === 'ended' && selectedScenario && currentNode && (
        <div className="space-y-6">
          {/* Result Card */}
          <Card>
            <CardContent className="py-8 text-center">
              {currentNode.endingType === 'success' ? (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    ¡Excelente! 🎉
                  </h2>
                </>
              ) : currentNode.endingType === 'partial' ? (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    ¡Casi! 💪
                  </h2>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Try Again! 🔄
                  </h2>
                </>
              )}

              {/* Final message */}
              <div className="max-w-lg mx-auto">
                <button
                  onClick={() => speak(currentNode.spanish)}
                  className="group"
                >
                  <p className="text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary-500">
                    {currentNode.spanish}
                    <Volume2 className="w-4 h-4 inline ml-2 opacity-50 group-hover:opacity-100" />
                  </p>
                </button>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentNode.english}
                </p>
              </div>

              {/* Stats */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl inline-block">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed in <span className="font-bold text-primary-500">{history.length}</span> exchanges
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Button onClick={restartScenario}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="secondary" onClick={backToSelection}>
                  More Scenarios
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Conversation History */}
          <Card>
            <CardContent>
              <CardTitle className="text-lg mb-4">📜 Your Conversation</CardTitle>
              <div className="space-y-4">
                {history.map((item, index) => {
                  const node = selectedScenario.nodes.find(n => n.id === item.nodeId);
                  const choice = node?.options?.find(o => o.id === item.choiceId);
                  return (
                    <div key={index} className="space-y-2">
                      {/* What they said */}
                      <div className="flex gap-3">
                        <span className="text-blue-500">🗣️</span>
                        <div>
                          <p className="text-gray-900 dark:text-white">{node?.spanish}</p>
                          <p className="text-sm text-gray-500">{node?.english}</p>
                        </div>
                      </div>
                      {/* What you said */}
                      {choice && (
                        <div className="flex gap-3 ml-6">
                          <span className="text-green-500">👤</span>
                          <div>
                            <p className="text-gray-900 dark:text-white">{choice.spanish}</p>
                            <p className="text-sm text-gray-500">{choice.english}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
