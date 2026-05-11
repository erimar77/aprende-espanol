'use client';

import { useState } from 'react';
import { ChevronRight, Lightbulb } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { FillTableStep } from '@/lib/types';

export function FillTableRenderer({
  step,
  onContinue,
  onResult,
}: {
  step: FillTableStep;
  onContinue: () => void;
  onResult: (correct: boolean) => void;
}) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const editableCells = step.rows.flatMap((row, ri) =>
    row.cells.map((cell, ci) => (cell.editable ? { ri, ci, value: cell.value } : null)).filter(Boolean)
  ) as { ri: number; ci: number; value: string }[];

  const allFilled = editableCells.every((c) => inputs[`${c.ri}-${c.ci}`]?.trim());

  const handleCheck = () => {
    setChecked(true);
    const allCorrect = editableCells.every(
      (c) => inputs[`${c.ri}-${c.ci}`]?.trim().toLowerCase() === c.value.toLowerCase()
    );
    onResult(allCorrect);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-700 dark:text-gray-300 font-medium">{step.instruction}</p>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-primary/10 dark:bg-primary/20">
            <tr>
              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300" />
              {step.headers.map((h, i) => (
                <th
                  key={i}
                  className="px-3 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {step.rows.map((row, ri) => (
              <tr
                key={ri}
                className={ri % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}
              >
                <td className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {row.label}
                </td>
                {row.cells.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2">
                    {cell.editable ? (
                      <input
                        type="text"
                        value={checked ? cell.value : inputs[`${ri}-${ci}`] || ''}
                        onChange={(e) =>
                          setInputs((prev) => ({ ...prev, [`${ri}-${ci}`]: e.target.value }))
                        }
                        disabled={checked}
                        aria-label={`Enter value for ${step.headers[ci]}`}
                        className={`w-full px-2 py-1 text-sm border rounded ${
                          checked
                            ? inputs[`${ri}-${ci}`]?.trim().toLowerCase() === cell.value.toLowerCase()
                              ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary'
                        }`}
                        placeholder="..."
                      />
                    ) : (
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {cell.value}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {step.tip && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          <Lightbulb className="w-3 h-3 inline mr-1" />
          {step.tip}
        </p>
      )}

      {allFilled && !checked && (
        <Button onClick={handleCheck} size="sm">
          Check Answers
        </Button>
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
