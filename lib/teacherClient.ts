// Client-side teacher data fetching with fallback to static data
import { teachers as staticTeachers, getTeacherById as getStaticTeacherById, getTeacherBySpecialty as getStaticTeacherBySpecialty } from '@/data/teachers';
import { Teacher } from '@/lib/types';

let cachedTeachers: Teacher[] | null = null;

// Fetch teachers from API with fallback to static data
export async function fetchTeachers(): Promise<Teacher[]> {
  try {
    const response = await fetch('/api/teachers');
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Convert database format to Teacher type
        cachedTeachers = data.map((t: any) => ({
          id: t.id,
          name: t.name,
          imageUrl: t.imageUrl,
          greeting: t.greeting,
          greetingTranslation: t.greetingTranslation,
          specialty: t.specialty,
          gender: t.gender,
        }));
        return cachedTeachers;
      }
    }
  } catch (error) {
    console.error('Failed to fetch teachers from API:', error);
  }

  // Fallback to static data
  cachedTeachers = staticTeachers;
  return staticTeachers;
}

// Get cached teachers or fetch
export async function getTeachers(): Promise<Teacher[]> {
  if (cachedTeachers) return cachedTeachers;
  return fetchTeachers();
}

// Get teacher by ID with fallback
export async function getTeacherByIdAsync(id: string): Promise<Teacher> {
  const teachers = await getTeachers();
  return teachers.find(t => t.id === id) || teachers[0];
}

// Get teacher by specialty with fallback
export async function getTeacherBySpecialtyAsync(specialty: string): Promise<Teacher> {
  const teachers = await getTeachers();

  const specialtyMap: Record<string, string> = {
    vocabulary: 'Vocabulary & Conversations',
    grammar: 'Grammar & Structure',
    verbs: 'Verb Conjugation',
    flashcards: 'Flashcards & Review',
    test: 'Testing & Assessment',
    conversations: 'Interactive Dialogues',
    numbers: 'Numbers & Time',
    practice: 'Numbers & Time',
    advanced: 'Advanced Conversations',
  };

  const targetSpecialty = specialtyMap[specialty.toLowerCase()];
  const teacher = teachers.find(t =>
    t.specialty.toLowerCase().includes(targetSpecialty?.toLowerCase() || specialty.toLowerCase())
  );

  return teacher || teachers[0];
}

// Sync versions using static data as fallback
// These are useful for initial render before async fetch completes
export function getTeachersSync(): Teacher[] {
  return cachedTeachers || staticTeachers;
}

export function getTeacherByIdSync(id: string): Teacher {
  const teachers = getTeachersSync();
  return teachers.find(t => t.id === id) || getStaticTeacherById(id);
}

export function getTeacherBySpecialtySync(specialty: string): Teacher {
  // For immediate sync access, use static helper
  return getStaticTeacherBySpecialty(specialty);
}

// Clear cache (useful for after admin updates)
export function clearTeacherCache(): void {
  cachedTeachers = null;
}
