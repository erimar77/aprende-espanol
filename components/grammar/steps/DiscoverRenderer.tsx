'use client';

import { useState } from 'react';
import { ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { DiscoverStep } from '@/lib/types';

export function DiscoverRenderer({ step, onContinue }: { step: DiscoverStep; onContinue: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const isCorrect = selected === step.correctAnswer;

  return (
    <div className="space-y-4">
      <p className="text-gray-700 dark:text-gray-300 font-medium">{step.instruction}</p>

      {/* Examples */}
      <div className="grid gap-2">
        {step.examples.map((ex, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex items-center gap-4"
          >
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white font-medium">
                {ex.highlight ? (
                  <>
                    {ex.spanish.split(ex.highlight).map((part, j) => (
                      <span key={j}>
                        {part}
                        {j < ex.spanish.split(ex.highlight!).length - 1 && (
                          <span className="bg-yellow-200 dark:bg-yellow-700 px-1 rounded font-bold">
                            {ex.highlight}
                          </span>
                        )}
                      </span>
                    ))}
                  </>
                ) : (
                  ex.spanish
                )}
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">{ex.english}</p>
          </div>
        ))}
      </div>

      {/* Question */}
      <div className="bg-accent/5 dark:bg-accent/10 rounded-lg p-4 border border-accent/20">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {step.question}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {step.options.map((opt) => {
            let cls =
              'p-3 rounded-lg border-2 text-left text-sm font-medium transition-all cursor-pointer ';
            if (!selected) {
              cls += 'border-gray-200 dark:border-gray-600 hover:border-primary bg-white dark:bg-gray-800';
            } else if (opt === step.correctAnswer) {
              cls += 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200';
            } else if (opt === selected) {
              cls += 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200';
            } else {
              cls += 'border-gray-200 dark:border-gray-600 opacity-50 bg-white dark:bg-gray-800';
            }
            return (
              <button
                key={opt}
                onClick={() => !selected && setSelected(opt)}
                disabled={!!selected}
                aria-label={`Select ${opt}`}
                className={cls}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {selected && (
        <div
          className={`p-4 rounded-lg ${
            isCorrect
              ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
              : 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700'
          } animate-fade-in`}
        >
          <div className="flex items-center gap-2 mb-1">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-semibold text-sm">
              {isCorrect ? 'Exactly!' : `Not quite — the answer is "${step.correctAnswer}"`}
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{step.explanation}</p>
        </div>
      )}

      {selected && (
        <div className="flex justify-end">
          <Button onClick={onContinue} size="sm">
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
