'use client';

import { useState, useMemo } from 'react';
import { Search, Grid, List } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import WordCard from '@/components/ui/WordCard';
import TeacherBubble from '@/components/layout/TeacherBubble';
import { useTeachers } from '@/hooks/useTeachers';
import { adverbs, getAdverbCategories, getAdverbsByCategory } from '@/data/adverbs';

const categoryLabels: Record<string, string> = {
  time: 'Time',
  frequency: 'Frequency',
  manner: 'Manner',
  place: 'Place',
  quantity: 'Quantity/Degree',
  affirmation: 'Affirmation/Negation',
};

export default function AdverbsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { getTeacherBySpecialty } = useTeachers();

  const teacher = getTeacherBySpecialty('vocabulary');
  const categories = getAdverbCategories();

  const filteredAdverbs = useMemo(() => {
    let result = selectedCategory === 'all' ? adverbs : getAdverbsByCategory(selectedCategory);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        adv =>
          adv.spanish.toLowerCase().includes(query) ||
          adv.english.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Adverbios / Adverbs
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {adverbs.length} adverbs to describe when, where, and how
        </p>
      </div>

      <TeacherBubble
        teacher={teacher}
        message="Los adverbios modifican verbos, adjetivos u otros adverbios. No cambian de forma - siempre son iguales!"
        messageTranslation="Adverbs modify verbs, adjectives, or other adverbs. They don't change form - they're always the same!"
        size="small"
      />

      {/* Adverb Formation Info */}
      <Card className="bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800">
        <CardContent>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Forming Adverbs from Adjectives</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Many adverbs are formed by adding <strong>-mente</strong> to the feminine form of an adjective:
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-800 p-2 rounded">
              <p className="text-gray-500">rapido (fast) →</p>
              <p className="font-medium text-accent-600 dark:text-accent-400">rapidamente (quickly)</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-2 rounded">
              <p className="text-gray-500">facil (easy) →</p>
              <p className="font-medium text-accent-600 dark:text-accent-400">facilmente (easily)</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-2 rounded">
              <p className="text-gray-500">lento (slow) →</p>
              <p className="font-medium text-accent-600 dark:text-accent-400">lentamente (slowly)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search adverbs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat] || cat} ({getAdverbsByCategory(cat).length})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredAdverbs.length} of {adverbs.length} adverbs
      </p>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-accent-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-accent-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Words Display */}
      {viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAdverbs.map((adv) => (
            <WordCard key={adv.id} word={adv} showExample />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAdverbs.map((adv) => (
            <WordCard key={adv.id} word={adv} compact />
          ))}
        </div>
      )}

      {filteredAdverbs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No adverbs found.</p>
          <Button
            variant="outline"
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
