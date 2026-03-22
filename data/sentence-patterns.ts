// Common sentence patterns for building Spanish sentences

export interface SentencePattern {
  id: string;
  pattern: string;
  patternEnglish: string;
  category: 'basics' | 'questions' | 'desires' | 'descriptions' | 'time' | 'opinions';
  difficulty: 'beginner' | 'elementary' | 'intermediate';
  slots: {
    id: string;
    label: string;
    labelEnglish: string;
    options: { spanish: string; english: string }[];
  }[];
  examples: { spanish: string; english: string }[];
}

export const sentencePatterns: SentencePattern[] = [
  // BASICS
  {
    id: 'yo-soy',
    pattern: 'Yo soy ___',
    patternEnglish: 'I am ___',
    category: 'basics',
    difficulty: 'beginner',
    slots: [
      {
        id: 'adjective',
        label: 'adjetivo',
        labelEnglish: 'adjective',
        options: [
          { spanish: 'alto/alta', english: 'tall' },
          { spanish: 'bajo/baja', english: 'short' },
          { spanish: 'inteligente', english: 'intelligent' },
          { spanish: 'simpático/simpática', english: 'nice/friendly' },
          { spanish: 'estudiante', english: 'a student' },
          { spanish: 'profesor/profesora', english: 'a teacher' },
          { spanish: 'de Perú', english: 'from Peru' },
          { spanish: 'feliz', english: 'happy' },
          { spanish: 'cansado/cansada', english: 'tired' },
        ],
      },
    ],
    examples: [
      { spanish: 'Yo soy estudiante.', english: 'I am a student.' },
      { spanish: 'Yo soy de Lima.', english: 'I am from Lima.' },
    ],
  },
  {
    id: 'el-ella-es',
    pattern: '___ es ___',
    patternEnglish: '___ is ___',
    category: 'basics',
    difficulty: 'beginner',
    slots: [
      {
        id: 'subject',
        label: 'sujeto',
        labelEnglish: 'subject',
        options: [
          { spanish: 'Él', english: 'He' },
          { spanish: 'Ella', english: 'She' },
          { spanish: 'Mi amigo', english: 'My friend (m)' },
          { spanish: 'Mi amiga', english: 'My friend (f)' },
          { spanish: 'Mi mamá', english: 'My mom' },
          { spanish: 'Mi papá', english: 'My dad' },
        ],
      },
      {
        id: 'description',
        label: 'descripción',
        labelEnglish: 'description',
        options: [
          { spanish: 'muy amable', english: 'very kind' },
          { spanish: 'doctor', english: 'a doctor' },
          { spanish: 'de México', english: 'from Mexico' },
          { spanish: 'inteligente', english: 'intelligent' },
          { spanish: 'mi mejor amigo', english: 'my best friend' },
        ],
      },
    ],
    examples: [
      { spanish: 'Ella es doctora.', english: 'She is a doctor.' },
      { spanish: 'Mi papá es muy amable.', english: 'My dad is very kind.' },
    ],
  },
  {
    id: 'hay',
    pattern: 'Hay ___ en ___',
    patternEnglish: 'There is/are ___ in ___',
    category: 'basics',
    difficulty: 'beginner',
    slots: [
      {
        id: 'thing',
        label: 'cosa',
        labelEnglish: 'thing',
        options: [
          { spanish: 'un libro', english: 'a book' },
          { spanish: 'muchas personas', english: 'many people' },
          { spanish: 'una mesa', english: 'a table' },
          { spanish: 'tres sillas', english: 'three chairs' },
          { spanish: 'comida', english: 'food' },
          { spanish: 'un problema', english: 'a problem' },
        ],
      },
      {
        id: 'place',
        label: 'lugar',
        labelEnglish: 'place',
        options: [
          { spanish: 'la casa', english: 'the house' },
          { spanish: 'el restaurante', english: 'the restaurant' },
          { spanish: 'la cocina', english: 'the kitchen' },
          { spanish: 'mi habitación', english: 'my room' },
          { spanish: 'la ciudad', english: 'the city' },
        ],
      },
    ],
    examples: [
      { spanish: 'Hay un libro en la mesa.', english: 'There is a book on the table.' },
      { spanish: 'Hay muchas personas en el restaurante.', english: 'There are many people in the restaurant.' },
    ],
  },

  // DESIRES & NEEDS
  {
    id: 'quiero',
    pattern: 'Quiero ___',
    patternEnglish: 'I want ___',
    category: 'desires',
    difficulty: 'beginner',
    slots: [
      {
        id: 'object-or-verb',
        label: 'objeto o verbo',
        labelEnglish: 'object or verb',
        options: [
          { spanish: 'comer', english: 'to eat' },
          { spanish: 'beber agua', english: 'to drink water' },
          { spanish: 'ir al cine', english: 'to go to the movies' },
          { spanish: 'dormir', english: 'to sleep' },
          { spanish: 'un café', english: 'a coffee' },
          { spanish: 'aprender español', english: 'to learn Spanish' },
          { spanish: 'hablar contigo', english: 'to talk with you' },
          { spanish: 'descansar', english: 'to rest' },
        ],
      },
    ],
    examples: [
      { spanish: 'Quiero comer algo.', english: 'I want to eat something.' },
      { spanish: 'Quiero aprender español.', english: 'I want to learn Spanish.' },
    ],
  },
  {
    id: 'necesito',
    pattern: 'Necesito ___',
    patternEnglish: 'I need ___',
    category: 'desires',
    difficulty: 'beginner',
    slots: [
      {
        id: 'need',
        label: 'necesidad',
        labelEnglish: 'need',
        options: [
          { spanish: 'ayuda', english: 'help' },
          { spanish: 'más tiempo', english: 'more time' },
          { spanish: 'ir al baño', english: 'to go to the bathroom' },
          { spanish: 'comprar comida', english: 'to buy food' },
          { spanish: 'un doctor', english: 'a doctor' },
          { spanish: 'descansar', english: 'to rest' },
          { spanish: 'trabajar', english: 'to work' },
        ],
      },
    ],
    examples: [
      { spanish: 'Necesito ayuda, por favor.', english: 'I need help, please.' },
      { spanish: 'Necesito más tiempo.', english: 'I need more time.' },
    ],
  },
  {
    id: 'me-gustaria',
    pattern: 'Me gustaría ___',
    patternEnglish: 'I would like ___',
    category: 'desires',
    difficulty: 'elementary',
    slots: [
      {
        id: 'wish',
        label: 'deseo',
        labelEnglish: 'wish',
        options: [
          { spanish: 'viajar a España', english: 'to travel to Spain' },
          { spanish: 'pedir la cuenta', english: 'to ask for the check' },
          { spanish: 'reservar una mesa', english: 'to reserve a table' },
          { spanish: 'probar esto', english: 'to try this' },
          { spanish: 'hablar con el gerente', english: 'to speak with the manager' },
          { spanish: 'saber más', english: 'to know more' },
        ],
      },
    ],
    examples: [
      { spanish: 'Me gustaría pedir la cuenta.', english: 'I would like to ask for the check.' },
      { spanish: 'Me gustaría viajar a Perú.', english: 'I would like to travel to Peru.' },
    ],
  },

  // QUESTIONS
  {
    id: 'donde-esta',
    pattern: '¿Dónde está ___?',
    patternEnglish: 'Where is ___?',
    category: 'questions',
    difficulty: 'beginner',
    slots: [
      {
        id: 'place-thing',
        label: 'lugar o cosa',
        labelEnglish: 'place or thing',
        options: [
          { spanish: 'el baño', english: 'the bathroom' },
          { spanish: 'la estación', english: 'the station' },
          { spanish: 'el supermercado', english: 'the supermarket' },
          { spanish: 'mi teléfono', english: 'my phone' },
          { spanish: 'el hotel', english: 'the hotel' },
          { spanish: 'la farmacia', english: 'the pharmacy' },
        ],
      },
    ],
    examples: [
      { spanish: '¿Dónde está el baño?', english: 'Where is the bathroom?' },
      { spanish: '¿Dónde está la estación de tren?', english: 'Where is the train station?' },
    ],
  },
  {
    id: 'puedo',
    pattern: '¿Puedo ___?',
    patternEnglish: 'Can I ___?',
    category: 'questions',
    difficulty: 'beginner',
    slots: [
      {
        id: 'action',
        label: 'acción',
        labelEnglish: 'action',
        options: [
          { spanish: 'sentarme aquí', english: 'sit here' },
          { spanish: 'pagar con tarjeta', english: 'pay with card' },
          { spanish: 'usar el baño', english: 'use the bathroom' },
          { spanish: 'hacer una pregunta', english: 'ask a question' },
          { spanish: 'probar esto', english: 'try this' },
          { spanish: 'tomar una foto', english: 'take a photo' },
        ],
      },
    ],
    examples: [
      { spanish: '¿Puedo sentarme aquí?', english: 'Can I sit here?' },
      { spanish: '¿Puedo pagar con tarjeta?', english: 'Can I pay with card?' },
    ],
  },
  {
    id: 'tienes',
    pattern: '¿Tienes ___?',
    patternEnglish: 'Do you have ___?',
    category: 'questions',
    difficulty: 'beginner',
    slots: [
      {
        id: 'thing',
        label: 'cosa',
        labelEnglish: 'thing',
        options: [
          { spanish: 'tiempo', english: 'time' },
          { spanish: 'un bolígrafo', english: 'a pen' },
          { spanish: 'hambre', english: 'hunger (are you hungry)' },
          { spanish: 'sed', english: 'thirst (are you thirsty)' },
          { spanish: 'wifi', english: 'wifi' },
          { spanish: 'el menú', english: 'the menu' },
        ],
      },
    ],
    examples: [
      { spanish: '¿Tienes tiempo para hablar?', english: 'Do you have time to talk?' },
      { spanish: '¿Tienes hambre?', english: 'Are you hungry?' },
    ],
  },
  {
    id: 'que-hora',
    pattern: '¿A qué hora ___?',
    patternEnglish: 'At what time ___?',
    category: 'questions',
    difficulty: 'elementary',
    slots: [
      {
        id: 'event',
        label: 'evento',
        labelEnglish: 'event',
        options: [
          { spanish: 'abre el museo', english: 'does the museum open' },
          { spanish: 'cierra la tienda', english: 'does the store close' },
          { spanish: 'sale el tren', english: 'does the train leave' },
          { spanish: 'es la reunión', english: 'is the meeting' },
          { spanish: 'empieza la película', english: 'does the movie start' },
          { spanish: 'llegamos', english: 'do we arrive' },
        ],
      },
    ],
    examples: [
      { spanish: '¿A qué hora abre el museo?', english: 'At what time does the museum open?' },
      { spanish: '¿A qué hora sale el vuelo?', english: 'At what time does the flight leave?' },
    ],
  },
  {
    id: 'cuanto-cuesta',
    pattern: '¿Cuánto cuesta ___?',
    patternEnglish: 'How much does ___ cost?',
    category: 'questions',
    difficulty: 'beginner',
    slots: [
      {
        id: 'item',
        label: 'artículo',
        labelEnglish: 'item',
        options: [
          { spanish: 'esto', english: 'this' },
          { spanish: 'el boleto', english: 'the ticket' },
          { spanish: 'una noche', english: 'one night' },
          { spanish: 'el desayuno', english: 'the breakfast' },
          { spanish: 'la entrada', english: 'the entrance/ticket' },
          { spanish: 'el viaje', english: 'the trip' },
        ],
      },
    ],
    examples: [
      { spanish: '¿Cuánto cuesta esto?', english: 'How much does this cost?' },
      { spanish: '¿Cuánto cuesta el boleto?', english: 'How much does the ticket cost?' },
    ],
  },

  // TIME
  {
    id: 'voy-a',
    pattern: 'Voy a ___ ___',
    patternEnglish: 'I am going to ___ ___',
    category: 'time',
    difficulty: 'beginner',
    slots: [
      {
        id: 'action',
        label: 'acción',
        labelEnglish: 'action',
        options: [
          { spanish: 'comer', english: 'eat' },
          { spanish: 'trabajar', english: 'work' },
          { spanish: 'estudiar', english: 'study' },
          { spanish: 'viajar', english: 'travel' },
          { spanish: 'cocinar', english: 'cook' },
          { spanish: 'salir', english: 'go out' },
        ],
      },
      {
        id: 'when',
        label: 'cuándo',
        labelEnglish: 'when',
        options: [
          { spanish: 'mañana', english: 'tomorrow' },
          { spanish: 'esta noche', english: 'tonight' },
          { spanish: 'el próximo lunes', english: 'next Monday' },
          { spanish: 'la próxima semana', english: 'next week' },
          { spanish: 'más tarde', english: 'later' },
          { spanish: 'ahora', english: 'now' },
        ],
      },
    ],
    examples: [
      { spanish: 'Voy a estudiar mañana.', english: 'I am going to study tomorrow.' },
      { spanish: 'Voy a viajar la próxima semana.', english: 'I am going to travel next week.' },
    ],
  },
  {
    id: 'ayer',
    pattern: 'Ayer ___',
    patternEnglish: 'Yesterday ___',
    category: 'time',
    difficulty: 'elementary',
    slots: [
      {
        id: 'past-action',
        label: 'acción pasada',
        labelEnglish: 'past action',
        options: [
          { spanish: 'fui al mercado', english: 'I went to the market' },
          { spanish: 'comí ceviche', english: 'I ate ceviche' },
          { spanish: 'hablé con mi familia', english: 'I talked with my family' },
          { spanish: 'trabajé mucho', english: 'I worked a lot' },
          { spanish: 'vi una película', english: 'I watched a movie' },
          { spanish: 'conocí a alguien', english: 'I met someone' },
        ],
      },
    ],
    examples: [
      { spanish: 'Ayer fui al mercado.', english: 'Yesterday I went to the market.' },
      { spanish: 'Ayer comí en un restaurante peruano.', english: 'Yesterday I ate at a Peruvian restaurant.' },
    ],
  },

  // DESCRIPTIONS
  {
    id: 'me-gusta',
    pattern: 'Me gusta ___ porque ___',
    patternEnglish: 'I like ___ because ___',
    category: 'descriptions',
    difficulty: 'elementary',
    slots: [
      {
        id: 'thing',
        label: 'cosa',
        labelEnglish: 'thing',
        options: [
          { spanish: 'la música', english: 'music' },
          { spanish: 'cocinar', english: 'cooking' },
          { spanish: 'viajar', english: 'traveling' },
          { spanish: 'este lugar', english: 'this place' },
          { spanish: 'la comida peruana', english: 'Peruvian food' },
          { spanish: 'aprender idiomas', english: 'learning languages' },
        ],
      },
      {
        id: 'reason',
        label: 'razón',
        labelEnglish: 'reason',
        options: [
          { spanish: 'es divertido', english: 'it\'s fun' },
          { spanish: 'es interesante', english: 'it\'s interesting' },
          { spanish: 'me relaja', english: 'it relaxes me' },
          { spanish: 'es delicioso', english: 'it\'s delicious' },
          { spanish: 'puedo conocer gente', english: 'I can meet people' },
          { spanish: 'es muy bonito', english: 'it\'s very beautiful' },
        ],
      },
    ],
    examples: [
      { spanish: 'Me gusta la música porque me relaja.', english: 'I like music because it relaxes me.' },
      { spanish: 'Me gusta viajar porque puedo conocer gente.', english: 'I like traveling because I can meet people.' },
    ],
  },
  {
    id: 'el-la-es',
    pattern: 'El/La ___ es ___ y ___',
    patternEnglish: 'The ___ is ___ and ___',
    category: 'descriptions',
    difficulty: 'beginner',
    slots: [
      {
        id: 'noun',
        label: 'sustantivo',
        labelEnglish: 'noun',
        options: [
          { spanish: 'ciudad', english: 'city' },
          { spanish: 'comida', english: 'food' },
          { spanish: 'clima', english: 'weather' },
          { spanish: 'hotel', english: 'hotel' },
          { spanish: 'playa', english: 'beach' },
          { spanish: 'museo', english: 'museum' },
        ],
      },
      {
        id: 'adj1',
        label: 'adjetivo 1',
        labelEnglish: 'adjective 1',
        options: [
          { spanish: 'grande', english: 'big' },
          { spanish: 'pequeño/a', english: 'small' },
          { spanish: 'bonito/a', english: 'beautiful' },
          { spanish: 'tranquilo/a', english: 'calm/peaceful' },
          { spanish: 'moderno/a', english: 'modern' },
          { spanish: 'antiguo/a', english: 'old/ancient' },
        ],
      },
      {
        id: 'adj2',
        label: 'adjetivo 2',
        labelEnglish: 'adjective 2',
        options: [
          { spanish: 'interesante', english: 'interesting' },
          { spanish: 'limpio/a', english: 'clean' },
          { spanish: 'ruidoso/a', english: 'noisy' },
          { spanish: 'cómodo/a', english: 'comfortable' },
          { spanish: 'barato/a', english: 'cheap' },
          { spanish: 'caro/a', english: 'expensive' },
        ],
      },
    ],
    examples: [
      { spanish: 'La ciudad es grande y ruidosa.', english: 'The city is big and noisy.' },
      { spanish: 'La playa es bonita y tranquila.', english: 'The beach is beautiful and peaceful.' },
    ],
  },

  // OPINIONS
  {
    id: 'creo-que',
    pattern: 'Creo que ___',
    patternEnglish: 'I think that ___',
    category: 'opinions',
    difficulty: 'elementary',
    slots: [
      {
        id: 'opinion',
        label: 'opinión',
        labelEnglish: 'opinion',
        options: [
          { spanish: 'es una buena idea', english: 'it\'s a good idea' },
          { spanish: 'tienes razón', english: 'you\'re right' },
          { spanish: 'es muy importante', english: 'it\'s very important' },
          { spanish: 'va a llover', english: 'it\'s going to rain' },
          { spanish: 'necesitamos más tiempo', english: 'we need more time' },
          { spanish: 'es posible', english: 'it\'s possible' },
        ],
      },
    ],
    examples: [
      { spanish: 'Creo que es una buena idea.', english: 'I think it\'s a good idea.' },
      { spanish: 'Creo que va a llover mañana.', english: 'I think it\'s going to rain tomorrow.' },
    ],
  },
  {
    id: 'prefiero',
    pattern: 'Prefiero ___ en vez de ___',
    patternEnglish: 'I prefer ___ instead of ___',
    category: 'opinions',
    difficulty: 'intermediate',
    slots: [
      {
        id: 'preference',
        label: 'preferencia',
        labelEnglish: 'preference',
        options: [
          { spanish: 'caminar', english: 'walking' },
          { spanish: 'quedarnos aquí', english: 'staying here' },
          { spanish: 'comer en casa', english: 'eating at home' },
          { spanish: 'el café', english: 'coffee' },
          { spanish: 'viajar en tren', english: 'traveling by train' },
        ],
      },
      {
        id: 'alternative',
        label: 'alternativa',
        labelEnglish: 'alternative',
        options: [
          { spanish: 'tomar un taxi', english: 'taking a taxi' },
          { spanish: 'salir', english: 'going out' },
          { spanish: 'ir al restaurante', english: 'going to a restaurant' },
          { spanish: 'el té', english: 'tea' },
          { spanish: 'volar', english: 'flying' },
        ],
      },
    ],
    examples: [
      { spanish: 'Prefiero caminar en vez de tomar un taxi.', english: 'I prefer walking instead of taking a taxi.' },
      { spanish: 'Prefiero el café en vez de el té.', english: 'I prefer coffee instead of tea.' },
    ],
  },
];

export const categories = [
  { id: 'basics', label: 'Básicos', labelEnglish: 'Basics', icon: '📝' },
  { id: 'questions', label: 'Preguntas', labelEnglish: 'Questions', icon: '❓' },
  { id: 'desires', label: 'Deseos', labelEnglish: 'Desires & Needs', icon: '💭' },
  { id: 'descriptions', label: 'Descripciones', labelEnglish: 'Descriptions', icon: '🎨' },
  { id: 'time', label: 'Tiempo', labelEnglish: 'Time', icon: '⏰' },
  { id: 'opinions', label: 'Opiniones', labelEnglish: 'Opinions', icon: '💬' },
];
