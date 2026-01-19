import { Teacher } from '@/lib/types';

export const teachers: Teacher[] = [
  {
    id: 'maria',
    name: 'Maria',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    greeting: 'Hola! Soy Maria, tu profesora de espanol. Vamos a aprender juntos!',
    greetingTranslation: "Hello! I'm Maria, your Spanish teacher. Let's learn together!",
    specialty: 'Vocabulary & Conversations',
    gender: 'female',
  },
  {
    id: 'sofia',
    name: 'Sofia',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    greeting: 'Bienvenido! Me llamo Sofia y estoy aqui para ayudarte con la gramatica.',
    greetingTranslation: "Welcome! My name is Sofia and I'm here to help you with grammar.",
    specialty: 'Grammar & Structure',
    gender: 'female',
  },
  {
    id: 'carmen',
    name: 'Carmen',
    imageUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=face',
    greeting: 'Hola amigo! Soy Carmen. Los verbos son mi especialidad!',
    greetingTranslation: "Hello friend! I'm Carmen. Verbs are my specialty!",
    specialty: 'Verb Conjugation',
    gender: 'female',
  },
  {
    id: 'lucia',
    name: 'Lucia',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    greeting: 'Que tal! Soy Lucia. Vamos a practicar con tarjetas!',
    greetingTranslation: "How's it going! I'm Lucia. Let's practice with flashcards!",
    specialty: 'Flashcards & Review',
    gender: 'female',
  },
  {
    id: 'valentina',
    name: 'Valentina',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
    greeting: 'Hola! Soy Valentina. Preparate para el examen final!',
    greetingTranslation: "Hello! I'm Valentina. Get ready for the final exam!",
    specialty: 'Testing & Assessment',
    gender: 'female',
  },
  {
    id: 'isabella',
    name: 'Isabella',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    greeting: 'Buenos dias! Soy Isabella. Vamos a tener conversaciones divertidas!',
    greetingTranslation: "Good morning! I'm Isabella. Let's have fun conversations!",
    specialty: 'Interactive Dialogues',
    gender: 'female',
  },
  {
    id: 'carlos',
    name: 'Carlos',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    greeting: 'Hola! Soy Carlos, tu profesor de numeros y tiempo. Los numeros son faciles!',
    greetingTranslation: "Hello! I'm Carlos, your numbers and time teacher. Numbers are easy!",
    specialty: 'Numbers & Time',
    gender: 'male',
  },
  {
    id: 'diego',
    name: 'Diego',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    greeting: 'Que tal! Me llamo Diego. Vamos a practicar conversaciones avanzadas!',
    greetingTranslation: "How's it going! My name is Diego. Let's practice advanced conversations!",
    specialty: 'Advanced Conversations',
    gender: 'male',
  },
];

export function getTeacherById(id: string): Teacher {
  return teachers.find(t => t.id === id) || teachers[0];
}

export function getTeacherBySpecialty(specialty: string): Teacher {
  const specialtyMap: Record<string, string> = {
    vocabulary: 'maria',
    grammar: 'sofia',
    verbs: 'carmen',
    flashcards: 'lucia',
    test: 'valentina',
    conversations: 'isabella',
    numbers: 'carlos',
    practice: 'carlos',
    advanced: 'diego',
  };

  const teacherId = specialtyMap[specialty.toLowerCase()] || 'maria';
  return getTeacherById(teacherId);
}
