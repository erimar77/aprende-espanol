'use client';

import { useState, useCallback, useRef } from 'react';
import { ChevronLeft, Award, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import type {
  GrammarLesson,
  NarrativeStep,
  DiscoverStep,
  ExplainStep,
  PracticeStep,
  DragOrderStep,
  FillTableStep,
  ColorMatchStep,
} from '@/lib/types';
import { NarrativeRenderer } from './steps/NarrativeRenderer';
import { DiscoverRenderer } from './steps/DiscoverRenderer';
import { ExplainRenderer } from './steps/ExplainRenderer';
import { PracticeRenderer } from './steps/PracticeRenderer';
import { DragOrderRenderer } from './steps/DragOrderRenderer';
import { FillTableRenderer } from './steps/FillTableRenderer';
import { ColorMatchRenderer } from './steps/ColorMatchRenderer';

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
        <Button variant="ghost" onClick={onBack} aria-label="Go back to lessons list">
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
          aria-label="Go to previous step"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Previous step
        </button>
      )}
    </div>
  );
}
