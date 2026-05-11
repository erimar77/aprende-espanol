'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, MessageCircle, Eye } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { NarrativeStep } from '@/lib/types';

export function NarrativeRenderer({ step, onContinue }: { step: NarrativeStep; onContinue: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (visibleLines < step.lines.length) {
      const timer = setTimeout(() => setVisibleLines((v) => v + 1), 800);
      return () => clearTimeout(timer);
    } else if (step.noticePrompt) {
      const timer = setTimeout(() => setShowNotice(true), 600);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, step.lines.length, step.noticePrompt]);

  return (
    <div className="space-y-4">
      {/* Scene setting */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 dark:from-accent/20 dark:to-primary/20 rounded-lg p-4 border border-accent/20">
        <p className="text-sm italic text-gray-600 dark:text-gray-300">{step.scene}</p>
      </div>

      {/* Dialogue lines */}
      <div className="space-y-3">
        {step.lines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className="flex gap-3 animate-fade-in"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-xs font-semibold text-primary mb-1">{line.speaker}</div>
              <p className="text-gray-900 dark:text-white font-medium">
                {line.highlight ? (
                  <>
                    {line.text.split(line.highlight).map((part, j) => (
                      <span key={j}>
                        {part}
                        {j < line.text.split(line.highlight!).length - 1 && (
                          <span className="bg-yellow-200 dark:bg-yellow-700 px-1 rounded font-bold">
                            {line.highlight}
                          </span>
                        )}
                      </span>
                    ))}
                  </>
                ) : (
                  line.text
                )}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
                {line.translation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Notice prompt */}
      {showNotice && step.noticePrompt && (
        <div className="bg-secondary-100 dark:bg-secondary-900/30 border border-secondary-300 dark:border-secondary-700 rounded-lg p-4 mt-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-secondary-600" />
            <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
              Did you notice?
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{step.noticePrompt}</p>
        </div>
      )}

      {/* Continue */}
      {visibleLines >= step.lines.length && (
        <div className="flex justify-end pt-2">
          <Button onClick={onContinue} size="sm">
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
