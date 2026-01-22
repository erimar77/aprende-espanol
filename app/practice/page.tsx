'use client';

import { useState, useEffect } from 'react';
import { Hash, Clock, Calendar, Calculator, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeacherBubble from '@/components/layout/TeacherBubble';
import { useTeachers } from '@/hooks/useTeachers';
import {
  cardinalNumbers,
  ordinalNumbers,
  timeExpressions,
  daysOfWeek,
  monthsOfYear,
  seasons,
  mathProblems,
  priceExpressions,
  getRandomNumber,
  getRandomMathProblem,
  getRandomTimeExpression,
  NumberWord,
  TimeExpression,
  MathProblem,
  DateWord,
} from '@/data/number-drills';
import { speak } from '@/lib/speech';

type DrillType = 'numbers' | 'time' | 'dates' | 'math';

interface DrillQuestion {
  question: string;
  questionSpanish?: string;
  correctAnswer: string;
  options: string[];
  type: DrillType;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateNumberQuestion(): DrillQuestion {
  const questionTypes = ['recognize', 'translate', 'ordinal'];
  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  if (type === 'ordinal') {
    const ordinal = ordinalNumbers[Math.floor(Math.random() * ordinalNumbers.length)];
    const wrongOptions = shuffleArray(ordinalNumbers.filter(o => o.value !== ordinal.value))
      .slice(0, 3)
      .map(o => o.spanish);
    return {
      question: `What is "${ordinal.value}${getOrdinalSuffix(ordinal.value)}" in Spanish?`,
      correctAnswer: ordinal.spanish,
      options: shuffleArray([ordinal.spanish, ...wrongOptions]),
      type: 'numbers',
    };
  }

  const num = getRandomNumber(0, 100);
  if (type === 'recognize') {
    const wrongOptions = shuffleArray(cardinalNumbers.filter(n => n.value !== num.value && n.value <= 100))
      .slice(0, 3)
      .map(n => n.spanish);
    return {
      question: `What is ${num.value} in Spanish?`,
      correctAnswer: num.spanish,
      options: shuffleArray([num.spanish, ...wrongOptions]),
      type: 'numbers',
    };
  } else {
    const wrongOptions = shuffleArray(cardinalNumbers.filter(n => n.value !== num.value && n.value <= 100))
      .slice(0, 3)
      .map(n => n.value.toString());
    return {
      question: `What number is "${num.spanish}"?`,
      questionSpanish: num.spanish,
      correctAnswer: num.value.toString(),
      options: shuffleArray([num.value.toString(), ...wrongOptions]),
      type: 'numbers',
    };
  }
}

function generateTimeQuestion(): DrillQuestion {
  const time = getRandomTimeExpression();
  const questionTypes = ['readTime', 'sayTime'];
  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  if (type === 'readTime') {
    const wrongOptions = shuffleArray(timeExpressions.filter(t => t.spanish !== time.spanish))
      .slice(0, 3)
      .map(t => t.english);
    return {
      question: `What time is it? "${time.spanish}"`,
      questionSpanish: time.spanish,
      correctAnswer: time.english,
      options: shuffleArray([time.english, ...wrongOptions]),
      type: 'time',
    };
  } else {
    const wrongOptions = shuffleArray(timeExpressions.filter(t => t.spanish !== time.spanish))
      .slice(0, 3)
      .map(t => t.spanish);
    return {
      question: `How do you say "${time.english}" in Spanish?`,
      correctAnswer: time.spanish,
      options: shuffleArray([time.spanish, ...wrongOptions]),
      type: 'time',
    };
  }
}

function generateDateQuestion(): DrillQuestion {
  const allDateWords = [...daysOfWeek, ...monthsOfYear, ...seasons];
  const dateWord = allDateWords[Math.floor(Math.random() * allDateWords.length)];
  const sameTypeWords = allDateWords.filter(d => d.type === dateWord.type && d.id !== dateWord.id);
  const wrongOptions = shuffleArray(sameTypeWords).slice(0, 3).map(d => d.spanish);

  const typeLabel = dateWord.type === 'day' ? 'day of the week' : dateWord.type === 'month' ? 'month' : 'season';

  return {
    question: `What is "${dateWord.english}" in Spanish? (${typeLabel})`,
    correctAnswer: dateWord.spanish,
    options: shuffleArray([dateWord.spanish, ...wrongOptions]),
    type: 'dates',
  };
}

function generateMathQuestion(): DrillQuestion {
  const problem = getRandomMathProblem();
  const wrongAnswers = [
    problem.answer + Math.floor(Math.random() * 5) + 1,
    problem.answer - Math.floor(Math.random() * 5) - 1,
    problem.answer + Math.floor(Math.random() * 10) + 5,
  ].filter(n => n > 0 && n !== problem.answer);

  return {
    question: problem.questionSpanish,
    questionSpanish: problem.questionSpanish,
    correctAnswer: problem.answer.toString(),
    options: shuffleArray([problem.answer.toString(), ...wrongAnswers.slice(0, 3).map(n => n.toString())]),
    type: 'math',
  };
}

function getOrdinalSuffix(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

function DrillGame({ drillType, onBack }: { drillType: DrillType; onBack: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState<DrillQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const generateQuestion = () => {
    switch (drillType) {
      case 'numbers':
        return generateNumberQuestion();
      case 'time':
        return generateTimeQuestion();
      case 'dates':
        return generateDateQuestion();
      case 'math':
        return generateMathQuestion();
    }
  };

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, [drillType]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    setTotalQuestions(prev => prev + 1);
    if (answer === currentQuestion?.correctAnswer) {
      setScore(prev => prev + 1);
    }
    setShowResult(true);

    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentQuestion(generateQuestion());
    }, 1500);
  };

  const handleSpeak = (text: string) => {
    speak(text, 0.85);
  };

  const drillTitles: Record<DrillType, string> = {
    numbers: 'Number Recognition',
    time: 'Telling Time',
    dates: 'Days, Months & Seasons',
    math: 'Math in Spanish',
  };

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {drillTitles[drillType]}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Score: {score} / {totalQuestions}
          </p>
        </div>
        <Button variant="ghost" onClick={onBack}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Back to Drills
        </Button>
      </div>

      <Card className="p-8">
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-xl text-gray-900 dark:text-white font-medium">
              {currentQuestion.question}
            </p>
            {currentQuestion.questionSpanish && (
              <button
                onClick={() => handleSpeak(currentQuestion.questionSpanish!)}
                className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600"
              >
                <Volume2 className="w-5 h-5" />
                Listen
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            {currentQuestion.options.map((option, idx) => {
              const isCorrect = option === currentQuestion.correctAnswer;
              const isSelected = option === selectedAnswer;
              let buttonClass = 'p-4 text-lg font-medium rounded-xl border-2 transition-all ';

              if (showResult) {
                if (isCorrect) {
                  buttonClass += 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-300';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-300';
                } else {
                  buttonClass += 'bg-gray-100 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700';
                }
              } else {
                buttonClass += 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className={`flex items-center justify-center gap-2 text-lg font-medium ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Correcto!
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6" />
                  The answer is: {currentQuestion.correctAnswer}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-64">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all"
            style={{ width: `${totalQuestions > 0 ? (score / totalQuestions) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function PracticePage() {
  const [selectedDrill, setSelectedDrill] = useState<DrillType | null>(null);
  const { getTeacherBySpecialty } = useTeachers();
  const teacher = getTeacherBySpecialty('practice');

  const drills = [
    {
      id: 'numbers' as DrillType,
      title: 'Numbers',
      titleSpanish: 'Numeros',
      description: 'Practice recognizing and translating numbers from 0 to 1000',
      icon: Hash,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      id: 'time' as DrillType,
      title: 'Telling Time',
      titleSpanish: 'La Hora',
      description: 'Learn to tell time in Spanish with clock exercises',
      icon: Clock,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
    {
      id: 'dates' as DrillType,
      title: 'Days, Months & Seasons',
      titleSpanish: 'Dias, Meses y Estaciones',
      description: 'Master days of the week, months, and seasons',
      icon: Calendar,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
      id: 'math' as DrillType,
      title: 'Math in Spanish',
      titleSpanish: 'Matematicas',
      description: 'Solve simple math problems with Spanish numbers',
      icon: Calculator,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    },
  ];

  if (selectedDrill) {
    return <DrillGame drillType={selectedDrill} onBack={() => setSelectedDrill(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Practica / Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Master numbers, time, and dates with interactive drills
        </p>
      </div>

      <TeacherBubble
        teacher={teacher}
        message="Los numeros son muy importantes! Practica conmigo para dominarlos."
        messageTranslation="Numbers are very important! Practice with me to master them."
        size="medium"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {drills.map((drill) => {
          const Icon = drill.icon;
          return (
            <Card
              key={drill.id}
              hover
              className="cursor-pointer"
              onClick={() => setSelectedDrill(drill.id)}
            >
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl ${drill.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <CardTitle>{drill.title}</CardTitle>
                <p className="text-sm text-primary-500 font-medium">{drill.titleSpanish}</p>
                <CardDescription className="mt-2">{drill.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
