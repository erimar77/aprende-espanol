import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProgressProvider } from '@/context/ProgressContext';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Aprende Espanol - Learn Spanish A1',
  description: 'Interactive Spanish learning website for A1 beginners with vocabulary, grammar, verb conjugation, flashcards, and conversations.',
  keywords: ['Spanish', 'Learn Spanish', 'A1', 'Language Learning', 'Vocabulary', 'Grammar', 'Flashcards'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <ProgressProvider>
              <div className="min-h-screen bg-cream dark:bg-charcoal tile-pattern">
                <Header />
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                  {children}
                </main>
                <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-12">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Aprende Espanol - Your journey to Spanish fluency starts here
                    </p>
                  </div>
                </footer>
              </div>
            </ProgressProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
