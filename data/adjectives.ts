import { Word } from '@/lib/types';

export const adjectives: Word[] = [
  // Size & Quantity
  { id: 'adj001', spanish: 'grande', english: 'big/large', category: 'size', example: 'La casa es grande.', exampleTranslation: 'The house is big.' },
  { id: 'adj002', spanish: 'pequeño', english: 'small', category: 'size', example: 'El gato es pequeño.', exampleTranslation: 'The cat is small.' },
  { id: 'adj003', spanish: 'alto', english: 'tall/high', category: 'size', example: 'Mi hermano es alto.', exampleTranslation: 'My brother is tall.' },
  { id: 'adj004', spanish: 'bajo', english: 'short/low', category: 'size' },
  { id: 'adj005', spanish: 'largo', english: 'long', category: 'size' },
  { id: 'adj006', spanish: 'corto', english: 'short', category: 'size' },
  { id: 'adj007', spanish: 'ancho', english: 'wide', category: 'size' },
  { id: 'adj008', spanish: 'estrecho', english: 'narrow', category: 'size' },
  { id: 'adj009', spanish: 'gordo', english: 'fat', category: 'size' },
  { id: 'adj010', spanish: 'delgado', english: 'thin/slim', category: 'size' },
  { id: 'adj011', spanish: 'enorme', english: 'enormous', category: 'size' },
  { id: 'adj012', spanish: 'diminuto', english: 'tiny', category: 'size' },
  { id: 'adj013', spanish: 'mediano', english: 'medium', category: 'size' },

  // Colors
  { id: 'adj014', spanish: 'rojo', english: 'red', category: 'colors', example: 'El coche es rojo.', exampleTranslation: 'The car is red.' },
  { id: 'adj015', spanish: 'azul', english: 'blue', category: 'colors' },
  { id: 'adj016', spanish: 'verde', english: 'green', category: 'colors' },
  { id: 'adj017', spanish: 'amarillo', english: 'yellow', category: 'colors' },
  { id: 'adj018', spanish: 'naranja', english: 'orange', category: 'colors' },
  { id: 'adj019', spanish: 'morado', english: 'purple', category: 'colors' },
  { id: 'adj020', spanish: 'rosa', english: 'pink', category: 'colors' },
  { id: 'adj021', spanish: 'negro', english: 'black', category: 'colors' },
  { id: 'adj022', spanish: 'blanco', english: 'white', category: 'colors' },
  { id: 'adj023', spanish: 'gris', english: 'gray', category: 'colors' },
  { id: 'adj024', spanish: 'marrón', english: 'brown', category: 'colors' },
  { id: 'adj025', spanish: 'dorado', english: 'golden', category: 'colors' },
  { id: 'adj026', spanish: 'plateado', english: 'silver', category: 'colors' },
  { id: 'adj027', spanish: 'claro', english: 'light (color)', category: 'colors' },
  { id: 'adj028', spanish: 'oscuro', english: 'dark', category: 'colors' },

  // Personality & Character
  { id: 'adj029', spanish: 'bueno', english: 'good', category: 'personality', example: 'Es una buena persona.', exampleTranslation: 'He/she is a good person.' },
  { id: 'adj030', spanish: 'malo', english: 'bad', category: 'personality' },
  { id: 'adj031', spanish: 'amable', english: 'kind/friendly', category: 'personality' },
  { id: 'adj032', spanish: 'simpático', english: 'nice/likeable', category: 'personality' },
  { id: 'adj033', spanish: 'antipático', english: 'unpleasant', category: 'personality' },
  { id: 'adj034', spanish: 'inteligente', english: 'intelligent', category: 'personality' },
  { id: 'adj035', spanish: 'tonto', english: 'silly/dumb', category: 'personality' },
  { id: 'adj036', spanish: 'trabajador', english: 'hardworking', category: 'personality' },
  { id: 'adj037', spanish: 'perezoso', english: 'lazy', category: 'personality' },
  { id: 'adj038', spanish: 'generoso', english: 'generous', category: 'personality' },
  { id: 'adj039', spanish: 'tacaño', english: 'stingy', category: 'personality' },
  { id: 'adj040', spanish: 'honesto', english: 'honest', category: 'personality' },
  { id: 'adj041', spanish: 'tímido', english: 'shy', category: 'personality' },
  { id: 'adj042', spanish: 'valiente', english: 'brave', category: 'personality' },
  { id: 'adj043', spanish: 'cobarde', english: 'cowardly', category: 'personality' },
  { id: 'adj044', spanish: 'serio', english: 'serious', category: 'personality' },
  { id: 'adj045', spanish: 'divertido', english: 'fun/funny', category: 'personality' },
  { id: 'adj046', spanish: 'aburrido', english: 'boring/bored', category: 'personality' },
  { id: 'adj047', spanish: 'tranquilo', english: 'calm', category: 'personality' },
  { id: 'adj048', spanish: 'nervioso', english: 'nervous', category: 'personality' },
  { id: 'adj049', spanish: 'responsable', english: 'responsible', category: 'personality' },
  { id: 'adj050', spanish: 'irresponsable', english: 'irresponsible', category: 'personality' },

  // Emotions & States
  { id: 'adj051', spanish: 'feliz', english: 'happy', category: 'emotions', example: 'Estoy muy feliz.', exampleTranslation: 'I am very happy.' },
  { id: 'adj052', spanish: 'triste', english: 'sad', category: 'emotions' },
  { id: 'adj053', spanish: 'contento', english: 'content/pleased', category: 'emotions' },
  { id: 'adj054', spanish: 'enojado', english: 'angry', category: 'emotions' },
  { id: 'adj055', spanish: 'enfadado', english: 'upset', category: 'emotions' },
  { id: 'adj056', spanish: 'preocupado', english: 'worried', category: 'emotions' },
  { id: 'adj057', spanish: 'sorprendido', english: 'surprised', category: 'emotions' },
  { id: 'adj058', spanish: 'asustado', english: 'scared', category: 'emotions' },
  { id: 'adj059', spanish: 'emocionado', english: 'excited', category: 'emotions' },
  { id: 'adj060', spanish: 'cansado', english: 'tired', category: 'emotions', example: 'Estoy cansado.', exampleTranslation: 'I am tired.' },
  { id: 'adj061', spanish: 'ocupado', english: 'busy', category: 'emotions' },
  { id: 'adj062', spanish: 'confundido', english: 'confused', category: 'emotions' },
  { id: 'adj063', spanish: 'seguro', english: 'sure/safe', category: 'emotions' },
  { id: 'adj064', spanish: 'orgulloso', english: 'proud', category: 'emotions' },
  { id: 'adj065', spanish: 'avergonzado', english: 'embarrassed', category: 'emotions' },

  // Physical Appearance
  { id: 'adj066', spanish: 'guapo', english: 'handsome', category: 'appearance', example: 'El actor es guapo.', exampleTranslation: 'The actor is handsome.' },
  { id: 'adj067', spanish: 'bonito', english: 'pretty', category: 'appearance' },
  { id: 'adj068', spanish: 'hermoso', english: 'beautiful', category: 'appearance' },
  { id: 'adj069', spanish: 'feo', english: 'ugly', category: 'appearance' },
  { id: 'adj070', spanish: 'joven', english: 'young', category: 'appearance' },
  { id: 'adj071', spanish: 'viejo', english: 'old', category: 'appearance' },
  { id: 'adj072', spanish: 'nuevo', english: 'new', category: 'appearance' },
  { id: 'adj073', spanish: 'fuerte', english: 'strong', category: 'appearance' },
  { id: 'adj074', spanish: 'débil', english: 'weak', category: 'appearance' },
  { id: 'adj075', spanish: 'sano', english: 'healthy', category: 'appearance' },
  { id: 'adj076', spanish: 'enfermo', english: 'sick', category: 'appearance' },
  { id: 'adj077', spanish: 'rubio', english: 'blonde', category: 'appearance' },
  { id: 'adj078', spanish: 'moreno', english: 'dark-haired/brunette', category: 'appearance' },
  { id: 'adj079', spanish: 'calvo', english: 'bald', category: 'appearance' },

  // Quality & Condition
  { id: 'adj080', spanish: 'fácil', english: 'easy', category: 'quality', example: 'El examen es fácil.', exampleTranslation: 'The exam is easy.' },
  { id: 'adj081', spanish: 'difícil', english: 'difficult', category: 'quality' },
  { id: 'adj082', spanish: 'importante', english: 'important', category: 'quality' },
  { id: 'adj083', spanish: 'necesario', english: 'necessary', category: 'quality' },
  { id: 'adj084', spanish: 'posible', english: 'possible', category: 'quality' },
  { id: 'adj085', spanish: 'imposible', english: 'impossible', category: 'quality' },
  { id: 'adj086', spanish: 'perfecto', english: 'perfect', category: 'quality' },
  { id: 'adj087', spanish: 'excelente', english: 'excellent', category: 'quality' },
  { id: 'adj088', spanish: 'terrible', english: 'terrible', category: 'quality' },
  { id: 'adj089', spanish: 'normal', english: 'normal', category: 'quality' },
  { id: 'adj090', spanish: 'especial', english: 'special', category: 'quality' },
  { id: 'adj091', spanish: 'común', english: 'common', category: 'quality' },
  { id: 'adj092', spanish: 'raro', english: 'rare/strange', category: 'quality' },
  { id: 'adj093', spanish: 'diferente', english: 'different', category: 'quality' },
  { id: 'adj094', spanish: 'igual', english: 'equal/same', category: 'quality' },
  { id: 'adj095', spanish: 'similar', english: 'similar', category: 'quality' },

  // Temperature & Sensations
  { id: 'adj096', spanish: 'caliente', english: 'hot', category: 'sensations', example: 'El café está caliente.', exampleTranslation: 'The coffee is hot.' },
  { id: 'adj097', spanish: 'frío', english: 'cold', category: 'sensations' },
  { id: 'adj098', spanish: 'tibio', english: 'warm/lukewarm', category: 'sensations' },
  { id: 'adj099', spanish: 'fresco', english: 'fresh/cool', category: 'sensations' },
  { id: 'adj100', spanish: 'seco', english: 'dry', category: 'sensations' },
  { id: 'adj101', spanish: 'mojado', english: 'wet', category: 'sensations' },
  { id: 'adj102', spanish: 'suave', english: 'soft/smooth', category: 'sensations' },
  { id: 'adj103', spanish: 'duro', english: 'hard', category: 'sensations' },
  { id: 'adj104', spanish: 'limpio', english: 'clean', category: 'sensations' },
  { id: 'adj105', spanish: 'sucio', english: 'dirty', category: 'sensations' },

  // Food & Taste
  { id: 'adj106', spanish: 'delicioso', english: 'delicious', category: 'taste', example: 'La comida está deliciosa.', exampleTranslation: 'The food is delicious.' },
  { id: 'adj107', spanish: 'rico', english: 'rich/tasty', category: 'taste' },
  { id: 'adj108', spanish: 'dulce', english: 'sweet', category: 'taste' },
  { id: 'adj109', spanish: 'salado', english: 'salty', category: 'taste' },
  { id: 'adj110', spanish: 'amargo', english: 'bitter', category: 'taste' },
  { id: 'adj111', spanish: 'picante', english: 'spicy', category: 'taste' },
  { id: 'adj112', spanish: 'agrio', english: 'sour', category: 'taste' },

  // Speed & Time
  { id: 'adj113', spanish: 'rápido', english: 'fast/quick', category: 'speed' },
  { id: 'adj114', spanish: 'lento', english: 'slow', category: 'speed' },
  { id: 'adj115', spanish: 'temprano', english: 'early', category: 'speed' },
  { id: 'adj116', spanish: 'tarde', english: 'late', category: 'speed' },
  { id: 'adj117', spanish: 'próximo', english: 'next', category: 'speed' },
  { id: 'adj118', spanish: 'último', english: 'last', category: 'speed' },
  { id: 'adj119', spanish: 'primero', english: 'first', category: 'speed' },

  // Position & Location
  { id: 'adj120', spanish: 'cercano', english: 'near/close', category: 'position' },
  { id: 'adj121', spanish: 'lejano', english: 'far', category: 'position' },
  { id: 'adj122', spanish: 'derecho', english: 'right/straight', category: 'position' },
  { id: 'adj123', spanish: 'izquierdo', english: 'left', category: 'position' },
  { id: 'adj124', spanish: 'interior', english: 'interior', category: 'position' },
  { id: 'adj125', spanish: 'exterior', english: 'exterior', category: 'position' },
  { id: 'adj126', spanish: 'superior', english: 'upper/superior', category: 'position' },
  { id: 'adj127', spanish: 'inferior', english: 'lower/inferior', category: 'position' },

  // Quantity
  { id: 'adj128', spanish: 'mucho', english: 'much/a lot', category: 'quantity' },
  { id: 'adj129', spanish: 'poco', english: 'little/few', category: 'quantity' },
  { id: 'adj130', spanish: 'bastante', english: 'enough/quite', category: 'quantity' },
  { id: 'adj131', spanish: 'demasiado', english: 'too much', category: 'quantity' },
  { id: 'adj132', spanish: 'suficiente', english: 'sufficient', category: 'quantity' },
  { id: 'adj133', spanish: 'lleno', english: 'full', category: 'quantity' },
  { id: 'adj134', spanish: 'vacío', english: 'empty', category: 'quantity' },
  { id: 'adj135', spanish: 'completo', english: 'complete', category: 'quantity' },

  // More common adjectives
  { id: 'adj136', spanish: 'verdadero', english: 'true/real', category: 'quality' },
  { id: 'adj137', spanish: 'falso', english: 'false', category: 'quality' },
  { id: 'adj138', spanish: 'correcto', english: 'correct', category: 'quality' },
  { id: 'adj139', spanish: 'incorrecto', english: 'incorrect', category: 'quality' },
  { id: 'adj140', spanish: 'abierto', english: 'open', category: 'quality' },
  { id: 'adj141', spanish: 'cerrado', english: 'closed', category: 'quality' },
  { id: 'adj142', spanish: 'libre', english: 'free', category: 'quality' },
  { id: 'adj143', spanish: 'ocupado', english: 'occupied', category: 'quality' },
  { id: 'adj144', spanish: 'disponible', english: 'available', category: 'quality' },
  { id: 'adj145', spanish: 'caro', english: 'expensive', category: 'quality' },
  { id: 'adj146', spanish: 'barato', english: 'cheap', category: 'quality' },
  { id: 'adj147', spanish: 'gratis', english: 'free (no cost)', category: 'quality' },
  { id: 'adj148', spanish: 'favorito', english: 'favorite', category: 'quality' },
  { id: 'adj149', spanish: 'popular', english: 'popular', category: 'quality' },
  { id: 'adj150', spanish: 'famoso', english: 'famous', category: 'quality' },

  // Materials
  { id: 'adj151', spanish: 'de madera', english: 'wooden', category: 'materials' },
  { id: 'adj152', spanish: 'de metal', english: 'metal', category: 'materials' },
  { id: 'adj153', spanish: 'de plástico', english: 'plastic', category: 'materials' },
  { id: 'adj154', spanish: 'de vidrio', english: 'glass', category: 'materials' },
  { id: 'adj155', spanish: 'de algodón', english: 'cotton', category: 'materials' },

  // More personality
  { id: 'adj156', spanish: 'paciente', english: 'patient', category: 'personality' },
  { id: 'adj157', spanish: 'impaciente', english: 'impatient', category: 'personality' },
  { id: 'adj158', spanish: 'optimista', english: 'optimistic', category: 'personality' },
  { id: 'adj159', spanish: 'pesimista', english: 'pessimistic', category: 'personality' },
  { id: 'adj160', spanish: 'creativo', english: 'creative', category: 'personality' },
  { id: 'adj161', spanish: 'curioso', english: 'curious', category: 'personality' },
  { id: 'adj162', spanish: 'ambicioso', english: 'ambitious', category: 'personality' },
  { id: 'adj163', spanish: 'independiente', english: 'independent', category: 'personality' },

  // Physical state
  { id: 'adj164', spanish: 'embarazada', english: 'pregnant', category: 'physical' },
  { id: 'adj165', spanish: 'hambriento', english: 'hungry', category: 'physical' },
  { id: 'adj166', spanish: 'sediento', english: 'thirsty', category: 'physical' },
  { id: 'adj167', spanish: 'dormido', english: 'asleep', category: 'physical' },
  { id: 'adj168', spanish: 'despierto', english: 'awake', category: 'physical' },
  { id: 'adj169', spanish: 'vivo', english: 'alive', category: 'physical' },
  { id: 'adj170', spanish: 'muerto', english: 'dead', category: 'physical' },
  { id: 'adj171', spanish: 'desnudo', english: 'naked', category: 'physical' },
  { id: 'adj172', spanish: 'descalzo', english: 'barefoot', category: 'physical' },

  // More quality
  { id: 'adj173', spanish: 'útil', english: 'useful', category: 'quality' },
  { id: 'adj174', spanish: 'inútil', english: 'useless', category: 'quality' },
  { id: 'adj175', spanish: 'peligroso', english: 'dangerous', category: 'quality' },
  { id: 'adj176', spanish: 'profundo', english: 'deep', category: 'quality' },
  { id: 'adj177', spanish: 'superficial', english: 'superficial', category: 'quality' },
  { id: 'adj178', spanish: 'antiguo', english: 'ancient/old', category: 'quality' },
  { id: 'adj179', spanish: 'moderno', english: 'modern', category: 'quality' },
  { id: 'adj180', spanish: 'artificial', english: 'artificial', category: 'quality' },
  { id: 'adj181', spanish: 'natural', english: 'natural', category: 'quality' },
];

// Helper functions
export function getAdjectivesByCategory(category: string): Word[] {
  return adjectives.filter(adj => adj.category === category);
}

export function getAdjectiveCategories(): string[] {
  return [...new Set(adjectives.map(adj => adj.category))];
}

export function searchAdjectives(query: string): Word[] {
  const lowerQuery = query.toLowerCase();
  return adjectives.filter(
    adj =>
      adj.spanish.toLowerCase().includes(lowerQuery) ||
      adj.english.toLowerCase().includes(lowerQuery)
  );
}

export function getRandomAdjectives(count: number): Word[] {
  const shuffled = [...adjectives].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
