// Quick Response Drills - build automaticity by forcing fast reactions

export interface QuickResponse {
  id: string;
  category: 'reactions' | 'social' | 'questions' | 'emergencies' | 'opinions' | 'daily';
  situation: string;
  situationSpanish: string;
  expectedResponses: {
    spanish: string;
    english: string;
    formal?: boolean;
  }[];
  tip?: string;
}

export const quickResponses: QuickResponse[] = [
  // REACTIONS - Automatic responses to common situations
  {
    id: 'sneeze',
    category: 'reactions',
    situation: 'Someone sneezes',
    situationSpanish: 'Alguien estornuda',
    expectedResponses: [
      { spanish: '¡Salud!', english: 'Bless you!' },
    ],
  },
  {
    id: 'thank-you',
    category: 'reactions',
    situation: 'Someone says "Gracias"',
    situationSpanish: 'Alguien dice "Gracias"',
    expectedResponses: [
      { spanish: 'De nada', english: 'You\'re welcome' },
      { spanish: 'No hay de qué', english: 'Don\'t mention it' },
      { spanish: 'Con gusto', english: 'My pleasure' },
    ],
  },
  {
    id: 'sorry',
    category: 'reactions',
    situation: 'Someone bumps into you and apologizes',
    situationSpanish: 'Alguien te choca y se disculpa',
    expectedResponses: [
      { spanish: 'No te preocupes', english: 'Don\'t worry about it' },
      { spanish: 'No pasa nada', english: 'No problem / It\'s nothing' },
      { spanish: 'Está bien', english: 'It\'s okay' },
    ],
  },
  {
    id: 'good-news',
    category: 'reactions',
    situation: 'Someone shares good news with you',
    situationSpanish: 'Alguien te cuenta buenas noticias',
    expectedResponses: [
      { spanish: '¡Qué bueno!', english: 'That\'s great!' },
      { spanish: '¡Felicidades!', english: 'Congratulations!' },
      { spanish: '¡Qué alegría!', english: 'How wonderful!' },
      { spanish: '¡Me alegro mucho!', english: 'I\'m so happy!' },
    ],
  },
  {
    id: 'bad-news',
    category: 'reactions',
    situation: 'Someone shares bad news with you',
    situationSpanish: 'Alguien te cuenta malas noticias',
    expectedResponses: [
      { spanish: 'Lo siento mucho', english: 'I\'m so sorry' },
      { spanish: '¡Qué pena!', english: 'What a shame!' },
      { spanish: 'Qué lástima', english: 'That\'s too bad' },
    ],
  },
  {
    id: 'cute-thing',
    category: 'reactions',
    situation: 'You see a cute baby/puppy/kitten',
    situationSpanish: 'Ves un bebé/perrito/gatito lindo',
    expectedResponses: [
      { spanish: '¡Qué lindo!', english: 'How cute!' },
      { spanish: '¡Qué tierno!', english: 'How sweet/adorable!' },
      { spanish: '¡Qué bonito!', english: 'How beautiful!' },
    ],
  },
  {
    id: 'delicious-food',
    category: 'reactions',
    situation: 'You taste delicious food',
    situationSpanish: 'Pruebas comida deliciosa',
    expectedResponses: [
      { spanish: '¡Qué rico!', english: 'How delicious!' },
      { spanish: '¡Está delicioso!', english: 'It\'s delicious!' },
      { spanish: '¡Mmm, qué bueno!', english: 'Mmm, so good!' },
    ],
  },
  {
    id: 'surprise',
    category: 'reactions',
    situation: 'Someone surprises you with unexpected news',
    situationSpanish: 'Alguien te sorprende con noticias inesperadas',
    expectedResponses: [
      { spanish: '¿En serio?', english: 'Really?' },
      { spanish: '¡No me digas!', english: 'You don\'t say!' },
      { spanish: '¡No lo puedo creer!', english: 'I can\'t believe it!' },
    ],
  },

  // SOCIAL - Greetings and social exchanges
  {
    id: 'morning-greeting',
    category: 'social',
    situation: 'It\'s morning and you see your neighbor',
    situationSpanish: 'Es la mañana y ves a tu vecino',
    expectedResponses: [
      { spanish: '¡Buenos días!', english: 'Good morning!' },
      { spanish: '¡Hola, buenos días!', english: 'Hi, good morning!' },
    ],
  },
  {
    id: 'how-are-you',
    category: 'social',
    situation: 'Someone asks "¿Cómo estás?"',
    situationSpanish: 'Alguien pregunta "¿Cómo estás?"',
    expectedResponses: [
      { spanish: 'Bien, gracias. ¿Y tú?', english: 'Good, thanks. And you?' },
      { spanish: 'Muy bien, ¿y tú?', english: 'Very well, and you?' },
      { spanish: 'Ahí vamos. ¿Y tú?', english: 'Getting by. And you?' },
    ],
  },
  {
    id: 'nice-to-meet',
    category: 'social',
    situation: 'Someone introduces themselves to you',
    situationSpanish: 'Alguien se presenta',
    expectedResponses: [
      { spanish: 'Mucho gusto', english: 'Nice to meet you' },
      { spanish: 'Encantado/Encantada', english: 'Pleased to meet you' },
      { spanish: 'Es un placer', english: 'It\'s a pleasure' },
    ],
    tip: 'Use "encantado" if you\'re male, "encantada" if female',
  },
  {
    id: 'leaving',
    category: 'social',
    situation: 'You\'re leaving a gathering',
    situationSpanish: 'Te vas de una reunión',
    expectedResponses: [
      { spanish: 'Me tengo que ir', english: 'I have to go' },
      { spanish: 'Bueno, me voy', english: 'Well, I\'m leaving' },
      { spanish: 'Fue un placer verlos', english: 'It was a pleasure seeing you all' },
    ],
  },
  {
    id: 'goodbye-friend',
    category: 'social',
    situation: 'Saying goodbye to a friend',
    situationSpanish: 'Despidiéndote de un amigo',
    expectedResponses: [
      { spanish: '¡Nos vemos!', english: 'See you!' },
      { spanish: '¡Hasta luego!', english: 'See you later!' },
      { spanish: '¡Cuídate!', english: 'Take care!' },
      { spanish: '¡Chau!', english: 'Bye!' },
    ],
  },
  {
    id: 'birthday',
    category: 'social',
    situation: 'It\'s someone\'s birthday',
    situationSpanish: 'Es el cumpleaños de alguien',
    expectedResponses: [
      { spanish: '¡Feliz cumpleaños!', english: 'Happy birthday!' },
      { spanish: '¡Que los cumplas feliz!', english: 'May you have a happy birthday!' },
    ],
  },
  {
    id: 'cheers',
    category: 'social',
    situation: 'Making a toast with drinks',
    situationSpanish: 'Brindando con bebidas',
    expectedResponses: [
      { spanish: '¡Salud!', english: 'Cheers!' },
      { spanish: '¡Arriba, abajo, al centro, y adentro!', english: 'Up, down, center, and in!' },
    ],
  },

  // QUESTIONS - Quick responses to common questions
  {
    id: 'where-from',
    category: 'questions',
    situation: 'Someone asks "¿De dónde eres?"',
    situationSpanish: 'Alguien pregunta "¿De dónde eres?"',
    expectedResponses: [
      { spanish: 'Soy de...', english: 'I\'m from...' },
      { spanish: 'Soy de Estados Unidos', english: 'I\'m from the United States' },
    ],
    tip: 'Fill in your country/city!',
  },
  {
    id: 'what-do-you-do',
    category: 'questions',
    situation: 'Someone asks what you do for work',
    situationSpanish: 'Alguien pregunta a qué te dedicas',
    expectedResponses: [
      { spanish: 'Soy...', english: 'I\'m a...' },
      { spanish: 'Trabajo como...', english: 'I work as...' },
      { spanish: 'Trabajo en...', english: 'I work in/at...' },
    ],
  },
  {
    id: 'do-you-speak',
    category: 'questions',
    situation: 'Someone asks if you speak Spanish',
    situationSpanish: 'Alguien pregunta si hablas español',
    expectedResponses: [
      { spanish: 'Un poco', english: 'A little' },
      { spanish: 'Estoy aprendiendo', english: 'I\'m learning' },
      { spanish: 'Sí, pero estoy aprendiendo', english: 'Yes, but I\'m learning' },
    ],
  },
  {
    id: 'repeat-please',
    category: 'questions',
    situation: 'You didn\'t understand what someone said',
    situationSpanish: 'No entendiste lo que alguien dijo',
    expectedResponses: [
      { spanish: '¿Puede repetir, por favor?', english: 'Can you repeat, please?', formal: true },
      { spanish: '¿Puedes repetir?', english: 'Can you repeat?' },
      { spanish: '¿Cómo?', english: 'What? / Pardon?' },
      { spanish: 'No entendí', english: 'I didn\'t understand' },
    ],
  },
  {
    id: 'slower-please',
    category: 'questions',
    situation: 'Someone is speaking too fast',
    situationSpanish: 'Alguien habla demasiado rápido',
    expectedResponses: [
      { spanish: 'Más despacio, por favor', english: 'Slower, please' },
      { spanish: '¿Puede hablar más lento?', english: 'Can you speak slower?', formal: true },
    ],
  },
  {
    id: 'whats-this',
    category: 'questions',
    situation: 'You want to know what something is called',
    situationSpanish: 'Quieres saber cómo se llama algo',
    expectedResponses: [
      { spanish: '¿Qué es esto?', english: 'What is this?' },
      { spanish: '¿Cómo se llama esto?', english: 'What is this called?' },
      { spanish: '¿Cómo se dice... en español?', english: 'How do you say... in Spanish?' },
    ],
  },

  // DAILY - Everyday situations
  {
    id: 'phone-answer',
    category: 'daily',
    situation: 'Answering a phone call',
    situationSpanish: 'Contestando el teléfono',
    expectedResponses: [
      { spanish: '¿Aló?', english: 'Hello?' },
      { spanish: '¿Bueno?', english: 'Hello?' },
      { spanish: '¿Diga?', english: 'Hello?' },
    ],
    tip: '"¿Aló?" is common in Peru, "¿Bueno?" in Mexico',
  },
  {
    id: 'entering-shop',
    category: 'daily',
    situation: 'Entering a small shop',
    situationSpanish: 'Entrando a una tienda pequeña',
    expectedResponses: [
      { spanish: '¡Buenas!', english: 'Hello! (casual)' },
      { spanish: '¡Hola, buenas tardes!', english: 'Hi, good afternoon!' },
    ],
  },
  {
    id: 'waiter-attention',
    category: 'daily',
    situation: 'Getting a waiter\'s attention',
    situationSpanish: 'Llamando la atención del mesero',
    expectedResponses: [
      { spanish: '¡Disculpe!', english: 'Excuse me!' },
      { spanish: '¡Por favor!', english: 'Please! (to get attention)' },
      { spanish: '¿Me puede atender?', english: 'Can you help me?' },
    ],
  },
  {
    id: 'pay-check',
    category: 'daily',
    situation: 'You want the check at a restaurant',
    situationSpanish: 'Quieres la cuenta en un restaurante',
    expectedResponses: [
      { spanish: 'La cuenta, por favor', english: 'The check, please' },
      { spanish: '¿Me trae la cuenta?', english: 'Can you bring me the check?' },
    ],
  },
  {
    id: 'wrong-order',
    category: 'daily',
    situation: 'They brought you the wrong food',
    situationSpanish: 'Te trajeron la comida equivocada',
    expectedResponses: [
      { spanish: 'Disculpe, yo pedí...', english: 'Excuse me, I ordered...' },
      { spanish: 'Esto no es lo que pedí', english: 'This isn\'t what I ordered' },
    ],
  },
  {
    id: 'bathroom-where',
    category: 'daily',
    situation: 'You need to find the bathroom',
    situationSpanish: 'Necesitas encontrar el baño',
    expectedResponses: [
      { spanish: '¿Dónde está el baño?', english: 'Where is the bathroom?' },
      { spanish: '¿Dónde están los servicios?', english: 'Where are the restrooms?' },
    ],
  },
  {
    id: 'just-looking',
    category: 'daily',
    situation: 'A shop assistant asks if you need help',
    situationSpanish: 'Un vendedor pregunta si necesitas ayuda',
    expectedResponses: [
      { spanish: 'Solo estoy mirando, gracias', english: 'Just looking, thanks' },
      { spanish: 'No, gracias, solo miro', english: 'No thanks, just browsing' },
    ],
  },

  // EMERGENCIES - Important quick responses
  {
    id: 'help',
    category: 'emergencies',
    situation: 'You need help urgently',
    situationSpanish: 'Necesitas ayuda urgente',
    expectedResponses: [
      { spanish: '¡Ayuda!', english: 'Help!' },
      { spanish: '¡Ayúdeme, por favor!', english: 'Help me, please!' },
    ],
  },
  {
    id: 'call-police',
    category: 'emergencies',
    situation: 'There\'s an emergency',
    situationSpanish: 'Hay una emergencia',
    expectedResponses: [
      { spanish: '¡Llame a la policía!', english: 'Call the police!' },
      { spanish: '¡Llame una ambulancia!', english: 'Call an ambulance!' },
    ],
  },
  {
    id: 'feel-sick',
    category: 'emergencies',
    situation: 'You\'re not feeling well',
    situationSpanish: 'No te sientes bien',
    expectedResponses: [
      { spanish: 'No me siento bien', english: 'I don\'t feel well' },
      { spanish: 'Me siento mal', english: 'I feel sick' },
      { spanish: 'Necesito un médico', english: 'I need a doctor' },
    ],
  },
  {
    id: 'lost',
    category: 'emergencies',
    situation: 'You\'re lost',
    situationSpanish: 'Estás perdido/a',
    expectedResponses: [
      { spanish: 'Estoy perdido/perdida', english: 'I\'m lost' },
      { spanish: '¿Me puede ayudar?', english: 'Can you help me?' },
    ],
  },

  // OPINIONS - Quick agreement/disagreement
  {
    id: 'agree',
    category: 'opinions',
    situation: 'You agree with what someone said',
    situationSpanish: 'Estás de acuerdo con lo que alguien dijo',
    expectedResponses: [
      { spanish: 'Sí, tienes razón', english: 'Yes, you\'re right' },
      { spanish: 'Estoy de acuerdo', english: 'I agree' },
      { spanish: 'Exacto', english: 'Exactly' },
      { spanish: 'Claro que sí', english: 'Of course' },
    ],
  },
  {
    id: 'disagree',
    category: 'opinions',
    situation: 'You disagree politely',
    situationSpanish: 'No estás de acuerdo (educadamente)',
    expectedResponses: [
      { spanish: 'No estoy de acuerdo', english: 'I disagree' },
      { spanish: 'No creo', english: 'I don\'t think so' },
      { spanish: 'Yo creo que no', english: 'I think not' },
    ],
  },
  {
    id: 'not-sure',
    category: 'opinions',
    situation: 'You\'re not sure about something',
    situationSpanish: 'No estás seguro/a de algo',
    expectedResponses: [
      { spanish: 'No sé', english: 'I don\'t know' },
      { spanish: 'No estoy seguro/a', english: 'I\'m not sure' },
      { spanish: 'Tal vez', english: 'Maybe' },
      { spanish: 'Depende', english: 'It depends' },
    ],
  },
  {
    id: 'good-idea',
    category: 'opinions',
    situation: 'Someone suggests something you like',
    situationSpanish: 'Alguien sugiere algo que te gusta',
    expectedResponses: [
      { spanish: '¡Buena idea!', english: 'Good idea!' },
      { spanish: '¡Me parece bien!', english: 'Sounds good to me!' },
      { spanish: '¡Dale!', english: 'Let\'s do it!' },
      { spanish: '¡Perfecto!', english: 'Perfect!' },
    ],
  },
  {
    id: 'dont-like',
    category: 'opinions',
    situation: 'You don\'t like a suggestion',
    situationSpanish: 'No te gusta una sugerencia',
    expectedResponses: [
      { spanish: 'No me gusta mucho', english: 'I don\'t really like it' },
      { spanish: 'Prefiero otra cosa', english: 'I prefer something else' },
      { spanish: 'No sé si es buena idea', english: 'I\'m not sure it\'s a good idea' },
    ],
  },
];

export const responseCategories = [
  { id: 'reactions', label: 'Reactions', labelSpanish: 'Reacciones', icon: '⚡', description: 'Instant responses to situations' },
  { id: 'social', label: 'Social', labelSpanish: 'Social', icon: '👋', description: 'Greetings and social exchanges' },
  { id: 'questions', label: 'Questions', labelSpanish: 'Preguntas', icon: '❓', description: 'Responding to common questions' },
  { id: 'daily', label: 'Daily Life', labelSpanish: 'Vida Diaria', icon: '☀️', description: 'Everyday situations' },
  { id: 'opinions', label: 'Opinions', labelSpanish: 'Opiniones', icon: '💭', description: 'Quick agreement/disagreement' },
  { id: 'emergencies', label: 'Emergencies', labelSpanish: 'Emergencias', icon: '🚨', description: 'Important urgent phrases' },
];
