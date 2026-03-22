/**
 * Phrase database for daily practice routine.
 * Organized by category and CEFR level.
 * Each phrase is a complete, useful sentence you'd actually say.
 */

export interface PhraseCard {
  id: string;
  english: string;
  spanish: string;
  /** Literal/word-by-word breakdown */
  breakdown?: string;
  category: PhraseCategory;
  level: 'A1' | 'A2' | 'B1';
}

export type PhraseCategory =
  | 'greetings'
  | 'restaurant'
  | 'directions'
  | 'shopping'
  | 'travel'
  | 'social'
  | 'emergencies'
  | 'daily-life'
  | 'opinions'
  | 'requests';

export interface MicroChallenge {
  id: string;
  situation: string;
  prompt: string;
  modelAnswer: string;
  modelTranslation: string;
  level: 'A1' | 'A2' | 'B1';
  category: string;
  /** Key phrases the learner should try to use */
  keyPhrases?: string[];
}

// ── Phrases ──────────────────────────────────────────────────────────────

export const phrases: PhraseCard[] = [
  // Greetings & basics
  { id: 'p001', english: 'Nice to meet you.', spanish: 'Mucho gusto.', category: 'greetings', level: 'A1' },
  { id: 'p002', english: 'How are you doing?', spanish: '¿Cómo te va?', category: 'greetings', level: 'A1' },
  { id: 'p003', english: "I'm doing well, thanks.", spanish: 'Estoy bien, gracias.', category: 'greetings', level: 'A1' },
  { id: 'p004', english: 'See you later!', spanish: '¡Hasta luego!', category: 'greetings', level: 'A1' },
  { id: 'p005', english: 'What do you do for a living?', spanish: '¿A qué te dedicas?', category: 'greetings', level: 'A2' },
  { id: 'p006', english: "It's been a while!", spanish: '¡Cuánto tiempo sin verte!', category: 'greetings', level: 'A2' },
  { id: 'p007', english: "I'd like to introduce you to my friend.", spanish: 'Me gustaría presentarte a mi amigo.', category: 'greetings', level: 'B1' },

  // Restaurant
  { id: 'p010', english: 'A table for two, please.', spanish: 'Una mesa para dos, por favor.', category: 'restaurant', level: 'A1' },
  { id: 'p011', english: 'Can I see the menu?', spanish: '¿Me puede dar la carta?', category: 'restaurant', level: 'A1' },
  { id: 'p012', english: "I'll have the chicken.", spanish: 'Voy a pedir el pollo.', category: 'restaurant', level: 'A1' },
  { id: 'p013', english: 'The check, please.', spanish: 'La cuenta, por favor.', category: 'restaurant', level: 'A1' },
  { id: 'p014', english: 'Could you recommend something?', spanish: '¿Podría recomendarme algo?', category: 'restaurant', level: 'A2' },
  { id: 'p015', english: 'I have a food allergy.', spanish: 'Tengo una alergia alimentaria.', category: 'restaurant', level: 'A2' },
  { id: 'p016', english: 'Is the tip included?', spanish: '¿Está incluida la propina?', category: 'restaurant', level: 'A2' },
  { id: 'p017', english: 'This dish is delicious!', spanish: '¡Este plato está delicioso!', category: 'restaurant', level: 'A1' },
  { id: 'p018', english: 'Can you bring me another one?', spanish: '¿Me puede traer otro?', category: 'restaurant', level: 'A2' },

  // Directions
  { id: 'p020', english: 'Where is the nearest pharmacy?', spanish: '¿Dónde está la farmacia más cercana?', category: 'directions', level: 'A1' },
  { id: 'p021', english: "Turn left at the corner.", spanish: 'Gire a la izquierda en la esquina.', category: 'directions', level: 'A2' },
  { id: 'p022', english: "It's two blocks from here.", spanish: 'Está a dos cuadras de aquí.', category: 'directions', level: 'A2' },
  { id: 'p023', english: 'How do I get to the train station?', spanish: '¿Cómo llego a la estación de tren?', category: 'directions', level: 'A2' },
  { id: 'p024', english: 'Is it far from here?', spanish: '¿Está lejos de aquí?', category: 'directions', level: 'A1' },
  { id: 'p025', english: 'Go straight ahead.', spanish: 'Siga derecho.', category: 'directions', level: 'A1' },
  { id: 'p026', english: 'Can you show me on the map?', spanish: '¿Puede mostrarme en el mapa?', category: 'directions', level: 'A2' },

  // Shopping
  { id: 'p030', english: 'How much does this cost?', spanish: '¿Cuánto cuesta esto?', category: 'shopping', level: 'A1' },
  { id: 'p031', english: 'Do you have this in a larger size?', spanish: '¿Tiene esto en una talla más grande?', category: 'shopping', level: 'A2' },
  { id: 'p032', english: 'Can I try it on?', spanish: '¿Puedo probármelo?', category: 'shopping', level: 'A2' },
  { id: 'p033', english: "I'm just looking, thanks.", spanish: 'Solo estoy mirando, gracias.', category: 'shopping', level: 'A1' },
  { id: 'p034', english: 'Do you accept credit cards?', spanish: '¿Aceptan tarjetas de crédito?', category: 'shopping', level: 'A1' },
  { id: 'p035', english: "That's too expensive.", spanish: 'Eso es muy caro.', category: 'shopping', level: 'A1' },
  { id: 'p036', english: 'Is there a discount?', spanish: '¿Hay algún descuento?', category: 'shopping', level: 'A2' },

  // Travel
  { id: 'p040', english: 'I have a reservation.', spanish: 'Tengo una reservación.', category: 'travel', level: 'A1' },
  { id: 'p041', english: 'What time does the bus leave?', spanish: '¿A qué hora sale el autobús?', category: 'travel', level: 'A1' },
  { id: 'p042', english: 'I need a one-way ticket.', spanish: 'Necesito un boleto de ida.', category: 'travel', level: 'A2' },
  { id: 'p043', english: 'Where is the baggage claim?', spanish: '¿Dónde está la recogida de equipaje?', category: 'travel', level: 'A2' },
  { id: 'p044', english: 'Is breakfast included?', spanish: '¿El desayuno está incluido?', category: 'travel', level: 'A2' },
  { id: 'p045', english: 'Can you call me a taxi?', spanish: '¿Puede llamarme un taxi?', category: 'travel', level: 'A2' },
  { id: 'p046', english: 'My flight was delayed.', spanish: 'Mi vuelo se retrasó.', category: 'travel', level: 'B1' },

  // Social
  { id: 'p050', english: 'Do you want to grab coffee?', spanish: '¿Quieres tomar un café?', category: 'social', level: 'A1' },
  { id: 'p051', english: 'What are you doing this weekend?', spanish: '¿Qué vas a hacer este fin de semana?', category: 'social', level: 'A2' },
  { id: 'p052', english: 'I really enjoyed it.', spanish: 'Lo disfruté mucho.', category: 'social', level: 'A2' },
  { id: 'p053', english: "I'm sorry, I can't make it.", spanish: 'Lo siento, no puedo ir.', category: 'social', level: 'A2' },
  { id: 'p054', english: 'Happy birthday!', spanish: '¡Feliz cumpleaños!', category: 'social', level: 'A1' },
  { id: 'p055', english: 'Congratulations!', spanish: '¡Felicidades!', category: 'social', level: 'A1' },
  { id: 'p056', english: "Let's keep in touch.", spanish: 'Mantengamos el contacto.', category: 'social', level: 'B1' },

  // Emergencies
  { id: 'p060', english: 'I need help!', spanish: '¡Necesito ayuda!', category: 'emergencies', level: 'A1' },
  { id: 'p061', english: "I don't feel well.", spanish: 'No me siento bien.', category: 'emergencies', level: 'A1' },
  { id: 'p062', english: 'I lost my wallet.', spanish: 'Perdí mi cartera.', category: 'emergencies', level: 'A2' },
  { id: 'p063', english: 'Where is the hospital?', spanish: '¿Dónde está el hospital?', category: 'emergencies', level: 'A1' },
  { id: 'p064', english: 'Can you call the police?', spanish: '¿Puede llamar a la policía?', category: 'emergencies', level: 'A2' },
  { id: 'p065', english: "I'm allergic to...", spanish: 'Soy alérgico/a a...', category: 'emergencies', level: 'A2' },

  // Daily life
  { id: 'p070', english: 'I wake up at seven.', spanish: 'Me despierto a las siete.', category: 'daily-life', level: 'A1' },
  { id: 'p071', english: "I'm running late.", spanish: 'Voy retrasado.', category: 'daily-life', level: 'A2' },
  { id: 'p072', english: 'I have to go to work.', spanish: 'Tengo que ir al trabajo.', category: 'daily-life', level: 'A1' },
  { id: 'p073', english: 'What are we having for dinner?', spanish: '¿Qué vamos a cenar?', category: 'daily-life', level: 'A2' },
  { id: 'p074', english: "I'm so tired today.", spanish: 'Estoy muy cansado/a hoy.', category: 'daily-life', level: 'A1' },
  { id: 'p075', english: 'Can you take out the trash?', spanish: '¿Puedes sacar la basura?', category: 'daily-life', level: 'A2' },
  { id: 'p076', english: 'I need to do laundry.', spanish: 'Necesito lavar la ropa.', category: 'daily-life', level: 'A2' },
  { id: 'p077', english: 'The weather is nice today.', spanish: 'Hace buen tiempo hoy.', category: 'daily-life', level: 'A1' },

  // Opinions & feelings
  { id: 'p080', english: 'I think so too.', spanish: 'Yo también lo creo.', category: 'opinions', level: 'A2' },
  { id: 'p081', english: "I don't agree.", spanish: 'No estoy de acuerdo.', category: 'opinions', level: 'A2' },
  { id: 'p082', english: "That's a great idea!", spanish: '¡Esa es una gran idea!', category: 'opinions', level: 'A2' },
  { id: 'p083', english: "I'm not sure about that.", spanish: 'No estoy seguro/a de eso.', category: 'opinions', level: 'A2' },
  { id: 'p084', english: "In my opinion...", spanish: 'En mi opinión...', category: 'opinions', level: 'B1' },
  { id: 'p085', english: "I'd rather stay home.", spanish: 'Prefiero quedarme en casa.', category: 'opinions', level: 'B1' },

  // Polite requests
  { id: 'p090', english: 'Could you speak more slowly?', spanish: '¿Podría hablar más despacio?', category: 'requests', level: 'A1' },
  { id: 'p091', english: 'Can you repeat that?', spanish: '¿Puede repetir eso?', category: 'requests', level: 'A1' },
  { id: 'p092', english: "I don't understand.", spanish: 'No entiendo.', category: 'requests', level: 'A1' },
  { id: 'p093', english: 'How do you say this in Spanish?', spanish: '¿Cómo se dice esto en español?', category: 'requests', level: 'A1' },
  { id: 'p094', english: 'Could you help me with this?', spanish: '¿Podría ayudarme con esto?', category: 'requests', level: 'A2' },
  { id: 'p095', english: 'Would you mind opening the window?', spanish: '¿Le importaría abrir la ventana?', category: 'requests', level: 'B1' },
  { id: 'p096', english: 'Excuse me, do you have a moment?', spanish: 'Disculpe, ¿tiene un momento?', category: 'requests', level: 'A2' },
];

// ── Micro-Challenges ────────────────────────────────────────────────────

export const microChallenges: MicroChallenge[] = [
  {
    id: 'mc001',
    situation: "You're at a café and want to order.",
    prompt: "Order a coffee with milk and ask for the wifi password.",
    modelAnswer: "Hola, me gustaría un café con leche, por favor. ¿Cuál es la contraseña del wifi?",
    modelTranslation: "Hello, I'd like a coffee with milk, please. What's the wifi password?",
    level: 'A1',
    category: 'restaurant',
    keyPhrases: ['me gustaría', 'por favor', 'contraseña del wifi'],
  },
  {
    id: 'mc002',
    situation: "You just woke up and a friend texts asking about your plans.",
    prompt: "Tell them what you're doing today — you have work, then you want to cook dinner at home.",
    modelAnswer: "Hoy tengo que trabajar. Después quiero cocinar la cena en casa.",
    modelTranslation: "Today I have to work. After that I want to cook dinner at home.",
    level: 'A1',
    category: 'daily-life',
    keyPhrases: ['tengo que', 'quiero', 'en casa'],
  },
  {
    id: 'mc003',
    situation: "You're lost in a new city.",
    prompt: "Ask someone where the nearest metro station is and if it's far.",
    modelAnswer: "Disculpe, ¿dónde está la estación de metro más cercana? ¿Está lejos de aquí?",
    modelTranslation: "Excuse me, where is the nearest metro station? Is it far from here?",
    level: 'A1',
    category: 'directions',
    keyPhrases: ['disculpe', '¿dónde está', 'más cercana', 'lejos de aquí'],
  },
  {
    id: 'mc004',
    situation: "You're at a clothing store.",
    prompt: "Ask if they have a shirt in a different color and if you can try it on.",
    modelAnswer: "¿Tiene esta camisa en otro color? ¿Puedo probármela?",
    modelTranslation: "Do you have this shirt in another color? Can I try it on?",
    level: 'A2',
    category: 'shopping',
    keyPhrases: ['¿tiene', 'otro color', 'probármela'],
  },
  {
    id: 'mc005',
    situation: "A coworker asks you about your weekend.",
    prompt: "Tell them you went to a restaurant with your family and the food was excellent.",
    modelAnswer: "Fui a un restaurante con mi familia. La comida estaba excelente.",
    modelTranslation: "I went to a restaurant with my family. The food was excellent.",
    level: 'A2',
    category: 'social',
    keyPhrases: ['fui a', 'con mi familia', 'estaba excelente'],
  },
  {
    id: 'mc006',
    situation: "You're calling to make a hotel reservation.",
    prompt: "Reserve a room for two nights starting Friday. Ask if breakfast is included.",
    modelAnswer: "Quisiera reservar una habitación para dos noches a partir del viernes. ¿El desayuno está incluido?",
    modelTranslation: "I'd like to reserve a room for two nights starting Friday. Is breakfast included?",
    level: 'A2',
    category: 'travel',
    keyPhrases: ['quisiera reservar', 'a partir del', 'está incluido'],
  },
  {
    id: 'mc007',
    situation: "You don't feel well at work.",
    prompt: "Tell your boss you have a headache and ask if you can leave early.",
    modelAnswer: "Me duele la cabeza. ¿Puedo salir más temprano hoy?",
    modelTranslation: "I have a headache. Can I leave earlier today?",
    level: 'A2',
    category: 'emergencies',
    keyPhrases: ['me duele', 'puedo', 'más temprano'],
  },
  {
    id: 'mc008',
    situation: "You're meeting your partner's parents for the first time.",
    prompt: "Introduce yourself, say nice to meet them, and compliment their home.",
    modelAnswer: "Hola, mucho gusto, me llamo Eric. Su casa es muy bonita.",
    modelTranslation: "Hello, nice to meet you, my name is Eric. Your home is very pretty.",
    level: 'A1',
    category: 'greetings',
    keyPhrases: ['mucho gusto', 'me llamo', 'muy bonita'],
  },
  {
    id: 'mc009',
    situation: "A friend suggests going to the movies tonight.",
    prompt: "Say you can't because you're tired, but suggest going this weekend instead.",
    modelAnswer: "No puedo esta noche, estoy muy cansado. ¿Podemos ir este fin de semana?",
    modelTranslation: "I can't tonight, I'm very tired. Can we go this weekend?",
    level: 'A2',
    category: 'social',
    keyPhrases: ['no puedo', 'estoy cansado', 'este fin de semana'],
  },
  {
    id: 'mc010',
    situation: "You're at a restaurant and the waiter brings the wrong order.",
    prompt: "Politely tell them this isn't what you ordered and ask for the correct dish.",
    modelAnswer: "Disculpe, esto no es lo que pedí. Yo pedí el pescado, ¿podría cambiarlo?",
    modelTranslation: "Excuse me, this isn't what I ordered. I ordered the fish, could you change it?",
    level: 'A2',
    category: 'restaurant',
    keyPhrases: ['disculpe', 'no es lo que pedí', '¿podría'],
  },
  {
    id: 'mc011',
    situation: "Your neighbor asks about your daily routine.",
    prompt: "Describe your typical morning: when you wake up, what you eat, and how you get to work.",
    modelAnswer: "Me despierto a las seis y media. Desayuno café y tostadas. Voy al trabajo en coche.",
    modelTranslation: "I wake up at six thirty. I have coffee and toast for breakfast. I go to work by car.",
    level: 'A1',
    category: 'daily-life',
    keyPhrases: ['me despierto', 'desayuno', 'voy al trabajo'],
  },
  {
    id: 'mc012',
    situation: "You're at the doctor's office.",
    prompt: "Tell the doctor your stomach has been hurting for two days and ask if you should take medicine.",
    modelAnswer: "Me duele el estómago desde hace dos días. ¿Debería tomar algún medicamento?",
    modelTranslation: "My stomach has been hurting for two days. Should I take any medicine?",
    level: 'B1',
    category: 'emergencies',
    keyPhrases: ['me duele', 'desde hace', '¿debería'],
  },
  {
    id: 'mc013',
    situation: "You're on a video call with a Spanish-speaking colleague.",
    prompt: "Ask them to share their screen because you can't see the document. Also mention the audio is a bit quiet.",
    modelAnswer: "¿Puedes compartir tu pantalla? No puedo ver el documento. Además, el audio está un poco bajo.",
    modelTranslation: "Can you share your screen? I can't see the document. Also, the audio is a bit quiet.",
    level: 'B1',
    category: 'daily-life',
    keyPhrases: ['compartir tu pantalla', 'no puedo ver', 'un poco bajo'],
  },
  {
    id: 'mc014',
    situation: "You're at a market and see something interesting.",
    prompt: "Ask how much it costs, say it's a bit expensive, and ask if they can give you a better price.",
    modelAnswer: "¿Cuánto cuesta? Es un poco caro. ¿Me puede hacer un mejor precio?",
    modelTranslation: "How much does it cost? It's a bit expensive. Can you give me a better price?",
    level: 'A2',
    category: 'shopping',
    keyPhrases: ['¿cuánto cuesta?', 'un poco caro', 'mejor precio'],
  },
];

// ── Quick-Fire Translation Prompts ──────────────────────────────────────

export interface QuickFirePrompt {
  id: string;
  english: string;
  spanish: string;
  level: 'A1' | 'A2' | 'B1';
}

export const quickFirePrompts: QuickFirePrompt[] = [
  { id: 'qf001', english: 'I want water.', spanish: 'Quiero agua.', level: 'A1' },
  { id: 'qf002', english: 'Where is the bathroom?', spanish: '¿Dónde está el baño?', level: 'A1' },
  { id: 'qf003', english: 'I like this.', spanish: 'Me gusta esto.', level: 'A1' },
  { id: 'qf004', english: "I don't know.", spanish: 'No sé.', level: 'A1' },
  { id: 'qf005', english: 'What time is it?', spanish: '¿Qué hora es?', level: 'A1' },
  { id: 'qf006', english: 'I need to sleep.', spanish: 'Necesito dormir.', level: 'A1' },
  { id: 'qf007', english: "She's my sister.", spanish: 'Ella es mi hermana.', level: 'A1' },
  { id: 'qf008', english: 'We eat at eight.', spanish: 'Comemos a las ocho.', level: 'A1' },
  { id: 'qf009', english: 'It costs ten dollars.', spanish: 'Cuesta diez dólares.', level: 'A1' },
  { id: 'qf010', english: 'I live here.', spanish: 'Vivo aquí.', level: 'A1' },
  { id: 'qf011', english: 'He speaks Spanish.', spanish: 'Él habla español.', level: 'A1' },
  { id: 'qf012', english: 'We have to go.', spanish: 'Tenemos que ir.', level: 'A1' },
  { id: 'qf013', english: 'Can you help me?', spanish: '¿Puedes ayudarme?', level: 'A1' },
  { id: 'qf014', english: 'I arrived yesterday.', spanish: 'Llegué ayer.', level: 'A2' },
  { id: 'qf015', english: "She's cooking dinner.", spanish: 'Ella está cocinando la cena.', level: 'A2' },
  { id: 'qf016', english: 'We went to the beach.', spanish: 'Fuimos a la playa.', level: 'A2' },
  { id: 'qf017', english: "I've never been there.", spanish: 'Nunca he estado allí.', level: 'A2' },
  { id: 'qf018', english: "He told me he's busy.", spanish: 'Me dijo que está ocupado.', level: 'A2' },
  { id: 'qf019', english: 'I would like to learn more.', spanish: 'Me gustaría aprender más.', level: 'A2' },
  { id: 'qf020', english: "They don't live here anymore.", spanish: 'Ya no viven aquí.', level: 'A2' },
  { id: 'qf021', english: 'Can you pass me the salt?', spanish: '¿Me puedes pasar la sal?', level: 'A2' },
  { id: 'qf022', english: "I'll call you tomorrow.", spanish: 'Te llamo mañana.', level: 'A2' },
  { id: 'qf023', english: 'What did you say?', spanish: '¿Qué dijiste?', level: 'A2' },
  { id: 'qf024', english: "I'm looking for a gift.", spanish: 'Estoy buscando un regalo.', level: 'A2' },
  { id: 'qf025', english: 'We should leave early.', spanish: 'Deberíamos salir temprano.', level: 'B1' },
  { id: 'qf026', english: "If I had time, I'd go.", spanish: 'Si tuviera tiempo, iría.', level: 'B1' },
  { id: 'qf027', english: 'I wish I could stay longer.', spanish: 'Ojalá pudiera quedarme más tiempo.', level: 'B1' },
  { id: 'qf028', english: "It's possible it'll rain.", spanish: 'Es posible que llueva.', level: 'B1' },
  { id: 'qf029', english: "He asked me to help him.", spanish: 'Me pidió que lo ayudara.', level: 'B1' },
  { id: 'qf030', english: "I didn't realize it was so late.", spanish: 'No me di cuenta de que era tan tarde.', level: 'B1' },
];

// ── Helpers ──────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getDailyPhrases(count: number = 6, level?: 'A1' | 'A2' | 'B1'): PhraseCard[] {
  const pool = level ? phrases.filter((p) => p.level === level) : phrases;
  return shuffle(pool).slice(0, count);
}

export function getDailyChallenge(level?: 'A1' | 'A2' | 'B1'): MicroChallenge {
  const pool = level ? microChallenges.filter((c) => c.level === level) : microChallenges;
  // Use date as seed for consistency within a day
  const today = new Date().toISOString().slice(0, 10);
  const hash = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

export function getQuickFireSet(count: number = 8, level?: 'A1' | 'A2' | 'B1'): QuickFirePrompt[] {
  const pool = level ? quickFirePrompts.filter((p) => p.level === level) : quickFirePrompts;
  return shuffle(pool).slice(0, count);
}
