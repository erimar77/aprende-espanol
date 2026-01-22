'use client';

import { useState, useMemo } from 'react';
import { Search, Volume2, Filter, Grid, List } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import WordCard from '@/components/ui/WordCard';
import TeacherBubble from '@/components/layout/TeacherBubble';
import { useTeachers } from '@/hooks/useTeachers';
import { nouns, getCategories, getNounsByCategory } from '@/data/nouns';
import { WORD_CATEGORIES, WordCategory } from '@/lib/types';
import { speak } from '@/lib/speech';

export default function NounsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showTeacher, setShowTeacher] = useState(true);
  const { getTeacherBySpecialty } = useTeachers();

  const teacher = getTeacherBySpecialty('vocabulary');
  const categories = getCategories();

  const filteredNouns = useMemo(() => {
    let result = selectedCategory === 'all' ? nouns : getNounsByCategory(selectedCategory);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        noun =>
          noun.spanish.toLowerCase().includes(query) ||
          noun.english.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  const handleSpeak = (text: string) => {
    speak(text, 0.85);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sustantivos / Nouns
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {nouns.length} nouns organized by {categories.length} categories
        </p>
      </div>

      {showTeacher && (
        <TeacherBubble
          teacher={teacher}
          message="Los sustantivos en espanol tienen genero - masculino (el) o femenino (la). Presta atencion al articulo!"
          messageTranslation="Nouns in Spanish have gender - masculine (el) or feminine (la). Pay attention to the article!"
          size="small"
        />
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search nouns in Spanish or English..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {WORD_CATEGORIES[cat as WordCategory]?.label || cat} ({getNounsByCategory(cat).length})
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
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

      {/* Results Count */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredNouns.length} of {nouns.length} nouns
        {selectedCategory !== 'all' && (
          <span> in <strong>{WORD_CATEGORIES[selectedCategory as WordCategory]?.label || selectedCategory}</strong></span>
        )}
      </p>

      {/* Category Pills (quick filter) */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {categories.slice(0, 8).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {WORD_CATEGORIES[cat as WordCategory]?.label || cat}
          </button>
        ))}
      </div>

      {/* Words Display */}
      {viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNouns.map((noun) => (
            <WordCard key={noun.id} word={noun} showExample />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNouns.map((noun) => (
            <WordCard key={noun.id} word={noun} compact />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredNouns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No nouns found matching your search.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
