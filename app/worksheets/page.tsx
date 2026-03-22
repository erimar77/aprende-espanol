'use client';

import { useState } from 'react';
import {
  Download, Printer, BookOpen, Languages, PenTool,
  ArrowRightLeft, Loader2, CheckSquare, CircleDot,
  CheckCircle2, RefreshCw, Hash,
} from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';

const SECTION_OPTIONS = [
  {
    id: 'vocab_matching',
    label: 'Vocabulary Matching',
    description: 'Match Spanish words to English translations',
    icon: ArrowRightLeft,
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    id: 'fill_blank',
    label: 'Fill in the Blank',
    description: 'Complete sentences with the missing word',
    icon: PenTool,
    color: 'text-green-500 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    id: 'multiple_choice',
    label: 'Multiple Choice',
    description: 'Pick the correct answer from four options',
    icon: CircleDot,
    color: 'text-purple-500 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    id: 'true_false',
    label: 'True or False',
    description: 'Mark statements as verdadero or falso',
    icon: CheckCircle2,
    color: 'text-red-500 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
  {
    id: 'conjugation',
    label: 'Verb Conjugation',
    description: 'Fill in conjugation tables',
    icon: BookOpen,
    color: 'text-purple-500 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    id: 'translation',
    label: 'Translation',
    description: 'Translate English sentences to Spanish',
    icon: Languages,
    color: 'text-orange-500 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
];

const WORD_TYPE_OPTIONS = [
  { value: 'mixed', label: 'Mixed (All Types)' },
  { value: 'nouns', label: 'Nouns' },
  { value: 'adjectives', label: 'Adjectives' },
  { value: 'adverbs', label: 'Adverbs' },
];

const ITEMS_OPTIONS = [
  { value: 6, label: '6 items (quick)' },
  { value: 8, label: '8 items' },
  { value: 10, label: '10 items (standard)' },
  { value: 12, label: '12 items (extended)' },
];

export default function WorksheetsPage() {
  const { earnXP } = useGamification();
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'vocab_matching', 'fill_blank', 'multiple_choice',
  ]);
  const [wordType, setWordType] = useState('mixed');
  const [itemsPerSection, setItemsPerSection] = useState(8);
  const [seed, setSeed] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSeed, setLastSeed] = useState<number | null>(null);

  const toggleSection = (id: string) => {
    setSelectedSections(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : prev.length < 4
          ? [...prev, id]
          : prev
    );
  };

  const randomizeSeed = () => {
    setSeed(String(Math.floor(1000 + Math.random() * 9000)));
  };

  const handleGenerate = async () => {
    if (selectedSections.length === 0) {
      setError('Please select at least one section.');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const seedValue = seed ? parseInt(seed, 10) : null;
      const response = await fetch('/api/worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: selectedSections,
          wordType,
          itemsPerSection,
          seed: seedValue,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to generate worksheet');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `spanish-worksheet-${seed || 'random'}-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      earnXP('worksheet_generated');

      if (seedValue) setLastSeed(seedValue);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong');
      } else {
        setError('Something went wrong');
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-4">
            <Printer className="w-7 h-7 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Printable Worksheets
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Generate PDF practice worksheets with fill-in-the-blank, multiple choice,
            true/false, and more. Answer key included.
          </p>
        </div>

        {/* Sections selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Choose Sections
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {selectedSections.length}/4 selected
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Pick 2–4 section types for your worksheet.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECTION_OPTIONS.map(sec => {
              const isSelected = selectedSections.includes(sec.id);
              const Icon = sec.icon;
              const isDisabled = !isSelected && selectedSections.length >= 4;
              return (
                <button
                  key={sec.id}
                  onClick={() => toggleSection(sec.id)}
                  disabled={isDisabled}
                  className={`relative flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400'
                      : isDisabled
                        ? 'border-gray-100 dark:border-gray-700 opacity-40 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${sec.bg}`}>
                    <Icon className={`w-5 h-5 ${sec.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {sec.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {sec.description}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckSquare className="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Options */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Options
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Word Type
              </label>
              <select
                value={wordType}
                onChange={e => setWordType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {WORD_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Items per Section
              </label>
              <select
                value={itemsPerSection}
                onChange={e => setItemsPerSection(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {ITEMS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Seed (optional)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={seed}
                    onChange={e => setSeed(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Random"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button
                  onClick={randomizeSeed}
                  className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Generate random seed"
                >
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Same seed = same worksheet
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={generating || selectedSections.length === 0}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Worksheet...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Generate & Download PDF
            </>
          )}
        </button>

        {/* Info */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Each worksheet is randomly generated with different content.
            Use the seed number to regenerate the same worksheet.
          </p>
          {lastSeed && (
            <p className="text-xs text-primary-500 dark:text-primary-400">
              Last generated seed: <span className="font-mono font-bold">{lastSeed}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
