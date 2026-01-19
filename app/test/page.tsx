'use client';

import { useState, useEffect, useMemo } from 'react';
import { ClipboardCheck, Clock, ChevronRight, CheckCircle, XCircle, Award, RotateCcw, Trophy } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import TeacherBubble from '@/components/layout/TeacherBubble';
import { getTeacherBySpecialty } from '@/data/teachers';
import { testQuestions, getTestQuestions, calculateScore } from '@/data/test-questions';
import { TestQuestion } from '@/lib/types';
import { useProgress } from '@/context/ProgressContext';

function TestQuestion({
  question,
  onAnswer,
  answered,
  userAnswer,
  showExplanation,
}: {
  question: TestQuestion;
  onAnswer: (answer: string) => void;
  answered: boolean;
  userAnswer: string | null;
  showExplanation: boolean;
}) {
  const isCorrect = userAnswer === question.correctAnswer;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
          question.category === 'vocabulary' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          question.category === 'grammar' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
          question.category === 'conjugation' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
        }`}>
          {question.category}
        </span>
        {question.subcategory && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {question.subcategory}
          </span>
        )}
      </div>

      <p className="text-lg font-medium text-gray-900 dark:text-white">
        {question.question}
      </p>

      <div className="grid gap-2">
        {question.options?.map((option) => {
          const isSelected = userAnswer === option;
          const isCorrectOption = option === question.correctAnswer;
          let buttonClass = 'w-full p-4 rounded-xl border-2 text-left transition-all ';

          if (!answered) {
            buttonClass += 'border-gray-200 dark:border-gray-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20';
          } else if (isCorrectOption) {
            buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900/30';
          } else if (isSelected && !isCorrectOption) {
            buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900/30';
          } else {
            buttonClass += 'border-gray-200 dark:border-gray-600 opacity-50';
          }

          return (
            <button
              key={option}
              onClick={() => !answered && onAnswer(option)}
              disabled={answered}
              className={buttonClass}
            >
              <span className="text-gray-900 dark:text-white">{option}</span>
              {answered && isCorrectOption && (
                <CheckCircle className="w-5 h-5 text-green-500 inline ml-2" />
              )}
              {answered && isSelected && !isCorrectOption && (
                <XCircle className="w-5 h-5 text-red-500 inline ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {showExplanation && answered && (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Explanation: </span>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default function TestPage() {
  const [testStarted, setTestStarted] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timedMode, setTimedMode] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
  const [showExplanations, setShowExplanations] = useState(true);

  const { addTestScore } = useProgress();
  const teacher = getTeacherBySpecialty('grammar');

  // Timer effect
  useEffect(() => {
    if (!testStarted || testComplete || !timedMode) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTestComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testComplete, timedMode]);

  const startTest = () => {
    setQuestions(getTestQuestions());
    setCurrentIndex(0);
    setAnswers({});
    setTestStarted(true);
    setTestComplete(false);
    setTimeRemaining(30 * 60);
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentIndex];
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, showExplanations ? 2000 : 500);
  };

  const finishTest = () => {
    const score = calculateScore(answers);
    addTestScore({
      testId: 'a1-final',
      score: score.correct,
      totalQuestions: score.total,
      completedAt: new Date().toISOString(),
      timeSpent: timedMode ? (30 * 60 - timeRemaining) : 0,
    });
    setTestComplete(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const score = useMemo(() => calculateScore(answers), [answers]);
  const answeredCount = Object.keys(answers).length;

  if (testComplete) {
    const percentage = score.percentage;
    const passed = percentage >= 70;

    return (
      <div className="space-y-6">
        <Card className="text-center py-12">
          <CardContent>
            {passed ? (
              <Trophy className="w-20 h-20 text-secondary-400 mx-auto mb-4" />
            ) : (
              <Award className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            )}

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {passed ? 'Felicitaciones!' : 'Keep Practicing!'}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {passed
                ? 'You passed the A1 Spanish Assessment!'
                : 'You need 70% to pass. Keep studying and try again!'}
            </p>

            <div className="max-w-md mx-auto mb-8">
              <div className={`text-6xl font-bold mb-2 ${
                percentage >= 80 ? 'text-green-500' :
                percentage >= 70 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {percentage}%
              </div>
              <p className="text-gray-500">
                {score.correct} out of {score.total} correct
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {score.byCategory.vocabulary?.correct || 0}/{score.byCategory.vocabulary?.total || 0}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Vocabulary</div>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {score.byCategory.grammar?.correct || 0}/{score.byCategory.grammar?.total || 0}
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Grammar</div>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {score.byCategory.conjugation?.correct || 0}/{score.byCategory.conjugation?.total || 0}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">Conjugation</div>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {score.byCategory.comprehensive?.correct || 0}/{score.byCategory.comprehensive?.total || 0}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Comprehensive</div>
              </div>
            </div>

            {passed && (
              <div className="bg-gradient-to-r from-secondary-100 to-primary-100 dark:from-secondary-900/30 dark:to-primary-900/30 p-6 rounded-xl mb-8 max-w-lg mx-auto">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  A1 Level Certificate
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  You have demonstrated basic proficiency in Spanish vocabulary, grammar, and verb conjugation at the A1 level.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Completed: {new Date().toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => {
                setTestStarted(false);
                setTestComplete(false);
              }}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Back to Setup
              </Button>
              <Button onClick={startTest}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Examen Final A1 / A1 Final Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your Spanish knowledge with this comprehensive assessment
          </p>
        </div>

        <TeacherBubble
          teacher={teacher}
          message="Este examen evaluara todo lo que has aprendido. No te preocupes, puedes tomarlo las veces que quieras. Buena suerte!"
          messageTranslation="This test will evaluate everything you've learned. Don't worry, you can take it as many times as you want. Good luck!"
          size="medium"
        />

        <Card>
          <CardContent>
            <CardTitle className="mb-6">Test Configuration</CardTitle>

            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">50</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Questions</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600">70%</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Passing Score</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">A1</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Level</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Test Mode
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTimedMode(false)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      !timedMode
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">Practice Mode</div>
                    <div className="text-sm text-gray-500">No time limit, see explanations</div>
                  </button>
                  <button
                    onClick={() => setTimedMode(true)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      timedMode
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">Timed Mode</div>
                    <div className="text-sm text-gray-500">30 minutes, exam conditions</div>
                  </button>
                </div>
              </div>

              {!timedMode && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="showExplanations"
                    checked={showExplanations}
                    onChange={(e) => setShowExplanations(e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded"
                  />
                  <label htmlFor="showExplanations" className="text-gray-700 dark:text-gray-300">
                    Show explanations after each question
                  </label>
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Topics Covered:</h4>
                <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Vocabulary (nouns, adjectives, verbs)</li>
                  <li>• Articles and gender</li>
                  <li>• Ser vs Estar</li>
                  <li>• Present tense conjugation</li>
                  <li>• Adjective agreement</li>
                  <li>• Common expressions</li>
                </ul>
              </div>

              <Button onClick={startTest} size="lg" className="w-full">
                <ClipboardCheck className="w-5 h-5 mr-2" />
                Start Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            A1 Spanish Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        {timedMode && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeRemaining < 300 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Progress</span>
            <span className="text-sm text-gray-500">{answeredCount} answered</span>
          </div>
          <ProgressBar value={currentIndex + 1} max={questions.length} color="primary" />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {currentQuestion && (
            <TestQuestion
              question={currentQuestion}
              onAnswer={handleAnswer}
              answered={!!answers[currentQuestion.id]}
              userAnswer={answers[currentQuestion.id] || null}
              showExplanation={showExplanations && !timedMode}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <div className="flex gap-1">
          {questions.slice(
            Math.max(0, currentIndex - 2),
            Math.min(questions.length, currentIndex + 3)
          ).map((q, idx) => {
            const actualIdx = Math.max(0, currentIndex - 2) + idx;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(actualIdx)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  actualIdx === currentIndex
                    ? 'bg-primary-500 text-white'
                    : answers[q.id]
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {actualIdx + 1}
              </button>
            );
          })}
        </div>

        {currentIndex < questions.length - 1 ? (
          <Button
            onClick={() => setCurrentIndex(currentIndex + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={finishTest}>
            Finish Test
            <CheckCircle className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
