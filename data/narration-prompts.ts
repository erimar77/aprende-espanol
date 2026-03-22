// Story Narration Prompts - prompts, hints, and model narrations for story retelling practice

export interface NarrationPrompt {
  storyId: string;
  title: string;
  titleEs: string;
  briefSummary: string; // English summary to remind user what to narrate
  imageUrl: string; // Scene image for visual reference
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  plotPoints: PlotPoint[]; // Key events to cover
  usefulVocabulary: VocabHint[]; // Vocabulary from the story
  sentenceStarters: SentenceStarter[]; // Helpful phrases to begin sentences
  connectors: Connector[]; // Time expressions and transitions
  modelNarration: string; // Example narration in Spanish
  modelTranslation: string; // Translation of model narration
}

export interface PlotPoint {
  id: string;
  english: string; // What to mention
  spanishHint: string; // Key Spanish phrase/verb to use
}

export interface VocabHint {
  spanish: string;
  english: string;
  example?: string; // Optional example usage
}

export interface SentenceStarter {
  spanish: string;
  english: string;
  usage: string; // When to use this starter
}

export interface Connector {
  spanish: string;
  english: string;
  type: 'time' | 'sequence' | 'contrast' | 'cause' | 'addition';
}

export const narrationPrompts: NarrationPrompt[] = [
  {
    storyId: 'story-001',
    title: 'A Morning in Madrid',
    titleEs: 'Una Mañana en Madrid',
    briefSummary: 'Ana wakes up, has a typical Spanish breakfast, gets dressed, takes the metro to work, and greets her colleagues.',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=500&fit=crop',
    difficulty: 'beginner',
    plotPoints: [
      { id: 'pp1', english: 'Ana wakes up at 7am, sun coming through window', spanishHint: 'se despierta a las siete' },
      { id: 'pp2', english: 'She makes coffee with milk and toast with tomato', spanishHint: 'café con leche, tostadas con tomate' },
      { id: 'pp3', english: 'She showers and gets dressed in blue and black', spanishHint: 'se ducha, camiseta azul, pantalones negros' },
      { id: 'pp4', english: 'At 8:30 she leaves and walks to the metro', spanishHint: 'a las ocho y media, camina a la estación' },
      { id: 'pp5', english: 'She reads on her phone during the ride', spanishHint: 'lee un libro en su teléfono' },
      { id: 'pp6', english: 'She arrives at work at 9 and greets colleagues', spanishHint: 'llega a las nueve, buenos días' },
    ],
    usefulVocabulary: [
      { spanish: 'despertarse', english: 'to wake up', example: 'Ana se despierta temprano' },
      { spanish: 'el desayuno', english: 'breakfast', example: 'Es un desayuno típico' },
      { spanish: 'ducharse', english: 'to shower' },
      { spanish: 'vestirse', english: 'to get dressed' },
      { spanish: 'caminar', english: 'to walk' },
      { spanish: 'el metro', english: 'the metro/subway' },
      { spanish: 'la oficina', english: 'the office' },
      { spanish: 'los compañeros', english: 'colleagues' },
    ],
    sentenceStarters: [
      { spanish: 'La historia es sobre...', english: 'The story is about...', usage: 'Opening' },
      { spanish: 'Ana vive en...', english: 'Ana lives in...', usage: 'Setting' },
      { spanish: 'Por la mañana, ella...', english: 'In the morning, she...', usage: 'Daily routine' },
      { spanish: 'Después de desayunar...', english: 'After having breakfast...', usage: 'Sequence' },
      { spanish: 'Ella trabaja en...', english: 'She works in...', usage: 'Work details' },
    ],
    connectors: [
      { spanish: 'primero', english: 'first', type: 'sequence' },
      { spanish: 'luego', english: 'then', type: 'sequence' },
      { spanish: 'después', english: 'afterwards', type: 'sequence' },
      { spanish: 'a las (siete)', english: 'at (seven)', type: 'time' },
      { spanish: 'por la mañana', english: 'in the morning', type: 'time' },
      { spanish: 'finalmente', english: 'finally', type: 'sequence' },
    ],
    modelNarration: 'Esta historia es sobre Ana, una mujer que vive en Madrid. Por la mañana, ella se despierta a las siete. El sol entra por la ventana. Primero, va a la cocina y prepara el desayuno: café con leche y tostadas con tomate. Después de desayunar, se ducha y se viste. Lleva una camiseta azul y pantalones negros. A las ocho y media, sale de casa y camina hasta la estación de metro. En el metro, lee un libro en su teléfono. Finalmente, llega a su oficina a las nueve y dice "buenos días" a sus compañeros.',
    modelTranslation: 'This story is about Ana, a woman who lives in Madrid. In the morning, she wakes up at seven. The sun comes through the window. First, she goes to the kitchen and prepares breakfast: coffee with milk and toast with tomato. After having breakfast, she showers and gets dressed. She wears a blue t-shirt and black pants. At eight thirty, she leaves home and walks to the metro station. On the metro, she reads a book on her phone. Finally, she arrives at her office at nine and says "good morning" to her colleagues.',
  },
  {
    storyId: 'story-002',
    title: 'At the Market',
    titleEs: 'En el Mercado',
    briefSummary: 'Carlos goes to the market on Saturday, buys oranges, apples, bread, and ham, then returns home to cook dinner.',
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=500&fit=crop',
    difficulty: 'beginner',
    plotPoints: [
      { id: 'pp1', english: 'It\'s Saturday, Carlos goes to the Central Market', spanishHint: 'es sábado, va al Mercado Central' },
      { id: 'pp2', english: 'The market has many stalls with different foods', spanishHint: 'hay muchos puestos, frutas, verduras' },
      { id: 'pp3', english: 'He buys oranges and apples from a fruit seller', spanishHint: 'un kilo de naranjas, medio kilo de manzanas' },
      { id: 'pp4', english: 'The oranges are from Valencia, sweet and juicy', spanishHint: 'de Valencia, dulces y jugosas' },
      { id: 'pp5', english: 'He also buys bread and serrano ham', spanishHint: 'pan en la panadería, jamón serrano' },
      { id: 'pp6', english: 'He returns home to cook dinner for his family', spanishHint: 'vuelve a casa, cocinar una cena' },
    ],
    usefulVocabulary: [
      { spanish: 'el mercado', english: 'the market' },
      { spanish: 'el puesto', english: 'the stall', example: 'Hay muchos puestos' },
      { spanish: 'la vendedora', english: 'the seller (f)' },
      { spanish: 'un kilo', english: 'a kilogram' },
      { spanish: 'medio kilo', english: 'half a kilogram' },
      { spanish: 'dulce', english: 'sweet' },
      { spanish: 'la panadería', english: 'the bakery' },
      { spanish: 'el jamón serrano', english: 'serrano ham' },
      { spanish: 'cocinar', english: 'to cook' },
    ],
    sentenceStarters: [
      { spanish: 'La historia es sobre...', english: 'The story is about...', usage: 'Opening' },
      { spanish: 'Carlos va a...', english: 'Carlos goes to...', usage: 'Action' },
      { spanish: 'En el mercado, hay...', english: 'In the market, there are...', usage: 'Description' },
      { spanish: 'Él compra...', english: 'He buys...', usage: 'Shopping' },
      { spanish: 'Al final...', english: 'At the end...', usage: 'Conclusion' },
    ],
    connectors: [
      { spanish: 'primero', english: 'first', type: 'sequence' },
      { spanish: 'después', english: 'then/after', type: 'sequence' },
      { spanish: 'también', english: 'also', type: 'addition' },
      { spanish: 'por fin', english: 'finally', type: 'sequence' },
      { spanish: 'hoy', english: 'today', type: 'time' },
      { spanish: 'esta noche', english: 'tonight', type: 'time' },
    ],
    modelNarration: 'La historia es sobre Carlos, que va al mercado el sábado. El Mercado Central está en el centro de la ciudad y es muy grande. Dentro hay muchos puestos con frutas, verduras, carne, pescado y queso. Primero, Carlos compra un kilo de naranjas y medio kilo de manzanas. Las naranjas son de Valencia y son muy dulces. Después, va a la panadería para comprar pan. También compra jamón serrano en la charcutería porque es su favorito. Finalmente, vuelve a casa con su bolsa llena. Esta noche va a cocinar una cena deliciosa para su familia.',
    modelTranslation: 'The story is about Carlos, who goes to the market on Saturday. The Central Market is in the center of the city and is very big. Inside there are many stalls with fruits, vegetables, meat, fish, and cheese. First, Carlos buys a kilo of oranges and half a kilo of apples. The oranges are from Valencia and are very sweet. Then, he goes to the bakery to buy bread. He also buys serrano ham at the deli because it\'s his favorite. Finally, he returns home with his full bag. Tonight he is going to cook a delicious dinner for his family.',
  },
  {
    storyId: 'story-003',
    title: 'The New Student',
    titleEs: 'El Estudiante Nuevo',
    briefSummary: 'Miguel starts at a new school, introduces himself, makes a friend named Pablo, and joins him for lunch.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop',
    difficulty: 'beginner',
    plotPoints: [
      { id: 'pp1', english: 'Miguel is a new student, nervous on first day', spanishHint: 'estudiante nuevo, está nervioso' },
      { id: 'pp2', english: 'The teacher introduces him to the class', spanishHint: 'la profesora presenta a Miguel' },
      { id: 'pp3', english: 'He introduces himself - from Barcelona, likes soccer', spanishHint: 'soy de Barcelona, me gusta el fútbol' },
      { id: 'pp4', english: 'He sits next to Pablo, who is friendly', spanishHint: 'se sienta al lado de Pablo' },
      { id: 'pp5', english: 'Pablo invites him to eat lunch together', spanishHint: '¿quieres comer conmigo?' },
      { id: 'pp6', english: 'They become friends by the end of the day', spanishHint: 'nuevo amigo, buen día' },
    ],
    usefulVocabulary: [
      { spanish: 'el estudiante', english: 'the student' },
      { spanish: 'nervioso/a', english: 'nervous' },
      { spanish: 'la profesora', english: 'the teacher (f)' },
      { spanish: 'presentarse', english: 'to introduce oneself' },
      { spanish: 'el fútbol', english: 'soccer' },
      { spanish: 'sentarse', english: 'to sit down' },
      { spanish: 'almorzar', english: 'to have lunch' },
      { spanish: 'el amigo', english: 'the friend' },
    ],
    sentenceStarters: [
      { spanish: 'Miguel es...', english: 'Miguel is...', usage: 'Character intro' },
      { spanish: 'El primer día...', english: 'The first day...', usage: 'Time setting' },
      { spanish: 'Él se presenta y dice...', english: 'He introduces himself and says...', usage: 'Introduction' },
      { spanish: 'Pablo le pregunta...', english: 'Pablo asks him...', usage: 'Dialogue' },
      { spanish: 'Al final del día...', english: 'At the end of the day...', usage: 'Conclusion' },
    ],
    connectors: [
      { spanish: 'el primer día', english: 'the first day', type: 'time' },
      { spanish: 'cuándo', english: 'when', type: 'time' },
      { spanish: 'entonces', english: 'then/so', type: 'sequence' },
      { spanish: 'más tarde', english: 'later', type: 'time' },
      { spanish: 'al final', english: 'at the end', type: 'sequence' },
      { spanish: 'porque', english: 'because', type: 'cause' },
    ],
    modelNarration: 'Esta historia es sobre Miguel, un estudiante nuevo. El primer día de clase, Miguel está muy nervioso. La profesora lo presenta a la clase y él dice: "Hola, me llamo Miguel. Soy de Barcelona y me gusta mucho el fútbol." Después, se sienta al lado de un chico que se llama Pablo. Pablo es muy simpático y le pregunta a Miguel: "¿Quieres comer conmigo?" Miguel dice que sí y almuerzan juntos. Hablan sobre el fútbol y los videojuegos. Al final del día, Miguel está contento porque tiene un nuevo amigo.',
    modelTranslation: 'This story is about Miguel, a new student. On the first day of class, Miguel is very nervous. The teacher introduces him to the class and he says: "Hi, my name is Miguel. I\'m from Barcelona and I really like soccer." Then, he sits next to a boy named Pablo. Pablo is very nice and asks Miguel: "Do you want to eat with me?" Miguel says yes and they have lunch together. They talk about soccer and video games. At the end of the day, Miguel is happy because he has a new friend.',
  },
  {
    storyId: 'story-004',
    title: 'The Lost Dog',
    titleEs: 'El Perro Perdido',
    briefSummary: 'María finds a lost dog in the park, looks for its owner, and eventually reunites Max with his owner Señor García.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=500&fit=crop',
    difficulty: 'beginner',
    plotPoints: [
      { id: 'pp1', english: 'María is walking in the park and finds a dog', spanishHint: 'camina por el parque, encuentra un perro' },
      { id: 'pp2', english: 'The dog looks lost and sad, has a collar', spanishHint: 'parece perdido, tiene un collar' },
      { id: 'pp3', english: 'She reads the collar: Max, with a phone number', spanishHint: 'se llama Max, número de teléfono' },
      { id: 'pp4', english: 'She calls the number and speaks to the owner', spanishHint: 'llama al número, habla con el dueño' },
      { id: 'pp5', english: 'The owner, Señor García, comes to the park', spanishHint: 'Señor García viene al parque' },
      { id: 'pp6', english: 'Max is happy to see his owner, they thank María', spanishHint: 'Max está feliz, le dan las gracias' },
    ],
    usefulVocabulary: [
      { spanish: 'el perro', english: 'the dog' },
      { spanish: 'perdido/a', english: 'lost' },
      { spanish: 'el collar', english: 'the collar' },
      { spanish: 'el número de teléfono', english: 'phone number' },
      { spanish: 'llamar', english: 'to call' },
      { spanish: 'el dueño', english: 'the owner' },
      { spanish: 'encontrar', english: 'to find' },
      { spanish: 'dar las gracias', english: 'to thank' },
    ],
    sentenceStarters: [
      { spanish: 'Un día, María...', english: 'One day, María...', usage: 'Opening' },
      { spanish: 'Ella ve un perro que...', english: 'She sees a dog that...', usage: 'Discovery' },
      { spanish: 'El collar dice...', english: 'The collar says...', usage: 'Information' },
      { spanish: 'Ella decide...', english: 'She decides...', usage: 'Action' },
      { spanish: 'Al final...', english: 'In the end...', usage: 'Resolution' },
    ],
    connectors: [
      { spanish: 'un día', english: 'one day', type: 'time' },
      { spanish: 'de repente', english: 'suddenly', type: 'sequence' },
      { spanish: 'entonces', english: 'then', type: 'sequence' },
      { spanish: 'por eso', english: 'that\'s why', type: 'cause' },
      { spanish: 'al final', english: 'in the end', type: 'sequence' },
      { spanish: 'mientras tanto', english: 'meanwhile', type: 'time' },
    ],
    modelNarration: 'Un día, María está caminando por el parque cuándo ve un perro pequeño. El perro parece perdido y triste. María se acerca y ve que tiene un collar. El collar dice "Max" y tiene un número de teléfono. Entonces, María llama al número y habla con el dueño del perro. El dueño, Señor García, está muy preocupado por Max. Él viene al parque inmediatamente. Cuando Max ve a su dueño, está muy feliz y mueve la cola. Señor García le da las gracias a María por encontrar a su perro.',
    modelTranslation: 'One day, María is walking through the park when she sees a small dog. The dog looks lost and sad. María approaches and sees that it has a collar. The collar says "Max" and has a phone number. Then, María calls the number and speaks with the dog\'s owner. The owner, Mr. García, is very worried about Max. He comes to the park immediately. When Max sees his owner, he is very happy and wags his tail. Mr. García thanks María for finding his dog.',
  },
  {
    storyId: 'story-005',
    title: 'A Birthday Surprise',
    titleEs: 'Una Sorpresa de Cumpleaños',
    briefSummary: 'Laura\'s friends plan a surprise party for her birthday, pretending to forget, then surprising her at home.',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=500&fit=crop',
    difficulty: 'beginner',
    plotPoints: [
      { id: 'pp1', english: 'Today is Laura\'s birthday, she thinks friends forgot', spanishHint: 'es el cumpleaños de Laura, cree que olvidan' },
      { id: 'pp2', english: 'Her friends seem busy and don\'t mention the birthday', spanishHint: 'los amigos parecen ocupados' },
      { id: 'pp3', english: 'Laura feels sad and goes home after school', spanishHint: 'está triste, vuelve a casa' },
      { id: 'pp4', english: 'When she opens the door: "Surprise!"', spanishHint: 'abre la puerta, ¡sorpresa!' },
      { id: 'pp5', english: 'All her friends are there with cake and decorations', spanishHint: 'todos los amigos, pastel, decoraciones' },
      { id: 'pp6', english: 'Laura is very happy, they didn\'t forget after all', spanishHint: 'muy feliz, no olvidaron' },
    ],
    usefulVocabulary: [
      { spanish: 'el cumpleaños', english: 'birthday' },
      { spanish: 'la sorpresa', english: 'surprise' },
      { spanish: 'olvidar', english: 'to forget' },
      { spanish: 'triste', english: 'sad' },
      { spanish: 'feliz', english: 'happy' },
      { spanish: 'el pastel', english: 'cake' },
      { spanish: 'los globos', english: 'balloons' },
      { spanish: 'los regalos', english: 'gifts' },
    ],
    sentenceStarters: [
      { spanish: 'Hoy es el cumpleaños de...', english: 'Today is the birthday of...', usage: 'Opening' },
      { spanish: 'Laura piensa que...', english: 'Laura thinks that...', usage: 'Feelings' },
      { spanish: 'Pero en realidad...', english: 'But in reality...', usage: 'Twist' },
      { spanish: 'Cuando llega a casa...', english: 'When she arrives home...', usage: 'Climax' },
      { spanish: 'Todos gritan...', english: 'Everyone shouts...', usage: 'Surprise' },
    ],
    connectors: [
      { spanish: 'hoy', english: 'today', type: 'time' },
      { spanish: 'durante el día', english: 'during the day', type: 'time' },
      { spanish: 'pero', english: 'but', type: 'contrast' },
      { spanish: 'cuándo', english: 'when', type: 'time' },
      { spanish: 'de repente', english: 'suddenly', type: 'sequence' },
      { spanish: 'en realidad', english: 'in reality', type: 'contrast' },
    ],
    modelNarration: 'Hoy es el cumpleaños de Laura. Durante el día, sus amigos no le dicen nada. Laura piensa que olvidan su cumpleaños y se siente triste. Después de las clases, vuelve a casa sola. Pero cuándo abre la puerta, de repente todos gritan: "¡Sorpresa!" Todos sus amigos están allí con un pastel grande, globos, y muchos regalos. En realidad, sus amigos planearon una fiesta sorpresa. Laura está muy feliz y emocionada. No olvidaron su cumpleaños, solo querían sorprenderla. Es la mejor fiesta de cumpleaños.',
    modelTranslation: 'Today is Laura\'s birthday. During the day, her friends don\'t say anything to her. Laura thinks they forget her birthday and she feels sad. After classes, she returns home alone. But when she opens the door, suddenly everyone shouts: "Surprise!" All her friends are there with a big cake, balloons, and many gifts. In reality, her friends planned a surprise party. Laura is very happy and excited. They didn\'t forget her birthday, they just wanted to surprise her. It\'s the best birthday party.',
  },
  {
    storyId: 'story-006',
    title: 'The Soccer Match',
    titleEs: 'El Partido de Fútbol',
    briefSummary: 'Diego\'s team plays in a championship final, he scores the winning goal in the last minute.',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop',
    difficulty: 'intermediate',
    plotPoints: [
      { id: 'pp1', english: 'Diego\'s team plays in the championship final', spanishHint: 'juega en la final del campeonato' },
      { id: 'pp2', english: 'The game is tied 1-1 with minutes remaining', spanishHint: 'el partido está empatado, pocos minutos' },
      { id: 'pp3', english: 'Diego receives the ball near the goal', spanishHint: 'recibe el balón cerca de la portería' },
      { id: 'pp4', english: 'He shoots with his left foot', spanishHint: 'dispara con el pie izquierdo' },
      { id: 'pp5', english: 'Goal! The crowd goes crazy', spanishHint: '¡gol! la multitud enloquece' },
      { id: 'pp6', english: 'His team wins the championship', spanishHint: 'su equipo gana el campeonato' },
    ],
    usefulVocabulary: [
      { spanish: 'el partido', english: 'the match/game' },
      { spanish: 'el equipo', english: 'the team' },
      { spanish: 'el campeonato', english: 'the championship' },
      { spanish: 'empatar', english: 'to tie' },
      { spanish: 'el balón', english: 'the ball' },
      { spanish: 'disparar', english: 'to shoot' },
      { spanish: 'marcar un gol', english: 'to score a goal' },
      { spanish: 'ganar', english: 'to win' },
    ],
    sentenceStarters: [
      { spanish: 'Es el día del partido...', english: 'It\'s the day of the match...', usage: 'Opening' },
      { spanish: 'El marcador está...', english: 'The score is...', usage: 'Score update' },
      { spanish: 'En el último minuto...', english: 'In the last minute...', usage: 'Climax' },
      { spanish: 'Diego recibe...', english: 'Diego receives...', usage: 'Action' },
      { spanish: 'Todos celebran porque...', english: 'Everyone celebrates because...', usage: 'Ending' },
    ],
    connectors: [
      { spanish: 'al principio', english: 'at the beginning', type: 'time' },
      { spanish: 'durante el partido', english: 'during the game', type: 'time' },
      { spanish: 'en el último minuto', english: 'in the last minute', type: 'time' },
      { spanish: 'de repente', english: 'suddenly', type: 'sequence' },
      { spanish: 'finalmente', english: 'finally', type: 'sequence' },
      { spanish: 'gracias a', english: 'thanks to', type: 'cause' },
    ],
    modelNarration: 'Es el día de la final del campeonato. El equipo de Diego juega contra el mejor equipo de la ciudad. El partido es muy intenso. Al principio, el otro equipo marca un gol. Pero después, un compañero de Diego empata el partido. El marcador está uno a uno. En el último minuto, Diego recibe el balón cerca de la portería. Tiene una oportunidad perfecta. Dispara con el pie izquierdo y... ¡gol! La multitud enloquece. El árbitro pita el final del partido. El equipo de Diego gana el campeonato dos a uno. Todos celebran y Diego es el héroe del día.',
    modelTranslation: 'It\'s the day of the championship final. Diego\'s team plays against the best team in the city. The match is very intense. At the beginning, the other team scores a goal. But then, one of Diego\'s teammates ties the game. The score is one to one. In the last minute, Diego receives the ball near the goal. He has a perfect opportunity. He shoots with his left foot and... goal! The crowd goes crazy. The referee blows the final whistle. Diego\'s team wins the championship two to one. Everyone celebrates and Diego is the hero of the day.',
  },
  {
    storyId: 'story-007',
    title: 'The Beach Vacation',
    titleEs: 'Las Vacaciones en la Playa',
    briefSummary: 'The García family spends a week at the beach - swimming, building sandcastles, eating seafood, and watching the sunset.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
    difficulty: 'beginner',
    plotPoints: [
      { id: 'pp1', english: 'The García family goes on vacation to the beach', spanishHint: 'va de vacaciones a la playa' },
      { id: 'pp2', english: 'They stay in a small hotel near the sea', spanishHint: 'se quedan en un hotel pequeño' },
      { id: 'pp3', english: 'The kids swim and build sandcastles', spanishHint: 'los niños nadan, construyen castillos' },
      { id: 'pp4', english: 'They eat fresh seafood for lunch', spanishHint: 'comen mariscos frescos' },
      { id: 'pp5', english: 'They watch the sunset every evening', spanishHint: 'ven la puesta del sol cada tarde' },
      { id: 'pp6', english: 'Best family vacation ever', spanishHint: 'las mejores vacaciones familiares' },
    ],
    usefulVocabulary: [
      { spanish: 'las vacaciones', english: 'vacation' },
      { spanish: 'la playa', english: 'the beach' },
      { spanish: 'el mar', english: 'the sea' },
      { spanish: 'nadar', english: 'to swim' },
      { spanish: 'el castillo de arena', english: 'sandcastle' },
      { spanish: 'los mariscos', english: 'seafood' },
      { spanish: 'la puesta del sol', english: 'sunset' },
      { spanish: 'disfrutar', english: 'to enjoy' },
    ],
    sentenceStarters: [
      { spanish: 'La familia García decide...', english: 'The García family decides...', usage: 'Opening' },
      { spanish: 'Se quedan en...', english: 'They stay in...', usage: 'Location' },
      { spanish: 'Por la mañana...', english: 'In the morning...', usage: 'Daily activities' },
      { spanish: 'Por la tarde...', english: 'In the afternoon...', usage: 'Activities' },
      { spanish: 'Es la mejor vacación porque...', english: 'It\'s the best vacation because...', usage: 'Conclusion' },
    ],
    connectors: [
      { spanish: 'cada día', english: 'every day', type: 'time' },
      { spanish: 'por la mañana', english: 'in the morning', type: 'time' },
      { spanish: 'por la tarde', english: 'in the afternoon', type: 'time' },
      { spanish: 'además', english: 'also/besides', type: 'addition' },
      { spanish: 'sobre todo', english: 'especially', type: 'addition' },
      { spanish: 'al final', english: 'at the end', type: 'sequence' },
    ],
    modelNarration: 'La familia García decide ir de vacaciones a la playa. Se quedan en un hotel pequeño pero bonito cerca del mar. Cada día, los niños se despiertan temprano para ir a la playa. Por la mañana, nadan en el mar y construyen castillos de arena. El agua está perfecta, ni muy fría ni muy caliente. Por la tarde, comen mariscos frescos en un restaurante junto al mar. Sobre todo, les encanta ver la puesta del sol cada noche. Los colores son increíbles: naranja, rosa y púrpura. Al final de la semana, todos están tristes de volver a casa. Pero todos dicen que son las mejores vacaciones familiares.',
    modelTranslation: 'The García family decides to go on vacation to the beach. They stay in a small but nice hotel near the sea. Every day, the kids wake up early to go to the beach. In the morning, they swim in the sea and build sandcastles. The water is perfect, not too cold and not too hot. In the afternoon, they eat fresh seafood at a restaurant by the sea. Especially, they love watching the sunset every night. The colors are incredible: orange, pink, and purple. At the end of the week, everyone is sad to return home. But everyone says they are the best family vacations.',
  },
  {
    storyId: 'story-008',
    title: 'The Magic Library',
    titleEs: 'La Biblioteca Mágica',
    briefSummary: 'Sofía discovers a magical library where books come to life when you read them.',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=500&fit=crop',
    difficulty: 'intermediate',
    plotPoints: [
      { id: 'pp1', english: 'Sofía finds an old, mysterious library', spanishHint: 'encuentra una biblioteca antigua' },
      { id: 'pp2', english: 'The librarian gives her a special book', spanishHint: 'el bibliotecario le da un libro especial' },
      { id: 'pp3', english: 'When she reads, the story comes to life around her', spanishHint: 'cuándo lee, la historia cobra vida' },
      { id: 'pp4', english: 'She visits a jungle with talking animals', spanishHint: 'visita una selva con animales que hablan' },
      { id: 'pp5', english: 'The adventure ends when she closes the book', spanishHint: 'la aventura termina cuándo cierra el libro' },
      { id: 'pp6', english: 'She returns every week for new adventures', spanishHint: 'vuelve cada semana para nuevas aventuras' },
    ],
    usefulVocabulary: [
      { spanish: 'la biblioteca', english: 'the library' },
      { spanish: 'mágico/a', english: 'magical' },
      { spanish: 'el libro', english: 'the book' },
      { spanish: 'cobrar vida', english: 'to come to life' },
      { spanish: 'la aventura', english: 'the adventure' },
      { spanish: 'la selva', english: 'the jungle' },
      { spanish: 'misterioso/a', english: 'mysterious' },
      { spanish: 'increíble', english: 'incredible' },
    ],
    sentenceStarters: [
      { spanish: 'Un día, Sofía descubre...', english: 'One day, Sofía discovers...', usage: 'Opening' },
      { spanish: 'El bibliotecario le dice...', english: 'The librarian tells her...', usage: 'Dialogue' },
      { spanish: 'Cuando empieza a leer...', english: 'When she starts reading...', usage: 'Magic begins' },
      { spanish: 'De repente, se encuentra en...', english: 'Suddenly, she finds herself in...', usage: 'Transformation' },
      { spanish: 'Desde ese día...', english: 'Since that day...', usage: 'Conclusion' },
    ],
    connectors: [
      { spanish: 'un día', english: 'one day', type: 'time' },
      { spanish: 'de repente', english: 'suddenly', type: 'sequence' },
      { spanish: 'mientras', english: 'while', type: 'time' },
      { spanish: 'sin embargo', english: 'however', type: 'contrast' },
      { spanish: 'desde entonces', english: 'since then', type: 'time' },
      { spanish: 'cada vez que', english: 'every time that', type: 'time' },
    ],
    modelNarration: 'Un día, Sofía camina por una calle antigua y descubre una biblioteca que nunca había visto antes. Es muy vieja y misteriosa. Adentro, un bibliotecario amable le da un libro especial. Le dice: "Este libro es mágico. Cuando lo leas, la historia cobrará vida." Sofía no lo cree, pero cuándo empieza a leer sobre una selva, de repente está en una selva real. Hay árboles enormes y animales que hablan. Un mono le dice "¡Bienvenida!" La aventura es increíble, pero cuándo cierra el libro, vuelve a la biblioteca. Desde ese día, Sofía va a la biblioteca cada semana para vivir nuevas aventuras.',
    modelTranslation: 'One day, Sofía walks down an old street and discovers a library she had never seen before. It\'s very old and mysterious. Inside, a kind librarian gives her a special book. He tells her: "This book is magical. When you read it, the story will come to life." Sofía doesn\'t believe it, but when she starts reading about a jungle, suddenly she\'s in a real jungle. There are enormous trees and animals that talk. A monkey says "Welcome!" The adventure is incredible, but when she closes the book, she returns to the library. Since that day, Sofía goes to the library every week to live new adventures.',
  },
];

// Helper function to get narration prompt by story ID
export function getNarrationByStoryId(storyId: string): NarrationPrompt | undefined {
  return narrationPrompts.find(n => n.storyId === storyId);
}

// Get all narration prompts grouped by difficulty
export function getNarrationsByDifficulty() {
  return {
    beginner: narrationPrompts.filter(n => n.difficulty === 'beginner'),
    intermediate: narrationPrompts.filter(n => n.difficulty === 'intermediate'),
    advanced: narrationPrompts.filter(n => n.difficulty === 'advanced'),
  };
}
