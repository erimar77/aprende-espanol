'use client';

import { useState } from 'react';
import { Volume2, RotateCcw, Check, X } from 'lucide-react';
import { speak } from '@/lib/speech';

interface FlashCardProps {
  front: string;
  back: string;
  frontLabel?: string;
  backLabel?: string;
  synonyms?: string[];
  antonyms?: string[];
  onCorrect?: () => void;
  onIncorrect?: () => void;
  onRate?: (quality: 1 | 3 | 4 | 5) => void;
  showControls?: boolean;
  useQualityRating?: boolean;
  autoSpeak?: boolean;
  className?: string;
}

export default function FlashCard({
  front,
  back,
  frontLabel = 'Spanish',
  backLabel = 'English',
  synonyms = [],
  antonyms = [],
  onCorrect,
  onIncorrect,
  onRate,
  showControls = true,
  useQualityRating = false,
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

  const hasSynonyms = synonyms.length > 0;
  const hasAntonyms = antonyms.length > 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Main row: antonyms | card | synonyms */}
      <div className="flex items-center justify-center gap-4">
        {/* Antonyms - Left side (opposites) */}
        <div className="hidden md:block w-40 flex-shrink-0">
          <div
            className={`transition-all duration-500 ${
              isFlipped && hasAntonyms ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
            }`}
          >
            <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800">
              <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-1.5 flex items-center gap-1">
                <span className="text-rose-500">&harr;</span> Antónimos
              </div>
              <div className="flex flex-wrap gap-1.5">
                {antonyms.slice(0, 3).map((ant, i) => (
                  <span
                    key={i}
                    className="text-sm px-2 py-0.5 bg-rose-100 dark:bg-rose-800/40 text-rose-800 dark:text-rose-300 rounded-full"
                  >
                    {ant}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-md">
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
        </div>

        {/* Synonyms - Right side (similar) */}
        <div className="hidden md:block w-40 flex-shrink-0">
          <div
            className={`transition-all duration-500 ${
              isFlipped && hasSynonyms ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
            }`}
          >
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1">
                <span className="text-emerald-500">&asymp;</span> Sinónimos
              </div>
              <div className="flex flex-wrap gap-1.5">
                {synonyms.slice(0, 3).map((syn, i) => (
                  <span
                    key={i}
                    className="text-sm px-2 py-0.5 bg-emerald-100 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-300 rounded-full"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: antonyms & synonyms below card */}
      {(hasSynonyms || hasAntonyms) && (
        <div
          className={`md:hidden mt-3 transition-all duration-500 ${
            isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex justify-center gap-3 max-w-md mx-auto">
            {hasAntonyms && (
              <div className="flex-1 bg-rose-50 dark:bg-rose-900/20 rounded-lg p-2.5 border border-rose-200 dark:border-rose-800">
                <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-1 flex items-center gap-1">
                  <span className="text-rose-500">&harr;</span> Antónimos
                </div>
                <div className="flex flex-wrap gap-1">
                  {antonyms.slice(0, 3).map((ant, i) => (
                    <span key={i} className="text-xs px-1.5 py-0.5 bg-rose-100 dark:bg-rose-800/40 text-rose-800 dark:text-rose-300 rounded-full">
                      {ant}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {hasSynonyms && (
              <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2.5 border border-emerald-200 dark:border-emerald-800">
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                  <span className="text-emerald-500">&asymp;</span> Sinónimos
                </div>
                <div className="flex flex-wrap gap-1">
                  {synonyms.slice(0, 3).map((syn, i) => (
                    <span key={i} className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-300 rounded-full">
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls - always in a fixed position */}
      {showControls && useQualityRating && onRate ? (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={(e) => { e.stopPropagation(); onRate(1); }}
            className="flex flex-col items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors min-w-[72px]"
          >
            <span className="font-semibold text-sm">Again</span>
            <span className="text-xs opacity-75">10m</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRate(3); }}
            className="flex flex-col items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors min-w-[72px]"
          >
            <span className="font-semibold text-sm">Hard</span>
            <span className="text-xs opacity-75">1d</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors self-center"
            aria-label="Flip back"
          >
            <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRate(4); }}
            className="flex flex-col items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors min-w-[72px]"
          >
            <span className="font-semibold text-sm">Good</span>
            <span className="text-xs opacity-75">next</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRate(5); }}
            className="flex flex-col items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors min-w-[72px]"
          >
            <span className="font-semibold text-sm">Easy</span>
            <span className="text-xs opacity-75">skip</span>
          </button>
        </div>
      ) : showControls && (
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
