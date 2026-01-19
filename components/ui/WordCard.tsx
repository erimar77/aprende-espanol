'use client';

import { Volume2 } from 'lucide-react';
import { speak } from '@/lib/speech';
import { Word } from '@/lib/types';

interface WordCardProps {
  word: Word;
  showExample?: boolean;
  compact?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function WordCard({
  word,
  showExample = false,
  compact = false,
  onClick,
  className = '',
}: WordCardProps) {
  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await speak(word.spanish, 0.85);
  };

  const genderColor = word.gender === 'masculine'
    ? 'text-blue-500'
    : word.gender === 'feminine'
    ? 'text-pink-500'
    : 'text-gray-500';

  const genderArticle = word.gender === 'masculine' ? 'el' : word.gender === 'feminine' ? 'la' : '';

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors cursor-pointer ${className}`}
      >
        <div className="flex items-center gap-2">
          {genderArticle && (
            <span className={`text-sm font-medium ${genderColor}`}>
              {genderArticle}
            </span>
          )}
          <span className="font-medium text-gray-900 dark:text-white">
            {word.spanish}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {word.english}
          </span>
          <button
            onClick={handleSpeak}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Listen to pronunciation"
          >
            <Volume2 className="w-4 h-4 text-gray-400 hover:text-primary-500" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {genderArticle && (
              <span className={`text-lg font-medium ${genderColor}`}>
                {genderArticle}
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {word.spanish}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{word.english}</p>
        </div>
        <button
          onClick={handleSpeak}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Listen to pronunciation"
        >
          <Volume2 className="w-5 h-5 text-gray-400 hover:text-primary-500" />
        </button>
      </div>

      {word.plural && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span className="font-medium">Plural:</span> {word.plural}
        </p>
      )}

      {showExample && word.example && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            "{word.example}"
          </p>
          {word.exampleTranslation && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              "{word.exampleTranslation}"
            </p>
          )}
        </div>
      )}

      <div className="mt-3">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full capitalize">
          {word.category}
        </span>
      </div>
    </div>
  );
}
