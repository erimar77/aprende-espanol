'use client';

import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { CulturalNote as CulturalNoteType } from '@/lib/types';

interface CulturalNoteProps {
  note: CulturalNoteType;
  defaultExpanded?: boolean;
}

export default function CulturalNote({ note, defaultExpanded = true }: CulturalNoteProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-200 dark:bg-amber-800 rounded-lg">
            <Lightbulb className="w-5 h-5 text-amber-700 dark:text-amber-300" />
          </div>
          <div>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              Cultural Note
            </span>
            <h4 className="font-semibold text-amber-900 dark:text-amber-100">
              {note.title}
            </h4>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <p className="text-amber-800 dark:text-amber-200 leading-relaxed pl-14">
            {note.content}
          </p>
        </div>
      )}
    </div>
  );
}
