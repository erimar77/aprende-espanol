'use client';

import Link from 'next/link';
import {
  MessageCircle,
  BookOpen,
  Languages,
  Brain,
  GraduationCap,
  RefreshCw,
  ClipboardCheck,
  Book,
  Headphones,
  Mic,
  Library,
  Zap,
  MessageSquare,
  Timer,
  Search,
  Pencil,
  Music,
} from 'lucide-react';
import Card, { CardContent, CardDescription, CardTitle } from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { useProgress } from '@/context/ProgressContext';

const sections = [
  {
    title: 'Conversations',
    titleSpanish: 'Conversaciones',
    description: 'Practice real-life dialogues',
    href: '/conversations',
    icon: MessageCircle,
    color: 'bg-primary-500',
  },
  {
    title: 'Stories',
    titleSpanish: 'Cuentos',
    description: '35+ graded reading stories',
    href: '/stories',
    icon: Book,
    color: 'bg-teal-500',
  },
  {
    title: 'Vocabulary',
    titleSpanish: 'Vocabulario',
    description: '500+ words by category',
    href: '/vocabulary',
    icon: BookOpen,
    color: 'bg-secondary-400',
  },
  {
    title: 'Verbs',
    titleSpanish: 'Verbos',
    description: '100+ verbs with conjugations',
    href: '/verbs',
    icon: Languages,
    color: 'bg-accent-500',
  },
  {
    title: 'Verb Trainer',
    titleSpanish: 'Entrenador de Verbos',
    description: 'Learn verbs in real sentences',
    href: '/verb-trainer',
    icon: Zap,
    color: 'bg-lime-500',
  },
  {
    title: 'Grammar',
    titleSpanish: 'Gramática',
    description: 'A1 grammar lessons',
    href: '/grammar',
    icon: Brain,
    color: 'bg-purple-500',
  },
  {
    title: 'Flashcards',
    titleSpanish: 'Tarjetas',
    description: 'Spaced repetition + review queue',
    href: '/flashcards',
    icon: RefreshCw,
    color: 'bg-green-500',
  },
  {
    title: 'Final Test',
    titleSpanish: 'Examen Final',
    description: 'A1 level assessment',
    href: '/test',
    icon: ClipboardCheck,
    color: 'bg-red-500',
  },
];

export default function Home() {
  const { progress } = useProgress();

  // Calculate overall progress
  const totalLessons = 10; // Grammar lessons
  const totalConversations = 10; // Conversation scenarios
  const wordsLearned = Object.keys(progress.flashcardProgress).length;

  return (
    <div className="space-y-12">
      {/* Hero Section - Theme-aware, adapts to color scheme */}
      <section className="relative overflow-hidden rounded-3xl theme-hero p-6 md:p-9">
        <div className="relative z-10 w-full max-w-[80%]">
          <p className="text-white/80 text-sm font-medium mb-2 tracking-wide uppercase">
            A1 Level · Beginner Spanish
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            ¡Bienvenido a tu viaje de español!
          </h1>
          <p className="text-lg text-white/90 mb-6 leading-relaxed">
            Start your Spanish journey with interactive lessons, real conversations, and more!
          </p>
        </div>
        <div className="absolute right-4 bottom-4 md:right-6 md:bottom-6 opacity-10" aria-hidden="true">
          <GraduationCap className="w-40 h-40 md:w-52 md:h-52 text-white" />
        </div>
      </section>

      {/* Learning Sections */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Secciones de Aprendizaje / Learning Sections
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href} aria-label={`Go to ${section.title}`}>
                <Card hover className="h-full">
                  <CardContent>
                    <div className={`inline-flex p-3 rounded-xl ${section.color} mb-4`} aria-hidden="true">
                      <Icon className="w-6 h-6 text-white" />
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
      </section>

      {/* Fluency Corner */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🗣️ Fluency Corner / Rincón de Fluidez
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Bridge the gap between knowing words and speaking fluently
        </p>
        {/* Featured: Workshop */}
        <Link href="/workshop" className="block mb-6">
          <Card hover className="border-2 border-orange-300 dark:border-orange-700 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
            <CardContent className="flex items-center gap-4">
              <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-500" aria-hidden="true">
                <Timer className="w-8 h-8 text-white" />
              </div>
              <div className="flex-grow">
                <CardTitle className="text-lg">⚡ Fluency Workshop</CardTitle>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Taller de Fluidez</p>
                <CardDescription>
                  Got 5, 10, or 20 minutes? Get a mixed practice session combining all exercises!
                </CardDescription>
              </div>
              <div className="hidden sm:flex flex-col gap-1 text-xs text-orange-600 dark:text-orange-400">
                <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">5 min</span>
                <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">10 min</span>
                <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded">20 min</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link href="/prompts">
            <Card hover className="h-full border-2 border-dashed border-secondary-200 dark:border-secondary-800 hover:border-secondary-400 dark:hover:border-secondary-600">
              <CardContent>
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-secondary-500 to-accent-500 mb-4" aria-hidden="true">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Speaking Prompts</CardTitle>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 font-medium mb-1">Temas de Conversación</p>
                <CardDescription>
                  Random topics with guiding questions
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/scenarios">
            <Card hover className="h-full border-2 border-dashed border-teal-200 dark:border-teal-800 hover:border-teal-400 dark:hover:border-teal-600">
              <CardContent>
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 mb-4" aria-hidden="true">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Scenarios</CardTitle>
                <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-1">Simulaciones</p>
                <CardDescription>
                  Immersive branching conversations
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/phrases">
            <Card hover className="h-full border-2 border-dashed border-accent-200 dark:border-accent-800 hover:border-accent-400 dark:hover:border-accent-600">
              <CardContent>
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-accent-500 to-primary-500 mb-4" aria-hidden="true">
                  <Library className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Phrase Bank</CardTitle>
                <p className="text-sm text-accent-600 dark:text-accent-400 font-medium mb-1">Banco de Frases</p>
                <CardDescription>
                  Essential phrases by situation
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/immersion">
            <Card hover className="h-full border-2 border-dashed border-pink-200 dark:border-pink-800 hover:border-pink-400 dark:hover:border-pink-600">
              <CardContent>
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 mb-4" aria-hidden="true">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Immersion</CardTitle>
                <p className="text-sm text-pink-600 dark:text-pink-400 font-medium mb-1">Inmersión</p>
                <CardDescription>
                  Spanish media: YouTube, podcasts, music & more
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Word Games */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🎮 Word Games / Juegos de Palabras
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Learn vocabulary through fun, interactive games
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          <Link href="/madlibs">
            <Card hover className="h-full border-2 border-dashed border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600">
              <CardContent>
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 mb-4" aria-hidden="true">
                  <Pencil className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Mad Libs</CardTitle>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Palabras Locas</p>
                <CardDescription>
                  Fill in blanks with nouns, verbs, and adjectives to create hilarious stories in Spanish
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/wordfind">
            <Card hover className="h-full border-2 border-dashed border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600">
              <CardContent>
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4" aria-hidden="true">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Word Find</CardTitle>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Sopa de Letras</p>
                <CardDescription>
                  Search for hidden Spanish words in a letter grid — 6 categories to explore
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Guitar & Spanish */}
      <section>
        <Link href="/guitarra">
          <Card hover className="border-2 border-dashed border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600">
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex-shrink-0" aria-hidden="true">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle>🎸 Guitarra y Español</CardTitle>
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">Guitar & Spanish</p>
                  <CardDescription>
                    Learn Spanish while playing guitar — 8 original songs with 3-4 chord progressions, strum patterns, tablature, and lyrics with translations
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Progress Overview */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Tu Progreso / Your Progress
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/grammar">
            <Card hover>
              <CardContent>
                <CardTitle>Lessons</CardTitle>
                <CardDescription>Grammar lessons completed</CardDescription>
                <div className="mt-4">
                  <ProgressBar
                    value={progress.lessonsCompleted.length}
                    max={totalLessons}
                    showPercentage
                    color="primary"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {progress.lessonsCompleted.length} of {totalLessons} complete
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/conversations">
            <Card hover>
              <CardContent>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>Dialogue scenarios practiced</CardDescription>
                <div className="mt-4">
                  <ProgressBar
                    value={progress.conversationsCompleted.length}
                    max={totalConversations}
                    showPercentage
                    color="secondary"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {progress.conversationsCompleted.length} of {totalConversations} complete
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/flashcards">
            <Card hover>
              <CardContent>
                <CardTitle>Words Learned</CardTitle>
                <CardDescription>Vocabulary in your flashcard deck</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-accent-500">
                    {wordsLearned}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    words practiced
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
