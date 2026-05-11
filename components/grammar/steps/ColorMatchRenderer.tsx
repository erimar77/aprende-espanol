'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { ColorMatchStep } from '@/lib/types';

export function ColorMatchRenderer({ step, onContinue }: { step: ColorMatchStep; onContinue: () => void }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const toggle = (i: number) => {
    setSelectedIdx(i);
    setRevealed((prev) => new Set(prev).add(i));
  };

  const allRevealed = revealed.size === step.segments.length;

  return (
    <div className="space-y-4">
      <p className="text-gray-700 dark:text-gray-300 font-medium">{step.instruction}</p>

      {/* Sentence with tappable segments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-1 text-lg">
          {step.segments.map((seg, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              aria-label={`Highlight ${seg.text} as ${seg.role}`}
              className={`px-2 py-1 rounded transition-all text-lg font-medium ${
                revealed.has(i)
                  ? `text-white`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              style={revealed.has(i) ? { backgroundColor: seg.color } : {}}
            >
              {seg.text}
            </button>
          ))}
        </div>
      </div>

      {/* Role label for selected */}
      {selectedIdx !== null && (
        <div
          className="p-3 rounded-lg text-white text-sm font-semibold animate-fade-in text-center"
          style={{ backgroundColor: step.segments[selectedIdx].color }}
        >
          {step.segments[selectedIdx].role}
        </div>
      )}

      {/* Legend when all revealed */}
      {allRevealed && (
        <div className="flex flex-wrap gap-3 animate-fade-in">
          {step.segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-gray-600 dark:text-gray-400">{seg.role}</span>
            </div>
          ))}
        </div>
      )}

      {allRevealed && (
        <div className="flex justify-end">
          <Button onClick={onContinue} size="sm">
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
