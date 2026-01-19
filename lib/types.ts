// Core Types for Spanish Learning App

export interface Word {
  id: string;
  spanish: string;
  english: string;
  gender?: 'masculine' | 'feminine' | 'neutral';
  plural?: string;
  category: string;
  example?: string;
  exampleTranslation?: string;
  audioUrl?: string;
}

export interface Verb {
  id: string;
  infinitive: string;
  english: string;
  type: 'regular' | 'irregular' | 'stem-changing' | 'reflexive';
  conjugation: VerbConjugation;
  example?: string;
  exampleTranslation?: string;
}

export interface VerbConjugation {
  present: ConjugationSet;
  preterite: ConjugationSet;
  imperfect: ConjugationSet;
  future: ConjugationSet;
  conditional?: ConjugationSet;
  subjunctivePresent?: ConjugationSet;
  imperative?: ImperativeSet;
  gerund: string;
  pastParticiple: string;
}

export interface ConjugationSet {
  yo: string;
  tu: string;
  el: string;
  nosotros: string;
  vosotros: string;
  ellos: string;
}

export interface ImperativeSet {
  tu: string;
  usted: string;
  nosotros: string;
  vosotros: string;
  ustedes: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  titleSpanish: string;
  description: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  order: number;
  content: LessonContent[];
  exercises: Exercise[];
}

export interface LessonContent {
  type: 'heading' | 'text' | 'example' | 'table' | 'tip';
  content: string;
  spanishExample?: string;
  englishTranslation?: string;
  tableData?: TableData;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'conjugation' | 'translation' | 'matching';
  question: string;
  questionSpanish?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  hint?: string;
}

export interface CulturalNote {
  title: string;
  content: string;
}

export interface ConversationScenario {
  id: string;
  title: string;
  titleSpanish: string;
  description: string;
  difficulty: 'beginner' | 'easy' | 'medium' | 'advanced';
  location: string;
  participants: string[];
  dialogue: DialogueNode[];
  order: number;
  prerequisiteId?: string;
  culturalNote?: CulturalNote;
}

export interface DialogueNode {
  id: string;
  speaker: 'teacher' | 'user' | 'npc';
  text: string;
  translation: string;
  responses?: DialogueResponse[];
  nextNodeId?: string;
}

export interface DialogueResponse {
  id: string;
  text: string;
  translation: string;
  isCorrect: boolean;
  feedback: string;
  feedbackTranslation: string;
  nextNodeId: string;
}

export interface Teacher {
  id: string;
  name: string;
  imageUrl: string;
  greeting: string;
  greetingTranslation: string;
  specialty: string;
  gender?: 'male' | 'female';
}

export interface FlashcardProgress {
  wordId: string;
  wordType: 'noun' | 'verb' | 'adjective' | 'adverb';
  correctCount: number;
  incorrectCount: number;
  lastReviewed: string;
  nextReview: string;
  easeFactor: number;
  interval: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

export interface UserProgress {
  lessonsCompleted: string[];
  conversationsCompleted: string[];
  unlockedConversations: string[];
  testScores: TestScore[];
  flashcardProgress: Record<string, FlashcardProgress>;
  streakDays: number;
  lastActive: string;
  totalWordsLearned: number;
  totalVerbsLearned: number;
}

export interface TestScore {
  testId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number;
}

export interface TestQuestion {
  id: string;
  category: 'vocabulary' | 'grammar' | 'conjugation' | 'comprehensive' | 'listening' | 'reading';
  subcategory?: string;
  type: 'multiple-choice' | 'fill-blank' | 'conjugation' | 'translation';
  question: string;
  questionSpanish?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points?: number;
}

export interface ContentBlock {
  type: 'heading' | 'text' | 'example' | 'table' | 'tip';
  content: string;
  spanishExample?: string;
  englishTranslation?: string;
  tableData?: TableData;
}

// Content Section interface for extensibility
export interface ContentSection {
  id: string;
  title: string;
  titleSpanish: string;
  description: string;
  icon: string;
  path: string;
  color: string;
  items?: Word[] | Verb[] | GrammarLesson[];
  exercises?: Exercise[];
}

export type WordCategory =
  | 'family'
  | 'food'
  | 'animals'
  | 'body'
  | 'clothing'
  | 'colors'
  | 'house'
  | 'transportation'
  | 'weather'
  | 'time'
  | 'numbers'
  | 'professions'
  | 'places'
  | 'nature'
  | 'school'
  | 'emotions'
  | 'actions'
  | 'objects'
  | 'greetings';

export const WORD_CATEGORIES: Record<WordCategory, { label: string; labelSpanish: string; icon: string }> = {
  family: { label: 'Family', labelSpanish: 'Familia', icon: 'Users' },
  food: { label: 'Food & Drink', labelSpanish: 'Comida y Bebida', icon: 'UtensilsCrossed' },
  animals: { label: 'Animals', labelSpanish: 'Animales', icon: 'Cat' },
  body: { label: 'Body Parts', labelSpanish: 'Partes del Cuerpo', icon: 'Heart' },
  clothing: { label: 'Clothing', labelSpanish: 'Ropa', icon: 'Shirt' },
  colors: { label: 'Colors', labelSpanish: 'Colores', icon: 'Palette' },
  house: { label: 'House & Home', labelSpanish: 'Casa y Hogar', icon: 'Home' },
  transportation: { label: 'Transportation', labelSpanish: 'Transporte', icon: 'Car' },
  weather: { label: 'Weather', labelSpanish: 'Clima', icon: 'Cloud' },
  time: { label: 'Time & Days', labelSpanish: 'Tiempo y Dias', icon: 'Clock' },
  numbers: { label: 'Numbers', labelSpanish: 'Numeros', icon: 'Hash' },
  professions: { label: 'Professions', labelSpanish: 'Profesiones', icon: 'Briefcase' },
  places: { label: 'Places', labelSpanish: 'Lugares', icon: 'MapPin' },
  nature: { label: 'Nature', labelSpanish: 'Naturaleza', icon: 'TreePine' },
  school: { label: 'School', labelSpanish: 'Escuela', icon: 'GraduationCap' },
  emotions: { label: 'Emotions', labelSpanish: 'Emociones', icon: 'Smile' },
  actions: { label: 'Actions', labelSpanish: 'Acciones', icon: 'Zap' },
  objects: { label: 'Common Objects', labelSpanish: 'Objetos Comunes', icon: 'Box' },
  greetings: { label: 'Greetings', labelSpanish: 'Saludos', icon: 'MessageCircle' },
};
