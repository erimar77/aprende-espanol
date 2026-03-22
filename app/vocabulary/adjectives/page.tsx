'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import WordCard from '@/components/ui/WordCard';
import { adjectives, getAdjectiveCategories, getAdjectivesByCategory } from '@/data/adjectives';

const categoryLabels: Record<string, string> = {
  size: 'Size & Quantity',
  colors: 'Colors',
  personality: 'Personality',
  emotions: 'Emotions & States',
  appearance: 'Physical Appearance',
  quality: 'Quality & Condition',
  sensations: 'Temperature & Sensations',
  taste: 'Food & Taste',
  speed: 'Speed & Time',
  position: 'Position & Location',
  quantity: 'Quantity',
};

export default function AdjectivesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = getAdjectiveCategories();

  const filteredAdjectives = useMemo(() => {
    let result = selectedCategory === 'all' ? adjectives : getAdjectivesByCategory(selectedCategory);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        adj =>
          adj.spanish.toLowerCase().includes(query) ||
          adj.english.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Adjetivos / Adjectives
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {adjectives.length} adjectives to describe people, places, and things
        </p>
      </div>


      {/* Gender Agreement Info */}
      <Card className="bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800">
        <CardContent>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Gender Agreement Rules</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p><strong>Masculine singular:</strong> -o ending (alto, bajo)</p>
              <p><strong>Feminine singular:</strong> -a ending (alta, baja)</p>
            </div>
            <div>
              <p><strong>Masculine plural:</strong> -os ending (altos, bajos)</p>
              <p><strong>Feminine plural:</strong> -as ending (altas, bajas)</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Note: Some adjectives ending in -e or consonants don't change for gender (inteligente, facil)
          </p>
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
                placeholder="Search adjectives..."
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
                  {categoryLabels[cat] || cat} ({getAdjectivesByCategory(cat).length})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredAdjectives.length} of {adjectives.length} adjectives
      </p>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-secondary-400 text-gray-900'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
                ? 'bg-secondary-400 text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Words Display */}
      {viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAdjectives.map((adj) => (
            <WordCard key={adj.id} word={adj} showExample />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAdjectives.map((adj) => (
            <WordCard key={adj.id} word={adj} compact />
          ))}
        </div>
      )}

      {filteredAdjectives.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No adjectives found.</p>
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
