// Conversation prompts for speaking practice

export interface ConversationPrompt {
  id: string;
  category: 'daily' | 'opinions' | 'descriptions' | 'hypothetical' | 'storytelling' | 'personal';
  difficulty: 'beginner' | 'elementary' | 'intermediate';
  promptSpanish: string;
  promptEnglish: string;
  helperQuestions: { spanish: string; english: string }[];
  usefulVocab: { spanish: string; english: string }[];
  exampleResponse?: string;
}

export const conversationPrompts: ConversationPrompt[] = [
  // DAILY LIFE
  {
    id: 'morning-routine',
    category: 'daily',
    difficulty: 'beginner',
    promptSpanish: 'Describe tu rutina de la mañana.',
    promptEnglish: 'Describe your morning routine.',
    helperQuestions: [
      { spanish: '¿A qué hora te despiertas?', english: 'What time do you wake up?' },
      { spanish: '¿Qué desayunas?', english: 'What do you have for breakfast?' },
      { spanish: '¿Cómo vas al trabajo o escuela?', english: 'How do you get to work or school?' },
    ],
    usefulVocab: [
      { spanish: 'despertarse', english: 'to wake up' },
      { spanish: 'ducharse', english: 'to shower' },
      { spanish: 'vestirse', english: 'to get dressed' },
      { spanish: 'desayunar', english: 'to have breakfast' },
      { spanish: 'salir de casa', english: 'to leave home' },
    ],
    exampleResponse: 'Me despierto a las siete. Primero, me ducho. Después, desayuno café y pan. Salgo de casa a las ocho.',
  },
  {
    id: 'weekend-plans',
    category: 'daily',
    difficulty: 'beginner',
    promptSpanish: '¿Qué vas a hacer este fin de semana?',
    promptEnglish: 'What are you going to do this weekend?',
    helperQuestions: [
      { spanish: '¿Vas a salir o quedarte en casa?', english: 'Are you going out or staying home?' },
      { spanish: '¿Con quién vas a estar?', english: 'Who are you going to be with?' },
      { spanish: '¿Qué actividades te gustan?', english: 'What activities do you like?' },
    ],
    usefulVocab: [
      { spanish: 'voy a...', english: 'I\'m going to...' },
      { spanish: 'descansar', english: 'to rest' },
      { spanish: 'salir con amigos', english: 'to go out with friends' },
      { spanish: 'ir de compras', english: 'to go shopping' },
      { spanish: 'ver una película', english: 'to watch a movie' },
    ],
  },
  {
    id: 'typical-day',
    category: 'daily',
    difficulty: 'beginner',
    promptSpanish: 'Describe un día típico en tu vida.',
    promptEnglish: 'Describe a typical day in your life.',
    helperQuestions: [
      { spanish: '¿A qué hora empiezas el día?', english: 'What time do you start your day?' },
      { spanish: '¿Qué haces en el trabajo/escuela?', english: 'What do you do at work/school?' },
      { spanish: '¿Qué haces por la noche?', english: 'What do you do in the evening?' },
    ],
    usefulVocab: [
      { spanish: 'por la mañana', english: 'in the morning' },
      { spanish: 'por la tarde', english: 'in the afternoon' },
      { spanish: 'por la noche', english: 'in the evening' },
      { spanish: 'primero... después... luego...', english: 'first... then... later...' },
    ],
  },
  {
    id: 'last-meal',
    category: 'daily',
    difficulty: 'beginner',
    promptSpanish: '¿Qué comiste ayer?',
    promptEnglish: 'What did you eat yesterday?',
    helperQuestions: [
      { spanish: '¿Qué desayunaste?', english: 'What did you have for breakfast?' },
      { spanish: '¿Dónde almorzaste?', english: 'Where did you have lunch?' },
      { spanish: '¿Cocinaste o fuiste a un restaurante?', english: 'Did you cook or go to a restaurant?' },
    ],
    usefulVocab: [
      { spanish: 'comí', english: 'I ate' },
      { spanish: 'bebí', english: 'I drank' },
      { spanish: 'cociné', english: 'I cooked' },
      { spanish: 'delicioso', english: 'delicious' },
      { spanish: 'rico', english: 'tasty' },
    ],
  },

  // DESCRIPTIONS
  {
    id: 'describe-home',
    category: 'descriptions',
    difficulty: 'beginner',
    promptSpanish: 'Describe tu casa o apartamento.',
    promptEnglish: 'Describe your house or apartment.',
    helperQuestions: [
      { spanish: '¿Cuántas habitaciones tiene?', english: 'How many rooms does it have?' },
      { spanish: '¿Cómo es tu habitación favorita?', english: 'What is your favorite room like?' },
      { spanish: '¿Tiene jardín o balcón?', english: 'Does it have a garden or balcony?' },
    ],
    usefulVocab: [
      { spanish: 'la cocina', english: 'the kitchen' },
      { spanish: 'el baño', english: 'the bathroom' },
      { spanish: 'la sala', english: 'the living room' },
      { spanish: 'el dormitorio', english: 'the bedroom' },
      { spanish: 'grande/pequeño', english: 'big/small' },
      { spanish: 'cómodo', english: 'comfortable' },
    ],
  },
  {
    id: 'describe-family',
    category: 'descriptions',
    difficulty: 'beginner',
    promptSpanish: 'Describe a tu familia.',
    promptEnglish: 'Describe your family.',
    helperQuestions: [
      { spanish: '¿Cuántas personas hay en tu familia?', english: 'How many people are in your family?' },
      { spanish: '¿Tienes hermanos?', english: 'Do you have siblings?' },
      { spanish: '¿Cómo son tus padres?', english: 'What are your parents like?' },
    ],
    usefulVocab: [
      { spanish: 'mi madre/padre', english: 'my mother/father' },
      { spanish: 'mi hermano/hermana', english: 'my brother/sister' },
      { spanish: 'mayor/menor', english: 'older/younger' },
      { spanish: 'nos llevamos bien', english: 'we get along well' },
    ],
  },
  {
    id: 'describe-city',
    category: 'descriptions',
    difficulty: 'elementary',
    promptSpanish: 'Describe la ciudad donde vives.',
    promptEnglish: 'Describe the city where you live.',
    helperQuestions: [
      { spanish: '¿Es grande o pequeña?', english: 'Is it big or small?' },
      { spanish: '¿Qué lugares interesantes hay?', english: 'What interesting places are there?' },
      { spanish: '¿Cómo es el clima?', english: 'What is the weather like?' },
    ],
    usefulVocab: [
      { spanish: 'hay muchos/pocos...', english: 'there are many/few...' },
      { spanish: 'el centro', english: 'downtown' },
      { spanish: 'el transporte público', english: 'public transportation' },
      { spanish: 'tranquilo/ruidoso', english: 'quiet/noisy' },
    ],
  },
  {
    id: 'describe-friend',
    category: 'descriptions',
    difficulty: 'beginner',
    promptSpanish: 'Describe a tu mejor amigo/amiga.',
    promptEnglish: 'Describe your best friend.',
    helperQuestions: [
      { spanish: '¿Cómo se llama?', english: 'What is their name?' },
      { spanish: '¿Cómo es físicamente?', english: 'What do they look like?' },
      { spanish: '¿Cómo es su personalidad?', english: 'What is their personality like?' },
      { spanish: '¿Qué les gusta hacer juntos?', english: 'What do you like to do together?' },
    ],
    usefulVocab: [
      { spanish: 'alto/bajo', english: 'tall/short' },
      { spanish: 'simpático/amable', english: 'nice/kind' },
      { spanish: 'divertido', english: 'fun' },
      { spanish: 'inteligente', english: 'smart' },
      { spanish: 'nos conocimos...', english: 'we met...' },
    ],
  },

  // OPINIONS
  {
    id: 'favorite-food',
    category: 'opinions',
    difficulty: 'beginner',
    promptSpanish: '¿Cuál es tu comida favorita y por qué?',
    promptEnglish: 'What is your favorite food and why?',
    helperQuestions: [
      { spanish: '¿De qué país es?', english: 'What country is it from?' },
      { spanish: '¿Cuándo la comes normalmente?', english: 'When do you usually eat it?' },
      { spanish: '¿Sabes cocinarla?', english: 'Do you know how to cook it?' },
    ],
    usefulVocab: [
      { spanish: 'me encanta', english: 'I love' },
      { spanish: 'porque es...', english: 'because it is...' },
      { spanish: 'delicioso', english: 'delicious' },
      { spanish: 'sabroso', english: 'tasty' },
      { spanish: 'me recuerda a...', english: 'it reminds me of...' },
    ],
  },
  {
    id: 'hobbies',
    category: 'opinions',
    difficulty: 'beginner',
    promptSpanish: '¿Qué te gusta hacer en tu tiempo libre?',
    promptEnglish: 'What do you like to do in your free time?',
    helperQuestions: [
      { spanish: '¿Prefieres actividades al aire libre o en casa?', english: 'Do you prefer outdoor or indoor activities?' },
      { spanish: '¿Lo haces solo o con otras personas?', english: 'Do you do it alone or with others?' },
      { spanish: '¿Cuánto tiempo dedicas a esto?', english: 'How much time do you spend on this?' },
    ],
    usefulVocab: [
      { spanish: 'me gusta...', english: 'I like...' },
      { spanish: 'me relaja', english: 'it relaxes me' },
      { spanish: 'es divertido', english: 'it\'s fun' },
      { spanish: 'leer/cocinar/correr', english: 'to read/cook/run' },
    ],
  },
  {
    id: 'travel-preference',
    category: 'opinions',
    difficulty: 'elementary',
    promptSpanish: '¿Prefieres viajar a la playa o a las montañas?',
    promptEnglish: 'Do you prefer traveling to the beach or the mountains?',
    helperQuestions: [
      { spanish: '¿Por qué prefieres ese lugar?', english: 'Why do you prefer that place?' },
      { spanish: '¿Qué actividades te gustan allí?', english: 'What activities do you like there?' },
      { spanish: '¿Cuándo fue la última vez que fuiste?', english: 'When was the last time you went?' },
    ],
    usefulVocab: [
      { spanish: 'prefiero... porque...', english: 'I prefer... because...' },
      { spanish: 'nadar/caminar/escalar', english: 'to swim/walk/climb' },
      { spanish: 'el paisaje', english: 'the landscape' },
      { spanish: 'relajante/emocionante', english: 'relaxing/exciting' },
    ],
  },
  {
    id: 'learning-spanish',
    category: 'opinions',
    difficulty: 'elementary',
    promptSpanish: '¿Por qué estás aprendiendo español?',
    promptEnglish: 'Why are you learning Spanish?',
    helperQuestions: [
      { spanish: '¿Cuánto tiempo llevas estudiando?', english: 'How long have you been studying?' },
      { spanish: '¿Qué es lo más difícil?', english: 'What is the most difficult part?' },
      { spanish: '¿Cómo practicas?', english: 'How do you practice?' },
    ],
    usefulVocab: [
      { spanish: 'quiero viajar a...', english: 'I want to travel to...' },
      { spanish: 'para mi trabajo', english: 'for my job' },
      { spanish: 'me parece bonito', english: 'I think it\'s beautiful' },
      { spanish: 'llevo... meses/años', english: 'I\'ve been... months/years' },
    ],
  },

  // PERSONAL
  {
    id: 'introduce-yourself',
    category: 'personal',
    difficulty: 'beginner',
    promptSpanish: 'Preséntate. ¿Quién eres?',
    promptEnglish: 'Introduce yourself. Who are you?',
    helperQuestions: [
      { spanish: '¿Cómo te llamas?', english: 'What is your name?' },
      { spanish: '¿De dónde eres?', english: 'Where are you from?' },
      { spanish: '¿A qué te dedicas?', english: 'What do you do?' },
      { spanish: '¿Cuántos años tienes?', english: 'How old are you?' },
    ],
    usefulVocab: [
      { spanish: 'me llamo...', english: 'my name is...' },
      { spanish: 'soy de...', english: 'I\'m from...' },
      { spanish: 'trabajo como...', english: 'I work as...' },
      { spanish: 'tengo... años', english: 'I am... years old' },
    ],
    exampleResponse: 'Hola, me llamo María. Soy de Lima, Perú. Tengo treinta años. Trabajo como profesora de inglés.',
  },
  {
    id: 'childhood-memory',
    category: 'personal',
    difficulty: 'intermediate',
    promptSpanish: 'Cuenta un recuerdo de tu infancia.',
    promptEnglish: 'Tell a memory from your childhood.',
    helperQuestions: [
      { spanish: '¿Dónde vivías de niño/a?', english: 'Where did you live as a child?' },
      { spanish: '¿Qué te gustaba hacer?', english: 'What did you like to do?' },
      { spanish: '¿Quién estaba contigo?', english: 'Who was with you?' },
    ],
    usefulVocab: [
      { spanish: 'cuando era niño/a', english: 'when I was a child' },
      { spanish: 'recuerdo que...', english: 'I remember that...' },
      { spanish: 'solía...', english: 'I used to...' },
      { spanish: 'me divertía mucho', english: 'I had a lot of fun' },
    ],
  },
  {
    id: 'future-goals',
    category: 'personal',
    difficulty: 'elementary',
    promptSpanish: '¿Cuáles son tus metas para el futuro?',
    promptEnglish: 'What are your goals for the future?',
    helperQuestions: [
      { spanish: '¿Qué quieres lograr este año?', english: 'What do you want to achieve this year?' },
      { spanish: '¿Dónde te ves en cinco años?', english: 'Where do you see yourself in five years?' },
      { spanish: '¿Qué necesitas hacer para lograrlo?', english: 'What do you need to do to achieve it?' },
    ],
    usefulVocab: [
      { spanish: 'quiero...', english: 'I want...' },
      { spanish: 'espero...', english: 'I hope...' },
      { spanish: 'mi sueño es...', english: 'my dream is...' },
      { spanish: 'voy a...', english: 'I\'m going to...' },
    ],
  },

  // HYPOTHETICAL
  {
    id: 'lottery',
    category: 'hypothetical',
    difficulty: 'intermediate',
    promptSpanish: '¿Qué harías si ganaras la lotería?',
    promptEnglish: 'What would you do if you won the lottery?',
    helperQuestions: [
      { spanish: '¿Seguirías trabajando?', english: 'Would you keep working?' },
      { spanish: '¿Qué comprarías primero?', english: 'What would you buy first?' },
      { spanish: '¿Ayudarías a alguien?', english: 'Would you help anyone?' },
    ],
    usefulVocab: [
      { spanish: 'compraría...', english: 'I would buy...' },
      { spanish: 'viajaría a...', english: 'I would travel to...' },
      { spanish: 'ayudaría a...', english: 'I would help...' },
      { spanish: 'dejaría de...', english: 'I would stop...' },
    ],
  },
  {
    id: 'superpower',
    category: 'hypothetical',
    difficulty: 'intermediate',
    promptSpanish: 'Si pudieras tener un superpoder, ¿cuál elegirías?',
    promptEnglish: 'If you could have a superpower, which would you choose?',
    helperQuestions: [
      { spanish: '¿Por qué elegirías ese poder?', english: 'Why would you choose that power?' },
      { spanish: '¿Cómo lo usarías?', english: 'How would you use it?' },
      { spanish: '¿Ayudarías a otros?', english: 'Would you help others?' },
    ],
    usefulVocab: [
      { spanish: 'elegiría...', english: 'I would choose...' },
      { spanish: 'volar', english: 'to fly' },
      { spanish: 'ser invisible', english: 'to be invisible' },
      { spanish: 'leer mentes', english: 'to read minds' },
      { spanish: 'sería útil para...', english: 'it would be useful for...' },
    ],
  },

  // STORYTELLING
  {
    id: 'last-vacation',
    category: 'storytelling',
    difficulty: 'elementary',
    promptSpanish: 'Cuenta sobre tus últimas vacaciones.',
    promptEnglish: 'Tell about your last vacation.',
    helperQuestions: [
      { spanish: '¿Adónde fuiste?', english: 'Where did you go?' },
      { spanish: '¿Con quién fuiste?', english: 'Who did you go with?' },
      { spanish: '¿Qué hiciste allí?', english: 'What did you do there?' },
      { spanish: '¿Qué fue lo mejor?', english: 'What was the best part?' },
    ],
    usefulVocab: [
      { spanish: 'fui a...', english: 'I went to...' },
      { spanish: 'viajé con...', english: 'I traveled with...' },
      { spanish: 'visitamos...', english: 'we visited...' },
      { spanish: 'lo mejor fue...', english: 'the best part was...' },
    ],
  },
  {
    id: 'embarrassing-moment',
    category: 'storytelling',
    difficulty: 'intermediate',
    promptSpanish: 'Cuenta una situación embarazosa que te pasó.',
    promptEnglish: 'Tell about an embarrassing situation that happened to you.',
    helperQuestions: [
      { spanish: '¿Cuándo pasó?', english: 'When did it happen?' },
      { spanish: '¿Quién estaba contigo?', english: 'Who was with you?' },
      { spanish: '¿Qué hiciste después?', english: 'What did you do after?' },
    ],
    usefulVocab: [
      { spanish: 'me dio vergüenza', english: 'I was embarrassed' },
      { spanish: 'no sabía qué hacer', english: 'I didn\'t know what to do' },
      { spanish: 'me puse rojo/a', english: 'I turned red' },
      { spanish: 'ahora me río de eso', english: 'now I laugh about it' },
    ],
  },
];

export const promptCategories = [
  { id: 'daily', label: 'Vida Diaria', labelEnglish: 'Daily Life', icon: '☀️', color: 'bg-yellow-500' },
  { id: 'descriptions', label: 'Descripciones', labelEnglish: 'Descriptions', icon: '🎨', color: 'bg-blue-500' },
  { id: 'opinions', label: 'Opiniones', labelEnglish: 'Opinions', icon: '💬', color: 'bg-purple-500' },
  { id: 'personal', label: 'Personal', labelEnglish: 'Personal', icon: '👤', color: 'bg-pink-500' },
  { id: 'hypothetical', label: 'Hipotéticos', labelEnglish: 'Hypothetical', icon: '🔮', color: 'bg-indigo-500' },
  { id: 'storytelling', label: 'Historias', labelEnglish: 'Storytelling', icon: '📖', color: 'bg-green-500' },
];
