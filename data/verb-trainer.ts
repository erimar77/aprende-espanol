// Verb Trainer - contextual verb practice data
// Focus on the 25 most essential verbs with real-life sentences

export type Pronoun = 'yo' | 'tu' | 'el' | 'nosotros' | 'ellos';
export type Tense = 'present' | 'preterite' | 'imperfect' | 'future';

export interface VerbSentence {
  template: string; // Sentence with ___ for the blank
  english: string;
  answer: string; // The correct conjugated form
  verbId: string;
  pronoun: Pronoun;
  tense: Tense;
  hint?: string;
}

export interface VerbContextGroup {
  verbId: string;
  infinitive: string;
  english: string;
  tip: string; // When/why to use this verb
  sentences: VerbSentence[];
}

// The 25 most essential verbs, ordered by frequency and usefulness
export const essentialVerbIds = [
  'v001', // ser
  'v002', // estar
  'v003', // tener
  'v004', // hacer
  'v005', // ir
  'v006', // poder
  'v007', // querer
  'v008', // decir
  'v009', // saber
  'v010', // dar
  'v011', // hablar
  'v012', // comer
  'v013', // vivir
  'v014', // venir
  'v016', // poner
  'v018', // salir
  'v020', // ver
  'v021', // creer
  'v023', // llegar
  'v024', // pasar
  'v025', // sentir
  'v028', // gustar
  'v030', // necesitar
  'v033', // trabajar
  'v040', // comprar
];

export const pronounLabels: Record<Pronoun, string> = {
  yo: 'yo',
  tu: 'tú',
  el: 'él/ella',
  nosotros: 'nosotros',
  ellos: 'ellos/ellas',
};

export const tenseLabels: Record<Tense, { spanish: string; english: string; description: string }> = {
  present: { spanish: 'Presente', english: 'Present', description: 'What happens now or regularly' },
  preterite: { spanish: 'Pretérito', english: 'Preterite', description: 'What happened (completed)' },
  imperfect: { spanish: 'Imperfecto', english: 'Imperfect', description: 'What used to happen or was happening' },
  future: { spanish: 'Futuro', english: 'Future', description: 'What will happen' },
};

// Contextual sentences for each essential verb
export const verbContextGroups: VerbContextGroup[] = [
  {
    verbId: 'v001',
    infinitive: 'ser',
    english: 'to be (permanent)',
    tip: 'Use "ser" for identity, origin, characteristics, time, and profession',
    sentences: [
      { template: 'Yo ___ estudiante.', english: 'I am a student.', answer: 'soy', verbId: 'v001', pronoun: 'yo', tense: 'present' },
      { template: '¿De dónde ___ tú?', english: 'Where are you from?', answer: 'eres', verbId: 'v001', pronoun: 'tu', tense: 'present' },
      { template: 'Ella ___ muy inteligente.', english: 'She is very intelligent.', answer: 'es', verbId: 'v001', pronoun: 'el', tense: 'present' },
      { template: 'Nosotros ___ amigos desde la escuela.', english: 'We have been friends since school.', answer: 'somos', verbId: 'v001', pronoun: 'nosotros', tense: 'present' },
      { template: 'La fiesta ___ el sábado pasado.', english: 'The party was last Saturday.', answer: 'fue', verbId: 'v001', pronoun: 'el', tense: 'preterite' },
      { template: 'Cuando yo ___ niño, vivía en México.', english: 'When I was a child, I lived in Mexico.', answer: 'era', verbId: 'v001', pronoun: 'yo', tense: 'imperfect' },
    ],
  },
  {
    verbId: 'v002',
    infinitive: 'estar',
    english: 'to be (temporary/location)',
    tip: 'Use "estar" for feelings, location, conditions, and temporary states',
    sentences: [
      { template: 'Yo ___ cansado hoy.', english: 'I am tired today.', answer: 'estoy', verbId: 'v002', pronoun: 'yo', tense: 'present' },
      { template: '¿Cómo ___ tú?', english: 'How are you?', answer: 'estás', verbId: 'v002', pronoun: 'tu', tense: 'present' },
      { template: 'El restaurante ___ en la esquina.', english: 'The restaurant is on the corner.', answer: 'está', verbId: 'v002', pronoun: 'el', tense: 'present' },
      { template: 'Nosotros ___ contentos con el resultado.', english: 'We are happy with the result.', answer: 'estamos', verbId: 'v002', pronoun: 'nosotros', tense: 'present' },
      { template: 'Ayer yo ___ enfermo todo el día.', english: 'Yesterday I was sick all day.', answer: 'estuve', verbId: 'v002', pronoun: 'yo', tense: 'preterite' },
      { template: 'Ellos ___ muy preocupados por la noticia.', english: 'They are very worried about the news.', answer: 'están', verbId: 'v002', pronoun: 'ellos', tense: 'present' },
    ],
  },
  {
    verbId: 'v003',
    infinitive: 'tener',
    english: 'to have',
    tip: 'Also used for age (tengo 25 años), hunger (tengo hambre), and many expressions',
    sentences: [
      { template: 'Yo ___ dos gatos.', english: 'I have two cats.', answer: 'tengo', verbId: 'v003', pronoun: 'yo', tense: 'present' },
      { template: '¿Cuántos años ___ tú?', english: 'How old are you?', answer: 'tienes', verbId: 'v003', pronoun: 'tu', tense: 'present' },
      { template: 'Ella ___ mucha hambre.', english: 'She is very hungry.', answer: 'tiene', verbId: 'v003', pronoun: 'el', tense: 'present', hint: 'tener hambre = to be hungry' },
      { template: 'Nosotros ___ que estudiar para el examen.', english: 'We have to study for the exam.', answer: 'tenemos', verbId: 'v003', pronoun: 'nosotros', tense: 'present', hint: 'tener que = to have to' },
      { template: 'Yo ___ un sueño muy raro anoche.', english: 'I had a very strange dream last night.', answer: 'tuve', verbId: 'v003', pronoun: 'yo', tense: 'preterite' },
      { template: 'Ellos ___ mucho frío en la montaña.', english: 'They are very cold in the mountains.', answer: 'tienen', verbId: 'v003', pronoun: 'ellos', tense: 'present', hint: 'tener frío = to be cold' },
    ],
  },
  {
    verbId: 'v004',
    infinitive: 'hacer',
    english: 'to do / to make',
    tip: 'Used for weather (hace calor), time ago (hace dos años), and doing/making things',
    sentences: [
      { template: '¿Qué ___ tú los fines de semana?', english: 'What do you do on weekends?', answer: 'haces', verbId: 'v004', pronoun: 'tu', tense: 'present' },
      { template: 'Yo ___ la cena todos los días.', english: 'I make dinner every day.', answer: 'hago', verbId: 'v004', pronoun: 'yo', tense: 'present' },
      { template: '¿Qué ___ ella ayer?', english: 'What did she do yesterday?', answer: 'hizo', verbId: 'v004', pronoun: 'el', tense: 'preterite' },
      { template: 'Nosotros ___ ejercicio por la mañana.', english: 'We exercise in the morning.', answer: 'hacemos', verbId: 'v004', pronoun: 'nosotros', tense: 'present' },
      { template: 'Mañana yo ___ una torta para la fiesta.', english: 'Tomorrow I will make a cake for the party.', answer: 'haré', verbId: 'v004', pronoun: 'yo', tense: 'future' },
    ],
  },
  {
    verbId: 'v005',
    infinitive: 'ir',
    english: 'to go',
    tip: '"ir a + infinitive" is the easiest way to talk about the future: voy a comer = I\'m going to eat',
    sentences: [
      { template: 'Yo ___ al supermercado.', english: 'I go to the supermarket.', answer: 'voy', verbId: 'v005', pronoun: 'yo', tense: 'present' },
      { template: '¿A dónde ___ tú?', english: 'Where are you going?', answer: 'vas', verbId: 'v005', pronoun: 'tu', tense: 'present' },
      { template: 'Ella ___ a la escuela en autobús.', english: 'She goes to school by bus.', answer: 'va', verbId: 'v005', pronoun: 'el', tense: 'present' },
      { template: 'Nosotros ___ a viajar en verano.', english: 'We are going to travel in summer.', answer: 'vamos', verbId: 'v005', pronoun: 'nosotros', tense: 'present', hint: 'ir a + infinitive = going to do something' },
      { template: 'Ayer ellos ___ al cine.', english: 'Yesterday they went to the movies.', answer: 'fueron', verbId: 'v005', pronoun: 'ellos', tense: 'preterite' },
      { template: 'Cuando era joven, yo ___ a la playa todos los veranos.', english: 'When I was young, I used to go to the beach every summer.', answer: 'iba', verbId: 'v005', pronoun: 'yo', tense: 'imperfect' },
    ],
  },
  {
    verbId: 'v006',
    infinitive: 'poder',
    english: 'to be able to / can',
    tip: 'Use for ability and permission: ¿Puedo...? = Can I...?',
    sentences: [
      { template: '¿___ ayudarme, por favor?', english: 'Can you help me, please?', answer: 'Puedes', verbId: 'v006', pronoun: 'tu', tense: 'present' },
      { template: 'Yo no ___ ir a la fiesta.', english: 'I can\'t go to the party.', answer: 'puedo', verbId: 'v006', pronoun: 'yo', tense: 'present' },
      { template: 'Ella no ___ dormir anoche.', english: 'She couldn\'t sleep last night.', answer: 'pudo', verbId: 'v006', pronoun: 'el', tense: 'preterite' },
      { template: 'Nosotros ___ hablar español un poco.', english: 'We can speak Spanish a little.', answer: 'podemos', verbId: 'v006', pronoun: 'nosotros', tense: 'present' },
      { template: '¿___ repetir, por favor?', english: 'Can you repeat, please?', answer: 'Puede', verbId: 'v006', pronoun: 'el', tense: 'present', hint: 'formal: usted puede' },
    ],
  },
  {
    verbId: 'v007',
    infinitive: 'querer',
    english: 'to want',
    tip: 'Very common! "Quiero + infinitive" = I want to do something. "Quisiera" is the polite form.',
    sentences: [
      { template: 'Yo ___ un café, por favor.', english: 'I want a coffee, please.', answer: 'quiero', verbId: 'v007', pronoun: 'yo', tense: 'present' },
      { template: '¿Qué ___ tú para cenar?', english: 'What do you want for dinner?', answer: 'quieres', verbId: 'v007', pronoun: 'tu', tense: 'present' },
      { template: 'Ella ___ aprender a bailar.', english: 'She wants to learn to dance.', answer: 'quiere', verbId: 'v007', pronoun: 'el', tense: 'present' },
      { template: 'Nosotros ___ viajar a Perú.', english: 'We want to travel to Peru.', answer: 'queremos', verbId: 'v007', pronoun: 'nosotros', tense: 'present' },
      { template: 'Yo ___ ser doctor cuando era niño.', english: 'I wanted to be a doctor when I was a child.', answer: 'quería', verbId: 'v007', pronoun: 'yo', tense: 'imperfect' },
    ],
  },
  {
    verbId: 'v008',
    infinitive: 'decir',
    english: 'to say / to tell',
    tip: '"¿Cómo se dice...?" = How do you say...? Very useful when learning!',
    sentences: [
      { template: '¿Qué ___ tú?', english: 'What are you saying?', answer: 'dices', verbId: 'v008', pronoun: 'tu', tense: 'present' },
      { template: 'Yo siempre ___ la verdad.', english: 'I always tell the truth.', answer: 'digo', verbId: 'v008', pronoun: 'yo', tense: 'present' },
      { template: '¿Qué ___ ella sobre el viaje?', english: 'What did she say about the trip?', answer: 'dijo', verbId: 'v008', pronoun: 'el', tense: 'preterite' },
      { template: '¿Cómo se ___ "dog" en español?', english: 'How do you say "dog" in Spanish?', answer: 'dice', verbId: 'v008', pronoun: 'el', tense: 'present' },
    ],
  },
  {
    verbId: 'v009',
    infinitive: 'saber',
    english: 'to know (facts/how to)',
    tip: '"Saber" = know facts or how to do something. "Conocer" = know/be familiar with people/places',
    sentences: [
      { template: 'Yo no ___ la respuesta.', english: 'I don\'t know the answer.', answer: 'sé', verbId: 'v009', pronoun: 'yo', tense: 'present' },
      { template: '¿___ tú cocinar?', english: 'Do you know how to cook?', answer: 'Sabes', verbId: 'v009', pronoun: 'tu', tense: 'present' },
      { template: 'Ella ___ hablar tres idiomas.', english: 'She knows how to speak three languages.', answer: 'sabe', verbId: 'v009', pronoun: 'el', tense: 'present' },
      { template: 'Nosotros no ___ dónde está el hotel.', english: 'We don\'t know where the hotel is.', answer: 'sabemos', verbId: 'v009', pronoun: 'nosotros', tense: 'present' },
    ],
  },
  {
    verbId: 'v010',
    infinitive: 'dar',
    english: 'to give',
    tip: '"Dar" is used in many expressions: dar un paseo (take a walk), dar miedo (to scare)',
    sentences: [
      { template: 'Yo te ___ un regalo.', english: 'I give you a gift.', answer: 'doy', verbId: 'v010', pronoun: 'yo', tense: 'present' },
      { template: 'Ella me ___ su número de teléfono.', english: 'She gave me her phone number.', answer: 'dio', verbId: 'v010', pronoun: 'el', tense: 'preterite' },
      { template: '¿Me ___ un vaso de agua?', english: 'Can you give me a glass of water?', answer: 'das', verbId: 'v010', pronoun: 'tu', tense: 'present' },
    ],
  },
  {
    verbId: 'v011',
    infinitive: 'hablar',
    english: 'to speak / to talk',
    tip: 'Regular -ar verb! A great model for learning the -ar pattern.',
    sentences: [
      { template: 'Yo ___ un poco de español.', english: 'I speak a little Spanish.', answer: 'hablo', verbId: 'v011', pronoun: 'yo', tense: 'present' },
      { template: '¿___ tú inglés?', english: 'Do you speak English?', answer: 'Hablas', verbId: 'v011', pronoun: 'tu', tense: 'present' },
      { template: 'Nosotros ___ todos los días en español.', english: 'We speak every day in Spanish.', answer: 'hablamos', verbId: 'v011', pronoun: 'nosotros', tense: 'present' },
      { template: 'Yo ___ con mi madre ayer.', english: 'I spoke with my mother yesterday.', answer: 'hablé', verbId: 'v011', pronoun: 'yo', tense: 'preterite' },
    ],
  },
  {
    verbId: 'v012',
    infinitive: 'comer',
    english: 'to eat',
    tip: 'Regular -er verb! Also: "comer fuera" = to eat out.',
    sentences: [
      { template: '¿Qué ___ tú para el almuerzo?', english: 'What do you eat for lunch?', answer: 'comes', verbId: 'v012', pronoun: 'tu', tense: 'present' },
      { template: 'Yo ___ mucha fruta.', english: 'I eat a lot of fruit.', answer: 'como', verbId: 'v012', pronoun: 'yo', tense: 'present' },
      { template: 'Nosotros ___ en un restaurante anoche.', english: 'We ate at a restaurant last night.', answer: 'comimos', verbId: 'v012', pronoun: 'nosotros', tense: 'preterite' },
      { template: 'Ella no ___ carne.', english: 'She doesn\'t eat meat.', answer: 'come', verbId: 'v012', pronoun: 'el', tense: 'present' },
    ],
  },
  {
    verbId: 'v013',
    infinitive: 'vivir',
    english: 'to live',
    tip: 'Regular -ir verb! "¿Dónde vives?" is one of the most common questions.',
    sentences: [
      { template: '¿Dónde ___ tú?', english: 'Where do you live?', answer: 'vives', verbId: 'v013', pronoun: 'tu', tense: 'present' },
      { template: 'Yo ___ en una ciudad grande.', english: 'I live in a big city.', answer: 'vivo', verbId: 'v013', pronoun: 'yo', tense: 'present' },
      { template: 'Ellos ___ en Colombia por cinco años.', english: 'They lived in Colombia for five years.', answer: 'vivieron', verbId: 'v013', pronoun: 'ellos', tense: 'preterite' },
      { template: 'Nosotros ___ cerca del parque.', english: 'We live near the park.', answer: 'vivimos', verbId: 'v013', pronoun: 'nosotros', tense: 'present' },
    ],
  },
  {
    verbId: 'v014',
    infinitive: 'venir',
    english: 'to come',
    tip: '"Venir" is the opposite of "ir". Vengo de... = I come from...',
    sentences: [
      { template: '¿De dónde ___ tú?', english: 'Where do you come from?', answer: 'vienes', verbId: 'v014', pronoun: 'tu', tense: 'present' },
      { template: 'Yo ___ de Estados Unidos.', english: 'I come from the United States.', answer: 'vengo', verbId: 'v014', pronoun: 'yo', tense: 'present' },
      { template: 'Ella ___ a visitarnos mañana.', english: 'She will come to visit us tomorrow.', answer: 'vendrá', verbId: 'v014', pronoun: 'el', tense: 'future' },
      { template: 'Ellos ___ a la fiesta anoche.', english: 'They came to the party last night.', answer: 'vinieron', verbId: 'v014', pronoun: 'ellos', tense: 'preterite' },
    ],
  },
  {
    verbId: 'v020',
    infinitive: 'ver',
    english: 'to see / to watch',
    tip: '"Ver" is short and simple. "Nos vemos" = See you!',
    sentences: [
      { template: 'Yo no ___ bien sin mis gafas.', english: 'I can\'t see well without my glasses.', answer: 'veo', verbId: 'v020', pronoun: 'yo', tense: 'present' },
      { template: '¿___ tú esa película?', english: 'Did you see that movie?', answer: 'Viste', verbId: 'v020', pronoun: 'tu', tense: 'preterite' },
      { template: 'Nosotros ___ la televisión por la noche.', english: 'We watch television at night.', answer: 'vemos', verbId: 'v020', pronoun: 'nosotros', tense: 'present' },
    ],
  },
  {
    verbId: 'v028',
    infinitive: 'gustar',
    english: 'to like / to please',
    tip: '"Gustar" works backwards! "Me gusta" = It pleases me. The thing liked is the subject!',
    sentences: [
      { template: 'Me ___ el chocolate.', english: 'I like chocolate.', answer: 'gusta', verbId: 'v028', pronoun: 'el', tense: 'present', hint: 'gusta because "el chocolate" is singular' },
      { template: 'Me ___ los perros.', english: 'I like dogs.', answer: 'gustan', verbId: 'v028', pronoun: 'ellos', tense: 'present', hint: 'gustan because "los perros" is plural' },
      { template: '¿Te ___ la comida mexicana?', english: 'Do you like Mexican food?', answer: 'gusta', verbId: 'v028', pronoun: 'el', tense: 'present' },
      { template: 'Nos ___ viajar en verano.', english: 'We like to travel in summer.', answer: 'gusta', verbId: 'v028', pronoun: 'el', tense: 'present', hint: 'gusta with infinitives (viajar)' },
      { template: 'A ella le ___ mucho bailar.', english: 'She likes to dance a lot.', answer: 'gusta', verbId: 'v028', pronoun: 'el', tense: 'present' },
    ],
  },
  {
    verbId: 'v030',
    infinitive: 'necesitar',
    english: 'to need',
    tip: 'Regular -ar verb. "Necesito + infinitive" = I need to do something.',
    sentences: [
      { template: 'Yo ___ ayuda.', english: 'I need help.', answer: 'necesito', verbId: 'v030', pronoun: 'yo', tense: 'present' },
      { template: '¿Qué ___ tú?', english: 'What do you need?', answer: 'necesitas', verbId: 'v030', pronoun: 'tu', tense: 'present' },
      { template: 'Nosotros ___ practicar más.', english: 'We need to practice more.', answer: 'necesitamos', verbId: 'v030', pronoun: 'nosotros', tense: 'present' },
      { template: 'Ella ___ descansar.', english: 'She needs to rest.', answer: 'necesita', verbId: 'v030', pronoun: 'el', tense: 'present' },
    ],
  },
  {
    verbId: 'v033',
    infinitive: 'trabajar',
    english: 'to work',
    tip: 'Regular -ar verb. "Trabajo en..." = I work at...',
    sentences: [
      { template: '¿Dónde ___ tú?', english: 'Where do you work?', answer: 'trabajas', verbId: 'v033', pronoun: 'tu', tense: 'present' },
      { template: 'Yo ___ en una oficina.', english: 'I work in an office.', answer: 'trabajo', verbId: 'v033', pronoun: 'yo', tense: 'present' },
      { template: 'Nosotros ___ de lunes a viernes.', english: 'We work Monday to Friday.', answer: 'trabajamos', verbId: 'v033', pronoun: 'nosotros', tense: 'present' },
      { template: 'Ella ___ mucho la semana pasada.', english: 'She worked a lot last week.', answer: 'trabajó', verbId: 'v033', pronoun: 'el', tense: 'preterite' },
    ],
  },
  {
    verbId: 'v040',
    infinitive: 'comprar',
    english: 'to buy',
    tip: 'Regular -ar verb. Useful for shopping situations!',
    sentences: [
      { template: 'Yo ___ pan todas las mañanas.', english: 'I buy bread every morning.', answer: 'compro', verbId: 'v040', pronoun: 'yo', tense: 'present' },
      { template: '¿Qué ___ tú en el supermercado?', english: 'What did you buy at the supermarket?', answer: 'compraste', verbId: 'v040', pronoun: 'tu', tense: 'preterite' },
      { template: 'Nosotros ___ un carro nuevo el año que viene.', english: 'We will buy a new car next year.', answer: 'compraremos', verbId: 'v040', pronoun: 'nosotros', tense: 'future' },
    ],
  },
  {
    verbId: 'v018',
    infinitive: 'salir',
    english: 'to go out / to leave',
    tip: '"Salir con" = to go out with. "Salir de" = to leave from.',
    sentences: [
      { template: 'Yo ___ de casa a las ocho.', english: 'I leave the house at eight.', answer: 'salgo', verbId: 'v018', pronoun: 'yo', tense: 'present' },
      { template: '¿A qué hora ___ tú del trabajo?', english: 'What time do you leave work?', answer: 'sales', verbId: 'v018', pronoun: 'tu', tense: 'present' },
      { template: 'Nosotros ___ a cenar los viernes.', english: 'We go out for dinner on Fridays.', answer: 'salimos', verbId: 'v018', pronoun: 'nosotros', tense: 'present' },
    ],
  },
  {
    verbId: 'v016',
    infinitive: 'poner',
    english: 'to put / to place',
    tip: '"Ponerse" = to put on (clothes) or to become. "Poner la mesa" = set the table.',
    sentences: [
      { template: '¿Dónde ___ yo las llaves?', english: 'Where do I put the keys?', answer: 'pongo', verbId: 'v016', pronoun: 'yo', tense: 'present' },
      { template: 'Ella ___ la mesa antes de cenar.', english: 'She sets the table before dinner.', answer: 'pone', verbId: 'v016', pronoun: 'el', tense: 'present' },
      { template: 'Yo ___ mi chaqueta porque hace frío.', english: 'I put on my jacket because it\'s cold.', answer: 'pongo', verbId: 'v016', pronoun: 'yo', tense: 'present', hint: 'me pongo = I put on (reflexive)' },
    ],
  },
  {
    verbId: 'v025',
    infinitive: 'sentir',
    english: 'to feel',
    tip: '"Sentirse" (reflexive) = to feel. "Lo siento" = I\'m sorry (I feel it).',
    sentences: [
      { template: '¿Cómo te ___ hoy?', english: 'How do you feel today?', answer: 'sientes', verbId: 'v025', pronoun: 'tu', tense: 'present' },
      { template: 'Yo me ___ mejor hoy.', english: 'I feel better today.', answer: 'siento', verbId: 'v025', pronoun: 'yo', tense: 'present' },
      { template: 'Lo ___ mucho.', english: 'I\'m very sorry.', answer: 'siento', verbId: 'v025', pronoun: 'yo', tense: 'present' },
    ],
  },
  {
    verbId: 'v023',
    infinitive: 'llegar',
    english: 'to arrive',
    tip: '"Llegar a" = arrive at. "Llegar tarde" = arrive late.',
    sentences: [
      { template: '¿A qué hora ___ tú?', english: 'What time do you arrive?', answer: 'llegas', verbId: 'v023', pronoun: 'tu', tense: 'present' },
      { template: 'El avión ___ a las tres.', english: 'The plane arrives at three.', answer: 'llega', verbId: 'v023', pronoun: 'el', tense: 'present' },
      { template: 'Nosotros ___ tarde a la reunión.', english: 'We arrived late to the meeting.', answer: 'llegamos', verbId: 'v023', pronoun: 'nosotros', tense: 'preterite' },
    ],
  },
  {
    verbId: 'v024',
    infinitive: 'pasar',
    english: 'to happen / to pass / to spend (time)',
    tip: '"¿Qué pasó?" = What happened? "Pasar tiempo" = spend time.',
    sentences: [
      { template: '¿Qué ___ ayer?', english: 'What happened yesterday?', answer: 'pasó', verbId: 'v024', pronoun: 'el', tense: 'preterite' },
      { template: 'Yo ___ mucho tiempo con mi familia.', english: 'I spend a lot of time with my family.', answer: 'paso', verbId: 'v024', pronoun: 'yo', tense: 'present' },
      { template: 'No ___ nada.', english: 'Nothing happens. / It\'s nothing.', answer: 'pasa', verbId: 'v024', pronoun: 'el', tense: 'present' },
    ],
  },
  {
    verbId: 'v021',
    infinitive: 'creer',
    english: 'to believe / to think',
    tip: '"Creo que..." = I think that... Very useful for expressing opinions!',
    sentences: [
      { template: 'Yo ___ que es una buena idea.', english: 'I think it\'s a good idea.', answer: 'creo', verbId: 'v021', pronoun: 'yo', tense: 'present' },
      { template: '¿Tú ___ que va a llover?', english: 'Do you think it\'s going to rain?', answer: 'crees', verbId: 'v021', pronoun: 'tu', tense: 'present' },
      { template: 'No ___ que sea verdad.', english: 'I don\'t believe it\'s true.', answer: 'creo', verbId: 'v021', pronoun: 'yo', tense: 'present' },
    ],
  },
];

// Get all sentences for drill mode (flat list)
export function getAllSentences(): VerbSentence[] {
  return verbContextGroups.flatMap(group => group.sentences);
}

// Get sentences filtered by tense
export function getSentencesByTense(tense: Tense): VerbSentence[] {
  return getAllSentences().filter(s => s.tense === tense);
}

// Get sentences for a specific verb
export function getSentencesForVerb(verbId: string): VerbSentence[] {
  const group = verbContextGroups.find(g => g.verbId === verbId);
  return group?.sentences ?? [];
}
