'use client';

import { ChevronRight, Lightbulb, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { ExplainStep } from '@/lib/types';

export function ExplainRenderer({ step, onContinue }: { step: ExplainStep; onContinue: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{step.title}</h3>
      </div>

      <p className="text-gray-700 dark:text-gray-300">{step.content}</p>

      {step.table && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-primary/10 dark:bg-primary/20">
              <tr>
                {step.table.headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {step.table.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className={
                    ri % 2 === 0
                      ? 'bg-white dark:bg-gray-900'
                      : 'bg-gray-50 dark:bg-gray-800/50'
                  }
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {step.tip && (
        <div className="bg-secondary-100 dark:bg-secondary-900/30 border-l-4 border-secondary-500 p-4 rounded-r-lg">
          <p className="text-sm text-gray-800 dark:text-gray-200">
            <Lightbulb className="w-4 h-4 inline mr-1 text-secondary-600" />
            <strong>Tip:</strong> {step.tip}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onContinue} size="sm">
          Got it <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
