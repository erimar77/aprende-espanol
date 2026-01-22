'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  MessageCircle,
  BookOpen,
  Languages,
  Brain,
  GraduationCap,
  RefreshCw,
  ClipboardCheck,
  Sparkles,
  Book,
} from 'lucide-react';
import Card, { CardContent, CardDescription, CardTitle } from '@/components/ui/Card';
import TeacherBubble from '@/components/layout/TeacherBubble';
import ProgressBar from '@/components/ui/ProgressBar';
import { useProgress } from '@/context/ProgressContext';
import { useTeachers } from '@/hooks/useTeachers';

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
    title: 'Grammar',
    titleSpanish: 'Gramatica',
    description: 'A1 grammar lessons',
    href: '/grammar',
    icon: Brain,
    color: 'bg-purple-500',
  },
  {
    title: 'Flashcards',
    titleSpanish: 'Tarjetas',
    description: 'Spaced repetition practice',
    href: '/flashcards',
    icon: RefreshCw,
    color: 'bg-green-500',
  },
  {
    title: 'Review',
    titleSpanish: 'Repaso',
    description: 'Practice weak areas',
    href: '/review',
    icon: Sparkles,
    color: 'bg-orange-500',
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
  const { teachers, loading: teachersLoading } = useTeachers();

  // Calculate overall progress
  const totalLessons = 10; // Grammar lessons
  const totalConversations = 10; // Conversation scenarios
  const lessonsProgress = (progress.lessonsCompleted.length / totalLessons) * 100;
  const conversationsProgress = (progress.conversationsCompleted.length / totalConversations) * 100;
  const wordsLearned = Object.keys(progress.flashcardProgress).length;

  const teacher = teachers[0]; // First teacher for homepage

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bienvenido a tu viaje de espanol!
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Welcome to your Spanish journey! Start learning with interactive lessons,
            engaging conversations, and helpful teachers.
          </p>
          <Link
            href="/conversations"
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Start Learning
          </Link>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>
      </section>

      {/* Teacher Welcome */}
      <section>
        <TeacherBubble
          teacher={teacher}
          message={teacher.greeting}
          messageTranslation={teacher.greetingTranslation}
          size="large"
        />
      </section>

      {/* Progress Overview */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Tu Progreso / Your Progress
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
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

          <Card>
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

          <Card>
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
              <Link key={section.href} href={section.href}>
                <Card hover className="h-full">
                  <CardContent>
                    <div className={`inline-flex p-3 rounded-xl ${section.color} mb-4`}>
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

      {/* Quick Stats */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Que vas a aprender / What You Will Learn
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-500">500+</div>
            <div className="text-gray-600 dark:text-gray-400">Nouns</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary-500">100+</div>
            <div className="text-gray-600 dark:text-gray-400">Verbs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-500">10+</div>
            <div className="text-gray-600 dark:text-gray-400">Grammar Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-500">10+</div>
            <div className="text-gray-600 dark:text-gray-400">Conversations</div>
          </div>
        </div>
      </section>

      {/* Meet the Teachers */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Tus Profesores / Your Teachers
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {teachers.slice(0, 10).map((teacher) => (
            <Card key={teacher.id} className="text-center">
              <CardContent>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={teacher.imageUrl}
                    alt={teacher.name}
                    fill
                    className="rounded-full object-cover border-4 border-secondary-400"
                    sizes="96px"
                  />
                </div>
                <CardTitle>{teacher.name}</CardTitle>
                <CardDescription>{teacher.specialty}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
