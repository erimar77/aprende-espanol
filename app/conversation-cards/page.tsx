'use client';

import { useState, useEffect } from 'react';
import { useGamification } from '@/context/GamificationContext';
import {
  topicCards,
  whatWouldYouSay,
  getScaffoldingTier,
  TopicCard,
  WhatWouldYouSay,
} from '@/data/topic-cards';
import { ArrowLeft, MessageCircle, Zap, Eye, EyeOff, RefreshCw, ChevronRight, Lightbulb, CheckCircle } from 'lucide-react';

type Mode = 'menu' | 'topic' | 'scenario';
type Tab = 'everyday' | 'opinions' | 'respond' | 'initiate';

export default function ConversationCardsPage() {
  const { earnXP, recordSkill } = useGamification();
  const [mode, setMode] = useState<Mode>('menu');
  const [activeTab, setActiveTab] = useState<Tab>('everyday');
  const [currentTopic, setCurrentTopic] = useState<TopicCard | null>(null);
  const [currentScenario, setCurrentScenario] = useState<WhatWouldYouSay | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('spanish_conversation_cards_completed');
    if (saved) setCompletedCount(parseInt(saved, 10));
  }, []);

  const tier = getScaffoldingTier(completedCount);

  const handleComplete = (selfRating: 'good' | 'okay' | 'struggled') => {
    const newCount = completedCount + 1;
    setCompletedCount(newCount);
    localStorage.setItem('spanish_conversation_cards_completed', String(newCount));

    earnXP('exercise_complete', undefined, { type: 'conversation_card', tier, rating: selfRating });
    recordSkill('conversation', selfRating !== 'struggled');

    // Reset for next card
    setShowModel(false);
    setUserResponse('');
    setIsRevealed(false);
    setCurrentTopic(null);
    setCurrentScenario(null);
    setMode('menu');
  };

  const startTopic = (card: TopicCard) => {
    setCurrentTopic(card);
    setMode('topic');
    setShowModel(false);
    setUserResponse('');
    setIsRevealed(false);
  };

  const startScenario = (scenario: WhatWouldYouSay) => {
    setCurrentScenario(scenario);
    setMode('scenario');
    setShowModel(false);
    setUserResponse('');
    setIsRevealed(false);
  };

  // ── MENU VIEW ──────────────────────────────────────────────────────
  if (mode === 'menu') {
    const everydayCards = topicCards.filter(tc => tc.category === 'everyday');
    const opinionCards = topicCards.filter(tc => tc.category === 'opinions');
    const respondScenarios = whatWouldYouSay.filter(s => s.category === 'respond' || s.category === 'react' || s.category === 'smalltalk');
    const initiateScenarios = whatWouldYouSay.filter(s => s.category === 'initiate');

    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Conversation Practice
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Build confidence for real conversations with family and friends.
            </p>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">
                Level: {tier === 'heavy' ? '🌱 Guided' : tier === 'medium' ? '🌿 Hints Only' : '🌳 Freeform'}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {completedCount} completed — {tier === 'heavy' ? `${5 - completedCount} more to unlock hints-only mode` : tier === 'medium' ? `${15 - completedCount} more to unlock freeform mode` : 'Full independence!'}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {([
              { key: 'everyday', label: '💬 Everyday Life', icon: MessageCircle },
              { key: 'opinions', label: '💭 Opinions & Reactions', icon: Zap },
              { key: 'respond', label: '🎯 What Would You Say?', icon: ChevronRight },
              { key: 'initiate', label: '🚀 Start a Conversation', icon: Lightbulb },
            ] as { key: Tab; label: string; icon: typeof MessageCircle }[]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                aria-label={`Show ${tab.label} cards`}
                aria-pressed={activeTab === tab.key}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTab === 'everyday' && everydayCards.map(card => (
              <button
                key={card.id}
                onClick={() => startTopic(card)}
                className="text-left p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{card.title}</h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">{card.titleSpanish}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{card.context}</p>
              </button>
            ))}
            {activeTab === 'opinions' && opinionCards.map(card => (
              <button
                key={card.id}
                onClick={() => startTopic(card)}
                className="text-left p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{card.title}</h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">{card.titleSpanish}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{card.context}</p>
              </button>
            ))}
            {activeTab === 'respond' && respondScenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario)}
                className="text-left p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{scenario.speaker}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{scenario.situation}</p>
                <p className="text-xs italic text-gray-500 dark:text-gray-400">"{scenario.theySaidTranslation}"</p>
              </button>
            ))}
            {activeTab === 'initiate' && initiateScenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario)}
                className="text-left p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{scenario.speaker}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{scenario.situation}</p>
                <p className="text-xs italic text-gray-500 dark:text-gray-400">{scenario.theySaidTranslation}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── TOPIC CARD VIEW ────────────────────────────────────────────────
  if (mode === 'topic' && currentTopic) {
    const scaffolding = currentTopic.scaffolding[tier];

    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Back button */}
          <button
            onClick={() => { setMode('menu'); setCurrentTopic(null); }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            aria-label="Go back to card list"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to cards
          </button>

          {/* Topic header */}
          <div className="mb-6">
            <span className="text-xs font-medium px-2 py-1 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
              {tier === 'heavy' ? '🌱 Guided' : tier === 'medium' ? '🌿 Hints Only' : '🌳 Freeform'}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{currentTopic.titleSpanish}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{currentTopic.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 italic">{currentTopic.context}</p>
          </div>

          {/* Scaffolding content */}
          <div className="space-y-4">
            {/* Heavy tier: show starters and key phrases */}
            {tier === 'heavy' && 'starters' in scaffolding && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 text-sm">Sentence starters:</h3>
                  <div className="space-y-2">
                    {scaffolding.starters.map((s, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="font-medium text-blue-800 dark:text-blue-300">{s.spanish}</span>
                        <span className="text-gray-500 dark:text-gray-400">{s.english}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-200 mb-3 text-sm">Key phrases:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {scaffolding.keyPhrases.map((p, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium text-green-800 dark:text-green-300">{p.spanish}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">— {p.english}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Medium tier: just hints */}
            {tier === 'medium' && 'hints' in scaffolding && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 text-sm">Hints:</h3>
                <ul className="space-y-1">
                  {scaffolding.hints.map((h, i) => (
                    <li key={i} className="text-sm text-yellow-800 dark:text-yellow-300">• {h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Freeform tier: just the prompt */}
            {tier === 'freeform' && 'prompt' in scaffolding && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <p className="text-purple-800 dark:text-purple-300 font-medium">{scaffolding.prompt}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 italic mt-1">{scaffolding.promptSpanish}</p>
              </div>
            )}

            {/* User response area */}
            <div className="mt-6">
              <label htmlFor="topic-response" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your response (try speaking it aloud, then type it):
              </label>
              <textarea
                id="topic-response"
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
                aria-label="Type your Spanish response"
              />
            </div>

            {/* Reveal model answer */}
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              aria-label={isRevealed ? 'Hide model answer' : 'Show model answer'}
            >
              {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isRevealed ? 'Hide model answer' : 'Show model answer'}
            </button>

            {isRevealed && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-fade-in">
                <p className="text-gray-900 dark:text-white font-medium mb-1">
                  {'modelResponse' in scaffolding ? scaffolding.modelResponse : ('sampleResponse' in scaffolding ? scaffolding.sampleResponse : '')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  {'modelTranslation' in scaffolding ? scaffolding.modelTranslation : ('sampleTranslation' in scaffolding ? scaffolding.sampleTranslation : '')}
                </p>
              </div>
            )}

            {/* Self-assessment */}
            {isRevealed && (
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">How did you do?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleComplete('good')}
                    className="flex-1 px-4 py-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm"
                  >
                    ✅ I said it well
                  </button>
                  <button
                    onClick={() => handleComplete('okay')}
                    className="flex-1 px-4 py-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors text-sm"
                  >
                    🤔 Mostly, some gaps
                  </button>
                  <button
                    onClick={() => handleComplete('struggled')}
                    className="flex-1 px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm"
                  >
                    😅 I struggled
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── SCENARIO VIEW ──────────────────────────────────────────────────
  if (mode === 'scenario' && currentScenario) {
    const scaffolding = currentScenario.scaffolding[tier];

    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Back button */}
          <button
            onClick={() => { setMode('menu'); setCurrentScenario(null); }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            aria-label="Go back to scenario list"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to cards
          </button>

          {/* Scenario context */}
          <div className="mb-6">
            <span className="text-xs font-medium px-2 py-1 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
              {tier === 'heavy' ? '🌱 Guided' : tier === 'medium' ? '🌿 Hints Only' : '🌳 Freeform'}
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 italic">{currentScenario.situation}</p>
          </div>

          {/* What they said */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{currentScenario.speaker}</p>
                <p className="text-lg text-gray-900 dark:text-white font-medium">"{currentScenario.theySaid}"</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">{currentScenario.theySaidTranslation}</p>
              </div>
            </div>
          </div>

          {/* Scaffolding */}
          <div className="space-y-4">
            {/* Heavy: response starters + key vocab */}
            {tier === 'heavy' && 'responseStarters' in scaffolding && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 text-sm">You could start with:</h3>
                  <div className="space-y-2">
                    {scaffolding.responseStarters.map((s, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="font-medium text-blue-800 dark:text-blue-300">{s.spanish}</span>
                        <span className="text-gray-500 dark:text-gray-400">{s.english}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-200 mb-3 text-sm">Useful vocabulary:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {scaffolding.keyVocab.map((v, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium text-green-800 dark:text-green-300">{v.spanish}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">— {v.english}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Medium: just hints */}
            {tier === 'medium' && 'hints' in scaffolding && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 text-sm">Tips:</h3>
                <ul className="space-y-1">
                  {scaffolding.hints.map((h, i) => (
                    <li key={i} className="text-sm text-yellow-800 dark:text-yellow-300">• {h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Freeform: no help, just respond */}
            {tier === 'freeform' && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-700 dark:text-purple-300">No hints — you've got this. Respond naturally.</p>
              </div>
            )}

            {/* User response */}
            <div className="mt-4">
              <label htmlFor="scenario-response" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What would you say? (speak it, then type it):
              </label>
              <textarea
                id="scenario-response"
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Tu respuesta..."
                className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
                aria-label="Type your Spanish response to the scenario"
              />
            </div>

            {/* Reveal model */}
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              aria-label={isRevealed ? 'Hide model responses' : 'Show model responses'}
            >
              {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isRevealed ? 'Hide model responses' : 'See how a native might respond'}
            </button>

            {isRevealed && (
              <div className="space-y-3 animate-fade-in">
                {scaffolding.modelResponses.map((resp, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-900 dark:text-white font-medium mb-1">{resp.spanish}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">{resp.english}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Self-assessment */}
            {isRevealed && (
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">How did you do?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleComplete('good')}
                    className="flex-1 px-4 py-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm"
                  >
                    ✅ I nailed it
                  </button>
                  <button
                    onClick={() => handleComplete('okay')}
                    className="flex-1 px-4 py-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors text-sm"
                  >
                    🤔 Close enough
                  </button>
                  <button
                    onClick={() => handleComplete('struggled')}
                    className="flex-1 px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm"
                  >
                    😅 I froze up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
