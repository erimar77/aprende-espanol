'use client';

import { useState } from 'react';
import { MessageCircle, Volume2, CheckCircle, XCircle, ChevronRight, RotateCcw, Lock } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeacherBubble from '@/components/layout/TeacherBubble';
import CulturalNote from '@/components/ui/CulturalNote';
import { getTeacherBySpecialty } from '@/data/teachers';
import { conversations, getConversationById } from '@/data/conversations';
import { ConversationScenario, DialogueNode, DialogueResponse } from '@/lib/types';
import { useProgress } from '@/context/ProgressContext';
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

  const teacher = getTeacherBySpecialty('conversations');
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
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {conversationHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.isUser
                  ? 'bg-primary-500 text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
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
      </div>

      {/* Current Teacher Message */}
      {currentNode && currentNode.text && (
        <TeacherBubble
          teacher={teacher}
          message={currentNode.text}
          messageTranslation={currentNode.translation}
          size="medium"
        />
      )}

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
  const { markConversationComplete, isConversationComplete, isConversationUnlocked } = useProgress();
  const teacher = getTeacherBySpecialty('conversations');

  const handleComplete = () => {
    if (selectedScenario) {
      markConversationComplete(selectedScenario.id);
    }
    setSelectedScenario(null);
  };

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    easy: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  // Sort conversations by order
  const sortedConversations = [...conversations].sort((a, b) => a.order - b.order);

  // Get prerequisite title for locked message
  const getPrerequisiteTitle = (conversationId: string): string | null => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv?.prerequisiteId) return null;
    const prereq = conversations.find(c => c.id === conv.prerequisiteId);
    return prereq?.title || null;
  };

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

      <TeacherBubble
        teacher={teacher}
        message="Practicar conversaciones es la mejor manera de aprender un idioma! Elige un escenario y vamos a hablar!"
        messageTranslation="Practicing conversations is the best way to learn a language! Choose a scenario and let's talk!"
        size="medium"
      />

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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${scenario.order}`}>
                      #{scenario.order}
                    </span>
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
