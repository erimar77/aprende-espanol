'use client';

import { useState, useEffect, useCallback } from 'react';
import { Teacher } from '@/lib/types';
import { teachers as staticTeachers, getTeacherBySpecialty as getStaticBySpecialty } from '@/data/teachers';

interface TeacherApiResponse {
  id: string;
  name: string;
  imageUrl: string;
  greeting: string;
  greetingTranslation: string;
  specialty: string;
  gender?: string;
}

interface UseTeachersReturn {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  getTeacherById: (id: string) => Teacher;
  getTeacherBySpecialty: (specialty: string) => Teacher;
  refetch: () => Promise<void>;
}

// Global cache to share across components
let globalTeachersCache: Teacher[] | null = null;
let globalFetchPromise: Promise<Teacher[]> | null = null;

export function useTeachers(): UseTeachersReturn {
  const [teachers, setTeachers] = useState<Teacher[]>(globalTeachersCache || staticTeachers);
  const [loading, setLoading] = useState(!globalTeachersCache);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    // If already fetching, wait for that promise
    if (globalFetchPromise) {
      const result = await globalFetchPromise;
      setTeachers(result);
      setLoading(false);
      return;
    }

    // If already cached, use cache
    if (globalTeachersCache) {
      setTeachers(globalTeachersCache);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    globalFetchPromise = fetch('/api/teachers')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch teachers');
        }
        const data = await response.json();

        // If database has teachers, use them
        if (Array.isArray(data) && data.length > 0) {
          const typedData = data as TeacherApiResponse[];
          const formattedTeachers: Teacher[] = typedData.map(t => ({
            id: t.id,
            name: t.name,
            imageUrl: t.imageUrl,
            greeting: t.greeting,
            greetingTranslation: t.greetingTranslation,
            specialty: t.specialty,
            gender: t.gender as 'male' | 'female' | undefined,
          }));
          globalTeachersCache = formattedTeachers;
          return formattedTeachers;
        }

        // Fallback to static data
        globalTeachersCache = staticTeachers;
        return staticTeachers;
      })
      .catch((err) => {
        console.error('Failed to fetch teachers:', err);
        // Fallback to static data on error
        globalTeachersCache = staticTeachers;
        return staticTeachers;
      })
      .finally(() => {
        globalFetchPromise = null;
      });

    const result = await globalFetchPromise;
    setTeachers(result);
    setLoading(false);
  }, []);

  const refetch = useCallback(async () => {
    // Clear cache and refetch
    globalTeachersCache = null;
    globalFetchPromise = null;
    await fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const getTeacherById = useCallback((id: string): Teacher => {
    const found = teachers.find(t => t.id === id);
    return found || teachers[0] || staticTeachers[0];
  }, [teachers]);

  const getTeacherBySpecialty = useCallback((specialty: string): Teacher => {
    // Map specialty keywords to teacher specialties
    const specialtyMap: Record<string, string[]> = {
      vocabulary: ['Vocabulary', 'Conversations'],
      grammar: ['Grammar', 'Structure'],
      verbs: ['Verb', 'Conjugation'],
      flashcards: ['Flashcard', 'Review'],
      test: ['Test', 'Assessment'],
      conversations: ['Interactive', 'Dialogue'],
      numbers: ['Number', 'Time'],
      practice: ['Number', 'Time', 'Practice'],
      review: ['Review', 'Flashcard'],
      advanced: ['Advanced'],
      stories: ['Stories', 'Reading', 'Storyteller'],
      reading: ['Stories', 'Reading', 'Storyteller'],
      cultural: ['Cultural', 'Culture', 'Immersion'],
      culture: ['Cultural', 'Culture', 'Immersion'],
    };

    const keywords = specialtyMap[specialty.toLowerCase()] || [specialty];

    const found = teachers.find(t =>
      keywords.some(keyword =>
        t.specialty.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    // Fallback to static helper if not found in database
    if (!found) {
      return getStaticBySpecialty(specialty);
    }

    return found;
  }, [teachers]);

  return {
    teachers,
    loading,
    error,
    getTeacherById,
    getTeacherBySpecialty,
    refetch,
  };
}

// Clear cache (call this after admin updates)
export function clearTeachersCache() {
  globalTeachersCache = null;
  globalFetchPromise = null;
}
