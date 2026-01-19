'use client';

import { useState } from 'react';
import { Volume2, RotateCcw, Check, X } from 'lucide-react';
import { speak } from '@/lib/speech';

interface FlashCardProps {
  front: string;
  back: string;
  frontLabel?: string;
  backLabel?: string;
  onCorrect?: () => void;
  onIncorrect?: () => void;
  showControls?: boolean;
  autoSpeak?: boolean;
  className?: string;
}

export default function FlashCard({
  front,
  back,
  frontLabel = 'Spanish',
  backLabel = 'English',
  onCorrect,
  onIncorrect,
  showControls = true,
  autoSpeak = false,
  className = '',
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await speak(front, 0.85);
  };

  const handleCorrect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCorrect?.();
  };

  const handleIncorrect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIncorrect?.();
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
  };

  return (
    <div className={`w-full max-w-md ${className}`}>
      <div
        className="flashcard h-64 cursor-pointer"
        onClick={handleFlip}
      >
        <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flashcard-front bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 flex flex-col items-center justify-center shadow-xl">
            <span className="text-xs uppercase tracking-wider opacity-75 mb-2">
              {frontLabel}
            </span>
            <span className="text-3xl font-bold text-center">{front}</span>
            <button
              onClick={handleSpeak}
              className="mt-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Listen to pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <span className="mt-4 text-sm opacity-75">Click to reveal</span>
          </div>

          {/* Back */}
          <div className="flashcard-back bg-gradient-to-br from-accent-500 to-accent-600 text-white p-6 flex flex-col items-center justify-center shadow-xl">
            <span className="text-xs uppercase tracking-wider opacity-75 mb-2">
              {backLabel}
            </span>
            <span className="text-3xl font-bold text-center">{back}</span>
            <div className="mt-4 text-sm opacity-75">
              <span className="text-secondary-300">{front}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleIncorrect}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Needs Practice</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
            aria-label="Flip back"
          >
            <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleCorrect}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Got It!</span>
          </button>
        </div>
      )}
    </div>
  );
}
