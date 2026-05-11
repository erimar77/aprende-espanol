'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getTheme, setTheme as saveTheme } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage-keys';

type Mode = 'light' | 'dark';
type ColorScheme = 'default' | 'peru' | 'mexico' | 'colombia' | 'argentina';

interface ThemeContextType {
  theme: Mode;
  colorScheme: ColorScheme;
  toggleTheme: () => void;
  setTheme: (theme: Mode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Mode>('light');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('default');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = getTheme();
    setThemeState(savedTheme);

    // Load color scheme from localStorage
    try {
      const savedScheme = localStorage.getItem(STORAGE_KEYS.COLOR_SCHEME) as ColorScheme;
      if (savedScheme && ['default', 'peru', 'mexico', 'colombia', 'argentina'].includes(savedScheme)) {
        setColorSchemeState(savedScheme);
      }
    } catch (e) {
      console.error('Failed to load color scheme:', e);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Handle dark/light mode
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);

    // Handle color scheme
    root.classList.remove('scheme-default', 'scheme-peru', 'scheme-mexico', 'scheme-colombia', 'scheme-argentina');
    root.classList.add(`scheme-${colorScheme}`);
    localStorage.setItem(STORAGE_KEYS.COLOR_SCHEME, colorScheme);
  }, [theme, colorScheme, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Mode) => {
    setThemeState(newTheme);
  };

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, toggleTheme, setTheme, setColorScheme }}>
      {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
