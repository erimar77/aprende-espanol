// Latin American Holidays — focused on Peru with broader context
// Each holiday includes a "day in the life" narrative, US comparison, and useful Spanish

export interface LatinHoliday {
  id: string;
  name: string;
  nameSpanish: string;
  date: string;
  /** Approximate month for calendar sorting */
  month: number;
  region: 'peru' | 'latin-america' | 'both';
  /** How well-known this is to a typical American */
  familiarity: 'probably-know' | 'maybe-heard-of' | 'new-to-you';
  /** Short one-liner */
  summary: string;
  /** Detailed "day in the life" — what it actually looks and feels like */
  dayInTheLife: string;
  /** How this contrasts with the US equivalent or US culture */
  usComparison: string;
  /** What you'd see / smell / hear / eat */
  sensoryDetails: {
    see: string;
    hear: string;
    smell: string;
    taste: string;
  };
  /** Vocabulary you need for this holiday */
  vocabulary: { spanish: string; english: string; context?: string }[];
  /** Phrases you'd actually say or hear during this holiday */
  phrases: { spanish: string; english: string; when: string }[];
  /** Cultural tips — things that might surprise you or that you should know */
  culturalTips: string[];
}

export const latinHolidays: LatinHoliday[] = [
  // ═══════════════════════════════════════════════════════════════════
  // DÍA DE LA MADRE — May (2nd Sunday in most countries, but varies)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hol001',
    name: "Mother's Day",
    nameSpanish: 'Día de la Madre',
    date: 'Second Sunday of May (Peru, most of Latin America)',
    month: 5,
    region: 'both',
    familiarity: 'probably-know',
    summary: "Same date as the US, but the celebration is much bigger — it's closer to a national event than a Hallmark holiday.",
    dayInTheLife: `The day starts early. You wake up and the first thing you do is call your mom — or better yet, you're already at her house. In Peru, this isn't a brunch-and-card day like in the US. The whole extended family gathers. Grandma, aunts, sisters, cousins — everyone converges on one house, usually the matriarch's.

By mid-morning, the kitchen is chaos in the best way. Someone's making pollo a la brasa with all the sides, or a big pachamanca if you're in the sierra, or a hearty seco de cordero. The men are expected to help — or at least stay out of the way and handle the drinks. Beer and chicha morada flow freely.

Around noon, the table is set for 15-20 people. There are speeches. Your girlfriend's brother might stand up and say something sentimental about their mom. People cry. It's emotional in a way that might feel unfamiliar if you grew up in a reserved household.

The afternoon stretches into evening. Nobody leaves early. There's cake (torta helada or a chocolate cake is the Peruvian default; tres leches shows up too but it's more associated with Nicaragua and Mexico), someone puts on cumbia or huayno music, and the older women end up dancing. Kids run around. It's warm, loud, and genuinely happy.

If you're there as the boyfriend, you're expected to participate fully — greet her mother warmly, give her flowers or a gift, and treat the day as important. Ignoring it or being passive would be noticed.`,
    usComparison: `In the US, Mother's Day often means brunch at a restaurant, a card, maybe flowers delivered. It's personal and relatively private — your nuclear family. In Peru (and most of Latin America), it's a full family reunion. Restaurants are packed but many families cook at home together. The emotional intensity is higher — public speeches, tears, and long toasts are normal. Schools also hold events the Friday before where kids perform songs and dances for their mothers. It's a much bigger cultural moment than most Americans expect.`,
    sensoryDetails: {
      see: 'Extended family crowded around a big table, flowers everywhere (roses and lilies are popular), kids in school uniforms performing songs, street vendors selling last-minute bouquets',
      hear: 'Cumbia and ballads playing, toasts being made, "¡Salud por las madres!", kids singing "Mamita" songs from school',
      smell: 'Pollo a la brasa, ají de gallina cooking, torta baking, fresh flowers',
      taste: 'Pollo a la brasa, ají de gallina, torta helada or chocolate cake, chicha morada, beer',
    },
    vocabulary: [
      { spanish: 'la mamá / la madre', english: 'mom / mother', context: 'mamá is casual, madre more formal' },
      { spanish: 'la suegra', english: 'mother-in-law', context: "your girlfriend's mom" },
      { spanish: 'el brindis', english: 'the toast (speech)', context: 'someone raises a glass' },
      { spanish: 'agradecido/a', english: 'grateful' },
      { spanish: 'las flores', english: 'flowers' },
      { spanish: 'un ramo de rosas', english: 'a bouquet of roses' },
      { spanish: 'consentir', english: 'to pamper / spoil', context: 'Hoy hay que consentirla' },
      { spanish: 'la torta', english: 'the cake' },
      { spanish: 'la reunión familiar', english: 'the family gathering' },
      { spanish: 'feliz día', english: 'happy (mother\'s) day', context: 'short form everyone uses' },
    ],
    phrases: [
      { spanish: '¡Feliz Día de la Madre, señora!', english: "Happy Mother's Day, ma'am!", when: 'When you greet her mother' },
      { spanish: 'Esto es para usted, con mucho cariño.', english: 'This is for you, with much affection.', when: 'Giving her a gift' },
      { spanish: 'Gracias por todo lo que hace por nosotros.', english: 'Thank you for everything you do for us.', when: 'During the toast or privately' },
      { spanish: '¿En qué le ayudo?', english: 'How can I help?', when: 'Offering to help in the kitchen' },
      { spanish: 'La comida está deliciosa, como siempre.', english: 'The food is delicious, as always.', when: 'At the table' },
      { spanish: '¡Salud por todas las madres!', english: 'Cheers to all the mothers!', when: 'Raising your glass for the toast' },
    ],
    culturalTips: [
      'Bring flowers AND a gift. Just a card isn\'t enough. A nice cream, perfume, or something for the house is expected.',
      'Address her mother with "usted" unless she\'s explicitly told you otherwise. Even on a warm occasion, respect matters.',
      'Offer to help set up, clean up, or serve. Sitting passively while women work is noticed negatively.',
      'If you can manage even a short toast in Spanish — "Gracias por aceptarme en su familia" — it will mean the world.',
      'This is a day to be present and attentive. Don\'t be on your phone.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // FIESTAS PATRIAS — July 28-29
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hol002',
    name: 'Peruvian Independence Day',
    nameSpanish: 'Fiestas Patrias',
    date: 'July 28-29',
    month: 7,
    region: 'peru',
    familiarity: 'new-to-you',
    summary: "Peru's biggest national holiday. Two full days off, and people celebrate for the entire last week of July.",
    dayInTheLife: `Fiestas Patrias isn't just a day — it's the whole last week of July. Schools close, businesses shut down, and many people travel home to their family's city of origin.

July 28 is the formal day. The president gives a speech. Every house, business, and taxi has a Peruvian flag hanging from it — by law you're actually supposed to display one. There's a military parade in Lima that plays on every TV. Families gather and cook traditional food: ceviche, lomo saltado, anticuchos, papa a la huarancaina.

July 29 is more relaxed — barbecues (parrilladas), drinking, music. Think of it as July 4th stretched over two days, but with a much stronger food culture. People compete over who makes the best ceviche.

If you're with a Peruvian family, expect national pride to be front and center. People wear red and white, sing the national anthem with genuine emotion, and get misty-eyed. The anthem itself is long and dramatic — "Somos libres, seámoslo siempre" (We are free, let us always be so).

The week after is basically still festive. People are still on vacation, still barbecuing, still celebrating. It's the Peruvian equivalent of the week between Christmas and New Year's in the US — nobody's really working.`,
    usComparison: `July 4th in the US is one day of fireworks and barbecues. Fiestas Patrias is two official days plus an entire festive week. The patriotism is more openly emotional — people sing the anthem with tears. There are no fireworks; instead it's about food, family, and national pride expressed through culture. Also, flags aren't optional — businesses can be fined for not displaying one. The food element is much more central than in the US where it's just "burgers and hot dogs."`,
    sensoryDetails: {
      see: 'Peruvian flags on every building, red and white decorations, military parade on TV, families gathered around tables of ceviche',
      hear: 'The national anthem ("Somos libres"), fireworks on the 28th at midnight, cumbia and huayno music, political commentary on TV',
      smell: 'Ceviche (lime and fish), anticuchos grilling (beef hearts), ají peppers, beer',
      taste: 'Ceviche, lomo saltado, anticuchos, papa a la huancaína, pisco sour, chicha morada',
    },
    vocabulary: [
      { spanish: 'la patria', english: 'the homeland/fatherland' },
      { spanish: 'la independencia', english: 'independence' },
      { spanish: 'la bandera', english: 'the flag' },
      { spanish: 'el himno nacional', english: 'the national anthem' },
      { spanish: 'el desfile', english: 'the parade' },
      { spanish: 'el orgullo', english: 'pride' },
      { spanish: '¡Viva el Perú!', english: 'Long live Peru!', context: 'Everyone shouts this' },
      { spanish: 'la parrillada', english: 'the barbecue/cookout' },
      { spanish: 'feriado', english: 'holiday (day off)' },
      { spanish: 'anticuchos', english: 'grilled beef heart skewers', context: 'classic street food for Fiestas' },
    ],
    phrases: [
      { spanish: '¡Felices Fiestas Patrias!', english: 'Happy Independence Day!', when: 'Greeting anyone during the last week of July' },
      { spanish: '¡Viva el Perú, carajo!', english: 'Long live Peru! (emphatic)', when: 'During toasts or after the anthem — the "carajo" is traditional and not rude here' },
      { spanish: '¿Dónde van a celebrar?', english: 'Where are you celebrating?', when: 'Asking family about their plans' },
      { spanish: 'El ceviche te quedó increíble.', english: 'Your ceviche turned out incredible.', when: 'Complimenting the cook' },
      { spanish: '¿Me enseñas a preparar anticuchos?', english: 'Can you teach me to make anticuchos?', when: 'Showing interest in the food culture' },
    ],
    culturalTips: [
      'Learn at least the first verse of the Peruvian national anthem. Standing and mouthing along shows respect.',
      'Don\'t compare it to July 4th out loud — Peruvians take their independence very seriously (from Spain, 1821).',
      'Offer to help grill the anticuchos. It\'s a social activity and a way to bond with the men in the family.',
      '"Viva el Perú, carajo!" — the "carajo" (damn) is traditional and accepted in this one specific context. Don\'t be shocked if grandma says it.',
      'Wear something red and white. Even a red shirt shows you\'re participating.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // INTI RAYMI — June 24
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hol003',
    name: 'Festival of the Sun',
    nameSpanish: 'Inti Raymi',
    date: 'June 24',
    month: 6,
    region: 'peru',
    familiarity: 'new-to-you',
    summary: 'Ancient Incan festival celebrating the winter solstice and the Sun God. Still celebrated massively in Cusco.',
    dayInTheLife: `Inti Raymi is the great Incan winter-solstice festival honoring Inti, the sun god (remember, Peru is in the Southern Hemisphere, so June is winter). It's distinct from the Andean New Year (Machaq Mara / Año Nuevo Andino, June 21) but often confused with it. Inti Raymi is one of the most spectacular cultural events in all of South America.

If you're in Cusco, the day starts at the Qorikancha (the ancient Sun Temple). Actors in elaborate Incan costumes perform a ritual in Quechua — not Spanish. The "Inca" (played by a chosen actor) makes offerings to the sun and asks for a good year ahead.

Then a massive procession moves through the streets of Cusco to the fortress of Sacsayhuamán above the city. Thousands of people follow. The main ceremony happens there — a theatrical reenactment of the original Incan ritual with hundreds of performers, music, dance, and a symbolic llama sacrifice (no actual animal harmed).

For a Peruvian family not in Cusco, the day might be quieter — watching it on TV is common, similar to how Americans watch the Macy's parade. But there's a sense of cultural pride, especially for families with Andean roots. Your girlfriend's mother might talk about it with pride, even from Lima.

What makes it special: it's pre-colonial. It's not Spanish, not Catholic — it's indigenous Peruvian identity. Many Peruvians feel a deep connection to it as part of who they are.`,
    usComparison: `The US has nothing quite like this — it's as if Native Americans had a living, nationally-celebrated festival with tens of thousands attending that was broadcast on every channel. The closest might be Indigenous Peoples' Day, but that's political rather than celebratory. Inti Raymi is a full cultural production — think Mardi Gras meets a historical reenactment meets genuine spiritual reverence. It's also a source of national identity in a way no US holiday connects to pre-colonial history.`,
    sensoryDetails: {
      see: 'Elaborate Incan costumes in gold and red, the fortress of Sacsayhuamán, thousands gathered on hillsides, fires lit at dawn',
      hear: 'Quechua chanting, pututus (conch shell horns), Andean flutes and drums, crowd cheering',
      smell: 'Burning herbs (palo santo, coca leaves), roasting meat, cold mountain air',
      taste: 'Chicha de jora (corn beer), roasted cuy (guinea pig), humitas (corn tamales), pachamanca (earth-oven meat)',
    },
    vocabulary: [
      { spanish: 'el sol / Inti', english: 'the sun / Sun God (Quechua)' },
      { spanish: 'el solsticio de invierno', english: 'the winter solstice' },
      { spanish: 'los incas', english: 'the Incas' },
      { spanish: 'Cusco / Cuzco', english: 'Cusco (former Incan capital)', context: 'both spellings are used' },
      { spanish: 'la ceremonia', english: 'the ceremony' },
      { spanish: 'los antepasados', english: 'the ancestors' },
      { spanish: 'la ofrenda', english: 'the offering' },
      { spanish: 'el quechua', english: 'Quechua language', context: 'indigenous language still spoken' },
      { spanish: 'la cosmovisión andina', english: 'Andean worldview' },
      { spanish: 'Pachamama', english: 'Mother Earth (Quechua)' },
    ],
    phrases: [
      { spanish: '¿Tu familia celebra Inti Raymi?', english: 'Does your family celebrate Inti Raymi?', when: 'Asking about their connection to the holiday' },
      { spanish: '¿Has ido alguna vez a Cusco para verlo?', english: 'Have you ever been to Cusco to see it?', when: 'Showing genuine interest' },
      { spanish: 'Me parece fascinante la cultura inca.', english: 'I find Incan culture fascinating.', when: 'Expressing interest respectfully' },
      { spanish: '¿Qué significa Inti Raymi?', english: 'What does Inti Raymi mean?', when: 'Asking to learn more' },
      { spanish: 'Algún día me gustaría ir a verlo.', english: 'Someday I\'d like to go see it.', when: 'Expressing a wish to experience it' },
    ],
    culturalTips: [
      'Don\'t call it "just a festival" — for many Peruvians, especially those with Andean heritage, it carries genuine spiritual weight.',
      'Quechua is still a living language spoken by millions. Asking if her family speaks any Quechua shows cultural sensitivity.',
      'Guinea pig (cuy) is traditional ceremonial food. If offered, at least try it — refusing is impolite.',
      'The Southern Hemisphere seasons are flipped. June is winter in Peru. This catches Americans off guard.',
      'Many Peruvians identify strongly with their Incan heritage even if they live modern urban lives in Lima.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SEÑOR DE LOS MILAGROS — October
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hol004',
    name: 'Lord of Miracles',
    nameSpanish: 'Señor de los Milagros',
    date: 'October (processions throughout the month, main day October 18)',
    month: 10,
    region: 'peru',
    familiarity: 'new-to-you',
    summary: "The largest religious procession in South America. Lima turns purple for an entire month.",
    dayInTheLife: `October in Lima is "el mes morado" — the purple month. Everywhere you look, people are wearing purple. Purple shirts, purple ribbons, purple ties at work. It's not a costume — it's devotion.

The story: in 1655, a devastating earthquake destroyed most of Lima, but one wall survived — a wall painted with an image of Christ by an enslaved African man. People called it a miracle. The devotion has grown for nearly 400 years.

On procession days (several Saturdays and the main day, October 18-19), a massive replica of the painting is carried through the streets of Lima on the shoulders of men in purple robes. The procession moves incredibly slowly — it can take 18-24 hours to complete the route. Hundreds of thousands follow on foot, praying, singing, and throwing flowers.

For your girlfriend's family, this might mean: her mother gets up at 4am to secure a spot along the route. She's wearing purple. She might cry. The family eats turrón de Doña Pepa (a traditional anise-flavored nougat dessert only made in October) and picarones (sweet potato and pumpkin fritters).

Even Peruvians who aren't particularly religious participate. It's cultural identity as much as faith. Soccer team Alianza Lima wears purple because of this tradition. Businesses close along the procession route. The whole city reorganizes around it.`,
    usComparison: `The US has no religious event of this scale. The closest cultural comparison might be Mardi Gras in New Orleans — a religious event that's become cultural identity — but Señor de los Milagros is much more solemn and sincere. There's no partying; it's genuine devotion. Imagine if an entire major city wore the same color for a month, voluntarily, out of faith. The intensity of Catholic devotion in Peru will likely surprise most Americans, even Catholic Americans.`,
    sensoryDetails: {
      see: 'Hundreds of thousands in purple, the massive painted image carried on a golden platform, flower petals raining down, candles everywhere',
      hear: 'Hymns ("Señor de los Milagros, a ti venimos"), prayers in unison, church bells, silence when the image passes',
      smell: 'Incense, candle wax, picarones frying, turrón de Doña Pepa (anise and honey)',
      taste: 'Turrón de Doña Pepa, picarones with chancaca syrup, anticuchos (street vendors follow the procession)',
    },
    vocabulary: [
      { spanish: 'la procesión', english: 'the procession' },
      { spanish: 'morado/a', english: 'purple' },
      { spanish: 'el mes morado', english: 'the purple month (October)' },
      { spanish: 'el milagro', english: 'the miracle' },
      { spanish: 'la fe', english: 'faith' },
      { spanish: 'los cargadores', english: 'the carriers (who carry the image)' },
      { spanish: 'la promesa', english: 'the promise/vow (to the saint)' },
      { spanish: 'el hábito morado', english: 'the purple robe/habit' },
      { spanish: 'turrón de Doña Pepa', english: 'traditional October nougat dessert' },
      { spanish: 'picarones', english: 'sweet potato/pumpkin fritters' },
    ],
    phrases: [
      { spanish: '¿Su mamá va a la procesión este año?', english: 'Is your mom going to the procession this year?', when: 'Asking about family plans in October' },
      { spanish: '¿Por qué todo el mundo está de morado?', english: 'Why is everyone wearing purple?', when: 'If you genuinely don\'t know — it\'s a fair question' },
      { spanish: '¿Me puede explicar la historia?', english: 'Can you explain the story to me?', when: 'Showing respectful curiosity to her mother' },
      { spanish: 'Quiero probar el turrón de Doña Pepa.', english: 'I want to try the turrón de Doña Pepa.', when: 'Showing interest in the food traditions' },
      { spanish: '¿Quieren que los acompañe?', english: 'Do you want me to come along?', when: 'Offering to join the family at the procession' },
    ],
    culturalTips: [
      'Even if you\'re not religious, showing respect during the procession is important. Don\'t joke about it.',
      'If her mother wears the purple habit, it means she made a "promesa" (vow) — often for a family member\'s health or safety. It\'s deeply personal.',
      'Trying turrón de Doña Pepa and picarones is expected. They\'re only available in October — it\'s seasonal.',
      'If you go to the procession, be prepared for massive crowds and very slow movement. Wear comfortable shoes.',
      'Asking "Can you explain this to me?" shows respect. Peruvians are proud of this tradition and love sharing it.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SEMANA SANTA — March/April
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hol005',
    name: 'Holy Week',
    nameSpanish: 'Semana Santa',
    date: 'Week before Easter (March/April)',
    month: 4,
    region: 'both',
    familiarity: 'maybe-heard-of',
    summary: "Not just Easter Sunday — the entire week is observed. Many people get Thursday and Friday off work.",
    dayInTheLife: `Semana Santa in Peru is a full week event, not just Easter Sunday. Most people get Thursday and Friday off work (Jueves Santo and Viernes Santo). Many offices close Wednesday afternoon.

The mood shifts during the week. Monday through Wednesday feels like pre-holiday anticipation. Thursday, the solemnity begins. Many families — even non-strict ones — avoid eating red meat from Thursday through Saturday. Fish is everywhere: ceviche, sudado de pescado, arroz con mariscos.

Friday is the most intense day. In cities like Ayacucho (famous for its Semana Santa), there are massive processions with floats depicting the Stations of the Cross. Even in Lima, churches are full. Her mother likely attends church on Friday.

But here's what might surprise you: Saturday is party time. Once the "mourning" period passes, people go out. It's like the emotional release valve opens. Barbecues, beach trips (it's fall in Peru but still warm), and family gatherings.

Sunday is actually calmer than Saturday — church in the morning, then a big family lunch. There's no Easter egg hunt tradition. Instead, it's about the meal: a big feast that feels celebratory.

The whole week has a rhythm: solemn building to joyful release.`,
    usComparison: `In the US, Easter is mainly Sunday: church, brunch, egg hunts for kids, maybe ham dinner. It's largely secular for many Americans. In Peru, the entire week is observed as a cultural and religious event. The "no meat" tradition is taken seriously even by people who don't go to church regularly. Getting Thursday-Friday off work is standard (not optional). The processions are public, massive, and solemn in a way American Easter never is. There's no Easter Bunny tradition — it's genuinely religious or at minimum culturally Catholic.`,
    sensoryDetails: {
      see: 'Church processions with carried floats, streets carpeted with flower petals (alfombras), purple-draped churches, families at the beach on Saturday',
      hear: 'Church bells, hymns, solemn music, silence during Friday procession, then cumbia and laughter by Saturday night',
      smell: 'Fish frying (sudado), incense from churches, ocean air (beach trips), empanadas de vigilia (Lent empanadas)',
      taste: 'Ceviche, arroz con mariscos, empanadas de vigilia (cheese/spinach), fanesca (grain soup in Ecuador), hot chocolate',
    },
    vocabulary: [
      { spanish: 'Semana Santa', english: 'Holy Week' },
      { spanish: 'Jueves Santo', english: 'Holy Thursday' },
      { spanish: 'Viernes Santo', english: 'Good Friday' },
      { spanish: 'Domingo de Resurrección', english: 'Easter Sunday' },
      { spanish: 'la cuaresma', english: 'Lent' },
      { spanish: 'no comer carne', english: 'not eating meat' },
      { spanish: 'el ayuno', english: 'fasting' },
      { spanish: 'la misa', english: 'mass (church service)' },
      { spanish: 'los feriados', english: 'the holidays/days off' },
      { spanish: 'la playa', english: 'the beach', context: 'many people travel for the long weekend' },
    ],
    phrases: [
      { spanish: '¿Van a viajar para Semana Santa?', english: 'Are you all traveling for Holy Week?', when: 'Asking about their plans — many families travel' },
      { spanish: '¿Su mamá va a misa el viernes?', english: 'Is your mom going to mass on Friday?', when: 'Showing awareness of the tradition' },
      { spanish: 'No sabía que no se come carne. ¿Qué cocinamos?', english: "I didn't know you don't eat meat. What should we cook?", when: 'Adapting to the tradition respectfully' },
      { spanish: '¿Qué hacían en Semana Santa cuando eran niños?', english: 'What did you do during Holy Week when you were kids?', when: 'Getting them to share memories' },
      { spanish: '¡Felices Pascuas!', english: 'Happy Easter!', when: 'Sunday greeting' },
    ],
    culturalTips: [
      'Even if you\'re not religious, respect the no-meat tradition Thursday-Saturday. Don\'t order a steak in front of her mother on Good Friday.',
      'Semana Santa is a great travel week in Peru. If invited on a family trip, go — it\'s bonding time.',
      'Don\'t say "I don\'t really do Easter" — participate in whatever way the family does, even if it\'s just the meal.',
      'Ayacucho\'s Semana Santa is world-famous. If anyone mentions going someday, express interest.',
      'The Saturday party mood after Friday\'s solemnity is a cultural pattern: restraint then release. Go with it.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NAVIDAD — December 24-25
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hol006',
    name: 'Christmas',
    nameSpanish: 'Navidad',
    date: 'December 24 (main celebration) - 25',
    month: 12,
    region: 'both',
    familiarity: 'probably-know',
    summary: "The main celebration is Christmas EVE, not Christmas Day. Midnight is the moment. December 25 is for sleeping in.",
    dayInTheLife: `This is where the biggest cultural difference hits: Christmas in Peru is celebrated on the NIGHT of December 24, not the morning of December 25.

The day of the 24th is preparation. The women are cooking all day — panetón (Italian panettone, hugely popular in Peru), hot chocolate, turkey or pork, tamales, arroz árabe. The men set up, run last-minute errands, and stay out of the way.

The family gathers in the evening, usually around 9-10pm. Dinner starts late — 10 or 11pm. The countdown is to midnight. At exactly 12:00am, everyone hugs, says "¡Feliz Navidad!", toasts with champagne or sidra (sparkling cider), and then — this is when gifts are opened. Not in the morning. Right now, at midnight, with everyone watching.

After gifts, people keep celebrating. Music comes on, dancing starts. Some families go to "Misa de Gallo" (Midnight Mass) at the church. Others just keep the party going until 3 or 4am.

December 25 is for recovery. You sleep in. Maybe leftover turkey for lunch. It's quiet — the opposite of the American Christmas morning frenzy.

The food deserves special mention: panetón con chocolate caliente (panettone with hot chocolate) is THE Christmas flavor combination. Every Peruvian will have strong opinions about which brand of panetón is best.`,
    usComparison: `American Christmas centers on the morning of the 25th: kids waking up early, opening presents under the tree, then big lunch/dinner. Peruvian Christmas centers on the NIGHT of the 24th: dinner at 11pm, gifts at midnight, party until dawn, then sleep all day on the 25th. It's a completely inverted schedule. Also: no Santa Claus coming down the chimney (though "Papá Noel" is known), no stockings, no cookies left out. It's summer in Peru (December), so no white Christmas — instead it's warm. Panetón replaces fruitcake, hot chocolate replaces eggnog.`,
    sensoryDetails: {
      see: 'The whole family dressed up (people wear new clothes), Christmas lights, nativity scene (pesebre/nacimiento), panetón boxes stacked on the counter, champagne bottles ready',
      hear: 'Countdown to midnight, "¡Feliz Navidad!" from everyone, champagne corks popping, villancicos (carols), cumbia after midnight',
      smell: 'Turkey roasting, panetón (sweet bread), hot chocolate, champagne',
      taste: 'Panetón with hot chocolate, turkey, tamales, arroz árabe, champagne or sidra, turrón',
    },
    vocabulary: [
      { spanish: 'la Nochebuena', english: 'Christmas Eve (literally "the Good Night")', context: 'This is the main event' },
      { spanish: 'el panetón', english: 'panettone/sweet bread', context: 'THE Christmas food' },
      { spanish: 'chocolate caliente', english: 'hot chocolate' },
      { spanish: 'el brindis', english: 'the toast' },
      { spanish: 'Papá Noel', english: 'Santa Claus' },
      { spanish: 'el nacimiento / pesebre', english: 'the nativity scene' },
      { spanish: 'la Misa de Gallo', english: 'Midnight Mass (literally "Rooster\'s Mass")' },
      { spanish: 'los villancicos', english: 'Christmas carols' },
      { spanish: 'la sidra', english: 'sparkling cider' },
      { spanish: 'el pavo', english: 'turkey' },
    ],
    phrases: [
      { spanish: '¡Feliz Navidad!', english: 'Merry Christmas!', when: 'At midnight, hugging everyone' },
      { spanish: '¿A qué hora es la cena?', english: 'What time is dinner?', when: 'Planning (answer: late!)' },
      { spanish: '¿Qué panetón compramos?', english: 'Which panettone should we buy?', when: 'This question will spark a debate — everyone has a favorite brand' },
      { spanish: 'Gracias por incluirme en su Navidad.', english: 'Thank you for including me in your Christmas.', when: 'Saying something warm to her mother' },
      { spanish: '¿Necesitan que traiga algo?', english: 'Do you need me to bring anything?', when: 'Offering to contribute' },
    ],
    culturalTips: [
      'Don\'t expect to sleep. The celebration goes until 3-4am. Plan accordingly.',
      'Bring a panetón as a gift when you arrive. It\'s the equivalent of bringing wine to a dinner party.',
      'Everyone hugs everyone at midnight. Every single person in the room. Be ready.',
      'Dress nicely — people wear new or special clothes for Nochebuena. Don\'t show up in a hoodie.',
      'If they do Misa de Gallo, go along even if church isn\'t your thing. It\'s short and it means a lot.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // AÑO NUEVO — December 31 - January 1
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hol007',
    name: "New Year's Eve",
    nameSpanish: 'Año Nuevo',
    date: 'December 31 - January 1',
    month: 1,
    region: 'both',
    familiarity: 'probably-know',
    summary: "Like New Year's everywhere, but with unique Peruvian traditions: yellow underwear, 12 grapes, burning effigies, and suitcase walks.",
    dayInTheLife: `New Year's in Peru is packed with superstitions and traditions that will seem wild if you've never seen them.

The day of December 31: people are buying yellow underwear (for luck and money in the new year — yes, really, entire market stalls sell only yellow underwear this week). Others buy effigies called "muñecos de Año Nuevo" — life-sized dummies stuffed with paper and old clothes, often dressed to look like politicians, celebrities, or just generic bad luck. At midnight, you burn them. The fire represents burning away the old year.

Evening arrives and the family gathers, similar to Nochebuena but often at a different family member's house. Dinner is served around 10-11pm. At midnight:

1. Everyone eats 12 grapes — one per bell toll, one wish per grape. You have to finish before the bells stop.
2. You wear yellow underwear (luck/money) or red (love). People openly discuss which color they chose.
3. Some people run around the block with a suitcase (so they'll travel in the new year).
4. The muñecos burn in the street. Every neighborhood has bonfires.
5. Champagne, hugs, "¡Feliz Año Nuevo!" repeated 50 times.

Then the party continues. Dancing, drinking, fireworks everywhere (not organized shows — individuals buying and setting off their own). The streets smell like gunpowder and burning paper. It's chaotic, loud, warm, and joyful.`,
    usComparison: `US New Year's is relatively standard: Times Square ball drop on TV, champagne toast at midnight, maybe a party. Peruvian New Year's has elaborate superstitions treated half-seriously, half-jokingly: the underwear color, the grapes, the suitcase run, burning effigies in the street. The fire element is the biggest difference — entire neighborhoods have bonfires of burning muñecos, creating a smoky, dramatic atmosphere nothing like the clean fireworks shows in the US. It's also much more family-oriented (not a bar/club holiday) and the superstitions make it participatory in a fun way.`,
    sensoryDetails: {
      see: 'Burning muñecos in every street, yellow underwear in store windows, fireworks from every rooftop, people running with suitcases, 12 grapes ready on plates',
      hear: 'Church bells tolling 12 times, fireworks (non-stop for an hour), "¡Feliz Año!" shouted everywhere, cumbia and salsa',
      smell: 'Burning paper and cloth (muñecos), gunpowder from fireworks, champagne, smoke',
      taste: '12 grapes (fast!), champagne/sidra, leftover Nochebuena food, lentils (for prosperity)',
    },
    vocabulary: [
      { spanish: 'Año Nuevo', english: 'New Year' },
      { spanish: 'la medianoche', english: 'midnight' },
      { spanish: 'las doce uvas', english: 'the 12 grapes' },
      { spanish: 'el muñeco', english: 'the effigy/dummy' },
      { spanish: 'quemar el muñeco', english: 'to burn the effigy' },
      { spanish: 'ropa interior amarilla', english: 'yellow underwear' },
      { spanish: 'la maleta', english: 'the suitcase', context: 'for the travel tradition' },
      { spanish: 'los fuegos artificiales', english: 'fireworks' },
      { spanish: 'los deseos', english: 'wishes' },
      { spanish: 'dar la vuelta a la manzana', english: 'go around the block', context: 'with a suitcase for travel luck' },
    ],
    phrases: [
      { spanish: '¡Feliz Año Nuevo!', english: 'Happy New Year!', when: 'At midnight and all day January 1' },
      { spanish: '¿Ya tienes tu ropa interior amarilla?', english: 'Do you have your yellow underwear yet?', when: 'Joking with the family before the 31st — this is a normal conversation topic' },
      { spanish: '¿Cuáles son tus doce deseos?', english: 'What are your 12 wishes?', when: 'Before the grapes' },
      { spanish: '¿Van a quemar muñeco este año?', english: 'Are you burning an effigy this year?', when: 'Asking about plans' },
      { spanish: '¡No me dio tiempo con las uvas!', english: 'I didn\'t have time with the grapes!', when: 'After failing to eat all 12 — everyone laughs' },
    ],
    culturalTips: [
      'Buy yellow underwear. Seriously. Even if you think it\'s silly, participating in the tradition is bonding.',
      'The 12 grapes are harder than they sound — you have to eat one per bell toll (one per second). Seedless grapes help.',
      'The muñeco burning creates a LOT of smoke. If you have asthma or sensitivities, stay upwind.',
      'Don\'t make fun of the traditions even if they seem superstitious. People are half-joking but also half-hopeful.',
      'Offering to help build or stuff the muñeco is a fun way to participate.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // DÍA DE LOS MUERTOS / DÍA DE TODOS LOS SANTOS — November 1-2
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hol008',
    name: 'Day of the Dead / All Saints Day',
    nameSpanish: 'Día de los Muertos / Día de Todos los Santos',
    date: 'November 1-2',
    month: 11,
    region: 'both',
    familiarity: 'maybe-heard-of',
    summary: "You've probably seen the Mexican version with skulls and marigolds. Peru's version is quieter — families visit cemeteries and bring food to share with the dead.",
    dayInTheLife: `The Mexican version with colorful skulls, altars, and marigolds is what most Americans picture. Peru's version is related but different — quieter, more solemn, more intimate.

November 1 (Día de Todos los Santos) and November 2 (Día de los Muertos), families visit the cemetery where their relatives are buried. But this isn't a somber, silent visit like putting flowers on a grave in the US.

Families bring food — the deceased's favorite dishes. They set up next to the grave: a blanket, plates of food, drinks. They eat together, as if the dead person is still there sharing the meal. Some bring music. Some bring beer and pour a little on the grave (for the dead to drink). Others pray the rosary.

Her mother might pack a basket: bread shaped like babies or dolls (tantawawas in Quechua), purple corn drink (mazamorra morada), the deceased's favorite home-cooked meal. The whole family goes. Kids come too — it's not morbid, it's connection.

The cemetery is full of families doing the same thing. It's social. You might run into relatives you haven't seen in months. There's a community feeling — grief but also gratitude and even joy in remembering.

If someone in her family has passed — a father, grandparent — this day carries weight. Being present, being quiet, being respectful matters enormously.`,
    usComparison: `In the US, visiting a grave is private and solemn — you go alone or in a small group, leave flowers, maybe cry. In Peru (and Latin America broadly), it's a family outing with food, conversation, and community. The relationship to death is different: less distant, less taboo. People talk to the dead openly, bring them food, update them on family news. Halloween exists in Peru now (imported from the US) but is seen as shallow compared to the genuine ancestor connection of Día de los Muertos. The food element — eating with the dead — has no US equivalent.`,
    sensoryDetails: {
      see: 'Families picnicking among graves, flowers covering headstones, tantawawas (bread dolls), candles lit everywhere, colorful blankets on the ground',
      hear: 'Prayers, quiet conversation, sometimes Andean music, church bells, birds',
      smell: 'Flowers (especially yellow ones), candle wax, home-cooked food, mazamorra morada (purple corn pudding)',
      taste: 'Tantawawas (sweet bread), mazamorra morada, the deceased\'s favorite home-cooked food',
    },
    vocabulary: [
      { spanish: 'el cementerio', english: 'the cemetery' },
      { spanish: 'los difuntos', english: 'the deceased/dead' },
      { spanish: 'la tumba', english: 'the grave/tomb' },
      { spanish: 'recordar', english: 'to remember' },
      { spanish: 'rezar', english: 'to pray' },
      { spanish: 'las velas', english: 'candles' },
      { spanish: 'tantawawas', english: 'bread dolls (Quechua tradition)' },
      { spanish: 'mazamorra morada', english: 'purple corn pudding' },
      { spanish: 'los antepasados', english: 'ancestors' },
      { spanish: 'en paz descanse', english: 'rest in peace' },
    ],
    phrases: [
      { spanish: '¿Van al cementerio este año?', english: 'Are you going to the cemetery this year?', when: 'Asking about plans around Nov 1-2' },
      { spanish: '¿Quieren que los acompañe?', english: 'Do you want me to come along?', when: 'Offering to join — only if appropriate' },
      { spanish: 'Lo siento mucho. ¿Cómo era él/ella?', english: 'I\'m very sorry. What were they like?', when: 'If they share about someone who passed' },
      { spanish: '¿Qué le gustaba comer?', english: 'What did they like to eat?', when: 'Asking about bringing the right food' },
      { spanish: 'Es bonito mantener esta tradición.', english: 'It\'s beautiful to keep this tradition.', when: 'Showing respect for the custom' },
    ],
    culturalTips: [
      'If invited to the cemetery visit, go. Your presence means you\'re considered family.',
      'Don\'t be cheerful or crack jokes at the cemetery. But don\'t be overly somber either — match the family\'s tone.',
      'Asking about the deceased — what they were like, their favorite things — is welcome. It shows you care.',
      'If someone pours a drink on a grave, don\'t react with surprise. It\'s offering a drink to the dead.',
      'This might be emotional for her mother. Be quietly supportive. A hand on the shoulder goes a long way.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // DÍA DEL PADRE — Third Sunday of June (Peru)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hol009',
    name: "Father's Day",
    nameSpanish: 'Día del Padre',
    date: 'Third Sunday of June',
    month: 6,
    region: 'both',
    familiarity: 'probably-know',
    summary: "Similar to the US version but more family-centered. Also potentially complicated if her father has passed.",
    dayInTheLife: `Father's Day in Peru is the third Sunday of June — same as the US. The structure is similar to Mother's Day but typically a bit less elaborate: family lunch, gifts, maybe the dad gets to choose the restaurant or activity.

For your situation, this could be sensitive if her father has passed. The day might be quiet, or the family might visit the cemetery (connecting to Día de los Muertos traditions). Pay attention to cues.

If her brothers have children, the focus shifts to them as fathers. The family gathers, the kids give their dads handmade cards from school (just like the US), and there's a big meal. As the boyfriend, you're there in a supportive role — you might help organize or contribute to the meal.

It's generally less intense than Mother's Day in Latin America. Mothers occupy a near-sacred cultural position. Father's Day is important but more casual — more "let's have a good time" than "emotional speeches."`,
    usComparison: `Very similar to the US in structure — probably the most similar holiday between the two cultures. The main difference is scale: like Mother's Day, it tends to be a bigger family gathering rather than just dad + nuclear family. Also, if the father has passed, the day takes on a memorial quality connected to the broader culture of ancestor remembrance that doesn't exist as strongly in the US.`,
    sensoryDetails: {
      see: 'Family gathered for lunch, kids presenting homemade cards, perhaps a parrillada (grill-out) since dad often "gets to grill"',
      hear: 'Kids saying "¡Feliz día, papá!", family conversation, sports on TV (dad\'s choice)',
      smell: 'Grilled meat (anticuchos, parrillada), beer',
      taste: 'Parrillada (grilled meats), beer, whatever dad\'s favorite food is',
    },
    vocabulary: [
      { spanish: 'el papá / el padre', english: 'dad / father' },
      { spanish: 'el suegro', english: 'father-in-law', context: 'her father' },
      { spanish: 'que en paz descanse', english: 'may he rest in peace', context: 'if he has passed' },
      { spanish: 'la parrillada', english: 'barbecue/grillout' },
      { spanish: 'el regalo', english: 'the gift' },
      { spanish: 'los hijos', english: 'the children/sons' },
    ],
    phrases: [
      { spanish: '¡Feliz Día del Padre!', english: 'Happy Father\'s Day!', when: 'Greeting her brothers if they have kids' },
      { spanish: '¿Hacen algo especial hoy?', english: 'Are you doing anything special today?', when: 'Asking about plans' },
      { spanish: '¿Cómo era su papá?', english: 'What was your/her dad like?', when: 'If appropriate — asking about the deceased father' },
      { spanish: 'Yo me encargo de la parrilla.', english: 'I\'ll take care of the grill.', when: 'Offering to grill' },
    ],
    culturalTips: [
      'Be sensitive — if her father has passed, follow the family\'s lead on how to handle the day.',
      'If her brothers are fathers, acknowledging them matters. A simple "Feliz día" goes a long way.',
      'Offering to grill (if there\'s a parrillada) is a good role for you as the non-dad male present.',
      'Don\'t make it about you not being a father yet. Just support and participate.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CANDELARIA — February
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hol010',
    name: 'Festival of Candelaria',
    nameSpanish: 'Fiesta de la Candelaria',
    date: 'First two weeks of February',
    month: 2,
    region: 'peru',
    familiarity: 'new-to-you',
    summary: "The biggest dance festival in South America. Thousands of dancers in elaborate costumes take over Puno for two weeks.",
    dayInTheLife: `Candelaria is based in Puno (on Lake Titicaca) and is one of the most visually spectacular festivals in the world — UNESCO Intangible Cultural Heritage since 2014.

For two weeks in February, the city of Puno transforms. Over 40,000 dancers and 9,000 musicians perform in the streets in elaborate, colorful costumes — feathered headdresses, demon masks, sequined outfits weighing 20+ pounds. Dance groups (comparsas) practice all year for this.

The festival blends Catholic and Andean traditions: it honors the Virgen de la Candelaria but incorporates pre-colonial dances like the Diablada (Dance of the Devils), Morenada, and Caporales. The devil masks aren't evil — they represent the conquest of good over evil.

For a Lima-based family, they might watch it on TV or have relatives from Puno who travel back for it. If anyone in her family is from Puno or the highlands, Candelaria is a source of immense pride.

The energy is like Carnival in Rio but with Andean music — brass bands, drums, zampoñas (pan flutes). It's not a spectator event; the line between performer and audience blurs. People dance in the streets whether they're in a comparsa or not.`,
    usComparison: `The closest US equivalent might be Mardi Gras in New Orleans — a multi-day festival with elaborate costumes, music, and dancing that takes over a city. But Candelaria has no bead-throwing or party atmosphere — it's performance art, cultural pride, and religious devotion fused together. The preparation is extraordinary: groups rehearse for a year. The costumes cost thousands of dollars. It's competitive — groups are judged and winning is prestigious. Nothing in the US combines religious procession + dance competition + cultural preservation at this scale.`,
    sensoryDetails: {
      see: 'Thousands of dancers in sequined costumes, devil masks in red and gold, feathered headdresses 3 feet tall, Lake Titicaca in the background',
      hear: 'Brass bands (bandas), drums pounding, zampoñas, crowd cheering, dancers\' bells and sequins jingling',
      smell: 'Street food (salchipapa, anticuchos), cold highland air, beer, incense',
      taste: 'Salchipapa (fries with hot dog), trucha (lake trout), caldo de cabeza (head soup — traditional), ponche (warm spiced punch)',
    },
    vocabulary: [
      { spanish: 'la diablada', english: 'Dance of the Devils' },
      { spanish: 'la comparsa', english: 'the dance group/troupe' },
      { spanish: 'el traje', english: 'the costume/outfit' },
      { spanish: 'la máscara', english: 'the mask' },
      { spanish: 'el altiplano', english: 'the high plateau (Andes region)' },
      { spanish: 'Puno', english: 'City on Lake Titicaca' },
      { spanish: 'la Virgen de la Candelaria', english: 'Virgin of Candelaria' },
      { spanish: 'la banda', english: 'the brass band' },
      { spanish: 'ensayar', english: 'to rehearse', context: 'groups rehearse all year' },
      { spanish: 'el concurso', english: 'the competition/contest' },
    ],
    phrases: [
      { spanish: '¿Alguien de tu familia es de Puno?', english: 'Is anyone in your family from Puno?', when: 'Exploring family roots' },
      { spanish: '¿Han ido a la Candelaria alguna vez?', english: 'Have you ever been to Candelaria?', when: 'Asking if they\'ve experienced it' },
      { spanish: 'Los trajes son increíbles.', english: 'The costumes are incredible.', when: 'Watching it on TV or looking at photos' },
      { spanish: '¿Cuál es tu danza favorita?', english: 'What\'s your favorite dance?', when: 'If they know the different styles' },
      { spanish: 'Me gustaría verlo algún día en persona.', english: 'I\'d like to see it in person someday.', when: 'Expressing interest in going' },
    ],
    culturalTips: [
      'If anyone in the family dances in a comparsa, that\'s a huge deal. Ask about it — they\'ll light up.',
      'Puno is at 3,800m (12,500ft) elevation. If you visit, altitude sickness is real. Coca tea helps.',
      'The devil masks aren\'t satanic — they\'re cultural. Don\'t make that association.',
      'This festival represents Andean identity. Showing interest and respect connects you to her heritage.',
      'Videos on YouTube are stunning — watching together and asking questions is great couple/family bonding.',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

/** Get holidays sorted by month (calendar order) */
export function getHolidaysByMonth(): LatinHoliday[] {
  return [...latinHolidays].sort((a, b) => a.month - b.month);
}

/** Get holidays by familiarity level */
export function getHolidaysByFamiliarity(level: LatinHoliday['familiarity']): LatinHoliday[] {
  return latinHolidays.filter(h => h.familiarity === level);
}

/** Get the next upcoming holiday based on current month */
export function getNextHoliday(currentMonth: number): LatinHoliday | undefined {
  const sorted = getHolidaysByMonth();
  return sorted.find(h => h.month >= currentMonth) || sorted[0];
}

/** Get Peru-specific holidays */
export function getPeruHolidays(): LatinHoliday[] {
  return latinHolidays.filter(h => h.region === 'peru' || h.region === 'both');
}
