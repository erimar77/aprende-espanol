// Inner Monologue Practice - Learn to think in Spanish

export interface ThoughtPrompt {
  id: string;
  category: 'morning' | 'planning' | 'observations' | 'feelings' | 'decisions' | 'reflections';
  situation: string;
  situationSpanish: string;
  starterThoughts: {
    spanish: string;
    english: string;
  }[];
  usefulPhrases: {
    spanish: string;
    english: string;
  }[];
  followUpQuestions: {
    spanish: string;
    english: string;
  }[];
}

export const thoughtPrompts: ThoughtPrompt[] = [
  // MORNING - Starting the day
  {
    id: 'wake-up',
    category: 'morning',
    situation: 'You just woke up',
    situationSpanish: 'Acabas de despertar',
    starterThoughts: [
      { spanish: 'Ya es de día...', english: 'It\'s already daytime...' },
      { spanish: 'Tengo sueño todavía...', english: 'I\'m still sleepy...' },
      { spanish: '¿Qué hora es?', english: 'What time is it?' },
    ],
    usefulPhrases: [
      { spanish: 'No quiero levantarme', english: 'I don\'t want to get up' },
      { spanish: 'Necesito café', english: 'I need coffee' },
      { spanish: 'Dormí bien/mal', english: 'I slept well/badly' },
      { spanish: 'Tuve un sueño extraño', english: 'I had a strange dream' },
    ],
    followUpQuestions: [
      { spanish: '¿Cómo me siento hoy?', english: 'How do I feel today?' },
      { spanish: '¿Qué tengo que hacer hoy?', english: 'What do I have to do today?' },
    ],
  },
  {
    id: 'getting-ready',
    category: 'morning',
    situation: 'Getting ready for the day',
    situationSpanish: 'Preparándote para el día',
    starterThoughts: [
      { spanish: '¿Qué me pongo hoy?', english: 'What should I wear today?' },
      { spanish: 'Primero, voy a ducharme...', english: 'First, I\'m going to shower...' },
      { spanish: 'Tengo que apurarme', english: 'I have to hurry' },
    ],
    usefulPhrases: [
      { spanish: 'Hace frío/calor afuera', english: 'It\'s cold/hot outside' },
      { spanish: 'No encuentro mis llaves', english: 'I can\'t find my keys' },
      { spanish: 'Casi estoy listo/a', english: 'I\'m almost ready' },
      { spanish: '¿Dónde dejé mi teléfono?', english: 'Where did I leave my phone?' },
    ],
    followUpQuestions: [
      { spanish: '¿Tengo todo lo que necesito?', english: 'Do I have everything I need?' },
      { spanish: '¿Voy a llegar a tiempo?', english: 'Am I going to arrive on time?' },
    ],
  },
  {
    id: 'breakfast',
    category: 'morning',
    situation: 'Having breakfast',
    situationSpanish: 'Desayunando',
    starterThoughts: [
      { spanish: 'Tengo hambre...', english: 'I\'m hungry...' },
      { spanish: '¿Qué voy a desayunar?', english: 'What am I going to have for breakfast?' },
      { spanish: 'El café está rico', english: 'The coffee is good' },
    ],
    usefulPhrases: [
      { spanish: 'Voy a comer algo rápido', english: 'I\'m going to eat something quick' },
      { spanish: 'No tengo mucha hambre', english: 'I\'m not very hungry' },
      { spanish: 'Necesito comprar leche', english: 'I need to buy milk' },
    ],
    followUpQuestions: [
      { spanish: '¿Qué quiero comer?', english: 'What do I want to eat?' },
      { spanish: '¿Tengo tiempo para cocinar?', english: 'Do I have time to cook?' },
    ],
  },

  // PLANNING - Thinking ahead
  {
    id: 'plan-day',
    category: 'planning',
    situation: 'Planning your day',
    situationSpanish: 'Planeando tu día',
    starterThoughts: [
      { spanish: 'A ver, ¿qué tengo que hacer hoy?', english: 'Let\'s see, what do I have to do today?' },
      { spanish: 'Primero voy a...', english: 'First I\'m going to...' },
      { spanish: 'Hoy va a ser un día ocupado', english: 'Today is going to be a busy day' },
    ],
    usefulPhrases: [
      { spanish: 'Tengo una reunión a las...', english: 'I have a meeting at...' },
      { spanish: 'Necesito terminar el proyecto', english: 'I need to finish the project' },
      { spanish: 'Después del trabajo voy a...', english: 'After work I\'m going to...' },
      { spanish: 'No puedo olvidar...', english: 'I can\'t forget...' },
    ],
    followUpQuestions: [
      { spanish: '¿Cuál es lo más importante?', english: 'What\'s the most important thing?' },
      { spanish: '¿Voy a tener tiempo para todo?', english: 'Am I going to have time for everything?' },
    ],
  },
  {
    id: 'weekend-plans',
    category: 'planning',
    situation: 'Thinking about weekend plans',
    situationSpanish: 'Pensando en planes para el fin de semana',
    starterThoughts: [
      { spanish: '¿Qué voy a hacer este fin de semana?', english: 'What am I going to do this weekend?' },
      { spanish: 'Quiero descansar un poco', english: 'I want to rest a little' },
      { spanish: 'Sería bueno ver a mis amigos', english: 'It would be nice to see my friends' },
    ],
    usefulPhrases: [
      { spanish: 'Podría ir al cine', english: 'I could go to the movies' },
      { spanish: 'Hace tiempo que no voy a...', english: 'It\'s been a while since I went to...' },
      { spanish: 'Depende del clima', english: 'It depends on the weather' },
      { spanish: 'Tengo ganas de...', english: 'I feel like...' },
    ],
    followUpQuestions: [
      { spanish: '¿Con quién quiero pasar tiempo?', english: 'Who do I want to spend time with?' },
      { spanish: '¿Qué necesito hacer en casa?', english: 'What do I need to do at home?' },
    ],
  },
  {
    id: 'grocery-list',
    category: 'planning',
    situation: 'Making a mental grocery list',
    situationSpanish: 'Haciendo una lista mental de compras',
    starterThoughts: [
      { spanish: '¿Qué necesito comprar?', english: 'What do I need to buy?' },
      { spanish: 'Se me acabó el pan', english: 'I ran out of bread' },
      { spanish: 'Tengo que pasar por el supermercado', english: 'I have to stop by the supermarket' },
    ],
    usefulPhrases: [
      { spanish: 'Necesito frutas y verduras', english: 'I need fruits and vegetables' },
      { spanish: 'No me queda nada de...', english: 'I don\'t have any ... left' },
      { spanish: 'Debería comprar algo para la cena', english: 'I should buy something for dinner' },
    ],
    followUpQuestions: [
      { spanish: '¿Qué voy a cocinar esta semana?', english: 'What am I going to cook this week?' },
      { spanish: '¿Hay ofertas hoy?', english: 'Are there sales today?' },
    ],
  },

  // OBSERVATIONS - Commenting on surroundings
  {
    id: 'weather',
    category: 'observations',
    situation: 'Looking at the weather',
    situationSpanish: 'Mirando el clima',
    starterThoughts: [
      { spanish: 'Qué bonito día...', english: 'What a nice day...' },
      { spanish: 'Parece que va a llover', english: 'It looks like it\'s going to rain' },
      { spanish: 'Hace mucho sol hoy', english: 'It\'s very sunny today' },
    ],
    usefulPhrases: [
      { spanish: 'El cielo está nublado', english: 'The sky is cloudy' },
      { spanish: 'Hace mucho viento', english: 'It\'s very windy' },
      { spanish: 'Necesito un paraguas', english: 'I need an umbrella' },
      { spanish: 'El clima está perfecto', english: 'The weather is perfect' },
    ],
    followUpQuestions: [
      { spanish: '¿Qué ropa debo usar?', english: 'What clothes should I wear?' },
      { spanish: '¿Puedo caminar o necesito el carro?', english: 'Can I walk or do I need the car?' },
    ],
  },
  {
    id: 'people-watching',
    category: 'observations',
    situation: 'Observing people around you',
    situationSpanish: 'Observando a la gente a tu alrededor',
    starterThoughts: [
      { spanish: 'Hay mucha gente hoy', english: 'There are a lot of people today' },
      { spanish: 'Esa persona parece interesante', english: 'That person looks interesting' },
      { spanish: 'Todo el mundo está en su teléfono', english: 'Everyone is on their phone' },
    ],
    usefulPhrases: [
      { spanish: 'Me pregunto qué hacen', english: 'I wonder what they do' },
      { spanish: 'Parece que tienen prisa', english: 'They seem to be in a hurry' },
      { spanish: 'Qué bonito vestido', english: 'What a nice dress' },
      { spanish: 'Ese niño es muy lindo', english: 'That child is very cute' },
    ],
    followUpQuestions: [
      { spanish: '¿A dónde irán?', english: 'Where might they be going?' },
      { spanish: '¿De qué estarán hablando?', english: 'What might they be talking about?' },
    ],
  },
  {
    id: 'walking-around',
    category: 'observations',
    situation: 'Walking through your neighborhood',
    situationSpanish: 'Caminando por tu barrio',
    starterThoughts: [
      { spanish: 'Me gusta esta calle', english: 'I like this street' },
      { spanish: 'Qué bonitas son esas flores', english: 'How beautiful those flowers are' },
      { spanish: 'Nunca había notado esa tienda', english: 'I had never noticed that store' },
    ],
    usefulPhrases: [
      { spanish: 'Ese edificio es nuevo', english: 'That building is new' },
      { spanish: 'Los árboles están muy verdes', english: 'The trees are very green' },
      { spanish: 'Qué tranquilo está todo', english: 'How peaceful everything is' },
    ],
    followUpQuestions: [
      { spanish: '¿Qué cambió desde la última vez?', english: 'What changed since last time?' },
      { spanish: '¿Debería explorar por aquí?', english: 'Should I explore around here?' },
    ],
  },

  // FEELINGS - Emotional self-reflection
  {
    id: 'feeling-happy',
    category: 'feelings',
    situation: 'When you\'re feeling happy',
    situationSpanish: 'Cuando te sientes feliz',
    starterThoughts: [
      { spanish: 'Me siento muy bien hoy', english: 'I feel really good today' },
      { spanish: 'Qué bueno es estar aquí', english: 'How nice it is to be here' },
      { spanish: 'Estoy contento/a con mi vida', english: 'I\'m happy with my life' },
    ],
    usefulPhrases: [
      { spanish: 'Todo está saliendo bien', english: 'Everything is going well' },
      { spanish: 'Me siento agradecido/a', english: 'I feel grateful' },
      { spanish: 'Este momento es perfecto', english: 'This moment is perfect' },
    ],
    followUpQuestions: [
      { spanish: '¿Por qué me siento tan bien?', english: 'Why do I feel so good?' },
      { spanish: '¿Cómo puedo mantener esta alegría?', english: 'How can I maintain this happiness?' },
    ],
  },
  {
    id: 'feeling-tired',
    category: 'feelings',
    situation: 'When you\'re feeling tired',
    situationSpanish: 'Cuando te sientes cansado/a',
    starterThoughts: [
      { spanish: 'Estoy muy cansado/a', english: 'I\'m very tired' },
      { spanish: 'Necesito descansar', english: 'I need to rest' },
      { spanish: 'No dormí bien anoche', english: 'I didn\'t sleep well last night' },
    ],
    usefulPhrases: [
      { spanish: 'Me falta energía', english: 'I\'m lacking energy' },
      { spanish: 'Quiero acostarme temprano', english: 'I want to go to bed early' },
      { spanish: 'Un café me ayudaría', english: 'A coffee would help me' },
    ],
    followUpQuestions: [
      { spanish: '¿Por qué estoy tan cansado/a?', english: 'Why am I so tired?' },
      { spanish: '¿Qué puedo hacer para tener más energía?', english: 'What can I do to have more energy?' },
    ],
  },
  {
    id: 'feeling-stressed',
    category: 'feelings',
    situation: 'When you\'re feeling stressed',
    situationSpanish: 'Cuando te sientes estresado/a',
    starterThoughts: [
      { spanish: 'Tengo mucho estrés', english: 'I have a lot of stress' },
      { spanish: 'Hay demasiadas cosas que hacer', english: 'There are too many things to do' },
      { spanish: 'Necesito calmarme', english: 'I need to calm down' },
    ],
    usefulPhrases: [
      { spanish: 'Voy a respirar profundo', english: 'I\'m going to take a deep breath' },
      { spanish: 'Una cosa a la vez', english: 'One thing at a time' },
      { spanish: 'Esto también pasará', english: 'This too shall pass' },
    ],
    followUpQuestions: [
      { spanish: '¿Qué es lo que más me preocupa?', english: 'What worries me the most?' },
      { spanish: '¿Qué puedo controlar y qué no?', english: 'What can I control and what not?' },
    ],
  },

  // DECISIONS - Making choices
  {
    id: 'what-to-eat',
    category: 'decisions',
    situation: 'Deciding what to eat',
    situationSpanish: 'Decidiendo qué comer',
    starterThoughts: [
      { spanish: 'Tengo hambre... ¿qué como?', english: 'I\'m hungry... what do I eat?' },
      { spanish: 'No sé qué quiero', english: 'I don\'t know what I want' },
      { spanish: 'Debería comer algo saludable', english: 'I should eat something healthy' },
    ],
    usefulPhrases: [
      { spanish: 'Me antoja algo dulce', english: 'I\'m craving something sweet' },
      { spanish: 'Podría pedir comida', english: 'I could order food' },
      { spanish: 'No quiero cocinar hoy', english: 'I don\'t want to cook today' },
      { spanish: '¿Pizza o tacos?', english: 'Pizza or tacos?' },
    ],
    followUpQuestions: [
      { spanish: '¿Qué hay en el refrigerador?', english: 'What\'s in the fridge?' },
      { spanish: '¿Cuánto quiero gastar?', english: 'How much do I want to spend?' },
    ],
  },
  {
    id: 'what-to-watch',
    category: 'decisions',
    situation: 'Deciding what to watch',
    situationSpanish: 'Decidiendo qué ver',
    starterThoughts: [
      { spanish: 'Quiero ver algo...', english: 'I want to watch something...' },
      { spanish: 'No hay nada interesante', english: 'There\'s nothing interesting' },
      { spanish: '¿Película o serie?', english: 'Movie or series?' },
    ],
    usefulPhrases: [
      { spanish: 'Ya vi esa película', english: 'I already saw that movie' },
      { spanish: 'Me recomendaron esta serie', english: 'They recommended this series to me' },
      { spanish: 'Prefiero algo de comedia', english: 'I prefer something comedy' },
      { spanish: 'Voy a buscar algo nuevo', english: 'I\'m going to look for something new' },
    ],
    followUpQuestions: [
      { spanish: '¿Qué tipo de película quiero ver?', english: 'What type of movie do I want to watch?' },
      { spanish: '¿Cuánto tiempo tengo?', english: 'How much time do I have?' },
    ],
  },
  {
    id: 'buy-or-not',
    category: 'decisions',
    situation: 'Deciding whether to buy something',
    situationSpanish: 'Decidiendo si comprar algo',
    starterThoughts: [
      { spanish: '¿Lo compro o no?', english: 'Do I buy it or not?' },
      { spanish: 'Es un poco caro...', english: 'It\'s a bit expensive...' },
      { spanish: '¿Realmente lo necesito?', english: 'Do I really need it?' },
    ],
    usefulPhrases: [
      { spanish: 'Está en oferta', english: 'It\'s on sale' },
      { spanish: 'Ya tengo algo parecido', english: 'I already have something similar' },
      { spanish: 'Puedo esperar', english: 'I can wait' },
      { spanish: 'Me lo merezco', english: 'I deserve it' },
    ],
    followUpQuestions: [
      { spanish: '¿Cuántas veces lo voy a usar?', english: 'How many times will I use it?' },
      { spanish: '¿Puedo encontrarlo más barato?', english: 'Can I find it cheaper?' },
    ],
  },

  // REFLECTIONS - End of day thoughts
  {
    id: 'end-of-day',
    category: 'reflections',
    situation: 'Reflecting on your day',
    situationSpanish: 'Reflexionando sobre tu día',
    starterThoughts: [
      { spanish: 'Fue un buen día', english: 'It was a good day' },
      { spanish: 'Hoy pasaron muchas cosas', english: 'A lot of things happened today' },
      { spanish: 'Estoy listo/a para descansar', english: 'I\'m ready to rest' },
    ],
    usefulPhrases: [
      { spanish: 'Lo mejor del día fue...', english: 'The best part of the day was...' },
      { spanish: 'Mañana voy a intentar...', english: 'Tomorrow I\'m going to try...' },
      { spanish: 'Aprendí algo nuevo', english: 'I learned something new' },
      { spanish: 'Me sentí productivo/a', english: 'I felt productive' },
    ],
    followUpQuestions: [
      { spanish: '¿Qué hice bien hoy?', english: 'What did I do well today?' },
      { spanish: '¿Qué puedo mejorar mañana?', english: 'What can I improve tomorrow?' },
    ],
  },
  {
    id: 'grateful-for',
    category: 'reflections',
    situation: 'Thinking about what you\'re grateful for',
    situationSpanish: 'Pensando en lo que agradeces',
    starterThoughts: [
      { spanish: 'Estoy agradecido/a por...', english: 'I\'m grateful for...' },
      { spanish: 'Tengo suerte de tener...', english: 'I\'m lucky to have...' },
      { spanish: 'Hoy aprecié...', english: 'Today I appreciated...' },
    ],
    usefulPhrases: [
      { spanish: 'Mi familia es importante para mí', english: 'My family is important to me' },
      { spanish: 'Tengo buenos amigos', english: 'I have good friends' },
      { spanish: 'Me gusta mi trabajo', english: 'I like my work' },
      { spanish: 'Tengo un techo sobre mi cabeza', english: 'I have a roof over my head' },
    ],
    followUpQuestions: [
      { spanish: '¿Qué cosas pequeñas me hacen feliz?', english: 'What small things make me happy?' },
      { spanish: '¿A quién debo agradecer?', english: 'Who should I thank?' },
    ],
  },
  {
    id: 'weekend-review',
    category: 'reflections',
    situation: 'Looking back on the weekend',
    situationSpanish: 'Recordando el fin de semana',
    starterThoughts: [
      { spanish: 'Qué rápido pasó el fin de semana', english: 'How fast the weekend went by' },
      { spanish: 'Fue un buen descanso', english: 'It was a good rest' },
      { spanish: 'Debería haber hecho más', english: 'I should have done more' },
    ],
    usefulPhrases: [
      { spanish: 'Pasé tiempo de calidad con...', english: 'I spent quality time with...' },
      { spanish: 'No hice nada y estuvo bien', english: 'I did nothing and it was fine' },
      { spanish: 'El próximo fin de semana quiero...', english: 'Next weekend I want to...' },
    ],
    followUpQuestions: [
      { spanish: '¿Descansé lo suficiente?', english: 'Did I rest enough?' },
      { spanish: '¿Qué voy a hacer diferente la próxima vez?', english: 'What will I do differently next time?' },
    ],
  },
];

export const thoughtCategories = [
  { id: 'morning', label: 'Morning', labelSpanish: 'Mañana', icon: '🌅', description: 'Start your day thinking in Spanish' },
  { id: 'planning', label: 'Planning', labelSpanish: 'Planeando', icon: '📋', description: 'Think ahead in Spanish' },
  { id: 'observations', label: 'Observations', labelSpanish: 'Observaciones', icon: '👀', description: 'Comment on your surroundings' },
  { id: 'feelings', label: 'Feelings', labelSpanish: 'Sentimientos', icon: '💭', description: 'Express your emotions' },
  { id: 'decisions', label: 'Decisions', labelSpanish: 'Decisiones', icon: '🤔', description: 'Make choices in Spanish' },
  { id: 'reflections', label: 'Reflections', labelSpanish: 'Reflexiones', icon: '🌙', description: 'End-of-day thoughts' },
];
