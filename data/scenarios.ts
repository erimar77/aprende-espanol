// Scenario Simulations - Immersive branching conversations

export interface ScenarioOption {
  id: string;
  spanish: string;
  english: string;
  nextNodeId: string;
  feedback?: string;
}

export interface ScenarioNode {
  id: string;
  speaker: 'them' | 'narrator';
  spanish: string;
  english: string;
  options?: ScenarioOption[];
  isEnding?: boolean;
  endingType?: 'success' | 'partial' | 'retry';
}

export interface Scenario {
  id: string;
  title: string;
  titleSpanish: string;
  description: string;
  setting: string;
  settingSpanish: string;
  difficulty: 'beginner' | 'elementary' | 'intermediate';
  icon: string;
  nodes: ScenarioNode[];
}

export const scenarios: Scenario[] = [
  // CAFE ORDERING
  {
    id: 'cafe',
    title: 'Ordering Coffee',
    titleSpanish: 'Pidiendo un café',
    description: 'Order your morning coffee at a local café',
    setting: 'A cozy café in the morning',
    settingSpanish: 'Una cafetería acogedora por la mañana',
    difficulty: 'beginner',
    icon: '☕',
    nodes: [
      {
        id: 'start',
        speaker: 'them',
        spanish: '¡Buenos días! ¿Qué le puedo servir?',
        english: 'Good morning! What can I get you?',
        options: [
          { id: 'a', spanish: 'Buenos días. Un café, por favor.', english: 'Good morning. A coffee, please.', nextNodeId: 'what-kind' },
          { id: 'b', spanish: 'Hola. Quiero un café.', english: 'Hi. I want a coffee.', nextNodeId: 'what-kind' },
          { id: 'c', spanish: '¿Tiene café?', english: 'Do you have coffee?', nextNodeId: 'yes-coffee', feedback: 'Works, but a bit unusual since it\'s a café!' },
        ],
      },
      {
        id: 'yes-coffee',
        speaker: 'them',
        spanish: 'Sí, claro. ¿Qué tipo de café quiere?',
        english: 'Yes, of course. What type of coffee do you want?',
        options: [
          { id: 'a', spanish: 'Un café con leche, por favor.', english: 'A coffee with milk, please.', nextNodeId: 'size' },
          { id: 'b', spanish: 'Un americano.', english: 'An americano.', nextNodeId: 'size' },
          { id: 'c', spanish: 'Un café negro.', english: 'A black coffee.', nextNodeId: 'size' },
        ],
      },
      {
        id: 'what-kind',
        speaker: 'them',
        spanish: '¿Qué tipo de café? ¿Con leche, americano, o negro?',
        english: 'What type of coffee? With milk, americano, or black?',
        options: [
          { id: 'a', spanish: 'Un café con leche, por favor.', english: 'A coffee with milk, please.', nextNodeId: 'size' },
          { id: 'b', spanish: 'Americano, por favor.', english: 'Americano, please.', nextNodeId: 'size' },
          { id: 'c', spanish: 'Negro está bien.', english: 'Black is fine.', nextNodeId: 'size' },
        ],
      },
      {
        id: 'size',
        speaker: 'them',
        spanish: '¿Grande o pequeño?',
        english: 'Large or small?',
        options: [
          { id: 'a', spanish: 'Grande, por favor.', english: 'Large, please.', nextNodeId: 'anything-else' },
          { id: 'b', spanish: 'Pequeño está bien.', english: 'Small is fine.', nextNodeId: 'anything-else' },
          { id: 'c', spanish: 'Mediano, si tiene.', english: 'Medium, if you have it.', nextNodeId: 'anything-else' },
        ],
      },
      {
        id: 'anything-else',
        speaker: 'them',
        spanish: '¿Algo más?',
        english: 'Anything else?',
        options: [
          { id: 'a', spanish: 'No, eso es todo. Gracias.', english: 'No, that\'s all. Thanks.', nextNodeId: 'total' },
          { id: 'b', spanish: 'Sí, un croissant también.', english: 'Yes, a croissant too.', nextNodeId: 'total-with-food' },
          { id: 'c', spanish: '¿Cuánto es?', english: 'How much is it?', nextNodeId: 'total' },
        ],
      },
      {
        id: 'total',
        speaker: 'them',
        spanish: 'Son tres euros. ¿Para llevar o para tomar aquí?',
        english: 'That\'s three euros. To go or to have here?',
        options: [
          { id: 'a', spanish: 'Para llevar, por favor.', english: 'To go, please.', nextNodeId: 'end-success' },
          { id: 'b', spanish: 'Para tomar aquí.', english: 'To have here.', nextNodeId: 'end-success' },
        ],
      },
      {
        id: 'total-with-food',
        speaker: 'them',
        spanish: 'Son cinco euros con cincuenta. ¿Para llevar o para tomar aquí?',
        english: 'That\'s five euros fifty. To go or to have here?',
        options: [
          { id: 'a', spanish: 'Para llevar, por favor.', english: 'To go, please.', nextNodeId: 'end-success' },
          { id: 'b', spanish: 'Para tomar aquí.', english: 'To have here.', nextNodeId: 'end-success' },
        ],
      },
      {
        id: 'end-success',
        speaker: 'them',
        spanish: '¡Aquí tiene! ¡Que tenga un buen día!',
        english: 'Here you go! Have a nice day!',
        isEnding: true,
        endingType: 'success',
      },
    ],
  },

  // ASKING FOR DIRECTIONS
  {
    id: 'directions',
    title: 'Asking for Directions',
    titleSpanish: 'Pidiendo direcciones',
    description: 'Find your way to the train station',
    setting: 'On a busy street in the city center',
    settingSpanish: 'En una calle concurrida en el centro de la ciudad',
    difficulty: 'beginner',
    icon: '🗺️',
    nodes: [
      {
        id: 'start',
        speaker: 'narrator',
        spanish: 'Estás perdido/a y necesitas encontrar la estación de tren. Ves a una persona amable.',
        english: 'You\'re lost and need to find the train station. You see a friendly-looking person.',
        options: [
          { id: 'a', spanish: 'Disculpe, ¿dónde está la estación de tren?', english: 'Excuse me, where is the train station?', nextNodeId: 'give-directions' },
          { id: 'b', spanish: 'Perdone, ¿puede ayudarme?', english: 'Pardon me, can you help me?', nextNodeId: 'yes-help' },
          { id: 'c', spanish: 'Hola, estoy perdido/a.', english: 'Hi, I\'m lost.', nextNodeId: 'where-to' },
        ],
      },
      {
        id: 'yes-help',
        speaker: 'them',
        spanish: 'Sí, claro. ¿Qué necesita?',
        english: 'Yes, of course. What do you need?',
        options: [
          { id: 'a', spanish: 'Busco la estación de tren.', english: 'I\'m looking for the train station.', nextNodeId: 'give-directions' },
          { id: 'b', spanish: '¿Cómo llego a la estación de tren?', english: 'How do I get to the train station?', nextNodeId: 'give-directions' },
        ],
      },
      {
        id: 'where-to',
        speaker: 'them',
        spanish: '¡Oh! ¿A dónde quiere ir?',
        english: 'Oh! Where do you want to go?',
        options: [
          { id: 'a', spanish: 'A la estación de tren, por favor.', english: 'To the train station, please.', nextNodeId: 'give-directions' },
          { id: 'b', spanish: 'Necesito encontrar la estación de tren.', english: 'I need to find the train station.', nextNodeId: 'give-directions' },
        ],
      },
      {
        id: 'give-directions',
        speaker: 'them',
        spanish: 'Ah, sí. Siga todo recto por esta calle, luego gire a la izquierda en el semáforo. Está a unos cinco minutos.',
        english: 'Ah, yes. Go straight down this street, then turn left at the traffic light. It\'s about five minutes away.',
        options: [
          { id: 'a', spanish: '¿Todo recto y luego a la izquierda?', english: 'Straight and then left?', nextNodeId: 'confirm' },
          { id: 'b', spanish: 'Muchas gracias.', english: 'Thank you very much.', nextNodeId: 'end-success' },
          { id: 'c', spanish: '¿Puede repetir, por favor? Más despacio.', english: 'Can you repeat, please? Slower.', nextNodeId: 'repeat-directions' },
        ],
      },
      {
        id: 'repeat-directions',
        speaker: 'them',
        spanish: 'Claro. Primero... recto... por esta calle. Después... a la izquierda... en el semáforo.',
        english: 'Sure. First... straight... down this street. Then... left... at the traffic light.',
        options: [
          { id: 'a', spanish: 'Entiendo. Muchas gracias.', english: 'I understand. Thank you very much.', nextNodeId: 'end-success' },
          { id: 'b', spanish: '¿A la izquierda en el semáforo?', english: 'Left at the traffic light?', nextNodeId: 'confirm' },
        ],
      },
      {
        id: 'confirm',
        speaker: 'them',
        spanish: '¡Exacto! Recto y luego a la izquierda. No tiene pérdida.',
        english: 'Exactly! Straight and then left. You can\'t miss it.',
        options: [
          { id: 'a', spanish: '¡Perfecto! Muchas gracias por su ayuda.', english: 'Perfect! Thank you very much for your help.', nextNodeId: 'end-success' },
          { id: 'b', spanish: '¡Gracias! ¡Hasta luego!', english: 'Thanks! Bye!', nextNodeId: 'end-success' },
        ],
      },
      {
        id: 'end-success',
        speaker: 'them',
        spanish: '¡De nada! ¡Buen viaje!',
        english: 'You\'re welcome! Have a good trip!',
        isEnding: true,
        endingType: 'success',
      },
    ],
  },

  // RESTAURANT
  {
    id: 'restaurant',
    title: 'At a Restaurant',
    titleSpanish: 'En un restaurante',
    description: 'Order food and handle a small issue with your order',
    setting: 'A casual restaurant at lunch time',
    settingSpanish: 'Un restaurante informal a la hora del almuerzo',
    difficulty: 'elementary',
    icon: '🍽️',
    nodes: [
      {
        id: 'start',
        speaker: 'them',
        spanish: '¡Buenas tardes! ¿Mesa para cuántos?',
        english: 'Good afternoon! Table for how many?',
        options: [
          { id: 'a', spanish: 'Para uno, por favor.', english: 'For one, please.', nextNodeId: 'seat' },
          { id: 'b', spanish: 'Solo para mí.', english: 'Just for me.', nextNodeId: 'seat' },
          { id: 'c', spanish: 'Para dos personas.', english: 'For two people.', nextNodeId: 'seat' },
        ],
      },
      {
        id: 'seat',
        speaker: 'them',
        spanish: 'Por aquí, por favor. Aquí tiene el menú. ¿Quiere algo de beber mientras decide?',
        english: 'This way, please. Here\'s the menu. Would you like something to drink while you decide?',
        options: [
          { id: 'a', spanish: 'Sí, una agua con gas, por favor.', english: 'Yes, a sparkling water, please.', nextNodeId: 'bring-water' },
          { id: 'b', spanish: 'Un refresco, por favor.', english: 'A soda, please.', nextNodeId: 'bring-water' },
          { id: 'c', spanish: 'No, gracias. Voy a ver el menú primero.', english: 'No, thanks. I\'ll look at the menu first.', nextNodeId: 'ready-order' },
        ],
      },
      {
        id: 'bring-water',
        speaker: 'them',
        spanish: 'Aquí tiene. ¿Ya sabe qué quiere pedir?',
        english: 'Here you go. Do you know what you\'d like to order?',
        options: [
          { id: 'a', spanish: 'Sí, quiero la paella, por favor.', english: 'Yes, I\'d like the paella, please.', nextNodeId: 'good-choice' },
          { id: 'b', spanish: '¿Qué me recomienda?', english: 'What do you recommend?', nextNodeId: 'recommend' },
          { id: 'c', spanish: 'Necesito un momento más.', english: 'I need another moment.', nextNodeId: 'ready-order' },
        ],
      },
      {
        id: 'ready-order',
        speaker: 'narrator',
        spanish: 'Después de unos minutos, el mesero regresa.',
        english: 'After a few minutes, the waiter returns.',
        options: [
          { id: 'a', spanish: '(Esperar)', english: '(Wait)', nextNodeId: 'waiter-returns' },
        ],
      },
      {
        id: 'waiter-returns',
        speaker: 'them',
        spanish: '¿Listo para pedir?',
        english: 'Ready to order?',
        options: [
          { id: 'a', spanish: 'Sí, quiero el pollo con arroz.', english: 'Yes, I\'d like the chicken with rice.', nextNodeId: 'good-choice' },
          { id: 'b', spanish: 'Me gustaría las tapas variadas.', english: 'I\'d like the assorted tapas.', nextNodeId: 'good-choice' },
          { id: 'c', spanish: '¿Tienen opciones vegetarianas?', english: 'Do you have vegetarian options?', nextNodeId: 'vegetarian' },
        ],
      },
      {
        id: 'recommend',
        speaker: 'them',
        spanish: 'La paella está muy buena hoy. También tenemos un especial de pescado.',
        english: 'The paella is very good today. We also have a fish special.',
        options: [
          { id: 'a', spanish: 'Perfecto, la paella entonces.', english: 'Perfect, the paella then.', nextNodeId: 'good-choice' },
          { id: 'b', spanish: '¿Cómo es el pescado?', english: 'What\'s the fish like?', nextNodeId: 'fish-desc' },
        ],
      },
      {
        id: 'fish-desc',
        speaker: 'them',
        spanish: 'Es lubina a la plancha con verduras. Muy fresco.',
        english: 'It\'s grilled sea bass with vegetables. Very fresh.',
        options: [
          { id: 'a', spanish: 'Suena bien. El pescado, por favor.', english: 'Sounds good. The fish, please.', nextNodeId: 'good-choice' },
          { id: 'b', spanish: 'Prefiero la paella.', english: 'I prefer the paella.', nextNodeId: 'good-choice' },
        ],
      },
      {
        id: 'vegetarian',
        speaker: 'them',
        spanish: 'Sí, tenemos ensalada mediterránea y tortilla española sin carne.',
        english: 'Yes, we have Mediterranean salad and Spanish omelette without meat.',
        options: [
          { id: 'a', spanish: 'La tortilla española, por favor.', english: 'The Spanish omelette, please.', nextNodeId: 'good-choice' },
          { id: 'b', spanish: 'Una ensalada y la tortilla para compartir.', english: 'A salad and the omelette to share.', nextNodeId: 'good-choice' },
        ],
      },
      {
        id: 'good-choice',
        speaker: 'them',
        spanish: '¡Buena elección! En unos minutos.',
        english: 'Good choice! In a few minutes.',
        options: [
          { id: 'a', spanish: 'Gracias.', english: 'Thanks.', nextNodeId: 'food-arrives' },
        ],
      },
      {
        id: 'food-arrives',
        speaker: 'narrator',
        spanish: 'La comida llega, pero hay un pequeño problema...',
        english: 'The food arrives, but there\'s a small problem...',
        options: [
          { id: 'a', spanish: '(Mirar la comida)', english: '(Look at the food)', nextNodeId: 'wrong-order' },
        ],
      },
      {
        id: 'wrong-order',
        speaker: 'them',
        spanish: 'Aquí tiene. ¡Buen provecho!',
        english: 'Here you go. Enjoy!',
        options: [
          { id: 'a', spanish: 'Disculpe, esto no es lo que pedí.', english: 'Excuse me, this isn\'t what I ordered.', nextNodeId: 'apologize' },
          { id: 'b', spanish: 'Perdone, yo pedí el pollo, no la carne.', english: 'Sorry, I ordered chicken, not beef.', nextNodeId: 'apologize' },
          { id: 'c', spanish: '(Aceptar la comida equivocada)', english: '(Accept the wrong food)', nextNodeId: 'end-partial', feedback: 'It\'s okay to speak up politely!' },
        ],
      },
      {
        id: 'apologize',
        speaker: 'them',
        spanish: '¡Ay, perdón! Tiene razón. Le traigo lo correcto enseguida.',
        english: 'Oh, sorry! You\'re right. I\'ll bring you the correct one right away.',
        options: [
          { id: 'a', spanish: 'No hay problema. Gracias.', english: 'No problem. Thanks.', nextNodeId: 'correct-food' },
          { id: 'b', spanish: 'Está bien, no se preocupe.', english: 'It\'s okay, don\'t worry.', nextNodeId: 'correct-food' },
        ],
      },
      {
        id: 'correct-food',
        speaker: 'them',
        spanish: 'Aquí está. Lo siento mucho por el error. Disfrute.',
        english: 'Here it is. I\'m very sorry for the mistake. Enjoy.',
        options: [
          { id: 'a', spanish: '¡Gracias! Se ve delicioso.', english: 'Thanks! It looks delicious.', nextNodeId: 'end-success' },
        ],
      },
      {
        id: 'end-success',
        speaker: 'narrator',
        spanish: '¡Muy bien! Manejaste la situación perfectamente con cortesía.',
        english: 'Very good! You handled the situation perfectly and politely.',
        isEnding: true,
        endingType: 'success',
      },
      {
        id: 'end-partial',
        speaker: 'narrator',
        spanish: 'La comida estaba bien, pero no era lo que querías. ¡No tengas miedo de hablar educadamente!',
        english: 'The food was fine, but it wasn\'t what you wanted. Don\'t be afraid to speak up politely!',
        isEnding: true,
        endingType: 'partial',
      },
    ],
  },

  // SHOPPING FOR CLOTHES
  {
    id: 'shopping',
    title: 'Clothes Shopping',
    titleSpanish: 'Comprando ropa',
    description: 'Find the right size and make a purchase',
    setting: 'A clothing store in a shopping area',
    settingSpanish: 'Una tienda de ropa en una zona comercial',
    difficulty: 'elementary',
    icon: '👕',
    nodes: [
      {
        id: 'start',
        speaker: 'them',
        spanish: '¡Hola! ¿En qué le puedo ayudar?',
        english: 'Hi! How can I help you?',
        options: [
          { id: 'a', spanish: 'Solo estoy mirando, gracias.', english: 'Just looking, thanks.', nextNodeId: 'browse' },
          { id: 'b', spanish: 'Busco una camisa.', english: 'I\'m looking for a shirt.', nextNodeId: 'what-kind' },
          { id: 'c', spanish: '¿Tienen esta camisa en talla mediana?', english: 'Do you have this shirt in medium?', nextNodeId: 'check-size' },
        ],
      },
      {
        id: 'browse',
        speaker: 'narrator',
        spanish: 'Miras la ropa y encuentras una camisa que te gusta.',
        english: 'You look around and find a shirt you like.',
        options: [
          { id: 'a', spanish: 'Disculpe, ¿tiene esta en otra talla?', english: 'Excuse me, do you have this in another size?', nextNodeId: 'what-size' },
        ],
      },
      {
        id: 'what-kind',
        speaker: 'them',
        spanish: '¿Qué tipo de camisa? ¿Formal o casual?',
        english: 'What type of shirt? Formal or casual?',
        options: [
          { id: 'a', spanish: 'Casual, por favor.', english: 'Casual, please.', nextNodeId: 'show-options' },
          { id: 'b', spanish: 'Algo formal para el trabajo.', english: 'Something formal for work.', nextNodeId: 'show-options' },
        ],
      },
      {
        id: 'show-options',
        speaker: 'them',
        spanish: 'Tenemos estas opciones. ¿De qué color prefiere?',
        english: 'We have these options. What color do you prefer?',
        options: [
          { id: 'a', spanish: '¿Tiene azul?', english: 'Do you have blue?', nextNodeId: 'yes-blue' },
          { id: 'b', spanish: 'Me gusta esta blanca.', english: 'I like this white one.', nextNodeId: 'what-size' },
          { id: 'c', spanish: '¿Cuál me recomienda?', english: 'Which do you recommend?', nextNodeId: 'recommend-color' },
        ],
      },
      {
        id: 'yes-blue',
        speaker: 'them',
        spanish: 'Sí, aquí está en azul. Es muy popular.',
        english: 'Yes, here it is in blue. It\'s very popular.',
        options: [
          { id: 'a', spanish: 'Me gusta. ¿La puedo probar?', english: 'I like it. Can I try it on?', nextNodeId: 'what-size' },
          { id: 'b', spanish: '¿Cuánto cuesta?', english: 'How much does it cost?', nextNodeId: 'price' },
        ],
      },
      {
        id: 'recommend-color',
        speaker: 'them',
        spanish: 'El azul marino es muy elegante y combina con todo.',
        english: 'Navy blue is very elegant and goes with everything.',
        options: [
          { id: 'a', spanish: 'Perfecto, me llevo esa.', english: 'Perfect, I\'ll take that one.', nextNodeId: 'what-size' },
          { id: 'b', spanish: 'Déjeme verla.', english: 'Let me see it.', nextNodeId: 'what-size' },
        ],
      },
      {
        id: 'what-size',
        speaker: 'them',
        spanish: '¿Qué talla usa?',
        english: 'What size do you wear?',
        options: [
          { id: 'a', spanish: 'Mediana, por favor.', english: 'Medium, please.', nextNodeId: 'check-size' },
          { id: 'b', spanish: 'No estoy seguro/a. ¿Me puedo probar la mediana?', english: 'I\'m not sure. Can I try the medium?', nextNodeId: 'fitting-room' },
          { id: 'c', spanish: 'Grande.', english: 'Large.', nextNodeId: 'check-size' },
        ],
      },
      {
        id: 'check-size',
        speaker: 'them',
        spanish: 'Déjeme ver... Sí, tenemos esa talla. Los probadores están al fondo a la derecha.',
        english: 'Let me see... Yes, we have that size. The fitting rooms are in the back on the right.',
        options: [
          { id: 'a', spanish: 'Gracias. Voy a probármela.', english: 'Thanks. I\'ll try it on.', nextNodeId: 'fitting-room' },
          { id: 'b', spanish: '¿Cuánto cuesta?', english: 'How much does it cost?', nextNodeId: 'price' },
        ],
      },
      {
        id: 'fitting-room',
        speaker: 'narrator',
        spanish: 'Te pruebas la camisa. Te queda bien.',
        english: 'You try on the shirt. It fits well.',
        options: [
          { id: 'a', spanish: 'Me queda bien. Me la llevo.', english: 'It fits well. I\'ll take it.', nextNodeId: 'price' },
          { id: 'b', spanish: '¿Tiene una talla más pequeña?', english: 'Do you have a smaller size?', nextNodeId: 'check-smaller' },
        ],
      },
      {
        id: 'check-smaller',
        speaker: 'them',
        spanish: 'Sí, aquí tiene la pequeña.',
        english: 'Yes, here\'s the small.',
        options: [
          { id: 'a', spanish: 'Perfecto, me la llevo.', english: 'Perfect, I\'ll take it.', nextNodeId: 'price' },
        ],
      },
      {
        id: 'price',
        speaker: 'them',
        spanish: 'Son veinticinco euros. ¿Efectivo o tarjeta?',
        english: 'That\'s twenty-five euros. Cash or card?',
        options: [
          { id: 'a', spanish: 'Tarjeta, por favor.', english: 'Card, please.', nextNodeId: 'end-success' },
          { id: 'b', spanish: 'En efectivo.', english: 'Cash.', nextNodeId: 'end-success' },
          { id: 'c', spanish: '¿Tienen algún descuento?', english: 'Do you have any discount?', nextNodeId: 'discount' },
        ],
      },
      {
        id: 'discount',
        speaker: 'them',
        spanish: 'Esta semana tenemos un 10% de descuento. Serían veintidós cincuenta.',
        english: 'This week we have a 10% discount. That would be twenty-two fifty.',
        options: [
          { id: 'a', spanish: '¡Perfecto! Con tarjeta, por favor.', english: 'Perfect! Card, please.', nextNodeId: 'end-success' },
          { id: 'b', spanish: '¡Qué bien! Aquí tiene.', english: 'Great! Here you go.', nextNodeId: 'end-success' },
        ],
      },
      {
        id: 'end-success',
        speaker: 'them',
        spanish: '¡Gracias por su compra! ¡Que tenga un buen día!',
        english: 'Thank you for your purchase! Have a nice day!',
        isEnding: true,
        endingType: 'success',
      },
    ],
  },

  // MAKING PLANS WITH A FRIEND
  {
    id: 'making-plans',
    title: 'Making Plans',
    titleSpanish: 'Haciendo planes',
    description: 'Plan an outing with a friend',
    setting: 'Chatting with a friend',
    settingSpanish: 'Hablando con un amigo',
    difficulty: 'intermediate',
    icon: '📅',
    nodes: [
      {
        id: 'start',
        speaker: 'them',
        spanish: '¡Hola! ¿Qué tal? ¿Tienes planes para el fin de semana?',
        english: 'Hi! How are you? Do you have plans for the weekend?',
        options: [
          { id: 'a', spanish: '¡Hola! Bien, gracias. Todavía no tengo planes. ¿Y tú?', english: 'Hi! Good, thanks. I don\'t have plans yet. And you?', nextNodeId: 'suggest' },
          { id: 'b', spanish: 'No, nada. ¿Quieres hacer algo?', english: 'No, nothing. Do you want to do something?', nextNodeId: 'suggest' },
          { id: 'c', spanish: 'Creo que voy a descansar. ¿Por qué?', english: 'I think I\'m going to rest. Why?', nextNodeId: 'convince' },
        ],
      },
      {
        id: 'suggest',
        speaker: 'them',
        spanish: '¡Estaba pensando que podríamos ir al cine o a cenar! ¿Qué te parece?',
        english: 'I was thinking we could go to the movies or to dinner! What do you think?',
        options: [
          { id: 'a', spanish: '¡Me encanta la idea del cine! ¿Qué película quieres ver?', english: 'I love the movie idea! What movie do you want to see?', nextNodeId: 'movie-choice' },
          { id: 'b', spanish: 'Prefiero cenar. ¿Conoces un buen restaurante?', english: 'I prefer dinner. Do you know a good restaurant?', nextNodeId: 'restaurant-choice' },
          { id: 'c', spanish: '¿Por qué no hacemos las dos cosas?', english: 'Why don\'t we do both?', nextNodeId: 'both' },
        ],
      },
      {
        id: 'convince',
        speaker: 'them',
        spanish: '¡Venga, no seas aburrido/a! Hace tiempo que no salimos. Te prometo que será divertido.',
        english: 'Come on, don\'t be boring! It\'s been a while since we went out. I promise it\'ll be fun.',
        options: [
          { id: 'a', spanish: 'Tienes razón. ¿Qué tienes en mente?', english: 'You\'re right. What do you have in mind?', nextNodeId: 'suggest' },
          { id: 'b', spanish: 'Está bien, me convenciste. ¿Qué hacemos?', english: 'Okay, you convinced me. What should we do?', nextNodeId: 'suggest' },
        ],
      },
      {
        id: 'movie-choice',
        speaker: 'them',
        spanish: 'Hay una película nueva de acción que se ve muy buena. O si prefieres, hay una comedia también.',
        english: 'There\'s a new action movie that looks really good. Or if you prefer, there\'s a comedy too.',
        options: [
          { id: 'a', spanish: 'La de acción suena bien. ¿A qué hora es?', english: 'The action one sounds good. What time is it?', nextNodeId: 'movie-time' },
          { id: 'b', spanish: 'Prefiero la comedia. Necesito reírme.', english: 'I prefer the comedy. I need to laugh.', nextNodeId: 'movie-time' },
          { id: 'c', spanish: '¿Cuál te gusta más a ti?', english: 'Which one do you like more?', nextNodeId: 'friend-preference' },
        ],
      },
      {
        id: 'friend-preference',
        speaker: 'them',
        spanish: 'A mí me gustan las dos, pero creo que la de acción sería más emocionante en el cine.',
        english: 'I like both, but I think the action one would be more exciting in the theater.',
        options: [
          { id: 'a', spanish: 'Perfecto, vamos a ver esa entonces.', english: 'Perfect, let\'s see that one then.', nextNodeId: 'movie-time' },
        ],
      },
      {
        id: 'movie-time',
        speaker: 'them',
        spanish: 'Hay funciones a las 5, a las 7, y a las 9. ¿Cuál prefieres?',
        english: 'There are showings at 5, 7, and 9. Which do you prefer?',
        options: [
          { id: 'a', spanish: 'La de las 7 está bien. Así podemos cenar después.', english: 'The 7 o\'clock one is good. That way we can have dinner after.', nextNodeId: 'dinner-after' },
          { id: 'b', spanish: '¿Qué tal la de las 5? Así terminamos temprano.', english: 'How about the 5 o\'clock one? That way we finish early.', nextNodeId: 'agree-time' },
        ],
      },
      {
        id: 'dinner-after',
        speaker: 'them',
        spanish: '¡Buena idea! Conozco un lugar cerca del cine que tiene muy buenas tapas.',
        english: 'Good idea! I know a place near the theater that has very good tapas.',
        options: [
          { id: 'a', spanish: '¡Perfecto! ¿Nos vemos a las 6:30 en el cine?', english: 'Perfect! Shall we meet at 6:30 at the theater?', nextNodeId: 'confirm-plans' },
          { id: 'b', spanish: 'Me encanta la idea. ¿Dónde nos encontramos?', english: 'I love the idea. Where should we meet?', nextNodeId: 'where-meet' },
        ],
      },
      {
        id: 'restaurant-choice',
        speaker: 'them',
        spanish: '¡Sí! Hay un restaurante nuevo de comida mexicana que quiero probar. ¿Te gusta la comida mexicana?',
        english: 'Yes! There\'s a new Mexican food restaurant I want to try. Do you like Mexican food?',
        options: [
          { id: 'a', spanish: '¡Me encanta! ¿A qué hora quedamos?', english: 'I love it! What time should we meet?', nextNodeId: 'dinner-time' },
          { id: 'b', spanish: 'Sí, me gusta. ¿Necesitamos reservación?', english: 'Yes, I like it. Do we need a reservation?', nextNodeId: 'reservation' },
        ],
      },
      {
        id: 'reservation',
        speaker: 'them',
        spanish: 'Buena pregunta. Déjame ver... Sí, mejor reservo para estar seguros. ¿A las 8 te parece bien?',
        english: 'Good question. Let me check... Yes, I\'d better make a reservation to be safe. Does 8 work for you?',
        options: [
          { id: 'a', spanish: 'Sí, a las 8 está perfecto.', english: 'Yes, 8 is perfect.', nextNodeId: 'confirm-plans' },
          { id: 'b', spanish: '¿Puede ser un poco más tarde? ¿A las 8:30?', english: 'Could it be a little later? 8:30?', nextNodeId: 'later-time' },
        ],
      },
      {
        id: 'later-time',
        speaker: 'them',
        spanish: 'Claro, a las 8:30 también funciona. ¡Reservo para las 8:30 entonces!',
        english: 'Sure, 8:30 also works. I\'ll reserve for 8:30 then!',
        options: [
          { id: 'a', spanish: '¡Genial! ¡Qué ganas!', english: 'Great! I can\'t wait!', nextNodeId: 'confirm-plans' },
        ],
      },
      {
        id: 'both',
        speaker: 'them',
        spanish: '¡Buena idea! Podemos cenar primero y después ir al cine. ¿Qué te parece a las 6 para cenar?',
        english: 'Good idea! We can have dinner first and then go to the movies. How about 6 for dinner?',
        options: [
          { id: 'a', spanish: 'Perfecto. ¿Dónde nos vemos?', english: 'Perfect. Where should we meet?', nextNodeId: 'where-meet' },
          { id: 'b', spanish: 'Me parece bien. ¿Ya sabes qué película?', english: 'Sounds good. Do you know what movie?', nextNodeId: 'movie-choice' },
        ],
      },
      {
        id: 'dinner-time',
        speaker: 'them',
        spanish: '¿Qué te parece a las 8? ¿O prefieres más temprano?',
        english: 'How about 8? Or do you prefer earlier?',
        options: [
          { id: 'a', spanish: 'Las 8 está bien para mí.', english: '8 is good for me.', nextNodeId: 'where-meet' },
          { id: 'b', spanish: 'Un poco más temprano estaría mejor, ¿a las 7:30?', english: 'A little earlier would be better, 7:30?', nextNodeId: 'where-meet' },
        ],
      },
      {
        id: 'agree-time',
        speaker: 'them',
        spanish: '¡Perfecto! ¿Nos vemos en el cine o quieres que pase por ti?',
        english: 'Perfect! Shall we meet at the theater or do you want me to pick you up?',
        options: [
          { id: 'a', spanish: 'Nos vemos allá, gracias.', english: 'Let\'s meet there, thanks.', nextNodeId: 'confirm-plans' },
          { id: 'b', spanish: 'Si puedes pasar por mí, te lo agradecería.', english: 'If you can pick me up, I\'d appreciate it.', nextNodeId: 'pickup' },
        ],
      },
      {
        id: 'pickup',
        speaker: 'them',
        spanish: '¡Claro! Paso por ti a las 4:30 entonces.',
        english: 'Sure! I\'ll pick you up at 4:30 then.',
        options: [
          { id: 'a', spanish: '¡Perfecto! ¡Nos vemos el sábado!', english: 'Perfect! See you Saturday!', nextNodeId: 'end-success' },
        ],
      },
      {
        id: 'where-meet',
        speaker: 'them',
        spanish: '¿Nos vemos en la entrada del centro comercial? Está cerca del restaurante y del cine.',
        english: 'Shall we meet at the entrance of the mall? It\'s close to the restaurant and the theater.',
        options: [
          { id: 'a', spanish: '¡Perfecto! ¡Ahí nos vemos!', english: 'Perfect! See you there!', nextNodeId: 'confirm-plans' },
          { id: 'b', spanish: 'Mejor en el restaurante directamente.', english: 'Better at the restaurant directly.', nextNodeId: 'confirm-plans' },
        ],
      },
      {
        id: 'confirm-plans',
        speaker: 'them',
        spanish: '¡Genial! Entonces quedamos así. ¡Qué ganas! ¡Nos vemos el sábado!',
        english: 'Great! So we\'re set. I can\'t wait! See you Saturday!',
        options: [
          { id: 'a', spanish: '¡Sí! ¡Hasta el sábado! ¡Cuídate!', english: 'Yes! Until Saturday! Take care!', nextNodeId: 'end-success' },
          { id: 'b', spanish: '¡Perfecto! Te escribo el sábado. ¡Hasta luego!', english: 'Perfect! I\'ll text you Saturday. See you!', nextNodeId: 'end-success' },
        ],
      },
      {
        id: 'end-success',
        speaker: 'them',
        spanish: '¡Hasta luego! 👋',
        english: 'See you later! 👋',
        isEnding: true,
        endingType: 'success',
      },
    ],
  },
];

export const scenarioCategories = [
  { difficulty: 'beginner', label: 'Beginner', color: 'bg-green-500' },
  { difficulty: 'elementary', label: 'Elementary', color: 'bg-yellow-500' },
  { difficulty: 'intermediate', label: 'Intermediate', color: 'bg-orange-500' },
];
