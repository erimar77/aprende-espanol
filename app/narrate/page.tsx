'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mic, Clock, ChevronRight, Filter, BookOpen, Sparkles } from 'lucide-react';
import Card, { CardContent, CardDescription, CardTitle } from '@/components/ui/Card';
import { narrationPrompts } from '@/data/narration-prompts';
import { useState } from 'react';

const difficultyColors = {
  beginner: 'bg-green-500',
  intermediate: 'bg-blue-500',
  advanced: 'bg-purple-500',
};

const difficultyLabels = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

export default function NarratePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredPrompts = selectedDifficulty === 'all'
    ? narrationPrompts
    : narrationPrompts.filter(p => p.difficulty === selectedDifficulty);

  const beginnerCount = narrationPrompts.filter(p => p.difficulty === 'beginner').length;
  const intermediateCount = narrationPrompts.filter(p => p.difficulty === 'intermediate').length;
  const advancedCount = narrationPrompts.filter(p => p.difficulty === 'advanced').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Narrar / Story Narration
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Practice retelling stories in your own words. Great for building fluency!
        </p>
      </div>


      {/* How It Works */}
      <Card className="border-l-4 border-l-primary-500">
        <CardContent>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            How It Works
          </h2>
          <ol className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Read the story summary to remember what happens</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Narrate the story out loud in Spanish, using your own words</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Use the hints section if you get stuck (vocabulary, connectors, sentence starters)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Check off plot points as you cover them</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-bold">5</span>
              <span>Compare your narration with the model answer</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Difficulty Filter */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedDifficulty('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedDifficulty === 'all'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          All ({narrationPrompts.length})
        </button>
        <button
          onClick={() => setSelectedDifficulty('beginner')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedDifficulty === 'beginner'
              ? 'bg-green-500 text-white'
              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
          }`}
        >
          Beginner ({beginnerCount})
        </button>
        <button
          onClick={() => setSelectedDifficulty('intermediate')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedDifficulty === 'intermediate'
              ? 'bg-blue-500 text-white'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
          }`}
        >
          Intermediate ({intermediateCount})
        </button>
        {advancedCount > 0 && (
          <button
            onClick={() => setSelectedDifficulty('advanced')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedDifficulty === 'advanced'
                ? 'bg-purple-500 text-white'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50'
            }`}
          >
            Advanced ({advancedCount})
          </button>
        )}
      </div>

      {/* Story Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredPrompts.map((prompt) => (
          <Link key={prompt.storyId} href={`/narrate/${prompt.storyId}`}>
            <Card hover className="h-full overflow-hidden">
              <div className="relative h-40 w-full">
                <Image
                  src={prompt.imageUrl}
                  alt={prompt.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white rounded ${difficultyColors[prompt.difficulty]}`}>
                  {difficultyLabels[prompt.difficulty]}
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-lg">{prompt.title}</h3>
                  <p className="text-white/80 text-sm">{prompt.titleEs}</p>
                </div>
              </div>
              <CardContent className="pt-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {prompt.briefSummary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {prompt.plotPoints.length} points
                    </div>
                    <div className="flex items-center gap-1">
                      <Mic className="w-4 h-4" />
                      {prompt.usefulVocabulary.length} words
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No stories found for this difficulty level.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Tips for Better Narration
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">•</span>
              <span><strong>Speak out loud</strong> - Don't just think it, say it! Your mouth needs practice too.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">•</span>
              <span><strong>Use connectors</strong> - Words like "primero", "después", "finalmente" make your story flow.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">•</span>
              <span><strong>Don't translate word-for-word</strong> - Express ideas naturally in Spanish.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">•</span>
              <span><strong>Try multiple times</strong> - Each retelling gets smoother and more natural.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">•</span>
              <span><strong>Record yourself</strong> - Listen back to identify areas for improvement.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Link to Original Stories */}
      <div className="text-center">
        <p className="text-gray-500 mb-2">Want to read the original stories first?</p>
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
        >
          <BookOpen className="w-4 h-4" />
          Go to Stories
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
