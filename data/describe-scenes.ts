// Image description scenes for speaking practice
// Users describe what they see, then check against vocabulary targets and checklist

export interface DescribeScene {
  id: string;
  title: string;
  titleEs: string;
  imageUrl: string;
  // Vocabulary the user should try to incorporate
  vocabularyTargets: {
    spanish: string;
    english: string;
    category: 'color' | 'number' | 'position' | 'object' | 'action' | 'description';
  }[];
  // Things to notice in the image (checklist)
  checklist: {
    spanish: string;
    english: string;
    hint?: string;
  }[];
  // Model description to compare against
  modelDescription: string;
  modelTranslation: string;
  // Difficulty level
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  // Sentence starters to help
  sentenceStarters?: string[];
}

export const describeScenes: DescribeScene[] = [
  {
    id: 'scene-01',
    title: 'Beach Sunset',
    titleEs: 'Atardecer en la Playa',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    vocabularyTargets: [
      { spanish: 'el sol', english: 'the sun', category: 'object' },
      { spanish: 'el mar', english: 'the sea', category: 'object' },
      { spanish: 'la playa', english: 'the beach', category: 'object' },
      { spanish: 'naranja', english: 'orange', category: 'color' },
      { spanish: 'rojo', english: 'red', category: 'color' },
      { spanish: 'el cielo', english: 'the sky', category: 'object' },
      { spanish: 'las nubes', english: 'the clouds', category: 'object' },
      { spanish: 'bonito', english: 'beautiful', category: 'description' },
    ],
    checklist: [
      { spanish: 'El color del cielo', english: 'The color of the sky', hint: '¿De qué color es?' },
      { spanish: 'La posición del sol', english: 'The position of the sun', hint: '¿Dónde está el sol?' },
      { spanish: 'El agua', english: 'The water', hint: '¿Cómo es el mar?' },
      { spanish: 'La arena', english: 'The sand', hint: '¿Hay arena?' },
    ],
    modelDescription: 'Veo una playa muy bonita. El sol está bajando en el cielo. El cielo es naranja y rojo. El mar está tranquilo y el agua refleja los colores del atardecer. Hay arena en la playa. Es un momento muy hermoso.',
    modelTranslation: 'I see a very beautiful beach. The sun is going down in the sky. The sky is orange and red. The sea is calm and the water reflects the colors of the sunset. There is sand on the beach. It is a very beautiful moment.',
    difficulty: 'beginner',
    sentenceStarters: ['Veo...', 'El cielo es...', 'El sol está...', 'Hay...'],
  },
  {
    id: 'scene-02',
    title: 'City Street',
    titleEs: 'Calle de la Ciudad',
    imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop',
    vocabularyTargets: [
      { spanish: 'los coches', english: 'the cars', category: 'object' },
      { spanish: 'los edificios', english: 'the buildings', category: 'object' },
      { spanish: 'las personas', english: 'the people', category: 'object' },
      { spanish: 'la calle', english: 'the street', category: 'object' },
      { spanish: 'caminar', english: 'to walk', category: 'action' },
      { spanish: 'alto', english: 'tall', category: 'description' },
      { spanish: 'a la izquierda', english: 'on the left', category: 'position' },
      { spanish: 'a la derecha', english: 'on the right', category: 'position' },
    ],
    checklist: [
      { spanish: 'Cuántas personas hay', english: 'How many people there are', hint: '¿Cuántas personas veo?' },
      { spanish: 'Los colores de los coches', english: 'The colors of the cars', hint: '¿De qué color son?' },
      { spanish: 'Los edificios', english: 'The buildings', hint: '¿Son altos o bajos?' },
      { spanish: 'Qué hacen las personas', english: 'What the people are doing', hint: '¿Qué están haciendo?' },
    ],
    modelDescription: 'Veo una calle de la ciudad. Hay muchos edificios altos a la izquierda y a la derecha. Veo tres coches: uno rojo, uno blanco y uno negro. Hay cinco personas caminando por la calle. El día está soleado.',
    modelTranslation: 'I see a city street. There are many tall buildings on the left and on the right. I see three cars: one red, one white and one black. There are five people walking down the street. The day is sunny.',
    difficulty: 'beginner',
    sentenceStarters: ['Veo una calle...', 'Hay... edificios', 'A la izquierda...', 'Las personas están...'],
  },
  {
    id: 'scene-03',
    title: 'Kitchen Table',
    titleEs: 'Mesa de Cocina',
    imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=600&fit=crop',
    vocabularyTargets: [
      { spanish: 'la mesa', english: 'the table', category: 'object' },
      { spanish: 'las frutas', english: 'the fruits', category: 'object' },
      { spanish: 'el plato', english: 'the plate', category: 'object' },
      { spanish: 'el vaso', english: 'the glass', category: 'object' },
      { spanish: 'tres', english: 'three', category: 'number' },
      { spanish: 'encima de', english: 'on top of', category: 'position' },
      { spanish: 'verde', english: 'green', category: 'color' },
      { spanish: 'amarillo', english: 'yellow', category: 'color' },
    ],
    checklist: [
      { spanish: 'Cuántas frutas hay', english: 'How many fruits there are', hint: 'Cuenta las frutas' },
      { spanish: 'Los colores de las frutas', english: 'The colors of the fruits', hint: '¿De qué color son?' },
      { spanish: 'Qué hay en la mesa', english: 'What is on the table', hint: '¿Qué objetos veo?' },
      { spanish: 'Dónde están las cosas', english: 'Where things are', hint: 'Usa palabras de posición' },
    ],
    modelDescription: 'Veo una mesa de madera en la cocina. Encima de la mesa hay un plato con tres manzanas rojas. También hay dos plátanos amarillos y un vaso de agua. A la derecha del plato hay una servilleta blanca.',
    modelTranslation: 'I see a wooden table in the kitchen. On top of the table there is a plate with three red apples. There are also two yellow bananas and a glass of water. To the right of the plate there is a white napkin.',
    difficulty: 'beginner',
    sentenceStarters: ['En la mesa hay...', 'Veo... frutas', 'El/La... es de color...', 'Encima de...'],
  },
  {
    id: 'scene-04',
    title: 'Park Scene',
    titleEs: 'Escena del Parque',
    imageUrl: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&h=600&fit=crop',
    vocabularyTargets: [
      { spanish: 'los árboles', english: 'the trees', category: 'object' },
      { spanish: 'el perro', english: 'the dog', category: 'object' },
      { spanish: 'los niños', english: 'the children', category: 'object' },
      { spanish: 'jugar', english: 'to play', category: 'action' },
      { spanish: 'correr', english: 'to run', category: 'action' },
      { spanish: 'el banco', english: 'the bench', category: 'object' },
      { spanish: 'verde', english: 'green', category: 'color' },
      { spanish: 'en el centro', english: 'in the center', category: 'position' },
    ],
    checklist: [
      { spanish: 'Cuántos árboles hay', english: 'How many trees there are', hint: 'Cuenta los árboles' },
      { spanish: 'Qué animales veo', english: 'What animals I see', hint: '¿Hay perros o pájaros?' },
      { spanish: 'Qué hacen las personas', english: 'What the people are doing', hint: '¿Están jugando, caminando?' },
      { spanish: 'El tiempo', english: 'The weather', hint: '¿Hace sol? ¿Está nublado?' },
    ],
    modelDescription: 'Estoy en un parque grande. Hay muchos árboles verdes. En el centro del parque, veo dos niños jugando con una pelota roja. Un perro marrón está corriendo cerca de ellos. A la izquierda hay un banco donde una señora está sentada leyendo un libro. Hace sol y el cielo está azul.',
    modelTranslation: 'I am in a big park. There are many green trees. In the center of the park, I see two children playing with a red ball. A brown dog is running near them. On the left there is a bench where a lady is sitting reading a book. It is sunny and the sky is blue.',
    difficulty: 'intermediate',
    sentenceStarters: ['En el parque hay...', 'Los niños están...', 'El perro está...', 'Hace...'],
  },
  {
    id: 'scene-05',
    title: 'Restaurant Interior',
    titleEs: 'Interior del Restaurante',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    vocabularyTargets: [
      { spanish: 'las mesas', english: 'the tables', category: 'object' },
      { spanish: 'las sillas', english: 'the chairs', category: 'object' },
      { spanish: 'el camarero', english: 'the waiter', category: 'object' },
      { spanish: 'la comida', english: 'the food', category: 'object' },
      { spanish: 'comer', english: 'to eat', category: 'action' },
      { spanish: 'beber', english: 'to drink', category: 'action' },
      { spanish: 'elegante', english: 'elegant', category: 'description' },
      { spanish: 'al fondo', english: 'in the back', category: 'position' },
    ],
    checklist: [
      { spanish: 'Cuántas mesas hay', english: 'How many tables there are', hint: 'Cuenta las mesas' },
      { spanish: 'Cuántas personas están comiendo', english: 'How many people are eating', hint: '¿Quién está comiendo?' },
      { spanish: 'El ambiente del restaurante', english: 'The atmosphere of the restaurant', hint: '¿Es elegante, informal?' },
      { spanish: 'Las luces', english: 'The lights', hint: '¿Hay muchas luces?' },
    ],
    modelDescription: 'Estoy en un restaurante elegante. Hay seis mesas con manteles blancos. En la primera mesa, una pareja está cenando. El camarero está al fondo llevando platos de comida. Las luces son suaves y hay velas en las mesas. Es un lugar muy acogedor.',
    modelTranslation: 'I am in an elegant restaurant. There are six tables with white tablecloths. At the first table, a couple is having dinner. The waiter is in the back carrying plates of food. The lights are soft and there are candles on the tables. It is a very cozy place.',
    difficulty: 'intermediate',
    sentenceStarters: ['Es un restaurante...', 'Hay... mesas', 'El camarero está...', 'Las personas están...'],
  },
  {
    id: 'scene-06',
    title: 'Living Room',
    titleEs: 'Sala de Estar',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    vocabularyTargets: [
      { spanish: 'el sofá', english: 'the sofa', category: 'object' },
      { spanish: 'la televisión', english: 'the television', category: 'object' },
      { spanish: 'la lámpara', english: 'the lamp', category: 'object' },
      { spanish: 'la alfombra', english: 'the rug', category: 'object' },
      { spanish: 'cómodo', english: 'comfortable', category: 'description' },
      { spanish: 'moderno', english: 'modern', category: 'description' },
      { spanish: 'debajo de', english: 'under', category: 'position' },
      { spanish: 'al lado de', english: 'next to', category: 'position' },
    ],
    checklist: [
      { spanish: 'Los muebles principales', english: 'The main furniture', hint: '¿Qué muebles veo?' },
      { spanish: 'Los colores de la habitación', english: 'The colors of the room', hint: '¿De qué color son las cosas?' },
      { spanish: 'La posición de los objetos', english: 'The position of objects', hint: 'Usa: debajo, al lado, encima' },
      { spanish: 'El estilo de la sala', english: 'The style of the room', hint: '¿Es moderna, clásica?' },
    ],
    modelDescription: 'Esta es una sala de estar moderna y cómoda. Hay un sofá gris grande en el centro. Delante del sofá hay una mesa de café de madera. La televisión está en la pared. Al lado del sofá hay una lámpara alta. Debajo de la mesa hay una alfombra azul. Las paredes son blancas.',
    modelTranslation: 'This is a modern and comfortable living room. There is a large gray sofa in the center. In front of the sofa there is a wooden coffee table. The television is on the wall. Next to the sofa there is a tall lamp. Under the table there is a blue rug. The walls are white.',
    difficulty: 'beginner',
    sentenceStarters: ['En la sala hay...', 'El sofá es...', 'Al lado de...', 'Debajo de...'],
  },
  {
    id: 'scene-07',
    title: 'Market Stall',
    titleEs: 'Puesto del Mercado',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
    vocabularyTargets: [
      { spanish: 'las verduras', english: 'the vegetables', category: 'object' },
      { spanish: 'las frutas', english: 'the fruits', category: 'object' },
      { spanish: 'el vendedor', english: 'the vendor', category: 'object' },
      { spanish: 'los tomates', english: 'the tomatoes', category: 'object' },
      { spanish: 'fresco', english: 'fresh', category: 'description' },
      { spanish: 'colorido', english: 'colorful', category: 'description' },
      { spanish: 'muchos', english: 'many', category: 'number' },
      { spanish: 'comprar', english: 'to buy', category: 'action' },
    ],
    checklist: [
      { spanish: 'Los tipos de frutas', english: 'The types of fruits', hint: '¿Qué frutas hay?' },
      { spanish: 'Los tipos de verduras', english: 'The types of vegetables', hint: '¿Qué verduras hay?' },
      { spanish: 'Los colores', english: 'The colors', hint: 'El mercado tiene muchos colores' },
      { spanish: 'Las personas', english: 'The people', hint: '¿Hay vendedor? ¿Clientes?' },
    ],
    modelDescription: 'Veo un puesto de mercado muy colorido. Hay muchas frutas frescas: manzanas rojas, naranjas, plátanos amarillos y uvas moradas. También hay verduras: tomates rojos, lechugas verdes y zanahorias naranjas. El vendedor está detrás del puesto sonriendo. Una señora está comprando tomates.',
    modelTranslation: 'I see a very colorful market stall. There are many fresh fruits: red apples, oranges, yellow bananas and purple grapes. There are also vegetables: red tomatoes, green lettuces and orange carrots. The vendor is behind the stall smiling. A lady is buying tomatoes.',
    difficulty: 'intermediate',
    sentenceStarters: ['En el mercado hay...', 'Las frutas son...', 'El vendedor está...', 'Veo... verduras'],
  },
  {
    id: 'scene-08',
    title: 'Classroom',
    titleEs: 'Aula de Clase',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop',
    vocabularyTargets: [
      { spanish: 'los estudiantes', english: 'the students', category: 'object' },
      { spanish: 'el profesor', english: 'the teacher', category: 'object' },
      { spanish: 'la pizarra', english: 'the blackboard', category: 'object' },
      { spanish: 'los libros', english: 'the books', category: 'object' },
      { spanish: 'estudiar', english: 'to study', category: 'action' },
      { spanish: 'escribir', english: 'to write', category: 'action' },
      { spanish: 'sentado', english: 'sitting', category: 'description' },
      { spanish: 'delante de', english: 'in front of', category: 'position' },
    ],
    checklist: [
      { spanish: 'Cuántos estudiantes hay', english: 'How many students there are', hint: 'Cuenta los estudiantes' },
      { spanish: 'Qué hay en la pizarra', english: 'What is on the blackboard', hint: '¿Hay palabras, números?' },
      { spanish: 'Qué están haciendo los estudiantes', english: 'What the students are doing', hint: '¿Están escribiendo, leyendo?' },
      { spanish: 'Dónde está el profesor', english: 'Where the teacher is', hint: '¿Está delante de la clase?' },
    ],
    modelDescription: 'Estoy en un aula de clase. Hay diez estudiantes sentados en sus escritorios. El profesor está delante de la pizarra explicando matemáticas. En la pizarra hay números y ecuaciones. Los estudiantes están escribiendo en sus cuadernos. Hay libros y lápices en las mesas.',
    modelTranslation: 'I am in a classroom. There are ten students sitting at their desks. The teacher is in front of the blackboard explaining mathematics. On the blackboard there are numbers and equations. The students are writing in their notebooks. There are books and pencils on the desks.',
    difficulty: 'intermediate',
    sentenceStarters: ['En el aula hay...', 'El profesor está...', 'Los estudiantes están...', 'En la pizarra...'],
  },
  {
    id: 'scene-09',
    title: 'Night City Lights',
    titleEs: 'Luces de la Ciudad de Noche',
    imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop',
    vocabularyTargets: [
      { spanish: 'las luces', english: 'the lights', category: 'object' },
      { spanish: 'los edificios', english: 'the buildings', category: 'object' },
      { spanish: 'la noche', english: 'the night', category: 'object' },
      { spanish: 'brillante', english: 'bright', category: 'description' },
      { spanish: 'oscuro', english: 'dark', category: 'color' },
      { spanish: 'parpadear', english: 'to blink/twinkle', category: 'action' },
      { spanish: 'cinco', english: 'five', category: 'number' },
      { spanish: 'arriba', english: 'above/up', category: 'position' },
    ],
    checklist: [
      { spanish: 'Cuántas luces de diferentes colores', english: 'How many lights of different colors', hint: 'Cuenta las luces rojas, blancas, etc.' },
      { spanish: 'La altura de los edificios', english: 'The height of the buildings', hint: '¿Son altos o bajos?' },
      { spanish: 'El cielo', english: 'The sky', hint: '¿De qué color es el cielo de noche?' },
      { spanish: 'El ambiente', english: 'The atmosphere', hint: '¿Es tranquilo, animado?' },
    ],
    modelDescription: 'Es de noche en la ciudad. El cielo está oscuro pero hay muchas luces brillantes. Veo tres luces rojas parpadeando en un edificio alto. Hay dos luces blancas en la calle. Los edificios tienen ventanas amarillas iluminadas. La ciudad se ve muy viva y animada por la noche.',
    modelTranslation: 'It is nighttime in the city. The sky is dark but there are many bright lights. I see three red lights blinking on a tall building. There are two white lights on the street. The buildings have illuminated yellow windows. The city looks very alive and lively at night.',
    difficulty: 'advanced',
    sentenceStarters: ['Es de noche...', 'Veo... luces', 'Los edificios son...', 'El cielo está...'],
  },
  {
    id: 'scene-10',
    title: 'Family Dinner',
    titleEs: 'Cena Familiar',
    imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=600&fit=crop',
    vocabularyTargets: [
      { spanish: 'la familia', english: 'the family', category: 'object' },
      { spanish: 'la cena', english: 'the dinner', category: 'object' },
      { spanish: 'los abuelos', english: 'the grandparents', category: 'object' },
      { spanish: 'los padres', english: 'the parents', category: 'object' },
      { spanish: 'los hijos', english: 'the children', category: 'object' },
      { spanish: 'comer', english: 'to eat', category: 'action' },
      { spanish: 'hablar', english: 'to talk', category: 'action' },
      { spanish: 'feliz', english: 'happy', category: 'description' },
      { spanish: 'juntos', english: 'together', category: 'description' },
    ],
    checklist: [
      { spanish: 'Cuántas personas hay', english: 'How many people there are', hint: 'Cuenta a todas las personas' },
      { spanish: 'Quiénes son (familia)', english: 'Who they are (family)', hint: '¿Hay abuelos, padres, niños?' },
      { spanish: 'Qué comida hay', english: 'What food there is', hint: '¿Qué están comiendo?' },
      { spanish: 'Cómo se sienten', english: 'How they feel', hint: '¿Están felices, serios?' },
    ],
    modelDescription: 'Veo una cena familiar. Hay seis personas sentadas alrededor de la mesa: dos abuelos, dos padres y dos hijos pequeños. Están comiendo pollo con arroz y ensalada. Todos están hablando y riendo. Se ven muy felices de estar juntos. Hay velas en la mesa y la luz es cálida.',
    modelTranslation: 'I see a family dinner. There are six people sitting around the table: two grandparents, two parents and two small children. They are eating chicken with rice and salad. Everyone is talking and laughing. They look very happy to be together. There are candles on the table and the light is warm.',
    difficulty: 'intermediate',
    sentenceStarters: ['En la foto hay...', 'La familia está...', 'Están comiendo...', 'Todos se ven...'],
  },
];

// Helper functions
export function getSceneById(id: string): DescribeScene | undefined {
  return describeScenes.find(scene => scene.id === id);
}

export function getScenesByDifficulty(difficulty: DescribeScene['difficulty']): DescribeScene[] {
  return describeScenes.filter(scene => scene.difficulty === difficulty);
}

export function getRandomScene(): DescribeScene {
  return describeScenes[Math.floor(Math.random() * describeScenes.length)];
}
