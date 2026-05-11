'use client';

import { useState } from 'react';
import { ChevronRight, CheckCircle, XCircle, GripVertical } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { DragOrderStep } from '@/lib/types';

export function DragOrderRenderer({
  step,
  onContinue,
  onResult,
}: {
  step: DragOrderStep;
  onContinue: () => void;
  onResult: (correct: boolean) => void;
}) {
  const [available, setAvailable] = useState<string[]>(() => {
    if (step.scrambled) return [...step.scrambled];
    const shuffled = [...step.correctOrder];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  const [placed, setPlaced] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const isCorrect = placed.join(' ') === step.correctOrder.join(' ');

  const addWord = (word: string, idx: number) => {
    if (checked) return;
    setPlaced((p) => [...p, word]);
    setAvailable((a) => a.filter((_, i) => i !== idx));
  };

  const removeWord = (idx: number) => {
    if (checked) return;
    const word = placed[idx];
    setPlaced((p) => p.filter((_, i) => i !== idx));
    setAvailable((a) => [...a, word]);
  };

  const handleCheck = () => {
    setChecked(true);
    onResult(isCorrect);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-700 dark:text-gray-300 font-medium">{step.instruction}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 italic">{step.translation}</p>

      {/* Drop zone */}
      <div className="min-h-[56px] bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-3 flex flex-wrap gap-2">
        {placed.length === 0 && (
          <span className="text-sm text-gray-400 italic">Tap words below to build the sentence...</span>
        )}
        {placed.map((word, i) => (
          <button
            key={`${word}-${i}`}
            onClick={() => removeWord(i)}
            aria-label={`Remove ${word} from sentence`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              checked
                ? word === step.correctOrder[i]
                  ? 'bg-green-100 border-green-400 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                  : 'bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                : 'bg-primary/10 border-primary/30 text-primary-700 dark:text-primary-300 hover:bg-primary/20 cursor-pointer'
            }`}
            disabled={checked}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2">
        {available.map((word, i) => (
          <button
            key={`${word}-${i}`}
            onClick={() => addWord(word, i)}
            disabled={checked}
            aria-label={`Add ${word} to sentence`}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50"
          >
            <GripVertical className="w-3 h-3 inline mr-1 opacity-50" aria-hidden="true" />
            {word}
          </button>
        ))}
      </div>

      {/* Check button */}
      {placed.length === step.correctOrder.length && !checked && (
        <Button onClick={handleCheck} size="sm">
          Check Order
        </Button>
      )}

      {/* Result */}
      {checked && (
        <div
          className={`p-3 rounded-lg animate-fade-in ${
            isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm font-medium">
              {isCorrect ? 'Perfect order!' : `Correct: ${step.correctOrder.join(' ')}`}
            </span>
          </div>
        </div>
      )}

      {checked && (
        <div className="flex justify-end">
          <Button onClick={onContinue} size="sm">
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
