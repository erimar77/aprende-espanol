'use client';

import { useState } from 'react';
import { latinHolidays, getHolidaysByMonth, LatinHoliday } from '@/data/latin-holidays';
import { ArrowLeft, Calendar, Eye, MapPin, Utensils, Volume2, BookOpen, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

type View = 'list' | 'detail';

export default function CulturaPage() {
  const [view, setView] = useState<View>('list');
  const [selectedHoliday, setSelectedHoliday] = useState<LatinHoliday | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('day-in-life');

  const holidays = getHolidaysByMonth();
  const currentMonth = new Date().getMonth() + 1;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getFamiliarityBadge = (level: LatinHoliday['familiarity']) => {
    switch (level) {
      case 'probably-know':
        return { text: 'Familiar', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
      case 'maybe-heard-of':
        return { text: 'Maybe heard of', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
      case 'new-to-you':
        return { text: 'New to you', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' };
    }
  };

  const getMonthName = (month: number) => {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1];
  };

  // ── LIST VIEW ──────────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Cultura: Holidays & Traditions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              What life actually looks like during Latin American holidays — focused on Peru.
              Each holiday includes the vocabulary and phrases you'd need to participate.
            </p>
          </div>

          {/* Calendar timeline */}
          <div className="space-y-4">
            {holidays.map(holiday => {
              const badge = getFamiliarityBadge(holiday.familiarity);
              const isUpcoming = holiday.month >= currentMonth && holiday.month <= currentMonth + 2;

              return (
                <button
                  key={holiday.id}
                  onClick={() => { setSelectedHoliday(holiday); setView('detail'); setExpandedSection('day-in-life'); }}
                  className={`w-full text-left p-5 rounded-xl border transition-all hover:shadow-md ${
                    isUpcoming
                      ? 'border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  } hover:border-primary-400 dark:hover:border-primary-600`}
                >
                  <div className="flex items-start gap-4">
                    {/* Month badge */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center ${
                      isUpcoming ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      <span className="text-xs font-medium uppercase">{getMonthName(holiday.month)}</span>
                      <Calendar className="w-4 h-4 mt-0.5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{holiday.nameSpanish}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>
                          {badge.text}
                        </span>
                        {isUpcoming && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 font-medium">
                            Coming up
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{holiday.name} — {holiday.date}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{holiday.summary}</p>
                    </div>

                    {/* Region */}
                    <div className="flex-shrink-0">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {holiday.region === 'peru' ? '🇵🇪 Peru' : '🌎 Latin America'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── DETAIL VIEW ────────────────────────────────────────────────────
  if (view === 'detail' && selectedHoliday) {
    const h = selectedHoliday;
    const badge = getFamiliarityBadge(h.familiarity);

    const sections = [
      { key: 'day-in-life', title: 'A Day in the Life', icon: Eye },
      { key: 'comparison', title: 'US vs. Peru', icon: MapPin },
      { key: 'senses', title: 'What You\'d Experience', icon: Volume2 },
      { key: 'vocabulary', title: 'Vocabulary', icon: BookOpen },
      { key: 'phrases', title: 'Phrases You\'d Use', icon: Utensils },
      { key: 'tips', title: 'Cultural Tips', icon: Lightbulb },
    ];

    return (
      <div className="min-h-screen py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Back */}
          <button
            onClick={() => { setView('list'); setSelectedHoliday(null); }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            aria-label="Back to holiday list"
          >
            <ArrowLeft className="w-4 h-4" />
            All holidays
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>{badge.text}</span>
              <span className="text-xs text-gray-400">{h.region === 'peru' ? '🇵🇪 Peru' : '🌎 Latin America'}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{h.nameSpanish}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{h.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {h.date}
            </p>
          </div>

          {/* Accordion sections */}
          <div className="space-y-3">
            {sections.map(section => {
              const isExpanded = expandedSection === section.key;
              const Icon = section.icon;

              return (
                <div key={section.key} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${section.title}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{section.title}</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      {/* Day in the Life */}
                      {section.key === 'day-in-life' && (
                        <div className="prose dark:prose-invert max-w-none">
                          {h.dayInTheLife.split('\n\n').map((paragraph, i) => (
                            <p key={i} className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3 last:mb-0">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* US Comparison */}
                      {section.key === 'comparison' && (
                        <div className="prose dark:prose-invert max-w-none">
                          {h.usComparison.split('\n\n').map((paragraph, i) => (
                            <p key={i} className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3 last:mb-0">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Sensory Details */}
                      {section.key === 'senses' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <p className="font-semibold text-blue-900 dark:text-blue-200 text-xs mb-1">👁️ You'd see:</p>
                            <p className="text-sm text-blue-800 dark:text-blue-300">{h.sensoryDetails.see}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                            <p className="font-semibold text-purple-900 dark:text-purple-200 text-xs mb-1">👂 You'd hear:</p>
                            <p className="text-sm text-purple-800 dark:text-purple-300">{h.sensoryDetails.hear}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <p className="font-semibold text-green-900 dark:text-green-200 text-xs mb-1">👃 You'd smell:</p>
                            <p className="text-sm text-green-800 dark:text-green-300">{h.sensoryDetails.smell}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                            <p className="font-semibold text-orange-900 dark:text-orange-200 text-xs mb-1">👅 You'd taste:</p>
                            <p className="text-sm text-orange-800 dark:text-orange-300">{h.sensoryDetails.taste}</p>
                          </div>
                        </div>
                      )}

                      {/* Vocabulary */}
                      {section.key === 'vocabulary' && (
                        <div className="space-y-2">
                          {h.vocabulary.map((v, i) => (
                            <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                              <span className="font-medium text-gray-900 dark:text-white text-sm min-w-0 flex-shrink-0">{v.spanish}</span>
                              <span className="text-gray-400 dark:text-gray-500">—</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{v.english}</span>
                              {v.context && (
                                <span className="text-xs text-gray-400 dark:text-gray-500 italic ml-auto flex-shrink-0">({v.context})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Phrases */}
                      {section.key === 'phrases' && (
                        <div className="space-y-3">
                          {h.phrases.map((p, i) => (
                            <div key={i} className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                              <p className="font-medium text-gray-900 dark:text-white text-sm">{p.spanish}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{p.english}</p>
                              <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 italic">When: {p.when}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Cultural Tips */}
                      {section.key === 'tips' && (
                        <div className="space-y-3">
                          {h.culturalTips.map((tip, i) => (
                            <div key={i} className="flex gap-3 items-start">
                              <span className="text-yellow-500 flex-shrink-0 mt-0.5">💡</span>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
