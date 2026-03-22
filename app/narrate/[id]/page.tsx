'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { useGamification } from '@/context/GamificationContext';
import {
  ArrowLeft,
  ArrowRight,
  Mic,
  Volume2,
  CheckCircle2,
  Circle,
  Lightbulb,
  BookOpen,
  MessageSquare,
  Link2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import { narrationPrompts, getNarrationByStoryId } from '@/data/narration-prompts';
import { speak, stopSpeaking } from '@/lib/speech';

const difficultyColors = {
  beginner: 'bg-green-500',
  intermediate: 'bg-blue-500',
  advanced: 'bg-purple-500',
};

const difficultyLabels = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

type HintSection = 'vocabulary' | 'starters' | 'connectors' | null;

export default function NarratePracticePage() {
  const params = useParams();
  const router = useRouter();
  const { earnXP, recordSkill } = useGamification();

  const storyId = params.id as string;
  const prompt = getNarrationByStoryId(storyId);

  // State
  const [checkedPoints, setCheckedPoints] = useState<Set<string>>(new Set());
  const [expandedHint, setExpandedHint] = useState<HintSection>(null);
  const [showModel, setShowModel] = useState(false);
  const [showModelTranslation, setShowModelTranslation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [phase, setPhase] = useState<'narrate' | 'review'>('narrate');

  // Navigation
  const currentIndex = narrationPrompts.findIndex(p => p.storyId === storyId);
  const prevPrompt = currentIndex > 0 ? narrationPrompts[currentIndex - 1] : null;
  const nextPrompt = currentIndex < narrationPrompts.length - 1 ? narrationPrompts[currentIndex + 1] : null;

  const togglePlotPoint = (id: string) => {
    const newChecked = new Set(checkedPoints);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedPoints(newChecked);
  };

  const toggleHintSection = (section: HintSection) => {
    setExpandedHint(expandedHint === section ? null : section);
  };

  const handleSpeakModel = useCallback(() => {
    if (!prompt) return;
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speak(prompt.modelNarration, 0.85);
      // Estimate duration
      setTimeout(() => setIsSpeaking(false), prompt.modelNarration.length * 70);
    }
  }, [prompt, isSpeaking]);

  const resetPractice = () => {
    setCheckedPoints(new Set());
    setShowModel(false);
    setShowModelTranslation(false);
    setPhase('narrate');
    setExpandedHint(null);
  };

  const allPointsCovered = prompt ? checkedPoints.size === prompt.plotPoints.length : false;

  // Award XP when transitioning to review phase with all points covered
  useEffect(() => {
    if (phase === 'review' && allPointsCovered) {
      earnXP('exercise_complete', undefined, { type: 'narration' });
      recordSkill('conversation', true);
    }
  }, [phase, allPointsCovered, earnXP, recordSkill]);

  if (!prompt) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Story narration not found.</p>
        <Link href="/narrate" className="text-primary-500 hover:underline">
          ← Back to Story Narration
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/narrate"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Story Narration
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-1 text-xs font-medium text-white rounded ${difficultyColors[prompt.difficulty]}`}>
                {difficultyLabels[prompt.difficulty]}
              </span>
              <span className="text-sm text-gray-500">{prompt.plotPoints.length} plot points</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {prompt.title}
            </h1>
            <p className="text-lg text-primary-500 font-medium">{prompt.titleEs}</p>
          </div>

          {/* Phase toggle / Reset */}
          <div className="flex items-center gap-2">
            {phase === 'review' && (
              <button
                onClick={resetPractice}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            )}
            <button
              onClick={() => setPhase(phase === 'narrate' ? 'review' : 'narrate')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {phase === 'narrate' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Review
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Practice
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Story Image & Summary */}
      <Card className="overflow-hidden">
        <div className="relative h-48 sm:h-64 w-full">
          <Image
            src={prompt.imageUrl}
            alt={prompt.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white/90 text-sm sm:text-base">
              <span className="font-medium">Summary:</span> {prompt.briefSummary}
            </p>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="border-l-4 border-l-secondary-400">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Mic className="w-6 h-6 text-secondary-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                {phase === 'narrate' ? 'Now narrate this story in Spanish!' : 'Review your narration'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {phase === 'narrate'
                  ? 'Speak out loud and check off plot points as you cover them. Use hints if you need help!'
                  : 'Compare your narration with the model. Did you cover all the key points?'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Plot Points */}
        <div className="space-y-6">
          {/* Plot Points Checklist */}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary-500" />
                  Plot Points
                </h2>
                <span className="text-sm text-gray-500">
                  {checkedPoints.size}/{prompt.plotPoints.length} covered
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${(checkedPoints.size / prompt.plotPoints.length) * 100}%` }}
                />
              </div>

              <div className="space-y-3">
                {prompt.plotPoints.map((point, index) => (
                  <button
                    key={point.id}
                    onClick={() => togglePlotPoint(point.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      checkedPoints.has(point.id)
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {checkedPoints.has(point.id) ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${checkedPoints.has(point.id) ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        <span className="font-medium text-gray-500 dark:text-gray-500 mr-2">{index + 1}.</span>
                        {point.english}
                      </p>
                      <p className="text-xs text-primary-500 mt-1 italic">
                        Hint: {point.spanishHint}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {allPointsCovered && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <p className="text-green-700 dark:text-green-400 font-medium text-center">
                    🎉 Great job! You covered all the plot points!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Hints & Model */}
        <div className="space-y-6">
          {/* Hints Section */}
          <Card>
            <CardContent>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-accent-500" />
                Hints
              </h2>

              {/* Hint Toggles */}
              <div className="space-y-3">
                {/* Vocabulary */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleHintSection('vocabulary')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      Vocabulary ({prompt.usefulVocabulary.length} words)
                    </span>
                    {expandedHint === 'vocabulary' ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedHint === 'vocabulary' && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="grid grid-cols-1 gap-2">
                        {prompt.usefulVocabulary.map((word, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="font-medium text-blue-700 dark:text-blue-400">{word.spanish}</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">{word.english}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sentence Starters */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleHintSection('starters')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      Sentence Starters ({prompt.sentenceStarters.length})
                    </span>
                    {expandedHint === 'starters' ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedHint === 'starters' && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="space-y-2">
                        {prompt.sentenceStarters.map((starter, idx) => (
                          <div key={idx} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="font-medium text-green-700 dark:text-green-400">{starter.spanish}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{starter.english}</p>
                            <p className="text-xs text-gray-500 mt-1 italic">Use for: {starter.usage}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Connectors */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleHintSection('connectors')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      <Link2 className="w-4 h-4 text-purple-500" />
                      Connectors ({prompt.connectors.length})
                    </span>
                    {expandedHint === 'connectors' ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedHint === 'connectors' && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="flex flex-wrap gap-2">
                        {prompt.connectors.map((conn, idx) => (
                          <div key={idx} className="px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <span className="font-medium text-purple-700 dark:text-purple-400">{conn.spanish}</span>
                            <span className="text-gray-500 text-sm ml-2">({conn.english})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Model Narration */}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-500" />
                  Model Narration
                </h2>
                <button
                  onClick={() => setShowModel(!showModel)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    showModel
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {showModel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showModel ? 'Hide' : 'Show'}
                </button>
              </div>

              {!showModel ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <Eye className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Try narrating first, then reveal the model to compare!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Audio control */}
                  <button
                    onClick={handleSpeakModel}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isSpeaking
                        ? 'bg-primary-500 text-white'
                        : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50'
                    }`}
                  >
                    <Volume2 className="w-5 h-5" />
                    {isSpeaking ? 'Stop Audio' : 'Listen to Model Narration'}
                  </button>

                  {/* Spanish text */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-gray-900 dark:text-white leading-relaxed">
                      {prompt.modelNarration}
                    </p>
                  </div>

                  {/* Translation toggle */}
                  <button
                    onClick={() => setShowModelTranslation(!showModelTranslation)}
                    className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
                  >
                    {showModelTranslation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {showModelTranslation ? 'Hide translation' : 'Show translation'}
                  </button>

                  {showModelTranslation && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <p className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed">
                        {prompt.modelTranslation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>


      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        {prevPrompt ? (
          <Link
            href={`/narrate/${prevPrompt.storyId}`}
            onClick={resetPractice}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">{prevPrompt.title}</span>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : (
          <div />
        )}

        <Link
          href={`/stories/${prompt.storyId}`}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Read Original
        </Link>

        {nextPrompt ? (
          <Link
            href={`/narrate/${nextPrompt.storyId}`}
            onClick={resetPractice}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
          >
            <span className="hidden sm:inline">{nextPrompt.title}</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
