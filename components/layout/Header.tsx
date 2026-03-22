'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/context/GamificationContext';
import { Menu, X, Sun, Moon, BookOpen, ChevronDown, Settings, Flame, Star } from 'lucide-react';

interface NavItem {
  name: string;
  href?: string;
  children?: { name: string; href: string; description?: string }[];
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: '📊 Dashboard', href: '/dashboard' },
  { name: '🔥 Daily Practice', href: '/daily-practice' },
  {
    name: 'Learn',
    children: [
      { name: 'Conversations', href: '/conversations', description: 'Real dialogues' },
      { name: 'Stories', href: '/stories', description: 'Read & listen' },
      { name: 'Vocabulary', href: '/vocabulary', description: 'Learn new words' },
      { name: 'Verbs', href: '/verbs', description: 'Conjugation patterns' },
      { name: 'Verb Trainer', href: '/verb-trainer', description: 'Practice verbs' },
      { name: 'Grammar', href: '/grammar', description: 'Grammar rules' },
    ],
  },
  {
    name: 'Fluency',
    children: [
      { name: '⚡ Workshop', href: '/workshop', description: 'Live sessions' },
      { name: 'Sentence Builder', href: '/sentence-builder', description: 'Build sentences' },
      { name: 'Speaking Prompts', href: '/prompts', description: 'Speaking exercises' },
      { name: 'Phrase Bank', href: '/phrases', description: 'Common phrases' },
      { name: 'Quick Response', href: '/quick-response', description: 'Quick replies' },
      { name: 'Inner Monologue', href: '/inner-monologue', description: 'Self talk' },
      { name: 'Scenarios', href: '/scenarios', description: 'Real situations' },
      { name: 'Immersion', href: '/immersion', description: 'Immersive content' },
    ],
  },
  {
    name: 'Practice',
    children: [
      { name: 'Exercises', href: '/practice', description: 'Core exercises' },
      { name: 'Flashcards', href: '/flashcards', description: 'Spaced repetition' },
      { name: 'Describe', href: '/describe', description: 'Describe images' },
      { name: 'Narrate', href: '/narrate', description: 'Tell stories' },
      { name: 'Mad Libs', href: '/madlibs', description: 'Fill-in games' },
      { name: 'Word Find', href: '/wordfind', description: 'Search puzzles' },
      { name: '🎸 Guitarra', href: '/guitarra', description: 'Learn with music' },
      { name: 'Review', href: '/review', description: 'Review material' },
      { name: 'Test', href: '/test', description: 'Assess progress' },
      { name: '🖨️ Worksheets', href: '/worksheets', description: 'Print & practice' },
    ],
  },
];

// Shared context so only one dropdown is open at a time
const DropdownContext = createContext<{
  openDropdown: string | null;
  setOpenDropdown: (name: string | null) => void;
}>({ openDropdown: null, setOpenDropdown: () => {} });

function NavDropdown({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const { openDropdown, setOpenDropdown } = useContext(DropdownContext);
  const isOpen = openDropdown === item.name;
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isCurrentPage = (href: string) => pathname === href;

  const hasActiveChild = item.children?.some(child => isCurrentPage(child.href)) ?? false;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setOpenDropdown]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  if (!item.children) {
    const isActive = isCurrentPage(item.href!);
    return (
      <Link
        href={item.href!}
        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
            : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        onMouseEnter={() => setOpenDropdown(null)}
      >
        {item.name}
      </Link>
    );
  }

  const cancelClose = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleMouseEnter = () => {
    cancelClose();
    setOpenDropdown(item.name);  // immediately opens this, closes others
  };

  const handleMouseLeave = () => {
    scheduleClose();
  };

  return (
    <div ref={dropdownRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        onClick={() => setOpenDropdown(isOpen ? null : item.name)}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          hasActiveChild
            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
            : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        {item.name}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 pt-1 w-56 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
            {item.children.map((child) => {
              const isChildActive = isCurrentPage(child.href);
              return (
                <Link
                  key={child.name}
                  href={child.href}
                  onClick={() => setOpenDropdown(null)}
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    isChildActive
                      ? 'bg-primary-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-medium border-l-3 border-primary-600 dark:border-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="font-medium">{child.name}</div>
                  {child.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{child.description}</div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const getCategoryColor = (categoryName: string) => {
  switch (categoryName) {
    case 'Learn':
      return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' };
    case 'Fluency':
      return { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' };
    case 'Practice':
      return { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' };
    default:
      return { bg: 'bg-gray-50 dark:bg-gray-800/50', border: 'border-gray-200 dark:border-gray-700' };
  }
};

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const { state, level } = useGamification();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Add Admin link for admins
  const navItems: NavItem[] = isAdmin
    ? [...navigation, { name: 'Admin', href: '/admin' }]
    : navigation;

  // Auto-expand section containing current page on mobile
  useEffect(() => {
    const currentSection = navItems.find(item =>
      item.children?.some(child => child.href === pathname)
    );
    if (currentSection) {
      setExpandedMobileSection(currentSection.name);
    }
  }, [pathname, navItems]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-charcoal/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary-500 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Aprende<span className="text-primary-500">Español</span>
            </span>
          </Link>

          {/* Desktop Navigation - Right aligned */}
          <DropdownContext.Provider value={{ openDropdown, setOpenDropdown }}>
            <div className="hidden lg:flex lg:items-center lg:gap-1 ml-auto mr-4">
              {navItems.map((item) => (
                <NavDropdown key={item.name} item={item} />
              ))}
            </div>
          </DropdownContext.Provider>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* XP & Streak Indicators */}
            <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              {state.streak.current > 0 && (
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{state.streak.current}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary-500" />
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Lv.{level.current.level}</span>
              </div>
            </div>

            {/* Settings */}
            <Link
              href="/settings"
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Auth button - hidden for now */}
            {/* <AuthButton /> */}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isCurrentPage = (href: string) => pathname === href;

                return item.children ? (
                  <div key={item.name} className={`rounded-lg border ${getCategoryColor(item.name).bg} ${getCategoryColor(item.name).border} border-l-4`}>
                    <button
                      onClick={() => setExpandedMobileSection(
                        expandedMobileSection === item.name ? null : item.name
                      )}
                      className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-gray-900 dark:text-white hover:opacity-80 transition-opacity rounded-t-lg"
                    >
                      {item.name}
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedMobileSection === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedMobileSection === item.name && (
                      <div className="flex flex-col gap-1 px-2 pb-2">
                        {item.children.map((child) => {
                          const isActive = isCurrentPage(child.href);
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`px-3 py-2.5 rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium border-l-3 border-primary-600 dark:border-primary-400'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                              }`}
                            >
                              <div className="font-medium text-sm">{child.name}</div>
                              {child.description && (
                                <div className={`text-xs mt-0.5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                  {child.description}
                                </div>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href!}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isCurrentPage(item.href!)
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-3 border-primary-600 dark:border-primary-400'
                        : item.name === 'Admin'
                        ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
