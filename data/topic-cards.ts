// Topic Cards & "What Would You Say?" Scenarios
// Designed for real conversations with family: girlfriend, her elderly mother, brothers

export interface TopicCard {
  id: string;
  category: 'everyday' | 'opinions' | 'family' | 'social';
  title: string;
  titleSpanish: string;
  /** Context: who you'd talk about this with */
  context: string;
  level: 'A1' | 'A2' | 'B1';
  /** Progressive scaffolding tiers */
  scaffolding: {
    /** Tier 1: Heavy — sentence starters + key vocab provided */
    heavy: {
      starters: { spanish: string; english: string }[];
      keyPhrases: { spanish: string; english: string }[];
      modelResponse: string;
      modelTranslation: string;
    };
    /** Tier 2: Medium — just hints, try on your own first */
    medium: {
      hints: string[];
      modelResponse: string;
      modelTranslation: string;
    };
    /** Tier 3: Freeform — just the prompt, no help */
    freeform: {
      prompt: string;
      promptSpanish: string;
      sampleResponse: string;
      sampleTranslation: string;
    };
  };
}

export interface WhatWouldYouSay {
  id: string;
  category: 'react' | 'respond' | 'initiate' | 'smalltalk';
  /** Who said something to you */
  speaker: string;
  /** The social context */
  situation: string;
  /** What they said (in Spanish) */
  theySaid: string;
  theySaidTranslation: string;
  level: 'A1' | 'A2' | 'B1';
  scaffolding: {
    heavy: {
      responseStarters: { spanish: string; english: string }[];
      keyVocab: { spanish: string; english: string }[];
      modelResponses: { spanish: string; english: string }[];
    };
    medium: {
      hints: string[];
      modelResponses: { spanish: string; english: string }[];
    };
    freeform: {
      modelResponses: { spanish: string; english: string }[];
    };
  };
}

// ═══════════════════════════════════════════════════════════════════════
// TOPIC CARDS
// ═══════════════════════════════════════════════════════════════════════

export const topicCards: TopicCard[] = [
  // ── EVERYDAY LIFE ──────────────────────────────────────────────────
  {
    id: 'tc001',
    category: 'everyday',
    title: 'What did you do this weekend?',
    titleSpanish: '¿Qué hiciste este fin de semana?',
    context: 'Monday chat with your girlfriend or her brothers',
    level: 'A2',
    scaffolding: {
      heavy: {
        starters: [
          { spanish: 'Este fin de semana yo...', english: 'This weekend I...' },
          { spanish: 'El sábado por la mañana...', english: 'Saturday morning...' },
          { spanish: 'Después, nosotros...', english: 'After that, we...' },
        ],
        keyPhrases: [
          { spanish: 'descansar', english: 'to rest' },
          { spanish: 'cocinar juntos', english: 'to cook together' },
          { spanish: 'salir a caminar', english: 'to go for a walk' },
          { spanish: 'ver una película', english: 'to watch a movie' },
          { spanish: 'limpiar la casa', english: 'to clean the house' },
          { spanish: 'ir al supermercado', english: 'to go to the supermarket' },
        ],
        modelResponse: 'Este fin de semana descansé mucho. El sábado por la mañana fui al supermercado y después cociné con mi novia. El domingo salimos a caminar por el parque.',
        modelTranslation: 'This weekend I rested a lot. Saturday morning I went to the supermarket and then I cooked with my girlfriend. Sunday we went for a walk in the park.',
      },
      medium: {
        hints: ['Use preterite tense (past)', 'Mention at least 2-3 activities', 'Connect with después, luego, también'],
        modelResponse: 'El sábado no hice mucho — limpié un poco y vi televisión. Pero el domingo fue mejor, salimos a comer y caminamos por el centro.',
        modelTranslation: "Saturday I didn't do much — I cleaned a bit and watched TV. But Sunday was better, we went out to eat and walked around downtown.",
      },
      freeform: {
        prompt: 'Tell someone about your weekend — what you did, who you were with, whether you enjoyed it.',
        promptSpanish: 'Cuéntale a alguien sobre tu fin de semana.',
        sampleResponse: 'Fue un fin de semana tranquilo. Necesitaba descansar porque la semana fue larga. Cocinamos algo rico el sábado y el domingo no hicimos nada especial, solo estar juntos en casa.',
        sampleTranslation: "It was a quiet weekend. I needed to rest because the week was long. We cooked something nice on Saturday and Sunday we didn't do anything special, just being together at home.",
      },
    },
  },
  {
    id: 'tc002',
    category: 'everyday',
    title: 'How was your day at work?',
    titleSpanish: '¿Cómo te fue en el trabajo?',
    context: 'Evening conversation with your girlfriend',
    level: 'A2',
    scaffolding: {
      heavy: {
        starters: [
          { spanish: 'Hoy en el trabajo...', english: 'Today at work...' },
          { spanish: 'Fue un día...', english: 'It was a ... day' },
          { spanish: 'Estoy cansado porque...', english: "I'm tired because..." },
        ],
        keyPhrases: [
          { spanish: 'una reunión larga', english: 'a long meeting' },
          { spanish: 'mucho trabajo', english: 'a lot of work' },
          { spanish: 'un día tranquilo', english: 'a quiet day' },
          { spanish: 'un problema con...', english: 'a problem with...' },
          { spanish: 'terminé un proyecto', english: 'I finished a project' },
          { spanish: 'estoy estresado', english: "I'm stressed" },
        ],
        modelResponse: 'Hoy fue un día largo. Tuve tres reuniones y mucho trabajo. Estoy cansado pero al menos terminé el proyecto importante.',
        modelTranslation: "Today was a long day. I had three meetings and a lot of work. I'm tired but at least I finished the important project.",
      },
      medium: {
        hints: ['Describe the mood of the day', 'Mention one specific thing that happened', 'Say how you feel now'],
        modelResponse: 'Fue un día normal, nada especial. Tuve una reunión aburrida por la mañana pero después trabajé tranquilo. Ya quiero descansar.',
        modelTranslation: 'It was a normal day, nothing special. I had a boring meeting in the morning but after that I worked peacefully. I just want to rest now.',
      },
      freeform: {
        prompt: 'Your girlfriend asks how work was. Give a natural, honest answer.',
        promptSpanish: 'Tu novia pregunta cómo te fue en el trabajo.',
        sampleResponse: 'Bien, más o menos. Hubo un problema con un cliente pero lo resolvimos. Lo bueno es que mañana es viernes.',
        sampleTranslation: "Good, more or less. There was a problem with a client but we resolved it. The good thing is tomorrow is Friday.",
      },
    },
  },
  {
    id: 'tc003',
    category: 'everyday',
    title: "What are you doing later / this week?",
    titleSpanish: '¿Qué vas a hacer después / esta semana?',
    context: 'Making plans with girlfriend or her brothers',
    level: 'A1',
    scaffolding: {
      heavy: {
        starters: [
          { spanish: 'Voy a...', english: "I'm going to..." },
          { spanish: 'Esta semana quiero...', english: 'This week I want to...' },
          { spanish: 'El viernes pensamos...', english: 'On Friday we plan to...' },
        ],
        keyPhrases: [
          { spanish: 'ir al gimnasio', english: 'go to the gym' },
          { spanish: 'cenar afuera', english: 'eat dinner out' },
          { spanish: 'visitar a mi familia', english: 'visit my family' },
          { spanish: 'no tengo planes', english: "I don't have plans" },
          { spanish: 'depende del clima', english: 'depends on the weather' },
          { spanish: 'todavía no sé', english: "I don't know yet" },
        ],
        modelResponse: 'Esta noche voy a descansar en casa. Mañana quiero ir al gimnasio y el viernes vamos a cenar afuera con unos amigos.',
        modelTranslation: "Tonight I'm going to rest at home. Tomorrow I want to go to the gym and Friday we're going to eat dinner out with some friends.",
      },
      medium: {
        hints: ['Use "ir a + infinitive" for future plans', 'Mention timeframes (tonight, tomorrow, this week)', 'Express certainty or uncertainty'],
        modelResponse: 'No estoy seguro todavía. Quiero hacer algo el sábado pero depende de cómo me sienta. Tal vez podemos ir al cine.',
        modelTranslation: "I'm not sure yet. I want to do something Saturday but it depends on how I feel. Maybe we can go to the movies.",
      },
      freeform: {
        prompt: "Someone asks what you're up to this week. Share your plans or lack thereof.",
        promptSpanish: 'Alguien pregunta qué vas a hacer esta semana.',
        sampleResponse: 'Honestamente, no tengo muchos planes. Trabajo toda la semana y el fin de semana quiero descansar. Pero si quieres hacer algo, avísame.',
        sampleTranslation: "Honestly, I don't have many plans. I work all week and this weekend I want to rest. But if you want to do something, let me know.",
      },
    },
  },
  {
    id: 'tc004',
    category: 'everyday',
    title: 'Talking about food / what to eat',
    titleSpanish: 'Hablando de comida / qué comer',
    context: "At girlfriend's mother's house or deciding dinner plans",
    level: 'A1',
    scaffolding: {
      heavy: {
        starters: [
          { spanish: 'Me gustaría comer...', english: 'I would like to eat...' },
          { spanish: '¿Qué te parece si...?', english: 'What do you think if...?' },
          { spanish: 'Esto está muy rico.', english: 'This is really delicious.' },
        ],
        keyPhrases: [
          { spanish: '¡Qué rico!', english: 'How delicious!' },
          { spanish: 'Tengo hambre', english: "I'm hungry" },
          { spanish: 'No tengo mucha hambre', english: "I'm not very hungry" },
          { spanish: '¿Quieres que cocine?', english: 'Do you want me to cook?' },
          { spanish: 'Me encanta tu comida', english: 'I love your food/cooking' },
          { spanish: '¿Me pasas la sal?', english: 'Can you pass me the salt?' },
        ],
        modelResponse: '¡Esto está delicioso! Me encanta cómo cocina. Siempre me gusta cuando venimos a comer aquí. ¿Me puede servir un poco más?',
        modelTranslation: "This is delicious! I love how she cooks. I always enjoy when we come to eat here. Can she serve me a little more?",
      },
      medium: {
        hints: ['Compliment the food genuinely', 'Ask about ingredients or recipe', 'Offer to help'],
        modelResponse: '¿Qué lleva este platillo? Está muy sabroso. Me gustaría aprender a hacerlo. ¿Me puede enseñar algún día?',
        modelTranslation: "What's in this dish? It's very tasty. I'd like to learn how to make it. Can you teach me someday?",
      },
      freeform: {
        prompt: "You're at her mother's table. The food is great. Make conversation about it.",
        promptSpanish: 'Estás en la mesa de su mamá. La comida está rica. Haz conversación.',
        sampleResponse: 'Señora, esto está increíble. Cada vez que vengo, cocina algo diferente y siempre está perfecto. Mi favorito es el arroz que hace. ¿Puedo repetir?',
        sampleTranslation: "Ma'am, this is incredible. Every time I come, you cook something different and it's always perfect. My favorite is the rice you make. Can I have seconds?",
      },
    },
  },
  {
    id: 'tc005',
    category: 'everyday',
    title: "How are you feeling?",
    titleSpanish: '¿Cómo te sientes?',
    context: 'Checking in with girlfriend, or her mother asking you',
    level: 'A1',
    scaffolding: {
      heavy: {
        starters: [
          { spanish: 'Me siento...', english: 'I feel...' },
          { spanish: 'Estoy un poco...', english: "I'm a little..." },
          { spanish: 'Hoy estoy mejor porque...', english: "Today I'm better because..." },
        ],
        keyPhrases: [
          { spanish: 'cansado/a', english: 'tired' },
          { spanish: 'contento/a', english: 'happy/content' },
          { spanish: 'estresado/a', english: 'stressed' },
          { spanish: 'con sueño', english: 'sleepy' },
          { spanish: 'de buen humor', english: 'in a good mood' },
          { spanish: 'un poco enfermo/a', english: 'a little sick' },
        ],
        modelResponse: 'Estoy bien, gracias. Un poco cansado del trabajo pero contento de estar aquí. Esta semana fue larga.',
        modelTranslation: "I'm good, thanks. A little tired from work but happy to be here. This week was long.",
      },
      medium: {
        hints: ['Use estar + adjective for temporary states', 'Give a reason for how you feel', 'Ask them back'],
        modelResponse: 'Más o menos. Dormí mal anoche y estoy un poco cansado. Pero nada grave. ¿Y tú, cómo estás?',
        modelTranslation: "So-so. I slept badly last night and I'm a little tired. But nothing serious. And you, how are you?",
      },
      freeform: {
        prompt: "Her mother asks how you're doing. Be genuine — you're tired but glad to see them.",
        promptSpanish: 'Su mamá pregunta cómo estás. Sé sincero.',
        sampleResponse: 'La verdad estoy un poco cansado, la semana fue difícil. Pero estar aquí con ustedes me pone de buen humor. Siempre es bueno venir.',
        sampleTranslation: "Honestly I'm a bit tired, the week was hard. But being here with you all puts me in a good mood. It's always good to come by.",
      },
    },
  },

  // ── OPINIONS & REACTIONS ───────────────────────────────────────────
  {
    id: 'tc006',
    category: 'opinions',
    title: 'Recommending a show or movie',
    titleSpanish: 'Recomendar una serie o película',
    context: "Chatting with girlfriend's brothers about what to watch",
    level: 'A2',
    scaffolding: {
      heavy: {
        starters: [
          { spanish: '¿Han visto...?', english: 'Have you all seen...?' },
          { spanish: 'Les recomiendo...', english: 'I recommend (to you all)...' },
          { spanish: 'Se trata de...', english: "It's about..." },
        ],
        keyPhrases: [
          { spanish: 'Es muy buena', english: "It's very good" },
          { spanish: 'Me enganchó desde el primer capítulo', english: 'It hooked me from the first episode' },
          { spanish: 'Tiene buenas actuaciones', english: 'It has good acting' },
          { spanish: 'Es de acción / comedia / drama', english: "It's action / comedy / drama" },
          { spanish: 'Vale la pena verla', english: "It's worth watching" },
          { spanish: 'No es para todos', english: "It's not for everyone" },
        ],
        modelResponse: '¿Han visto la nueva serie en Netflix? Se trata de un detective en México. Es de suspenso y tiene muy buenas actuaciones. Me enganchó desde el primer capítulo.',
        modelTranslation: 'Have you guys seen the new series on Netflix? It\'s about a detective in Mexico. It\'s suspense and has very good acting. It hooked me from the first episode.',
      },
      medium: {
        hints: ['Name the show', 'Say what genre it is', 'Give one reason why you liked it', 'Ask if they\'ve seen anything good'],
        modelResponse: 'Estoy viendo una serie que se llama... es de suspenso. Me gusta porque los personajes son muy reales. ¿Ustedes están viendo algo bueno?',
        modelTranslation: "I'm watching a series called... it's suspense. I like it because the characters are very real. Are you guys watching anything good?",
      },
      freeform: {
        prompt: "You just finished something good. Tell her brothers about it naturally.",
        promptSpanish: 'Acabas de terminar algo bueno. Cuéntales a sus hermanos.',
        sampleResponse: 'Oigan, acabo de terminar una serie increíble. Al principio pensé que no me iba a gustar pero después del tercer capítulo no podía parar. Si les gusta el drama, se las recomiendo mucho.',
        sampleTranslation: "Hey guys, I just finished an incredible series. At first I thought I wasn't going to like it but after the third episode I couldn't stop. If you like drama, I highly recommend it.",
      },
    },
  },
  {
    id: 'tc007',
    category: 'opinions',
    title: 'Talking about a restaurant or meal',
    titleSpanish: 'Hablando de un restaurante o comida',
    context: 'Suggesting where to eat, or sharing a food experience',
    level: 'A2',
    scaffolding: {
      heavy: {
        starters: [
          { spanish: 'Fuimos a un restaurante que...', english: 'We went to a restaurant that...' },
          { spanish: 'La comida estaba...', english: 'The food was...' },
          { spanish: '¿Han ido a...?', english: 'Have you been to...?' },
        ],
        keyPhrases: [
          { spanish: 'el servicio fue excelente', english: 'the service was excellent' },
          { spanish: 'los precios son razonables', english: 'the prices are reasonable' },
          { spanish: 'es un poco caro pero vale la pena', english: "it's a bit expensive but worth it" },
          { spanish: 'el ambiente es muy agradable', english: 'the atmosphere is very nice' },
          { spanish: 'yo pedí...', english: 'I ordered...' },
          { spanish: 'deberían ir', english: 'you all should go' },
        ],
        modelResponse: 'El otro día fuimos a un restaurante nuevo cerca de la casa. Yo pedí unos tacos y estaban muy buenos. Los precios son razonables y el ambiente es agradable. Deberían ir.',
        modelTranslation: 'The other day we went to a new restaurant near the house. I ordered some tacos and they were very good. The prices are reasonable and the atmosphere is nice. You should go.',
      },
      medium: {
        hints: ['Say where/when you went', 'Describe what you ate', 'Give your overall impression', 'Would you recommend it?'],
        modelResponse: 'Conocemos un lugar bueno para mariscos. Fuimos la semana pasada y todo estaba fresco. No es elegante pero la comida es auténtica. ¿Quieren ir este sábado?',
        modelTranslation: 'We know a good place for seafood. We went last week and everything was fresh. It\'s not fancy but the food is authentic. Do you want to go this Saturday?',
      },
      freeform: {
        prompt: "You tried a new place and want to suggest going together. Make it appealing.",
        promptSpanish: 'Probaste un lugar nuevo y quieres sugerir ir juntos.',
        sampleResponse: 'Oigan, encontramos un lugar increíble. La comida es casera, las porciones son grandes, y no es caro. El dueño es muy amable. Tenemos que ir todos juntos la próxima vez.',
        sampleTranslation: "Hey, we found an incredible place. The food is homestyle, the portions are big, and it's not expensive. The owner is very friendly. We have to all go together next time.",
      },
    },
  },
  {
    id: 'tc008',
    category: 'opinions',
    title: 'Reacting to news (good or bad)',
    titleSpanish: 'Reaccionar a noticias (buenas o malas)',
    context: 'When someone shares news at a family gathering',
    level: 'A2',
    scaffolding: {
      heavy: {
        starters: [
          { spanish: '¡Qué bueno! / ¡Qué lástima!', english: 'How great! / What a shame!' },
          { spanish: '¡No me digas!', english: 'No way! / You don\'t say!' },
          { spanish: 'Me alegro mucho. / Lo siento.', english: "I'm very happy for you. / I'm sorry." },
        ],
        keyPhrases: [
          { spanish: '¡Felicidades!', english: 'Congratulations!' },
          { spanish: '¿En serio?', english: 'Really? / Seriously?' },
          { spanish: '¡Qué sorpresa!', english: 'What a surprise!' },
          { spanish: 'Cuéntame más.', english: 'Tell me more.' },
          { spanish: '¿Y qué vas a hacer?', english: 'And what are you going to do?' },
          { spanish: 'Si necesitas algo, avísame.', english: 'If you need anything, let me know.' },
        ],
        modelResponse: '¡No me digas! ¡Qué buena noticia! Me alegro mucho por ti. ¿Cuándo empiezas? Cuéntame todo.',
        modelTranslation: "No way! What great news! I'm really happy for you. When do you start? Tell me everything.",
      },
      medium: {
        hints: ['React emotionally first', 'Ask a follow-up question', 'Offer support or congratulations'],
        modelResponse: '¿En serio? ¡Felicidades! Eso es increíble. ¿Cómo te sientes? Seguro estás muy contento.',
        modelTranslation: "Really? Congratulations! That's incredible. How do you feel? I'm sure you're very happy.",
      },
      freeform: {
        prompt: "Her brother just told you he got a promotion. React naturally.",
        promptSpanish: 'Su hermano te dice que lo ascendieron en el trabajo.',
        sampleResponse: '¡Órale! ¡Qué bueno, hermano! Te lo mereces, trabajas un montón. Hay que celebrar. ¿Qué te parece si vamos por unas cervezas este viernes?',
        sampleTranslation: "Nice! That's great, man! You deserve it, you work a ton. We should celebrate. How about we go for some beers this Friday?",
      },
    },
  },
  {
    id: 'tc009',
    category: 'opinions',
    title: 'Expressing preferences',
    titleSpanish: 'Expresando preferencias',
    context: 'When the group is deciding what to do or where to go',
    level: 'A1',
    scaffolding: {
      heavy: {
        starters: [
          { spanish: 'Yo prefiero...', english: 'I prefer...' },
          { spanish: 'A mí me gusta más...', english: 'I like ... more' },
          { spanish: 'No me importa, ustedes decidan.', english: "I don't mind, you all decide." },
        ],
        keyPhrases: [
          { spanish: 'Me da igual', english: "It's all the same to me" },
          { spanish: 'Lo que quieran', english: 'Whatever you all want' },
          { spanish: 'Mejor...', english: 'Better to... / I\'d rather...' },
          { spanish: 'No soy fan de...', english: "I'm not a fan of..." },
          { spanish: '¿Qué prefieren ustedes?', english: 'What do you all prefer?' },
          { spanish: 'A mí me parece bien', english: 'That sounds good to me' },
        ],
        modelResponse: 'A mí me gusta más la idea de quedarnos en casa y pedir comida. Pero si ustedes prefieren salir, también está bien. Lo que quieran.',
        modelTranslation: "I like the idea of staying home and ordering food better. But if you all prefer to go out, that's fine too. Whatever you want.",
      },
      medium: {
        hints: ['State your preference', 'Show flexibility', 'Ask what they prefer'],
        modelResponse: 'Yo prefiero algo tranquilo hoy, pero me adapto. ¿Qué tienen ganas de hacer ustedes?',
        modelTranslation: 'I prefer something chill today, but I\'m flexible. What do you all feel like doing?',
      },
      freeform: {
        prompt: "The group can't decide between two options. Weigh in without being pushy.",
        promptSpanish: 'El grupo no puede decidir entre dos opciones. Da tu opinión sin imponer.',
        sampleResponse: 'Miren, las dos opciones suenan bien. Si me preguntan, prefiero la primera porque es más cerca. Pero en serio, lo que decidan está bien para mí.',
        sampleTranslation: "Look, both options sound good. If you ask me, I prefer the first one because it's closer. But seriously, whatever you all decide is fine by me.",
      },
    },
  },
  {
    id: 'tc010',
    category: 'everyday',
    title: 'Talking about health and energy',
    titleSpanish: 'Hablando de salud y energía',
    context: "Chatting with her elderly mother or responding to 'you look tired'",
    level: 'A2',
    scaffolding: {
      heavy: {
        starters: [
          { spanish: 'Últimamente me siento...', english: 'Lately I feel...' },
          { spanish: 'Necesito dormir más.', english: 'I need to sleep more.' },
          { spanish: 'Estoy tratando de...', english: "I'm trying to..." },
        ],
        keyPhrases: [
          { spanish: 'me falta energía', english: "I'm lacking energy" },
          { spanish: 'estoy durmiendo mal', english: "I'm sleeping badly" },
          { spanish: 'debería hacer ejercicio', english: 'I should exercise' },
          { spanish: 'tomar vitaminas', english: 'to take vitamins' },
          { spanish: 'comer mejor', english: 'to eat better' },
          { spanish: 'el estrés del trabajo', english: 'work stress' },
        ],
        modelResponse: 'Sí, estoy un poco cansado últimamente. Es el estrés del trabajo. Necesito dormir más y estoy tratando de comer mejor. Pero no se preocupe, estoy bien.',
        modelTranslation: "Yes, I'm a bit tired lately. It's work stress. I need to sleep more and I'm trying to eat better. But don't worry, I'm fine.",
      },
      medium: {
        hints: ['Acknowledge how you feel', 'Give a reason', 'Mention what you\'re doing about it', 'Reassure them'],
        modelResponse: 'No se preocupe, señora. Es que la semana fue muy pesada. Ya estoy mejor, solo necesito descansar este fin de semana.',
        modelTranslation: "Don't worry, ma'am. It's just that the week was very heavy. I'm already better, I just need to rest this weekend.",
      },
      freeform: {
        prompt: "Her mother says you look tired and asks if you're eating well. Reassure her warmly.",
        promptSpanish: 'Su mamá dice que te ves cansado y pregunta si estás comiendo bien.',
        sampleResponse: 'Ay, gracias por preocuparse. Sí como bien, es que el trabajo ha estado pesado. Pero su comida siempre me ayuda a recuperar energía. Con esta cena voy a quedar como nuevo.',
        sampleTranslation: "Aw, thanks for worrying. I am eating well, it's just that work has been heavy. But your cooking always helps me recover energy. After this dinner I'll be good as new.",
      },
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════
// "WHAT WOULD YOU SAY?" SCENARIOS
// ═══════════════════════════════════════════════════════════════════════

export const whatWouldYouSay: WhatWouldYouSay[] = [
  {
    id: 'wwys001',
    category: 'respond',
    speaker: 'Su hermano (her brother)',
    situation: "At a family BBQ. Her brother turns to you and asks about your work.",
    theySaid: '¿Y cómo va el trabajo? ¿Te gusta lo que haces?',
    theySaidTranslation: "And how's work going? Do you like what you do?",
    level: 'A2',
    scaffolding: {
      heavy: {
        responseStarters: [
          { spanish: 'Sí, me gusta. Trabajo en...', english: 'Yeah, I like it. I work in...' },
          { spanish: 'Tiene sus días buenos y malos...', english: 'It has its good and bad days...' },
          { spanish: 'La verdad es que...', english: 'The truth is that...' },
        ],
        keyVocab: [
          { spanish: 'me gusta lo que hago', english: 'I like what I do' },
          { spanish: 'a veces es estresante', english: 'sometimes it\'s stressful' },
          { spanish: 'mis compañeros son buena onda', english: 'my coworkers are cool' },
          { spanish: 'paga bien', english: 'it pays well' },
          { spanish: 'estoy buscando algo mejor', english: "I'm looking for something better" },
        ],
        modelResponses: [
          { spanish: 'Sí, me gusta. A veces es estresante pero mis compañeros son buena onda y paga bien. No me quejo.', english: "Yeah, I like it. Sometimes it's stressful but my coworkers are cool and it pays well. Can't complain." },
        ],
      },
      medium: {
        hints: ['Answer honestly', 'Give one detail about your job', 'Ask them about theirs'],
        modelResponses: [
          { spanish: 'Va bien, gracias. Tiene sus días pero en general me gusta. ¿Y tú? ¿Sigues en la misma empresa?', english: "It's going well, thanks. It has its days but overall I like it. And you? Are you still at the same company?" },
        ],
      },
      freeform: {
        modelResponses: [
          { spanish: 'Mira, no es perfecto pero estoy contento. Lo mejor es que tengo buen horario y eso me deja tiempo para otras cosas. ¿Y a ti cómo te va?', english: "Look, it's not perfect but I'm happy. The best part is I have a good schedule and that gives me time for other things. How about you?" },
        ],
      },
    },
  },
  {
    id: 'wwys002',
    category: 'smalltalk',
    speaker: 'Su mamá (her mother)',
    situation: "You just arrived at her house. She opens the door and greets you warmly.",
    theySaid: '¡Mijo! ¡Qué bueno que viniste! Pasa, pasa. ¿Ya comiste?',
    theySaidTranslation: "Sweetie! How great that you came! Come in, come in. Have you eaten?",
    level: 'A1',
    scaffolding: {
      heavy: {
        responseStarters: [
          { spanish: '¡Hola! Gracias por invitarnos...', english: 'Hi! Thanks for inviting us...' },
          { spanish: 'No, todavía no como...', english: "No, I haven't eaten yet..." },
          { spanish: 'Sí, pero siempre tengo espacio para su comida...', english: 'Yes, but I always have room for your cooking...' },
        ],
        keyVocab: [
          { spanish: '¡Qué gusto verla!', english: 'Great to see you!' },
          { spanish: 'Huele muy rico', english: 'It smells delicious' },
          { spanish: '¿Cómo ha estado?', english: 'How have you been?' },
          { spanish: 'Le traje algo', english: 'I brought you something' },
        ],
        modelResponses: [
          { spanish: '¡Hola! ¡Qué gusto verla! No, no he comido y huele muy rico. ¿Cómo ha estado?', english: "Hi! Great to see you! No, I haven't eaten and it smells delicious. How have you been?" },
        ],
      },
      medium: {
        hints: ['Greet her warmly (use usted)', 'Answer the food question', 'Compliment something', 'Ask how she is'],
        modelResponses: [
          { spanish: '¡Hola señora! Qué alegría estar aquí. No he comido nada — vine con hambre porque sé que cocina delicioso. ¿Cómo se ha sentido?', english: "Hi ma'am! What a joy to be here. I haven't eaten — I came hungry because I know you cook deliciously. How have you been feeling?" },
        ],
      },
      freeform: {
        modelResponses: [
          { spanish: '¡Hola! Gracias, qué bueno estar aquí. ¿Sabe qué? No comí a propósito porque su comida es la mejor. Huele increíble, como siempre. ¿Le ayudo en algo?', english: "Hi! Thanks, it's great to be here. You know what? I didn't eat on purpose because your food is the best. It smells incredible, as always. Can I help you with anything?" },
        ],
      },
    },
  },
  {
    id: 'wwys003',
    category: 'react',
    speaker: 'Tu novia (your girlfriend)',
    situation: "You're on the couch watching TV. She sighs and says:",
    theySaid: 'Estoy aburrida. ¿Hacemos algo?',
    theySaidTranslation: "I'm bored. Should we do something?",
    level: 'A1',
    scaffolding: {
      heavy: {
        responseStarters: [
          { spanish: '¿Qué quieres hacer?', english: 'What do you want to do?' },
          { spanish: 'Podemos...', english: 'We can...' },
          { spanish: '¿Qué tal si...?', english: 'How about if...?' },
        ],
        keyVocab: [
          { spanish: 'salir a caminar', english: 'go for a walk' },
          { spanish: 'jugar un juego', english: 'play a game' },
          { spanish: 'preparar algo de comer', english: 'make something to eat' },
          { spanish: 'ir por un café', english: 'go get a coffee' },
          { spanish: 'poner música', english: 'put on music' },
        ],
        modelResponses: [
          { spanish: '¿Qué quieres hacer? Podemos salir a caminar o si prefieres, preparamos algo rico y ponemos música.', english: 'What do you want to do? We can go for a walk or if you prefer, we make something tasty and put on music.' },
        ],
      },
      medium: {
        hints: ['Suggest 2 options', 'Show you\'re open to her ideas too'],
        modelResponses: [
          { spanish: 'Hmm, ¿qué tal si vamos por un café? O podemos cocinar algo juntos. ¿Qué se te antoja?', english: "Hmm, how about we go get a coffee? Or we can cook something together. What are you in the mood for?" },
        ],
      },
      freeform: {
        modelResponses: [
          { spanish: 'Dale, sí. Yo también estoy un poco aburrido. ¿Sabes qué? Hace tiempo que no vamos a ese café que te gusta. ¿Vamos?', english: "Yeah, for sure. I'm a little bored too. You know what? It's been a while since we went to that café you like. Shall we go?" },
        ],
      },
    },
  },
  {
    id: 'wwys004',
    category: 'initiate',
    speaker: 'Tú (you start)',
    situation: "You're sitting with her brother and there's a silence. You want to start a conversation.",
    theySaid: '(silencio...)',
    theySaidTranslation: "(silence — it's your turn to say something)",
    level: 'A2',
    scaffolding: {
      heavy: {
        responseStarters: [
          { spanish: 'Oye, ¿viste el partido...?', english: 'Hey, did you see the game...?' },
          { spanish: '¿Qué tal el trabajo últimamente?', english: 'How\'s work been lately?' },
          { spanish: '¿Han hecho algo interesante...?', english: 'Have you done anything interesting...?' },
        ],
        keyVocab: [
          { spanish: '¿Qué planes tienes para...?', english: 'What plans do you have for...?' },
          { spanish: '¿Qué estás viendo en Netflix?', english: 'What are you watching on Netflix?' },
          { spanish: '¿Cómo están los niños?', english: 'How are the kids?' },
          { spanish: '¿Ya probaste...?', english: 'Have you tried...?' },
        ],
        modelResponses: [
          { spanish: 'Oye, ¿qué estás viendo últimamente en Netflix? Yo acabo de terminar una serie buena y necesito algo nuevo.', english: "Hey, what are you watching on Netflix lately? I just finished a good series and need something new." },
        ],
      },
      medium: {
        hints: ['Pick a universal topic (sports, shows, food, plans)', 'Ask an open question (not yes/no)', 'Share something about yourself to keep it going'],
        modelResponses: [
          { spanish: '¿Qué tal el trabajo? ¿Sigues igual de ocupado o ya se calmó un poco? A mí me está yendo bien pero esta semana fue pesada.', english: "How's work? Are you still just as busy or has it calmed down? Things are going well for me but this week was heavy." },
        ],
      },
      freeform: {
        modelResponses: [
          { spanish: 'Oye, ¿qué planes tienen para el próximo fin de semana? Estaba pensando que podemos hacer algo todos juntos. Hace tiempo que no salimos.', english: "Hey, what plans do you have for next weekend? I was thinking we could all do something together. It's been a while since we went out." },
        ],
      },
    },
  },
  {
    id: 'wwys005',
    category: 'respond',
    speaker: 'Su mamá (her mother)',
    situation: "Her mother asks about your family back home.",
    theySaid: '¿Y tu familia? ¿Cómo están? ¿Los extrañas?',
    theySaidTranslation: 'And your family? How are they? Do you miss them?',
    level: 'A2',
    scaffolding: {
      heavy: {
        responseStarters: [
          { spanish: 'Están bien, gracias a Dios...', english: "They're good, thank God..." },
          { spanish: 'Sí, a veces los extraño...', english: 'Yes, sometimes I miss them...' },
          { spanish: 'Hablo con ellos por teléfono...', english: 'I talk to them by phone...' },
        ],
        keyVocab: [
          { spanish: 'mi mamá / mi papá', english: 'my mom / my dad' },
          { spanish: 'mis hermanos', english: 'my siblings' },
          { spanish: 'hablamos seguido', english: 'we talk often' },
          { spanish: 'los visité en...', english: 'I visited them in...' },
          { spanish: 'viven lejos', english: 'they live far away' },
          { spanish: 'los voy a visitar pronto', english: "I'm going to visit them soon" },
        ],
        modelResponses: [
          { spanish: 'Están bien, gracias por preguntar. Hablo con mi mamá cada semana. Sí los extraño a veces, pero estoy contento aquí. Los voy a visitar pronto.', english: "They're good, thanks for asking. I talk to my mom every week. Yes, I miss them sometimes, but I'm happy here. I'm going to visit them soon." },
        ],
      },
      medium: {
        hints: ['Say how they are', 'Mention how you stay in touch', 'Be honest about missing them', 'Show gratitude for her family too'],
        modelResponses: [
          { spanish: 'Bien, gracias. Los extraño pero hablamos bastante por video. Y la verdad, ustedes me hacen sentir como en familia aquí.', english: "Good, thanks. I miss them but we talk a lot by video. And honestly, you all make me feel like family here." },
        ],
      },
      freeform: {
        modelResponses: [
          { spanish: 'Están bien. Mi mamá siempre me pregunta si estoy comiendo bien — igual que usted. Creo que por eso me llevo tan bien con usted, me recuerda a mi familia.', english: "They're good. My mom always asks if I'm eating well — just like you. I think that's why I get along so well with you, you remind me of my family." },
        ],
      },
    },
  },
  {
    id: 'wwys006',
    category: 'react',
    speaker: 'Su hermano (her brother)',
    situation: "Her brother is complaining about traffic / his commute.",
    theySaid: 'Tardé una hora y media para llegar. El tráfico está horrible últimamente.',
    theySaidTranslation: 'It took me an hour and a half to get here. Traffic has been horrible lately.',
    level: 'A2',
    scaffolding: {
      heavy: {
        responseStarters: [
          { spanish: '¡Uy, qué pesado!', english: 'Ugh, that sucks!' },
          { spanish: 'Sí, el tráfico está cada vez peor...', english: 'Yeah, traffic is getting worse...' },
          { spanish: 'A mí también me pasa...', english: 'That happens to me too...' },
        ],
        keyVocab: [
          { spanish: '¡Qué barbaridad!', english: 'That\'s crazy!' },
          { spanish: 'es desesperante', english: 'it\'s maddening' },
          { spanish: 'no hay de otra', english: 'there\'s no other choice' },
          { spanish: '¿no hay otra ruta?', english: 'isn\'t there another route?' },
          { spanish: 'a esa hora es lo peor', english: 'at that hour it\'s the worst' },
        ],
        modelResponses: [
          { spanish: '¡Uy, qué pesado! Una hora y media es mucho. ¿No hay otra ruta? A esa hora es lo peor, yo trato de salir más temprano pero no siempre se puede.', english: "Ugh, that's rough! An hour and a half is a lot. Isn't there another route? At that hour it's the worst, I try to leave earlier but you can't always." },
        ],
      },
      medium: {
        hints: ['Empathize first', 'Relate with your own experience', 'Maybe suggest something or just commiserate'],
        modelResponses: [
          { spanish: '¡Qué barbaridad! Yo a veces tardo lo mismo y es desesperante. ¿Llegaste estresado? Tómate una cerveza, te la mereces.', english: "That's crazy! Sometimes it takes me the same and it's maddening. Did you arrive stressed? Have a beer, you deserve it." },
        ],
      },
      freeform: {
        modelResponses: [
          { spanish: 'Sí está horrible. A mí me pasó la semana pasada, tardé casi lo mismo y llegué de mal humor. Lo bueno es que ya estás aquí. ¿Quieres algo de tomar?', english: "Yeah it's horrible. Same thing happened to me last week, took almost as long and I arrived in a bad mood. Good thing you're here now. Want something to drink?" },
        ],
      },
    },
  },
  {
    id: 'wwys007',
    category: 'initiate',
    speaker: 'Tú (you start)',
    situation: "You want to compliment her mother on something in the house — a plant, a photo, some decoration.",
    theySaid: '(you notice something nice and want to comment)',
    theySaidTranslation: "(you're looking for something to say — compliment something you see)",
    level: 'A1',
    scaffolding: {
      heavy: {
        responseStarters: [
          { spanish: '¡Qué bonita está esa planta!', english: 'How pretty that plant is!' },
          { spanish: 'Me gusta mucho esta foto...', english: 'I really like this photo...' },
          { spanish: '¿Eso es nuevo? Está muy bonito.', english: 'Is that new? It\'s very nice.' },
        ],
        keyVocab: [
          { spanish: '¿Dónde lo compró?', english: 'Where did you buy it?' },
          { spanish: 'Tiene muy buen gusto', english: 'You have very good taste' },
          { spanish: '¿Cuánto tiempo tiene esa planta?', english: 'How long have you had that plant?' },
          { spanish: 'La casa siempre se ve tan bonita', english: 'The house always looks so nice' },
        ],
        modelResponses: [
          { spanish: '¡Señora, qué bonitas están sus plantas! ¿Cuánto tiempo tienen? Se nota que las cuida mucho.', english: "Ma'am, your plants are so beautiful! How long have you had them? You can tell you take great care of them." },
        ],
      },
      medium: {
        hints: ['Pick something specific to compliment', 'Ask a question about it', 'Show genuine interest'],
        modelResponses: [
          { spanish: 'Me encanta esa foto de allá. ¿Cuándo fue eso? Se ven muy jóvenes todos.', english: "I love that photo over there. When was that? Everyone looks so young." },
        ],
      },
      freeform: {
        modelResponses: [
          { spanish: 'Señora, cada vez que vengo noto algo nuevo. ¿Esas flores son de su jardín? Tiene un talento para las plantas que yo no tengo — las mías se me mueren todas.', english: "Ma'am, every time I come I notice something new. Are those flowers from your garden? You have a talent for plants that I don't — mine all die on me." },
        ],
      },
    },
  },
  {
    id: 'wwys008',
    category: 'respond',
    speaker: 'Tu novia (your girlfriend)',
    situation: "She's had a bad day and just vented about her boss.",
    theySaid: 'Mi jefe me hizo quedarme hasta tarde otra vez. Estoy harta.',
    theySaidTranslation: "My boss made me stay late again. I'm fed up.",
    level: 'A2',
    scaffolding: {
      heavy: {
        responseStarters: [
          { spanish: 'Ay, lo siento mucho...', english: "Oh, I'm so sorry..." },
          { spanish: 'Eso no está bien...', english: "That's not right..." },
          { spanish: '¿Quieres hablar de eso o prefieres distraerte?', english: 'Do you want to talk about it or prefer to be distracted?' },
        ],
        keyVocab: [
          { spanish: 'eso es injusto', english: 'that\'s unfair' },
          { spanish: 'no te mereces eso', english: 'you don\'t deserve that' },
          { spanish: 'te entiendo', english: 'I understand you' },
          { spanish: '¿te preparo algo?', english: 'shall I make you something?' },
          { spanish: 'ven, siéntate', english: 'come, sit down' },
        ],
        modelResponses: [
          { spanish: 'Ay, eso es injusto. No te mereces eso. Ven, siéntate. ¿Te preparo un té o algo? Si quieres hablar, te escucho.', english: "That's unfair. You don't deserve that. Come, sit down. Shall I make you a tea or something? If you want to talk, I'm listening." },
        ],
      },
      medium: {
        hints: ['Validate her feelings first', 'Don\'t try to fix it right away', 'Offer comfort — listening or practical help'],
        modelResponses: [
          { spanish: 'Te entiendo, eso es muy frustrante. ¿Quieres contarme qué pasó o prefieres no pensar en eso ahorita? Hago la cena si quieres descansar.', english: "I understand, that's very frustrating. Do you want to tell me what happened or prefer not to think about it right now? I'll make dinner if you want to rest." },
        ],
      },
      freeform: {
        modelResponses: [
          { spanish: 'Otra vez lo mismo... tu jefe se pasa. Mira, no tienes que pensar en eso ahora. Relájate, yo me encargo de la cena. Y si luego quieres contarme, aquí estoy.', english: "Same thing again... your boss goes too far. Look, you don't have to think about that now. Relax, I'll take care of dinner. And if you want to tell me about it later, I'm here." },
        ],
      },
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

/** Get topic cards by category */
export function getTopicCardsByCategory(category: TopicCard['category']): TopicCard[] {
  return topicCards.filter(tc => tc.category === category);
}

/** Get a random topic card, optionally filtered by category */
export function getRandomTopicCard(category?: TopicCard['category']): TopicCard {
  const pool = category ? topicCards.filter(tc => tc.category === category) : topicCards;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Get scenarios by category */
export function getScenariosByCategory(category: WhatWouldYouSay['category']): WhatWouldYouSay[] {
  return whatWouldYouSay.filter(s => s.category === category);
}

/** Get a random scenario */
export function getRandomScenario(category?: WhatWouldYouSay['category']): WhatWouldYouSay {
  const pool = category ? whatWouldYouSay.filter(s => s.category === category) : whatWouldYouSay;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Determine scaffolding tier based on completion count */
export function getScaffoldingTier(completedCount: number): 'heavy' | 'medium' | 'freeform' {
  if (completedCount < 5) return 'heavy';
  if (completedCount < 15) return 'medium';
  return 'freeform';
}
