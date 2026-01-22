'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Sun, Moon, BookOpen, ChevronDown } from 'lucide-react';
import AuthButton from './AuthButton';

interface NavItem {
  name: string;
  href?: string;
  children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Conversations', href: '/conversations' },
  { name: 'Stories', href: '/stories' },
  { name: 'Vocabulary', href: '/vocabulary' },
  { name: 'Verbs', href: '/verbs' },
  { name: 'Grammar', href: '/grammar' },
  {
    name: 'Practice',
    children: [
      { name: 'Exercises', href: '/practice' },
      { name: 'Flashcards', href: '/flashcards' },
      { name: 'Review', href: '/review' },
      { name: 'Test', href: '/test' },
    ],
  },
];

function NavDropdown({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!item.children) {
    return (
      <Link
        href={item.href!}
        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        {item.name}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          {item.children.map((child) => (
            <Link
              key={child.name}
              href={child.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);

  // Add Admin link for admins
  const navItems: NavItem[] = isAdmin
    ? [...navigation, { name: 'Admin', href: '/admin' }]
    : navigation;

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
              Aprende<span className="text-primary-500">Espanol</span>
            </span>
          </Link>

          {/* Desktop Navigation - Right aligned */}
          <div className="hidden lg:flex lg:items-center lg:gap-1 ml-auto mr-4">
            {navItems.map((item) => (
              <NavDropdown key={item.name} item={item} />
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
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

            {/* Auth button */}
            <AuthButton />

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
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                item.children ? (
                  <div key={item.name}>
                    <button
                      onClick={() => setExpandedMobileSection(
                        expandedMobileSection === item.name ? null : item.name
                      )}
                      className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {item.name}
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedMobileSection === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedMobileSection === item.name && (
                      <div className="ml-4 mt-1 flex flex-col gap-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href!}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 text-base font-medium hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
                      item.name === 'Admin'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
