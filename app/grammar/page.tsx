'use client';

import { useState } from 'react';
import { BookOpen, ChevronRight, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { grammarLessons, getLessonById } from '@/data/grammar-lessons';
import { GrammarLesson, Exercise, ContentBlock } from '@/lib/types';
import { useProgress } from '@/context/ProgressContext';
import { useGamification } from '@/context/GamificationContext';
import InteractiveLessonView from '@/components/grammar/InteractiveLessonView';

function ContentRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return (
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3">
          {block.content}
        </h3>
      );
    case 'text':
      return (
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          {block.content}
        </p>
      );
    case 'example':
      return (
        <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 p-4 mb-3 rounded-r-lg">
          {block.content && (
            <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">{block.content}</p>
          )}
          <p className="text-primary-700 dark:text-primary-300 font-medium">
            {block.spanishExample}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm italic">
            {block.englishTranslation}
          </p>
        </div>
      );
    case 'table':
      if (!block.tableData) return null;
      return (
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                {block.tableData.headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.tableData.rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={rowIdx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}
                >
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'tip':
      return (
        <div className="bg-secondary-100 dark:bg-secondary-900/30 border-l-4 border-secondary-500 p-4 mb-3 rounded-r-lg">
          <p className="text-gray-800 dark:text-gray-200">
            <span className="font-bold">Tip: </span>
            {block.content}
          </p>
        </div>
      );
    default:
      return null;
  }
}

function ExerciseComponent({
  exercise,
  onAnswer,
  answered,
  userAnswer,
}: {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  answered: boolean;
  userAnswer: string | null;
}) {
  const [inputValue, setInputValue] = useState('');
  const isCorrect = userAnswer === exercise.correctAnswer;

  const handleSubmit = () => {
    onAnswer(inputValue.toLowerCase().trim());
  };

  if (exercise.type === 'multiple-choice') {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
        <p className="font-medium text-gray-900 dark:text-white mb-3">{exercise.question}</p>
        <div className="grid grid-cols-2 gap-2">
          {exercise.options?.map((option) => {
            const isSelected = userAnswer === option;
            const isCorrectOption = option === exercise.correctAnswer;
            let buttonClass = 'p-3 rounded-lg border-2 text-left transition-colors ';

            if (!answered) {
              buttonClass += 'border-gray-200 dark:border-gray-600 hover:border-primary-500';
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
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`mt-3 p-3 rounded-lg ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <div className="flex items-center gap-2 mb-1">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {isCorrect ? 'Correct!' : `Incorrect. The answer is "${exercise.correctAnswer}"`}
              </span>
            </div>
            {exercise.explanation && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.explanation}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fill-blank or conjugation type
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
      <p className="font-medium text-gray-900 dark:text-white mb-3">{exercise.question}</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={answered ? (userAnswer || '') : inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={answered}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          placeholder="Type your answer..."
          onKeyDown={(e) => e.key === 'Enter' && !answered && handleSubmit()}
        />
        {!answered && (
          <Button onClick={handleSubmit}>Check</Button>
        )}
      </div>
      {answered && (
        <div className={`mt-3 p-3 rounded-lg ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {isCorrect ? 'Correct!' : `Incorrect. The answer is "${exercise.correctAnswer}"`}
            </span>
          </div>
          {exercise.explanation && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}

function LessonView({
  lesson,
  onBack,
  onComplete,
}: {
  lesson: GrammarLesson;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [showExercises, setShowExercises] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [exerciseComplete, setExerciseComplete] = useState(false);

  const handleAnswer = (exerciseId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: answer }));
  };

  const allAnswered = lesson.exercises.every((ex) => answers[ex.id]);
  const correctCount = lesson.exercises.filter(
    (ex) => answers[ex.id] === ex.correctAnswer
  ).length;

  const handleFinishExercises = () => {
    setExerciseComplete(true);
    onComplete();
  };

  const resetExercises = () => {
    setAnswers({});
    setExerciseComplete(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lesson.title}
          </h1>
          <p className="text-primary-500 font-medium">{lesson.titleSpanish}</p>
        </div>
        <Button variant="ghost" onClick={onBack}>
          Back to Lessons
        </Button>
      </div>

      {!showExercises ? (
        <>
          <Card>
            <CardContent>
              <div className="mt-6">
                {lesson.content.map((block, idx) => (
                  <ContentRenderer key={idx} block={block} />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button size="lg" onClick={() => setShowExercises(true)}>
              Practice with Exercises
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </>
      ) : exerciseComplete ? (
        <Card className="text-center py-12">
          <CardContent>
            <Award className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Lesson Complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You got {correctCount} out of {lesson.exercises.length} correct!
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={resetExercises}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={onBack}>
                Next Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Practice Exercises
                </h2>
                <span className="text-sm text-gray-500">
                  {Object.keys(answers).length} / {lesson.exercises.length} answered
                </span>
              </div>

              <ProgressBar
                value={Object.keys(answers).length}
                max={lesson.exercises.length}
                color="primary"
                className="mb-6"
              />

              {lesson.exercises.map((exercise) => (
                <ExerciseComponent
                  key={exercise.id}
                  exercise={exercise}
                  onAnswer={(answer) => handleAnswer(exercise.id, answer)}
                  answered={!!answers[exercise.id]}
                  userAnswer={answers[exercise.id] || null}
                />
              ))}
            </CardContent>
          </Card>

          {allAnswered && (
            <div className="flex justify-center">
              <Button size="lg" onClick={handleFinishExercises}>
                Complete Lesson
                <CheckCircle className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function GrammarPage() {
  const [selectedLesson, setSelectedLesson] = useState<GrammarLesson | null>(null);
  const { markGrammarLessonComplete, isGrammarLessonComplete } = useProgress();
  const { earnXP, recordSkill } = useGamification();

  const handleComplete = () => {
    if (selectedLesson) {
      markGrammarLessonComplete(selectedLesson.id);
      earnXP('grammar_lesson_complete', undefined, { lessonId: selectedLesson.id });
      recordSkill('grammar', true);
    }
  };

  const handleInteractiveComplete = (correctCount: number, totalPractice: number) => {
    if (selectedLesson) {
      markGrammarLessonComplete(selectedLesson.id);
      earnXP('grammar_lesson_complete', undefined, { lessonId: selectedLesson.id, correctCount, totalPractice });
      // Record per-question skill accuracy
      for (let i = 0; i < totalPractice; i++) {
        recordSkill('grammar', i < correctCount);
      }
    }
  };

  if (selectedLesson) {
    // Use interactive view when available, fall back to classic text view
    if (selectedLesson.interactiveSteps && selectedLesson.interactiveSteps.length > 0) {
      return (
        <InteractiveLessonView
          lesson={selectedLesson}
          onBack={() => setSelectedLesson(null)}
          onComplete={handleInteractiveComplete}
        />
      );
    }

    return (
      <LessonView
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
        onComplete={handleComplete}
      />
    );
  }

  const completedCount = grammarLessons.filter((l) =>
    isGrammarLessonComplete(l.id)
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gramatica / Grammar
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Master Spanish grammar with interactive lessons
        </p>
      </div>


      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedCount} / {grammarLessons.length} lessons
              </p>
            </div>
            <div className="w-32">
              <ProgressBar
                value={completedCount}
                max={grammarLessons.length}
                color="secondary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {grammarLessons.map((lesson) => {
          const completed = isGrammarLessonComplete(lesson.id);
          return (
            <Card
              key={lesson.id}
              hover
              className={`cursor-pointer ${completed ? 'border-green-500' : ''}`}
              onClick={() => setSelectedLesson(lesson)}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${completed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-primary-100 dark:bg-primary-900/30'}`}>
                      {completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Lesson {lesson.order}</span>
                        <span className="px-2 py-0.5 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 text-xs rounded-full">
                          {lesson.level}
                        </span>
                      </div>
                      <CardTitle className="mt-1">{lesson.title}</CardTitle>
                      <p className="text-sm text-primary-500 font-medium">{lesson.titleSpanish}</p>
                      <CardDescription className="mt-1">{lesson.description}</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
