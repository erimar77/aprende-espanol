'use client';

import { useState } from 'react';
import { ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { PracticeStep } from '@/lib/types';

export function PracticeRenderer({
  step,
  onContinue,
  onResult,
}: {
  step: PracticeStep;
  onContinue: () => void;
  onResult: (correct: boolean) => void;
}) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const isCorrect =
    step.variant === 'fill-blank' || step.variant === 'translate'
      ? answer.trim().toLowerCase() === (step.correctAnswer as string).toLowerCase()
      : answer === step.correctAnswer;

  const handleSubmit = (val: string) => {
    setAnswer(val);
    setSubmitted(true);
    onResult(
      step.variant === 'fill-blank' || step.variant === 'translate'
        ? val.trim().toLowerCase() === (step.correctAnswer as string).toLowerCase()
        : val === step.correctAnswer
    );
  };

  return (
    <div className="space-y-3">
      {step.context && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">{step.context}</p>
      )}
      <p className="text-gray-900 dark:text-white font-medium">{step.question}</p>

      {step.variant === 'multiple-choice' && step.options && (
        <div className="grid grid-cols-2 gap-2">
          {step.options.map((opt) => {
            let cls = 'p-3 rounded-lg border-2 text-sm font-medium transition-all text-left ';
            if (!submitted) {
              cls += 'border-gray-200 dark:border-gray-600 hover:border-primary bg-white dark:bg-gray-800 cursor-pointer';
            } else if (opt === step.correctAnswer) {
              cls += 'border-green-500 bg-green-50 dark:bg-green-900/30';
            } else if (opt === answer) {
              cls += 'border-red-500 bg-red-50 dark:bg-red-900/30';
            } else {
              cls += 'border-gray-200 dark:border-gray-600 opacity-50 bg-white dark:bg-gray-800';
            }
            return (
              <button
                key={opt}
                onClick={() => !submitted && handleSubmit(opt)}
                disabled={submitted}
                aria-label={`Select ${opt}`}
                className={cls}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {(step.variant === 'fill-blank' || step.variant === 'translate') && (
        <div className="flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitted}
            aria-label={step.variant === 'translate' ? 'Translate to Spanish' : 'Fill in the blank'}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            placeholder="Type your answer..."
            onKeyDown={(e) => e.key === 'Enter' && !submitted && handleSubmit(answer)}
          />
          {!submitted && (
            <Button onClick={() => handleSubmit(answer)} size="sm">
              Check
            </Button>
          )}
        </div>
      )}

      {/* Hint */}
      {step.hint && !submitted && (
        <button
          onClick={() => setShowHint(true)}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {showHint ? step.hint : 'Need a hint?'}
        </button>
      )}

      {/* Feedback */}
      {submitted && (
        <div
          className={`p-3 rounded-lg animate-fade-in ${
            isCorrect
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            {isCorrect ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm font-medium">
              {isCorrect ? 'Correct!' : `The answer is "${step.correctAnswer}"`}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">{step.explanation}</p>
        </div>
      )}

      {submitted && (
        <div className="flex justify-end">
          <Button onClick={onContinue} size="sm">
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
