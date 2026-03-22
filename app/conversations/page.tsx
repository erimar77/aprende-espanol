'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Volume2, CheckCircle, XCircle, ChevronRight, RotateCcw, Lock, Globe, Coffee, Filter } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CulturalNote from '@/components/ui/CulturalNote';
import { getConversationById, getEverydayConversations, getCulturalConversations } from '@/data/conversations';
import { ConversationScenario, DialogueNode, DialogueResponse } from '@/lib/types';
import { useProgress } from '@/context/ProgressContext';
import { useGamification } from '@/context/GamificationContext';
import { speak } from '@/lib/speech';

function ConversationPlayer({
  scenario,
  onComplete
}: {
  scenario: ConversationScenario;
  onComplete: () => void;
}) {
  const [currentNodeId, setCurrentNodeId] = useState(scenario.dialogue[0].id);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    speaker: string;
    text: string;
    translation: string;
    isUser: boolean;
  }>>([]);
  const [feedback, setFeedback] = useState<{text: string; translation: string; isCorrect: boolean} | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const currentNode = scenario.dialogue.find(d => d.id === currentNodeId);

  const handleResponse = (response: DialogueResponse) => {
    // Add the teacher's message to history if it exists
    if (currentNode && currentNode.text) {
      setConversationHistory(prev => [...prev, {
        speaker: 'Teacher',
        text: currentNode.text,
        translation: currentNode.translation,
        isUser: false,
      }]);
    }

    // Add user's response to history
    setConversationHistory(prev => [...prev, {
      speaker: 'You',
      text: response.text,
      translation: response.translation,
      isUser: true,
    }]);

    // Show feedback
    if (response.feedback) {
      setFeedback({
        text: response.feedback,
        translation: response.feedbackTranslation,
        isCorrect: response.isCorrect,
      });
    }

    // Move to next node after a delay
    setTimeout(() => {
      setFeedback(null);
      if (response.nextNodeId === 'end') {
        setIsComplete(true);
      } else {
        setCurrentNodeId(response.nextNodeId);
      }
    }, 2000);
  };

  const handleSpeak = (text: string) => {
    speak(text, 0.85);
  };

  if (isComplete) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Conversacion Completada!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Excellent work! You completed the "{scenario.title}" conversation.
          </p>
          <Button onClick={onComplete}>
            Back to Conversations
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cultural Note */}
      {scenario.culturalNote && (
        <CulturalNote note={scenario.culturalNote} />
      )}

      {/* Conversation History */}
      <div className="space-y-3">
        {conversationHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.isUser
                  ? 'bg-primary-500 text-white rounded-br-none'
                  : 'bg-secondary-100 dark:bg-secondary-900/40 text-gray-900 dark:text-white rounded-bl-none border border-secondary-200 dark:border-secondary-800'
              }`}
            >
              <p className="font-medium text-sm opacity-75 mb-1">{msg.speaker}</p>
              <p>{msg.text}</p>
              <p className="text-sm opacity-75 mt-1 italic">{msg.translation}</p>
              <button
                onClick={() => handleSpeak(msg.text)}
                className="mt-2 opacity-75 hover:opacity-100"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Current Teacher Message (not yet in history) */}
        {currentNode && currentNode.text && !feedback && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-2xl bg-secondary-100 dark:bg-secondary-900/40 text-gray-900 dark:text-white rounded-bl-none border border-secondary-200 dark:border-secondary-800">
              <p className="font-medium text-sm opacity-75 mb-1">Teacher</p>
              <p>{currentNode.text}</p>
              <p className="text-sm opacity-75 mt-1 italic">{currentNode.translation}</p>
              <button
                onClick={() => handleSpeak(currentNode.text)}
                className="mt-2 opacity-75 hover:opacity-100"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <Card className={`border-2 ${feedback.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'}`}>
          <CardContent className="flex items-start gap-3">
            {feedback.isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
            )}
            <div>
              <p className="text-gray-900 dark:text-white">{feedback.text}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">{feedback.translation}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response Options */}
      {currentNode && currentNode.responses && !feedback && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Choose your response:</p>
          {currentNode.responses.map((response) => (
            <button
              key={response.id}
              onClick={() => handleResponse(response)}
              className="w-full text-left p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 transition-colors"
            >
              <p className="font-medium text-gray-900 dark:text-white">{response.text}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">{response.translation}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ConversationsPage() {
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'everyday' | 'cultural'>('all');
  const [conversations, setConversations] = useState<ConversationScenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { markConversationComplete, isConversationComplete, isConversationUnlocked } = useProgress();
  const { earnXP, recordSkill } = useGamification();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const module = await import('@/data/conversations');
        setConversations(module.conversations);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  const handleComplete = () => {
    if (selectedScenario) {
      markConversationComplete(selectedScenario.id);
      earnXP('conversation_complete', undefined, { conversationId: selectedScenario.id });
      recordSkill('conversation', true);
    }
    setSelectedScenario(null);
  };

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    easy: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  // Get filtered conversations based on category
  const getFilteredConversations = () => {
    let filtered;
    if (selectedCategory === 'cultural') {
      filtered = getCulturalConversations();
    } else if (selectedCategory === 'everyday') {
      filtered = getEverydayConversations();
    } else {
      filtered = conversations;
    }
    return [...filtered].sort((a, b) => a.order - b.order);
  };

  const sortedConversations = getFilteredConversations();
  const everydayCount = getEverydayConversations().length;
  const culturalCount = getCulturalConversations().length;

  // Get prerequisite title for locked message
  const getPrerequisiteTitle = (conversationId: string): string | null => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv?.prerequisiteId) return null;
    const prereq = conversations.find(c => c.id === conv.prerequisiteId);
    return prereq?.title || null;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Conversaciones / Conversation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Practice real-life dialogues in Spanish
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading conversations...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedScenario) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedScenario.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedScenario.titleSpanish} - {selectedScenario.location}
            </p>
          </div>
          <Button variant="ghost" onClick={() => setSelectedScenario(null)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Exit
          </Button>
        </div>

        <ConversationPlayer scenario={selectedScenario} onComplete={handleComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Conversaciones / Conversations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Practice real-life dialogues in Spanish
        </p>
      </div>


      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          All ({conversations.length})
        </button>
        <button
          onClick={() => setSelectedCategory('everyday')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'everyday'
              ? 'bg-primary-500 text-white'
              : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50'
          }`}
        >
          <Coffee className="w-4 h-4" />
          Everyday ({everydayCount})
        </button>
        <button
          onClick={() => setSelectedCategory('cultural')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'cultural'
              ? 'bg-accent-500 text-white'
              : 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400 hover:bg-accent-200 dark:hover:bg-accent-900/50'
          }`}
        >
          <Globe className="w-4 h-4" />
          Cultural ({culturalCount})
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sortedConversations.map((scenario) => {
          const completed = isConversationComplete(scenario.id);
          const unlocked = isConversationUnlocked(scenario.id);
          const prereqTitle = getPrerequisiteTitle(scenario.id);

          return (
            <Card
              key={scenario.id}
              hover={unlocked}
              className={`${unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} ${completed ? 'border-green-500' : ''}`}
              onClick={() => unlocked && setSelectedScenario(scenario)}
            >
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl ${unlocked ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {unlocked ? (
                      <MessageCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {completed && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {scenario.category === 'cultural' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">
                        Cultural
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${difficultyColors[scenario.difficulty] || difficultyColors.medium}`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                </div>
                <CardTitle className={!unlocked ? 'text-gray-400 dark:text-gray-500' : ''}>
                  {scenario.title}
                </CardTitle>
                <p className={`text-sm font-medium ${unlocked ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  {scenario.titleSpanish}
                </p>
                <CardDescription className="mt-2">{scenario.description}</CardDescription>
                <div className="mt-4 flex items-center justify-between">
                  {unlocked ? (
                    <>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {scenario.location}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </>
                  ) : (
                    <span className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      Complete "{prereqTitle}" to unlock
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
