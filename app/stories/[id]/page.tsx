'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle,
  XCircle,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import TeacherBubble from '@/components/layout/TeacherBubble';
import { useTeachers } from '@/hooks/useTeachers';
import { getStoryById, stories, Story, ComprehensionQuestion } from '@/data/stories';
import { speak, stopSpeaking, isSpeaking } from '@/lib/speech';

const levelColors = {
  beginner: 'bg-green-500',
  elementary: 'bg-blue-500',
  intermediate: 'bg-purple-500',
};

const levelLabels = {
  beginner: 'Principiante',
  elementary: 'Elemental',
  intermediate: 'Intermedio',
};

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const { getTeacherBySpecialty } = useTeachers();
  const teacher = getTeacherBySpecialty('stories');

  const storyId = params.id as string;
  const story = getStoryById(storyId);

  const [showTranslation, setShowTranslation] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | null>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [showVocabulary, setShowVocabulary] = useState(false);

  // Get next and previous stories
  const currentIndex = stories.findIndex(s => s.id === storyId);
  const prevStory = currentIndex > 0 ? stories[currentIndex - 1] : null;
  const nextStory = currentIndex < stories.length - 1 ? stories[currentIndex + 1] : null;

  const handleSpeak = useCallback((text: string, index: number) => {
    if (speakingIndex === index) {
      stopSpeaking();
      setSpeakingIndex(null);
    } else {
      stopSpeaking();
      setSpeakingIndex(index);
      speak(text, 0.85);
      // Reset after estimated time
      setTimeout(() => setSpeakingIndex(null), text.length * 80);
    }
  }, [speakingIndex]);

  const handleSpeakAll = useCallback(() => {
    if (!story) return;
    const fullText = story.content.map(p => p.spanish).join('. ');
    speak(fullText, 0.8);
  }, [story]);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    if (answeredQuestions.has(questionId)) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    setAnsweredQuestions(prev => new Set(prev).add(questionId));
  };

  const goToNextQuestion = () => {
    if (story?.comprehensionQuestions && currentQuestionIndex < story.comprehensionQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setAnsweredQuestions(new Set());
    setCurrentQuestionIndex(0);
  };

  const getScore = () => {
    if (!story?.comprehensionQuestions) return { correct: 0, total: 0 };
    let correct = 0;
    story.comprehensionQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) correct++;
    });
    return { correct, total: story.comprehensionQuestions.length };
  };

  const allQuestionsAnswered = story?.comprehensionQuestions?.length === answeredQuestions.size;

  if (!story) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Story not found.</p>
        <Link href="/stories" className="text-primary-500 hover:underline">
          ← Back to Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/stories"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stories
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-1 text-xs font-medium text-white rounded ${levelColors[story.level]}`}>
                {levelLabels[story.level]}
              </span>
              <span className="text-sm text-gray-500">{story.estimatedMinutes} min read</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {story.title}
            </h1>
            <p className="text-xl text-primary-500 font-medium">{story.titleSpanish}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showTranslation
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {showTranslation ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showTranslation ? 'Hide' : 'Show'} English
            </button>
            <button
              onClick={handleSpeakAll}
              className="flex items-center gap-2 px-4 py-2 bg-secondary-400 text-white rounded-lg font-medium hover:bg-secondary-500 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Read All
            </button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <Card>
        <CardContent>
          <div className="space-y-6">
            {story.content.map((paragraph, index) => (
              <div key={index} className="group">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleSpeak(paragraph.spanish, index)}
                    className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                      speakingIndex === index
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                    }`}
                    title="Listen to this paragraph"
                  >
                    {speakingIndex === index ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
                      {paragraph.spanish}
                    </p>
                    {showTranslation && (
                      <p className="text-gray-500 dark:text-gray-400 mt-2 italic">
                        {paragraph.english}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vocabulary Section */}
      <Card>
        <CardContent>
          <button
            onClick={() => setShowVocabulary(!showVocabulary)}
            className="w-full flex items-center justify-between"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-500" />
              Vocabulary ({story.vocabulary.length} words)
            </h2>
            <span className="text-gray-500">
              {showVocabulary ? '▲' : '▼'}
            </span>
          </button>

          {showVocabulary && (
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {story.vocabulary.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {word.spanish}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">({word.partOfSpeech})</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">{word.english}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cultural Note */}
      {story.culturalNote && (
        <Card className="border-l-4 border-l-accent-500">
          <CardContent>
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-accent-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Cultural Note</h3>
                <p className="text-gray-600 dark:text-gray-400">{story.culturalNote}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comprehension Questions - Slide Panel */}
      {story.comprehensionQuestions && story.comprehensionQuestions.length > 0 && (
        <Card>
          <CardContent>
            {/* Header with progress */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Comprehension Questions
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentQuestionIndex + 1} / {story.comprehensionQuestions.length}
                </span>
                {allQuestionsAnswered && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                    {getScore().correct}/{getScore().total} correct
                  </span>
                )}
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {story.comprehensionQuestions.map((q, idx) => {
                const isAnswered = answeredQuestions.has(q.id);
                const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      isCurrent
                        ? 'w-6 bg-primary-500'
                        : isAnswered
                          ? isCorrect
                            ? 'bg-green-500'
                            : 'bg-amber-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                );
              })}
            </div>

            {/* Current Question */}
            {(() => {
              const question = story.comprehensionQuestions[currentQuestionIndex];
              const isAnswered = answeredQuestions.has(question.id);
              const selectedAnswer = selectedAnswers[question.id];
              const isCorrect = selectedAnswer === question.correctAnswer;

              return (
                <div className="min-h-[300px]">
                  <p className="font-medium text-gray-900 dark:text-white mb-1 text-lg">
                    {question.question}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 italic">
                    {question.questionSpanish}
                  </p>

                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => {
                      const isSelected = selectedAnswer === oIndex;
                      const isCorrectOption = question.correctAnswer === oIndex;

                      return (
                        <button
                          key={oIndex}
                          onClick={() => handleAnswerSelect(question.id, oIndex)}
                          disabled={isAnswered}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                            isAnswered
                              ? isCorrectOption
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : isSelected
                                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                  : 'border-gray-200 dark:border-gray-700 opacity-50'
                              : isSelected
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              isAnswered && isCorrectOption
                                ? 'bg-green-500 text-white'
                                : isAnswered && isSelected
                                  ? 'bg-amber-500 text-white'
                                  : isSelected
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            {option}
                          </span>
                          {isAnswered && isCorrectOption && (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback after answering */}
                  {isAnswered && (
                    <div className={`mt-6 p-4 rounded-xl ${
                      isCorrect
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                    }`}>
                      <p className={`font-medium mb-1 ${
                        isCorrect ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'
                      }`}>
                        {isCorrect ? '¡Correcto! Well done!' : 'Not quite right'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={goToPrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {allQuestionsAnswered && (
                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
              )}

              <button
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === story.comprehensionQuestions.length - 1}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {prevStory ? (
          <Link
            href={`/stories/${prevStory.id}`}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">{prevStory.title}</span>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : (
          <div />
        )}

        {nextStory ? (
          <Link
            href={`/stories/${nextStory.id}`}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500"
          >
            <span className="hidden sm:inline">{nextStory.title}</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Teacher Encouragement */}
      {allQuestionsAnswered && getScore().correct === getScore().total && (
        <TeacherBubble
          teacher={teacher}
          message="Excelente! Has comprendido muy bien la historia. Sigue practicando con mas cuentos!"
          messageTranslation="Excellent! You have understood the story very well. Keep practicing with more stories!"
          size="small"
        />
      )}
    </div>
  );
}
