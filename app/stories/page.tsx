'use client';

import Link from 'next/link';
import { BookOpen, Clock, Star, Filter } from 'lucide-react';
import Card, { CardContent, CardDescription, CardTitle } from '@/components/ui/Card';
import { useState, useEffect } from 'react';
import type { Story } from '@/data/stories';

const levelColors = {
  beginner: 'bg-green-500',
  elementary: 'bg-blue-500',
  intermediate: 'bg-purple-500',
};

const levelLabels = {
  beginner: 'Principiante',
  elementary: 'Elemental',
  intermediate: 'Intermedio',
};

export default function StoriesPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const { stories: loadedStories } = await import('@/data/stories');
        setStories(loadedStories);
      } catch (error) {
        console.error('Failed to load stories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStories();
  }, []);

  const filteredStories = selectedLevel === 'all'
    ? stories
    : stories.filter(s => s.level === selectedLevel);

  const beginnerCount = stories.filter(s => s.level === 'beginner').length;
  const elementaryCount = stories.filter(s => s.level === 'elementary').length;
  const intermediateCount = stories.filter(s => s.level === 'intermediate').length;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Cuentos / Short Stories
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Practice reading with {stories.length} graded short stories. Tap words for translations!
        </p>
      </div>


      {/* Level Filter */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedLevel('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedLevel === 'all'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          All ({stories.length})
        </button>
        <button
          onClick={() => setSelectedLevel('beginner')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedLevel === 'beginner'
              ? 'bg-green-500 text-white'
              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
          }`}
        >
          Beginner ({beginnerCount})
        </button>
        <button
          onClick={() => setSelectedLevel('elementary')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedLevel === 'elementary'
              ? 'bg-blue-500 text-white'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
          }`}
        >
          Elementary ({elementaryCount})
        </button>
        <button
          onClick={() => setSelectedLevel('intermediate')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedLevel === 'intermediate'
              ? 'bg-purple-500 text-white'
              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50'
          }`}
        >
          Intermediate ({intermediateCount})
        </button>
      </div>

      {/* Story Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <Link key={story.id} href={`/stories/${story.id}`}>
            <Card hover className="h-full">
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-1 text-xs font-medium text-white rounded ${levelColors[story.level]}`}>
                    {levelLabels[story.level]}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {story.estimatedMinutes} min
                  </div>
                </div>

                <CardTitle className="mb-1">{story.title}</CardTitle>
                <p className="text-sm text-primary-500 font-medium mb-2">{story.titleSpanish}</p>
                <CardDescription>{story.description}</CardDescription>

                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {story.content.length} paragraphs
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {story.vocabulary.length} words
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No stories found for this level.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reading Tips */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Tips for Reading Practice
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">1.</span>
              <span>Read the story out loud - this helps with pronunciation and fluency</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">2.</span>
              <span>Try to understand the general meaning before looking at translations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">3.</span>
              <span>Use the audio feature to hear native pronunciation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">4.</span>
              <span>After reading, try the comprehension questions to test understanding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">5.</span>
              <span>Re-read stories multiple times - repetition builds retention</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
