'use client';

import { useState } from 'react';
import { Volume2, ChevronRight, Search, BookmarkPlus, Check } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { phraseSituations, PhraseSituation } from '@/data/phrase-bank';
import { speak } from '@/lib/speech';

export default function PhraseBankPage() {
  const [selectedSituation, setSelectedSituation] = useState<PhraseSituation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());

  // Filter phrases by search query
  const getFilteredPhrases = (situation: PhraseSituation) => {
    if (!searchQuery) return situation.phrases;
    const query = searchQuery.toLowerCase();
    return situation.phrases.filter(
      p => p.spanish.toLowerCase().includes(query) || p.english.toLowerCase().includes(query)
    );
  };

  // Get all matching phrases across all situations for global search
  const globalSearchResults = searchQuery
    ? phraseSituations.flatMap(sit =>
        sit.phrases
          .filter(p =>
            p.spanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.english.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(p => ({ ...p, situation: sit }))
      )
    : [];

  function toggleSavePhrase(phraseKey: string) {
    setSavedPhrases(prev => {
      const next = new Set(prev);
      if (next.has(phraseKey)) {
        next.delete(phraseKey);
      } else {
        next.add(phraseKey);
      }
      return next;
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Banco de Frases / Phrase Bank
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Essential phrases organized by situation
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search phrases in Spanish or English..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Global Search Results */}
      {searchQuery && !selectedSituation && globalSearchResults.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Found {globalSearchResults.length} phrase{globalSearchResults.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
          <div className="space-y-2">
            {globalSearchResults.slice(0, 20).map((result, i) => (
              <div
                key={`${result.situation.id}-${i}`}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <button
                  onClick={() => speak(result.spanish)}
                  className="flex-shrink-0 p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <div className="flex-grow min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {result.spanish}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {result.english}
                  </p>
                </div>
                <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full text-white ${result.situation.color}`}>
                  {result.situation.icon}
                </span>
              </div>
            ))}
            {globalSearchResults.length > 20 && (
              <p className="text-sm text-gray-500 text-center">
                ...and {globalSearchResults.length - 20} more results
              </p>
            )}
          </div>
        </div>
      )}

      {/* No search results */}
      {searchQuery && !selectedSituation && globalSearchResults.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No phrases found matching "{searchQuery}"
          </p>
        </div>
      )}

      {/* Situation Grid or Detail View */}
      {!searchQuery && !selectedSituation ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {phraseSituations.map(situation => (
            <Card
              key={situation.id}
              hover
              className="cursor-pointer"
              onClick={() => setSelectedSituation(situation)}
            >
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl ${situation.color}`}>
                    <span className="text-2xl">{situation.icon}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <CardTitle className="text-lg">{situation.title}</CardTitle>
                <p className="text-sm text-primary-500 font-medium mb-1">
                  {situation.titleSpanish}
                </p>
                <CardDescription>{situation.description}</CardDescription>
                <p className="text-xs text-gray-500 mt-2">
                  {situation.phrases.length} phrases
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : selectedSituation ? (
        <div className="space-y-6">
          {/* Back button and header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSelectedSituation(null); setSearchQuery(''); }}
              className="text-sm text-primary-500 hover:text-primary-600"
            >
              ← Back to situations
            </button>
          </div>

          <Card>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-xl ${selectedSituation.color}`}>
                  <span className="text-3xl">{selectedSituation.icon}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedSituation.title}
                  </h2>
                  <p className="text-primary-500 font-medium">
                    {selectedSituation.titleSpanish}
                  </p>
                </div>
              </div>

              {/* Search within situation */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter phrases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Phrase List */}
              <div className="space-y-2">
                {getFilteredPhrases(selectedSituation).map((phrase, i) => {
                  const phraseKey = `${selectedSituation.id}-${phrase.spanish}`;
                  const isSaved = savedPhrases.has(phraseKey);

                  return (
                    <div
                      key={i}
                      className="group flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <button
                        onClick={() => speak(phrase.spanish)}
                        className="flex-shrink-0 p-2 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <div className="flex-grow min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {phrase.spanish}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {phrase.english}
                        </p>
                        {phrase.pronunciation && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">
                            [{phrase.pronunciation}]
                          </p>
                        )}
                        {phrase.notes && (
                          <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
                            💡 {phrase.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleSavePhrase(phraseKey)}
                        className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                          isSaved
                            ? 'text-green-500 bg-green-50 dark:bg-green-900/30'
                            : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        title={isSaved ? 'Saved' : 'Save phrase'}
                      >
                        {isSaved ? <Check className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
                      </button>
                    </div>
                  );
                })}
              </div>

              {getFilteredPhrases(selectedSituation).length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No phrases match your filter
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Practice Tip */}
          <Card>
            <CardContent>
              <CardTitle className="text-lg mb-2">💡 Practice Tip</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click on any phrase to hear it pronounced. Try repeating it out loud!
                For extra practice, cover the English translation and see if you can remember the meaning.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Saved Phrases Summary */}
      {savedPhrases.size > 0 && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
          <span className="font-medium">{savedPhrases.size} phrase{savedPhrases.size !== 1 ? 's' : ''} saved</span>
        </div>
      )}
    </div>
  );
}
