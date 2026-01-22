'use client';

import { useState, useMemo } from 'react';
import { Search, Volume2, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import Card, { CardContent, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeacherBubble from '@/components/layout/TeacherBubble';
import { useTeachers } from '@/hooks/useTeachers';
import { allVerbs, getVerbsByType, searchVerbs } from '@/data/verbs';
import { Verb, ConjugationSet } from '@/lib/types';
import { speak } from '@/lib/speech';

const TENSES = [
  { key: 'present', label: 'Present', labelSpanish: 'Presente' },
  { key: 'preterite', label: 'Preterite', labelSpanish: 'Preterito' },
  { key: 'imperfect', label: 'Imperfect', labelSpanish: 'Imperfecto' },
  { key: 'future', label: 'Future', labelSpanish: 'Futuro' },
];

const SUBJECTS = [
  { key: 'yo', label: 'yo', english: 'I' },
  { key: 'tu', label: 'tu', english: 'you (informal)' },
  { key: 'el', label: 'el/ella/usted', english: 'he/she/you (formal)' },
  { key: 'nosotros', label: 'nosotros', english: 'we' },
  { key: 'vosotros', label: 'vosotros', english: 'you all (Spain)' },
  { key: 'ellos', label: 'ellos/ellas/ustedes', english: 'they/you all' },
];

function ConjugationTable({ verb, selectedTense }: { verb: Verb; selectedTense: string }) {
  const conjugation = verb.conjugation[selectedTense as keyof typeof verb.conjugation] as ConjugationSet;

  if (!conjugation) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-primary-500 text-white">
            <th className="py-2 px-4 text-left">Subject</th>
            <th className="py-2 px-4 text-left">Conjugation</th>
            <th className="py-2 px-4 text-center">Audio</th>
          </tr>
        </thead>
        <tbody>
          {SUBJECTS.map((subject) => (
            <tr key={subject.key} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="py-3 px-4">
                <span className="font-medium text-gray-900 dark:text-white">{subject.label}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({subject.english})</span>
              </td>
              <td className="py-3 px-4">
                <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                  {conjugation[subject.key as keyof ConjugationSet]}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => speak(`${subject.label} ${conjugation[subject.key as keyof ConjugationSet]}`, 0.8)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-gray-500 hover:text-primary-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VerbCard({ verb, isExpanded, onToggle }: { verb: Verb; isExpanded: boolean; onToggle: () => void }) {
  const [selectedTense, setSelectedTense] = useState('present');

  const typeColors = {
    regular: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    irregular: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'stem-changing': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    reflexive: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  return (
    <Card className="overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{verb.infinitive}</h3>
              <p className="text-gray-600 dark:text-gray-400">{verb.english}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[verb.type]}`}>
              {verb.type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); speak(verb.infinitive, 0.85); }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Volume2 className="w-5 h-5 text-gray-500" />
            </button>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Gerund:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{verb.conjugation.gerund}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Past Participle:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">{verb.conjugation.pastParticiple}</span>
            </div>
          </div>

          {verb.example && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200 italic">"{verb.example}"</p>
              {verb.exampleTranslation && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">"{verb.exampleTranslation}"</p>
              )}
            </div>
          )}

          {/* Tense Selector */}
          <div className="flex flex-wrap gap-2">
            {TENSES.map((tense) => (
              <button
                key={tense.key}
                onClick={() => setSelectedTense(tense.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedTense === tense.key
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tense.label}
              </button>
            ))}
          </div>

          {/* Conjugation Table */}
          <ConjugationTable verb={verb} selectedTense={selectedTense} />
        </div>
      )}
    </Card>
  );
}

export default function VerbsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [expandedVerb, setExpandedVerb] = useState<string | null>(null);
  const { getTeacherBySpecialty } = useTeachers();

  const teacher = getTeacherBySpecialty('verbs');

  const filteredVerbs = useMemo(() => {
    let result = typeFilter === 'all' ? allVerbs : getVerbsByType(typeFilter as Verb['type']);

    if (searchQuery) {
      result = searchVerbs(searchQuery).filter(v =>
        typeFilter === 'all' || v.type === typeFilter
      );
    }

    return result;
  }, [searchQuery, typeFilter]);

  const verbCounts = {
    all: allVerbs.length,
    regular: getVerbsByType('regular').length,
    irregular: getVerbsByType('irregular').length,
    'stem-changing': getVerbsByType('stem-changing').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Verbos / Verb Conjugation Machine
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {allVerbs.length}+ verbs with full conjugations in multiple tenses
        </p>
      </div>

      <TeacherBubble
        teacher={teacher}
        message="Los verbos son el corazon del espanol! Haz clic en cualquier verbo para ver todas sus conjugaciones. Practica con los verbos irregulares - son los mas importantes."
        messageTranslation="Verbs are the heart of Spanish! Click on any verb to see all its conjugations. Practice with irregular verbs - they're the most important."
        size="medium"
      />

      {/* Search and Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search verbs (e.g., hablar, to speak)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Types ({verbCounts.all})</option>
                <option value="regular">Regular ({verbCounts.regular})</option>
                <option value="irregular">Irregular ({verbCounts.irregular})</option>
                <option value="stem-changing">Stem-Changing ({verbCounts['stem-changing']})</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            typeFilter === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          All Verbs
        </button>
        <button
          onClick={() => setTypeFilter('regular')}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            typeFilter === 'regular'
              ? 'bg-green-500 text-white'
              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
          }`}
        >
          Regular
        </button>
        <button
          onClick={() => setTypeFilter('irregular')}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            typeFilter === 'irregular'
              ? 'bg-red-500 text-white'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
          }`}
        >
          Irregular
        </button>
        <button
          onClick={() => setTypeFilter('stem-changing')}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            typeFilter === 'stem-changing'
              ? 'bg-yellow-500 text-white'
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
          }`}
        >
          Stem-Changing
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredVerbs.length} verbs. Click a verb to see conjugations.
      </p>

      {/* Verbs List */}
      <div className="space-y-4">
        {filteredVerbs.map((verb) => (
          <VerbCard
            key={verb.id}
            verb={verb}
            isExpanded={expandedVerb === verb.id}
            onToggle={() => setExpandedVerb(expandedVerb === verb.id ? null : verb.id)}
          />
        ))}
      </div>

      {filteredVerbs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No verbs found.</p>
          <Button
            variant="outline"
            onClick={() => { setSearchQuery(''); setTypeFilter('all'); }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
