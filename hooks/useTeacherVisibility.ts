'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'showTeachers';

export function useTeacherVisibility() {
  const [showTeachers, setShowTeachers] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setShowTeachers(stored === 'true');
    }
    setIsLoaded(true);

    // Listen for changes from other tabs/windows
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        setShowTeachers(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleTeachers = useCallback(() => {
    const newValue = !showTeachers;
    setShowTeachers(newValue);
    localStorage.setItem(STORAGE_KEY, String(newValue));
  }, [showTeachers]);

  const setTeacherVisibility = useCallback((visible: boolean) => {
    setShowTeachers(visible);
    localStorage.setItem(STORAGE_KEY, String(visible));
  }, []);

  return {
    showTeachers,
    isLoaded,
    toggleTeachers,
    setTeacherVisibility,
  };
}
