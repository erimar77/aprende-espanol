'use client';

import Link from 'next/link';
import { BookOpen, Tag, Sparkles, Zap } from 'lucide-react';
import Card, { CardContent, CardDescription, CardTitle } from '@/components/ui/Card';
import TeacherBubble from '@/components/layout/TeacherBubble';
import { getTeacherBySpecialty } from '@/data/teachers';
import { nouns } from '@/data/nouns';
import { adjectives } from '@/data/adjectives';
import { adverbs } from '@/data/adverbs';

const vocabularySections = [
  {
    title: 'Nouns',
    titleSpanish: 'Sustantivos',
    description: `${nouns.length}+ words organized by category`,
    href: '/vocabulary/nouns',
    icon: BookOpen,
    color: 'bg-primary-500',
    count: nouns.length,
  },
  {
    title: 'Adjectives',
    titleSpanish: 'Adjetivos',
    description: `${adjectives.length}+ descriptive words`,
    href: '/vocabulary/adjectives',
    icon: Sparkles,
    color: 'bg-secondary-400',
    count: adjectives.length,
  },
  {
    title: 'Adverbs',
    titleSpanish: 'Adverbios',
    description: `${adverbs.length}+ adverbs for time, place, manner`,
    href: '/vocabulary/adverbs',
    icon: Zap,
    color: 'bg-accent-500',
    count: adverbs.length,
  },
];

export default function VocabularyPage() {
  const teacher = getTeacherBySpecialty('vocabulary');
  const totalWords = nouns.length + adjectives.length + adverbs.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Vocabulario / Vocabulary
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Learn {totalWords}+ Spanish words organized by type and category
        </p>
      </div>

      <TeacherBubble
        teacher={teacher}
        message="Bienvenido a la seccion de vocabulario! Aqui puedes aprender mas de 700 palabras en espanol. Empieza con los sustantivos - son la base del idioma."
        messageTranslation="Welcome to the vocabulary section! Here you can learn over 700 Spanish words. Start with the nouns - they are the foundation of the language."
        size="medium"
      />

      <div className="grid md:grid-cols-3 gap-6">
        {vocabularySections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <Card hover className="h-full">
                <CardContent>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${section.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-400">
                      {section.count}
                    </span>
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                  <p className="text-sm text-primary-500 font-medium mb-1">
                    {section.titleSpanish}
                  </p>
                  <CardDescription>{section.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Tips for Learning Vocabulary
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">1.</span>
              <span>Learn words in context - look at the example sentences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">2.</span>
              <span>Pay attention to gender (el/la) for nouns - it affects adjective agreement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">3.</span>
              <span>Use the audio feature to practice pronunciation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">4.</span>
              <span>Add words to your flashcard deck for spaced repetition practice</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">5.</span>
              <span>Focus on one category at a time for better retention</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
