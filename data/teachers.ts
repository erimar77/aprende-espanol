import { Teacher } from '@/lib/types';

export const teachers: Teacher[] = [
  {
    id: 'maria',
    name: 'Maria',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    greeting: 'Hola! Soy Maria, tu profesora de español. Vamos a aprender juntos!',
    greetingTranslation: "Hello! I'm Maria, your Spanish teacher. Let's learn together!",
    specialty: 'Vocabulary & Conversations',
    gender: 'female',
  },
  {
    id: 'alejandro',
    name: 'Alejandro',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    greeting: 'Bienvenido! Me llamo Alejandro y estoy aqui para ayudarte con la gramatica.',
    greetingTranslation: "Welcome! My name is Alejandro and I'm here to help you with grammar.",
    specialty: 'Grammar & Structure',
    gender: 'male',
  },
  {
    id: 'miguel',
    name: 'Miguel',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    greeting: 'Hola amigo! Soy Miguel. Los verbos son mi especialidad!',
    greetingTranslation: "Hello friend! I'm Miguel. Verbs are my specialty!",
    specialty: 'Verb Conjugation',
    gender: 'male',
  },
  {
    id: 'javier',
    name: 'Javier',
    imageUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face',
    greeting: 'Que tal! Soy Javier. Vamos a practicar con tarjetas!',
    greetingTranslation: "How's it going! I'm Javier. Let's practice with flashcards!",
    specialty: 'Flashcards & Review',
    gender: 'male',
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
  {
    id: 'elena',
    name: 'Elena',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    greeting: 'Hola! Soy Elena, tu cuentacuentos. Me encanta leer historias contigo!',
    greetingTranslation: "Hello! I'm Elena, your storyteller. I love reading stories with you!",
    specialty: 'Stories & Reading',
    gender: 'female',
  },
  {
    id: 'pablo',
    name: 'Pablo',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
    greeting: 'Bienvenido! Soy Pablo. Vamos a explorar la cultura española juntos!',
    greetingTranslation: "Welcome! I'm Pablo. Let's explore Spanish culture together!",
    specialty: 'Cultural Immersion',
    gender: 'male',
  },
];

export function getTeacherById(id: string): Teacher {
  return teachers.find(t => t.id === id) || teachers[0];
}

export function getTeacherBySpecialty(specialty: string): Teacher {
  const specialtyMap: Record<string, string> = {
    vocabulary: 'maria',
    grammar: 'alejandro',
    verbs: 'miguel',
    flashcards: 'javier',
    test: 'valentina',
    conversations: 'isabella',
    numbers: 'carlos',
    practice: 'carlos',
    advanced: 'diego',
    stories: 'elena',
    reading: 'elena',
    cultural: 'pablo',
    culture: 'pablo',
  };

  const teacherId = specialtyMap[specialty.toLowerCase()] || 'maria';
  return getTeacherById(teacherId);
}
