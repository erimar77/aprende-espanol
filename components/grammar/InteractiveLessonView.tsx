'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  MessageCircle,
  Lightbulb,
  Eye,
  Sparkles,
  GripVertical,
  Award,
  RotateCcw,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import type {
  GrammarLesson,
  InteractiveStep,
  NarrativeStep,
  DiscoverStep,
  ExplainStep,
  PracticeStep,
  DragOrderStep,
  FillTableStep,
  ColorMatchStep,
} from '@/lib/types';

// ── Narrative Step ──────────────────────────────────────────────────────

function NarrativeRenderer({ step, onContinue }: { step: NarrativeStep; onContinue: () => void }) {
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

// ── Discover Step ───────────────────────────────────────────────────────

function DiscoverRenderer({ step, onContinue }: { step: DiscoverStep; onContinue: () => void }) {
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

// ── Explain Step ────────────────────────────────────────────────────────

function ExplainRenderer({ step, onContinue }: { step: ExplainStep; onContinue: () => void }) {
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

// ── Practice Step ───────────────────────────────────────────────────────

function PracticeRenderer({
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
            value={submitted ? answer : undefined}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitted}
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

// ── Drag-Order Step ─────────────────────────────────────────────────────

function DragOrderRenderer({
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
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50"
          >
            <GripVertical className="w-3 h-3 inline mr-1 opacity-50" />
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

// ── Fill-Table Step ─────────────────────────────────────────────────────

function FillTableRenderer({
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

// ── Color-Match Step ────────────────────────────────────────────────────

function ColorMatchRenderer({ step, onContinue }: { step: ColorMatchStep; onContinue: () => void }) {
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

// ── Main Interactive Lesson View ────────────────────────────────────────

export default function InteractiveLessonView({
  lesson,
  onBack,
  onComplete,
}: {
  lesson: GrammarLesson;
  onBack: () => void;
  onComplete: (correctCount: number, totalPractice: number) => void;
}) {
  const steps = lesson.interactiveSteps || [];
  const [currentStep, setCurrentStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [practiceCount, setPracticeCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const stepContainerRef = useRef<HTMLDivElement>(null);

  const totalPracticeSteps = steps.filter(
    (s) => s.type === 'practice' || s.type === 'discover' || s.type === 'drag-order' || s.type === 'fill-table'
  ).length;

  const goNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((c) => c + 1);
      stepContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setCompleted(true);
      onComplete(correctCount, practiceCount);
    }
  }, [currentStep, steps.length, correctCount, practiceCount, onComplete]);

  const handleResult = useCallback((correct: boolean) => {
    setPracticeCount((c) => c + 1);
    if (correct) setCorrectCount((c) => c + 1);
  }, []);

  if (completed) {
    const pct = practiceCount > 0 ? Math.round((correctCount / practiceCount) * 100) : 100;
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Award className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Lesson Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            {lesson.title}
          </p>
          {practiceCount > 0 && (
            <p className="text-lg font-semibold text-primary mt-3">
              {correctCount}/{practiceCount} correct ({pct}%)
            </p>
          )}
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" onClick={() => { setCurrentStep(0); setCompleted(false); setCorrectCount(0); setPracticeCount(0); }}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Redo Lesson
            </Button>
            <Button onClick={onBack}>
              Next Lesson
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-6" ref={stepContainerRef}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
          <p className="text-primary-500 font-medium">{lesson.titleSpanish}</p>
        </div>
        <Button variant="ghost" onClick={onBack}>
          Back to Lessons
        </Button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {step.type === 'narrative' && (
          <NarrativeRenderer step={step as NarrativeStep} onContinue={goNext} />
        )}
        {step.type === 'discover' && (
          <DiscoverRenderer step={step as DiscoverStep} onContinue={goNext} />
        )}
        {step.type === 'explain' && (
          <ExplainRenderer step={step as ExplainStep} onContinue={goNext} />
        )}
        {step.type === 'practice' && (
          <PracticeRenderer step={step as PracticeStep} onContinue={goNext} onResult={handleResult} />
        )}
        {step.type === 'drag-order' && (
          <DragOrderRenderer step={step as DragOrderStep} onContinue={goNext} onResult={handleResult} />
        )}
        {step.type === 'fill-table' && (
          <FillTableRenderer step={step as FillTableStep} onContinue={goNext} onResult={handleResult} />
        )}
        {step.type === 'color-match' && (
          <ColorMatchRenderer step={step as ColorMatchStep} onContinue={goNext} />
        )}
      </div>

      {/* Back button */}
      {currentStep > 0 && (
        <button
          onClick={() => setCurrentStep((c) => c - 1)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous step
        </button>
      )}
    </div>
  );
}
