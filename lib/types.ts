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
  ellos: string;
}

export interface ImperativeSet {
  tu: string;
  usted: string;
  nosotros: string;
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
  /** New interactive lesson steps — if present, the lesson uses the interactive view */
  interactiveSteps?: InteractiveStep[];
}

// ── Interactive Lesson System ──────────────────────────────────────────

/** A single step in a progressive-reveal interactive lesson */
export type InteractiveStep =
  | NarrativeStep
  | DiscoverStep
  | ExplainStep
  | PracticeStep
  | DragOrderStep
  | FillTableStep
  | ColorMatchStep;

interface BaseStep {
  id: string;
}

/** Mini-story: dialogue/narrative that demonstrates the grammar in context */
export interface NarrativeStep extends BaseStep {
  type: 'narrative';
  /** Setting context line shown above the dialogue */
  scene: string;
  lines: { speaker: string; text: string; translation: string; highlight?: string }[];
  /** Question asking learner what they noticed */
  noticePrompt?: string;
}

/** Discovery: show examples and ask the learner to spot the pattern */
export interface DiscoverStep extends BaseStep {
  type: 'discover';
  instruction: string;
  examples: { spanish: string; english: string; highlight?: string }[];
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

/** Brief rule explanation — a concise reveal after the learner has seen the pattern */
export interface ExplainStep extends BaseStep {
  type: 'explain';
  title: string;
  content: string;
  /** Optional table for conjugation/grammar patterns */
  table?: TableData;
  tip?: string;
}

/** Inline practice question embedded in the flow */
export interface PracticeStep extends BaseStep {
  type: 'practice';
  variant: 'multiple-choice' | 'fill-blank' | 'translate';
  question: string;
  context?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

/** Drag to reorder words into correct sentence order */
export interface DragOrderStep extends BaseStep {
  type: 'drag-order';
  instruction: string;
  /** The words in correct order */
  correctOrder: string[];
  /** Scrambled words shown to the user (if omitted, auto-shuffled) */
  scrambled?: string[];
  translation: string;
}

/** Fill in a conjugation/grammar table interactively */
export interface FillTableStep extends BaseStep {
  type: 'fill-table';
  instruction: string;
  headers: string[];
  rows: { label: string; cells: { value: string; editable: boolean }[] }[];
  tip?: string;
}

/** Color-coded sentence analysis — tap parts to identify their role */
export interface ColorMatchStep extends BaseStep {
  type: 'color-match';
  instruction: string;
  sentence: string;
  /** Segments of the sentence with their grammatical role */
  segments: { text: string; role: string; color: string }[];
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
  category?: 'everyday' | 'cultural' | 'travel' | 'social' | 'professional';
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

export interface FlashcardProgress {
  wordId: string;
  wordType: 'noun' | 'verb' | 'adjective' | 'adverb';
  correctCount: number;
  incorrectCount: number;
  lastReviewed: string;
  nextReview: string;
  easeFactor: number;
  interval: number;
  repetition: number;          // consecutive correct answers (SM-2)
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
