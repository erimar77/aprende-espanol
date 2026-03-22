// Guitar practice songs for Spanish learners
// All lyrics are original, written for language learning purposes
// Real song references are provided by title/artist only for further practice

export interface ChordDiagram {
  name: string;
  frets: string; // e.g. "x32010" low E to high E
  fingers: string; // finger positions
  barFret?: number;
}

export interface TabLine {
  label?: string;
  e: string;
  B: string;
  G: string;
  D: string;
  A: string;
  E: string;
}

export interface GuitarSong {
  id: string;
  title: string;
  titleEnglish: string;
  description: string;
  descriptionSpanish: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  chords: string[];
  chordDiagrams: ChordDiagram[];
  strumPattern?: string;
  strumPatternDescription?: string;
  accentPattern?: ('accent' | 'normal' | 'ghost' | 'silent')[];
  sections: SongSection[];
  tab?: TabLine[];
  // Real songs with similar progressions to look up
  similarSongs?: { title: string; artist: string; note: string }[];
  tips?: string[];
  tipsSpanish?: string[];
}

export interface SongSection {
  type: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'interlude';
  label: string;
  labelSpanish: string;
  lines: SongLine[];
}

export interface SongLine {
  chords: string; // chord symbols above
  lyrics: string; // Spanish lyrics
  lyricsEnglish: string; // English translation
}

// ============================================================
// CHORD LIBRARY
// ============================================================

export const chordLibrary: Record<string, ChordDiagram> = {
  'C':    { name: 'C',    frets: 'x32010', fingers: '-32-1-' },
  'G':    { name: 'G',    frets: '320003', fingers: '21---3' },
  'D':    { name: 'D',    frets: 'xx0232', fingers: '---132' },
  'Dm':   { name: 'Dm',   frets: 'xx0231', fingers: '---231' },
  'Em':   { name: 'Em',   frets: '022000', fingers: '-23---' },
  'Am':   { name: 'Am',   frets: 'x02210', fingers: '--231-' },
  'E':    { name: 'E',    frets: '022100', fingers: '-231--' },
  'A':    { name: 'A',    frets: 'x02220', fingers: '--123-' },
  'F':    { name: 'F',    frets: '133211', fingers: '134211', barFret: 1 },
  'Bm':   { name: 'Bm',   frets: 'x24432', fingers: '-13421', barFret: 2 },
  'B7':   { name: 'B7',   frets: 'x21202', fingers: '-21-34' },
  'E7':   { name: 'E7',   frets: '020100', fingers: '-2-1--' },
  'A7':   { name: 'A7',   frets: 'x02020', fingers: '--2-3-' },
  'D7':   { name: 'D7',   frets: 'xx0212', fingers: '---213' },
  'G7':   { name: 'G7',   frets: '320001', fingers: '32---1' },
  'C7':   { name: 'C7',   frets: 'x32310', fingers: '-3241-' },
  'Cadd9': { name: 'Cadd9', frets: 'x32030', fingers: '-32-4-' },
  'Am7':  { name: 'Am7',  frets: 'x02010', fingers: '--2-1-' },
  'Dm7':  { name: 'Dm7',  frets: 'xx0211', fingers: '---211' },
  'Cmaj7': { name: 'Cmaj7', frets: 'x32000', fingers: '-32---' },
  'Fmaj7': { name: 'Fmaj7', frets: 'xx3210', fingers: '--321-' },
};

// ============================================================
// SONGS - Original lyrics for Spanish practice
// ============================================================

export const guitarSongs: GuitarSong[] = [
  {
    id: 'caminando',
    title: 'Caminando por la ciudad',
    titleEnglish: 'Walking Through the City',
    description: 'A simple 3-chord song perfect for absolute beginners. Practice basic open chords while learning city vocabulary.',
    descriptionSpanish: 'Una canción simple de 3 acordes perfecta para principiantes. Practica acordes abiertos mientras aprendes vocabulario de la ciudad.',
    difficulty: 'beginner',
    chords: ['G', 'C', 'D'],
    chordDiagrams: [
      { name: 'G', frets: '320003', fingers: '21---3' },
      { name: 'C', frets: 'x32010', fingers: '-32-1-' },
      { name: 'D', frets: 'xx0232', fingers: '---132' },
    ],
    strumPattern: 'D D U U D U',
    strumPatternDescription: 'Simple down-up pattern. Start slow, focus on clean chord changes.',
    accentPattern: ['accent', 'normal', 'ghost', 'normal'],
    sections: [
      {
        type: 'verse',
        label: 'Verse 1',
        labelSpanish: 'Verso 1',
        lines: [
          { chords: 'G                    C', lyrics: 'Caminando por la ciudad,', lyricsEnglish: 'Walking through the city,' },
          { chords: 'D                    G', lyrics: 'veo gente pasar y pasar.', lyricsEnglish: 'I see people pass and pass.' },
          { chords: 'G                    C', lyrics: 'Las tiendas abren sus puertas,', lyricsEnglish: 'The shops open their doors,' },
          { chords: 'D                    G', lyrics: 'el sol empieza a brillar.', lyricsEnglish: 'the sun begins to shine.' },
        ],
      },
      {
        type: 'chorus',
        label: 'Chorus',
        labelSpanish: 'Coro',
        lines: [
          { chords: 'C          D', lyrics: 'Buenos días, mi ciudad,', lyricsEnglish: 'Good morning, my city,' },
          { chords: 'G          C', lyrics: 'hoy es un día especial.', lyricsEnglish: 'today is a special day.' },
          { chords: 'C          D', lyrics: 'Con mi guitarra yo canto,', lyricsEnglish: 'With my guitar I sing,' },
          { chords: 'D          G', lyrics: 'esta canción de amistad.', lyricsEnglish: 'this song of friendship.' },
        ],
      },
      {
        type: 'verse',
        label: 'Verse 2',
        labelSpanish: 'Verso 2',
        lines: [
          { chords: 'G                    C', lyrics: 'El mercado está lleno,', lyricsEnglish: 'The market is full,' },
          { chords: 'D                    G', lyrics: 'de frutas de cada color.', lyricsEnglish: 'of fruits of every color.' },
          { chords: 'G                    C', lyrics: 'Los niños juegan contentos,', lyricsEnglish: 'The children play happily,' },
          { chords: 'D                    G', lyrics: 'la vida es un regalo mayor.', lyricsEnglish: 'life is a great gift.' },
        ],
      },
    ],
    similarSongs: [
      { title: 'La Bamba', artist: 'Ritchie Valens', note: 'C, F, G — similar 3-chord Latin progression' },
      { title: 'Guantanamera', artist: 'Traditional Cuban', note: 'C, F, G — classic folk progression' },
      { title: 'De Colores', artist: 'Traditional', note: 'G, C, D — same chords as this song' },
    ],
    tips: [
      'Focus on the G to C transition — keep your ring finger planted as an anchor',
      'The D to G change is one of the most common in music — practice it slowly',
      'Try humming the melody first, then add the Spanish words',
    ],
    tipsSpanish: [
      'Enfócate en la transición de G a C — mantén tu dedo anular como ancla',
      'El cambio de D a G es uno de los más comunes — practícalo lento',
      'Intenta tararear la melodía primero, luego añade las palabras en español',
    ],
  },
  {
    id: 'mi-corazon',
    title: 'Mi corazón canta',
    titleEnglish: 'My Heart Sings',
    description: 'A gentle ballad using Am, C, G, and F. Practice the F barre chord or use the easy Fmaj7 (xx3210) as a substitute.',
    descriptionSpanish: 'Una balada suave usando Am, C, G y F. Practica el acorde de cejilla F o usa Fmaj7 (xx3210) como sustituto.',
    difficulty: 'beginner',
    chords: ['Am', 'C', 'G', 'F'],
    chordDiagrams: [
      { name: 'Am', frets: 'x02210', fingers: '--231-' },
      { name: 'C', frets: 'x32010', fingers: '-32-1-' },
      { name: 'G', frets: '320003', fingers: '21---3' },
      { name: 'F', frets: '133211', fingers: '134211', barFret: 1 },
    ],
    strumPattern: 'D   D U   U D U',
    strumPatternDescription: 'Ballad strum with a slight pause. Count: 1 . 2 & . & 3 &',
    accentPattern: ['accent', 'ghost', 'normal', 'ghost'],
    sections: [
      {
        type: 'verse',
        label: 'Verse 1',
        labelSpanish: 'Verso 1',
        lines: [
          { chords: 'Am              C', lyrics: 'Cuando cierro los ojos,', lyricsEnglish: 'When I close my eyes,' },
          { chords: 'G               F', lyrics: 'escucho el viento cantar.', lyricsEnglish: 'I hear the wind sing.' },
          { chords: 'Am              C', lyrics: 'Las estrellas me dicen,', lyricsEnglish: 'The stars tell me,' },
          { chords: 'G               F', lyrics: 'que todo va a estar bien ya.', lyricsEnglish: 'that everything will be fine now.' },
        ],
      },
      {
        type: 'chorus',
        label: 'Chorus',
        labelSpanish: 'Coro',
        lines: [
          { chords: 'C            G', lyrics: 'Mi corazón canta,', lyricsEnglish: 'My heart sings,' },
          { chords: 'Am           F', lyrics: 'una canción sin final.', lyricsEnglish: 'a song without end.' },
          { chords: 'C            G', lyrics: 'En español yo sueño,', lyricsEnglish: 'In Spanish I dream,' },
          { chords: 'Am           F', lyrics: 'y empiezo a despertar.', lyricsEnglish: 'and I begin to wake up.' },
        ],
      },
      {
        type: 'verse',
        label: 'Verse 2',
        labelSpanish: 'Verso 2',
        lines: [
          { chords: 'Am              C', lyrics: 'La luna ilumina,', lyricsEnglish: 'The moon illuminates,' },
          { chords: 'G               F', lyrics: 'el camino que voy a tomar.', lyricsEnglish: 'the path I\'m going to take.' },
          { chords: 'Am              C', lyrics: 'No tengo miedo ahora,', lyricsEnglish: 'I\'m not afraid now,' },
          { chords: 'G               F', lyrics: 'mi guitarra me va a guiar.', lyricsEnglish: 'my guitar will guide me.' },
        ],
      },
    ],
    similarSongs: [
      { title: 'Bailando', artist: 'Enrique Iglesias', note: 'Am-based progression, similar feel' },
      { title: 'Malagueña Salerosa', artist: 'Traditional', note: 'Am-based folk song, beautiful for practice' },
    ],
    tips: [
      'If F is too hard, try Fmaj7: place fingers on frets xx3210 — much easier!',
      'The Am to C change only requires lifting one finger',
      'Try fingerpicking: thumb on bass, fingers on G-B-e strings',
    ],
    tipsSpanish: [
      'Si F es muy difícil, prueba Fmaj7: coloca los dedos en trastes xx3210 — ¡mucho más fácil!',
      'El cambio de Am a C solo requiere levantar un dedo',
      'Intenta punteo: pulgar en bajo, dedos en cuerdas G-B-e',
    ],
  },
  {
    id: 'fiesta-en-la-playa',
    title: 'Fiesta en la playa',
    titleEnglish: 'Party at the Beach',
    description: 'An upbeat 3-chord song with a Latin strum pattern. Great for building rhythm and learning vacation vocabulary.',
    descriptionSpanish: 'Una canción alegre de 3 acordes con un patrón de rasgueo latino. Excelente para desarrollar el ritmo y aprender vocabulario de vacaciones.',
    difficulty: 'beginner',
    chords: ['A', 'D', 'E'],
    chordDiagrams: [
      { name: 'A', frets: 'x02220', fingers: '--123-' },
      { name: 'D', frets: 'xx0232', fingers: '---132' },
      { name: 'E', frets: '022100', fingers: '-231--' },
    ],
    strumPattern: 'D . D U . U D U',
    strumPatternDescription: 'Cumbia-style strum. Accent the first down strum. The dots are rests — lift your hand but don\'t strum.',
    accentPattern: ['accent', 'ghost', 'accent', 'ghost'],
    sections: [
      {
        type: 'verse',
        label: 'Verse 1',
        labelSpanish: 'Verso 1',
        lines: [
          { chords: 'A                    D', lyrics: 'Vamos a la playa hoy,', lyricsEnglish: 'Let\'s go to the beach today,' },
          { chords: 'E                    A', lyrics: 'el agua es azul y clara.', lyricsEnglish: 'the water is blue and clear.' },
          { chords: 'A                    D', lyrics: 'Traigo mi guitarra aquí,', lyricsEnglish: 'I bring my guitar here,' },
          { chords: 'E                    A', lyrics: 'y una sonrisa en la cara.', lyricsEnglish: 'and a smile on my face.' },
        ],
      },
      {
        type: 'chorus',
        label: 'Chorus',
        labelSpanish: 'Coro',
        lines: [
          { chords: 'D            A', lyrics: '¡Fiesta, fiesta en la playa!', lyricsEnglish: 'Party, party at the beach!' },
          { chords: 'E            A', lyrics: 'Bailamos bajo el sol.', lyricsEnglish: 'We dance under the sun.' },
          { chords: 'D            A', lyrics: '¡Fiesta, fiesta en la playa!', lyricsEnglish: 'Party, party at the beach!' },
          { chords: 'E            A', lyrics: 'La música es lo mejor.', lyricsEnglish: 'The music is the best.' },
        ],
      },
      {
        type: 'verse',
        label: 'Verse 2',
        labelSpanish: 'Verso 2',
        lines: [
          { chords: 'A                    D', lyrics: 'Las olas van y vienen,', lyricsEnglish: 'The waves come and go,' },
          { chords: 'E                    A', lyrics: 'los peces saltan al mar.', lyricsEnglish: 'the fish jump in the sea.' },
          { chords: 'A                    D', lyrics: 'Comemos tacos con salsa,', lyricsEnglish: 'We eat tacos with salsa,' },
          { chords: 'E                    A', lyrics: 'la vida es para gozar.', lyricsEnglish: 'life is for enjoying.' },
        ],
      },
    ],
    tab: [
      {
        label: 'Intro riff (play 2x)',
        e: '|---0---0---2---0---|---0---0---2---0---|',
        B: '|---2---2---3---2---|---2---2---3---2---|',
        G: '|---2---2---2---2---|---2---2---2---2---|',
        D: '|---2---2---0---2---|---2---2---0---2---|',
        A: '|---0---0-------0---|---0---0-------0---|',
        E: '|-------------------|-------------------|',
      },
    ],
    similarSongs: [
      { title: 'La Bamba', artist: 'Ritchie Valens', note: 'Same I-IV-V progression in a different key' },
      { title: 'Twist and Shout', artist: 'The Beatles', note: 'D-G-A same pattern' },
    ],
    tips: [
      'The A-D-E progression is the I-IV-V in the key of A — the most important progression in music',
      'Try muting the strings between strums for a percussive cumbia feel',
      'For the intro riff, use your pick on downstrokes only',
    ],
    tipsSpanish: [
      'La progresión A-D-E es el I-IV-V en la tonalidad de A — la progresión más importante en la música',
      'Intenta silenciar las cuerdas entre rasgueos para un sonido percusivo de cumbia',
      'Para el riff de intro, usa tu púa solo en golpes hacia abajo',
    ],
  },
  {
    id: 'bajo-las-estrellas',
    title: 'Bajo las estrellas',
    titleEnglish: 'Under the Stars',
    description: 'A romantic fingerpicking song with 4 chords. Perfect for practicing arpeggios while learning nature vocabulary.',
    descriptionSpanish: 'Una canción romántica de punteo con 4 acordes. Perfecta para practicar arpegios mientras aprendes vocabulario de la naturaleza.',
    difficulty: 'intermediate',
    chords: ['Em', 'C', 'G', 'D'],
    chordDiagrams: [
      { name: 'Em', frets: '022000', fingers: '-23---' },
      { name: 'C', frets: 'x32010', fingers: '-32-1-' },
      { name: 'G', frets: '320003', fingers: '21---3' },
      { name: 'D', frets: 'xx0232', fingers: '---132' },
    ],
    strumPattern: 'Fingerpick: p i m a m i',
    strumPatternDescription: 'Fingerpick pattern: thumb (p) plays bass note, then index (i), middle (m), ring (a), middle (m), index (i). One pattern per chord.',
    accentPattern: ['accent', 'ghost', 'ghost', 'ghost'],
    sections: [
      {
        type: 'intro',
        label: 'Intro',
        labelSpanish: 'Introducción',
        lines: [
          { chords: 'Em    C    G    D', lyrics: '(fingerpick pattern x2)', lyricsEnglish: '(fingerpick pattern x2)' },
        ],
      },
      {
        type: 'verse',
        label: 'Verse 1',
        labelSpanish: 'Verso 1',
        lines: [
          { chords: 'Em                C', lyrics: 'Bajo las estrellas yo te vi,', lyricsEnglish: 'Under the stars I saw you,' },
          { chords: 'G                 D', lyrics: 'la noche era joven como tú.', lyricsEnglish: 'the night was young like you.' },
          { chords: 'Em                C', lyrics: 'El río susurraba tu nombre,', lyricsEnglish: 'The river whispered your name,' },
          { chords: 'G                 D', lyrics: 'y la luna pintaba su luz.', lyricsEnglish: 'and the moon painted its light.' },
        ],
      },
      {
        type: 'chorus',
        label: 'Chorus',
        labelSpanish: 'Coro',
        lines: [
          { chords: 'C             G', lyrics: 'Dime, ¿adónde vas?', lyricsEnglish: 'Tell me, where are you going?' },
          { chords: 'D             Em', lyrics: 'No quiero olvidar.', lyricsEnglish: 'I don\'t want to forget.' },
          { chords: 'C             G', lyrics: 'Bajo las estrellas,', lyricsEnglish: 'Under the stars,' },
          { chords: 'D             Em', lyrics: 'quiero siempre estar.', lyricsEnglish: 'I always want to be.' },
        ],
      },
      {
        type: 'verse',
        label: 'Verse 2',
        labelSpanish: 'Verso 2',
        lines: [
          { chords: 'Em                C', lyrics: 'Las montañas guardan secretos,', lyricsEnglish: 'The mountains keep secrets,' },
          { chords: 'G                 D', lyrics: 'los árboles cantan con el viento.', lyricsEnglish: 'the trees sing with the wind.' },
          { chords: 'Em                C', lyrics: 'Aquí en este momento perfecto,', lyricsEnglish: 'Here in this perfect moment,' },
          { chords: 'G                 D', lyrics: 'no necesito nada, estoy contento.', lyricsEnglish: 'I need nothing, I am content.' },
        ],
      },
    ],
    tab: [
      {
        label: 'Fingerpick pattern (Em)',
        e: '|-------0-------0---|',
        B: '|-----0---0---0---0-|',
        G: '|---0-------0-------|',
        D: '|-------------------|',
        A: '|-------------------|',
        E: '|-0-----------------| ← thumb',
      },
      {
        label: 'Fingerpick pattern (C)',
        e: '|-------0-------0---|',
        B: '|-----1---1---1---1-|',
        G: '|---0-------0-------|',
        D: '|-------------------|',
        A: '|-3-----------------| ← thumb',
        E: '|-------------------|',
      },
      {
        label: 'Melodic interlude',
        e: '|---0---3---5---3---0---|---0---3---5---7---5---|',
        B: '|---0---0---0---0---0---|---0---0---0---0---0---|',
        G: '|-----------------------|-----------------------|',
        D: '|-----------------------|-----------------------|',
        A: '|-----------------------|-----------------------|',
        E: '|-----------------------|-----------------------|',
      },
    ],
    similarSongs: [
      { title: 'Recuérdame', artist: 'from Coco soundtrack', note: 'Beautiful fingerpicking song in Spanish' },
      { title: 'Bésame Mucho', artist: 'Consuelo Velázquez', note: 'Classic romantic bolero — great for fingerpicking' },
    ],
    tips: [
      'Start the fingerpick pattern very slowly — speed comes with muscle memory',
      'Keep your picking hand relaxed and anchored on the guitar body',
      'The Em to C transition is smooth — just move two fingers down one string each',
    ],
    tipsSpanish: [
      'Empieza el punteo muy lento — la velocidad viene con la memoria muscular',
      'Mantén tu mano de punteo relajada y anclada en el cuerpo de la guitarra',
      'La transición de Em a C es suave — solo mueve dos dedos una cuerda abajo',
    ],
  },
  {
    id: 'el-tren',
    title: 'El tren de la mañana',
    titleEnglish: 'The Morning Train',
    description: 'A folk-style song using a classic I-V-vi-IV progression. Great vocabulary for daily routines and travel.',
    descriptionSpanish: 'Una canción estilo folk usando la progresión clásica I-V-vi-IV. Gran vocabulario para rutinas diarias y viajes.',
    difficulty: 'beginner',
    chords: ['C', 'G', 'Am', 'F'],
    chordDiagrams: [
      { name: 'C', frets: 'x32010', fingers: '-32-1-' },
      { name: 'G', frets: '320003', fingers: '21---3' },
      { name: 'Am', frets: 'x02210', fingers: '--231-' },
      { name: 'F', frets: '133211', fingers: '134211', barFret: 1 },
    ],
    strumPattern: 'D D U U D U',
    strumPatternDescription: 'Standard pop strum. The I-V-vi-IV is the most-used progression in popular music worldwide.',
    accentPattern: ['accent', 'normal', 'ghost', 'normal'],
    sections: [
      {
        type: 'verse',
        label: 'Verse 1',
        labelSpanish: 'Verso 1',
        lines: [
          { chords: 'C                  G', lyrics: 'Me despierto temprano hoy,', lyricsEnglish: 'I wake up early today,' },
          { chords: 'Am                 F', lyrics: 'el café está en la mesa.', lyricsEnglish: 'the coffee is on the table.' },
          { chords: 'C                  G', lyrics: 'Tomo el tren de la mañana,', lyricsEnglish: 'I take the morning train,' },
          { chords: 'Am                 F', lyrics: 'y comienza la promesa.', lyricsEnglish: 'and the promise begins.' },
        ],
      },
      {
        type: 'chorus',
        label: 'Chorus',
        labelSpanish: 'Coro',
        lines: [
          { chords: 'C         G', lyrics: 'Voy, voy, voy,', lyricsEnglish: 'I go, I go, I go,' },
          { chords: 'Am        F', lyrics: 'adonde me lleve el sol.', lyricsEnglish: 'wherever the sun takes me.' },
          { chords: 'C         G', lyrics: 'Voy, voy, voy,', lyricsEnglish: 'I go, I go, I go,' },
          { chords: 'Am        F', lyrics: 'con mi guitarra y mi voz.', lyricsEnglish: 'with my guitar and my voice.' },
        ],
      },
      {
        type: 'verse',
        label: 'Verse 2',
        labelSpanish: 'Verso 2',
        lines: [
          { chords: 'C                  G', lyrics: 'Por la ventana yo veo,', lyricsEnglish: 'Through the window I see,' },
          { chords: 'Am                 F', lyrics: 'campos verdes y el cielo azul.', lyricsEnglish: 'green fields and the blue sky.' },
          { chords: 'C                  G', lyrics: 'La gente sube y se baja,', lyricsEnglish: 'People get on and off,' },
          { chords: 'Am                 F', lyrics: 'cada uno busca su luz.', lyricsEnglish: 'each one looks for their light.' },
        ],
      },
    ],
    similarSongs: [
      { title: 'No Woman No Cry', artist: 'Bob Marley', note: 'Same C-G-Am-F progression' },
      { title: 'Let It Be', artist: 'The Beatles', note: 'Same C-G-Am-F progression' },
      { title: 'Zombie', artist: 'The Cranberries', note: 'Em-C-G-D similar feel' },
    ],
    tips: [
      'This C-G-Am-F progression is in hundreds of pop songs — master it!',
      'If F is hard, try just fretting the top 4 strings: xx3211',
      'Practice changing chords on beat 1 — use a metronome at 80 BPM',
    ],
    tipsSpanish: [
      'Esta progresión C-G-Am-F está en cientos de canciones pop — ¡domínala!',
      'Si F es difícil, intenta solo presionar las 4 cuerdas superiores: xx3211',
      'Practica cambiar acordes en el beat 1 — usa un metrónomo a 80 BPM',
    ],
  },
  {
    id: 'no-me-importa',
    title: 'No me importa',
    titleEnglish: 'I Don\'t Care',
    description: 'A fun, punky 3-chord song with attitude. All downstrokes for energy! Practice expressing opinions in Spanish.',
    descriptionSpanish: 'Una canción punk divertida de 3 acordes con actitud. ¡Todos golpes hacia abajo para energía! Practica expresar opiniones en español.',
    difficulty: 'beginner',
    chords: ['E', 'A', 'D'],
    chordDiagrams: [
      { name: 'E', frets: '022100', fingers: '-231--' },
      { name: 'A', frets: 'x02220', fingers: '--123-' },
      { name: 'D', frets: 'xx0232', fingers: '---132' },
    ],
    strumPattern: 'D D D D D D D D',
    strumPatternDescription: 'All downstrokes! Fast and energetic. Think punk rock — simple but powerful.',
    accentPattern: ['accent', 'normal', 'accent', 'normal'],
    sections: [
      {
        type: 'verse',
        label: 'Verse 1',
        labelSpanish: 'Verso 1',
        lines: [
          { chords: 'E                      A', lyrics: 'Dicen que no puedo hablar,', lyricsEnglish: 'They say I can\'t speak,' },
          { chords: 'D                      E', lyrics: 'dicen que me falta mucho más.', lyricsEnglish: 'they say I have a lot more to go.' },
          { chords: 'E                      A', lyrics: 'Pero yo practico cada día,', lyricsEnglish: 'But I practice every day,' },
          { chords: 'D                      E', lyrics: '¡y no me importa lo demás!', lyricsEnglish: 'and I don\'t care about the rest!' },
        ],
      },
      {
        type: 'chorus',
        label: 'Chorus',
        labelSpanish: 'Coro',
        lines: [
          { chords: 'A       D      E', lyrics: '¡No me importa! (no, no, no)', lyricsEnglish: 'I don\'t care! (no, no, no)' },
          { chords: 'A       D      E', lyrics: '¡No me importa! (no, no, no)', lyricsEnglish: 'I don\'t care! (no, no, no)' },
          { chords: 'A              D', lyrics: 'Yo sigo aprendiendo,', lyricsEnglish: 'I keep on learning,' },
          { chords: 'D              E', lyrics: 'y nunca voy a parar.', lyricsEnglish: 'and I\'m never going to stop.' },
        ],
      },
      {
        type: 'verse',
        label: 'Verse 2',
        labelSpanish: 'Verso 2',
        lines: [
          { chords: 'E                      A', lyrics: 'Mi acento es un poco raro,', lyricsEnglish: 'My accent is a bit strange,' },
          { chords: 'D                      E', lyrics: 'mezclo las palabras a veces.', lyricsEnglish: 'I mix up words sometimes.' },
          { chords: 'E                      A', lyrics: 'Pero cada error es un paso,', lyricsEnglish: 'But every mistake is a step,' },
          { chords: 'D                      E', lyrics: '¡el español yo lo aprendo en meses!', lyricsEnglish: 'I\'ll learn Spanish in months!' },
        ],
      },
    ],
    tab: [
      {
        label: 'Power chord version (easy!)',
        e: '|-------------------|',
        B: '|-------------------|',
        G: '|-------------------|',
        D: '|---2---2---2---2---|',
        A: '|---2---2---0---0---|',
        E: '|---0---0-----------|',
      },
    ],
    similarSongs: [
      { title: 'Lamento Boliviano', artist: 'Enanitos Verdes', note: 'Similar energy, great rock en español' },
      { title: 'Mujer Amante', artist: 'Rata Blanca', note: 'Classic Latin rock' },
    ],
    tips: [
      'All downstrokes! Keep your wrist loose and let gravity do the work',
      'Try palm muting for a heavier sound — rest your picking hand lightly on the strings near the bridge',
      'This is a great song to sing loud — don\'t worry about perfect pronunciation',
    ],
    tipsSpanish: [
      '¡Todos golpes hacia abajo! Mantén tu muñeca suelta y deja que la gravedad haga el trabajo',
      'Intenta palm muting para un sonido más pesado — apoya tu mano ligeramente en las cuerdas cerca del puente',
      'Esta es una gran canción para cantar fuerte — no te preocupes por la pronunciación perfecta',
    ],
  },
  {
    id: 'vals-del-cafe',
    title: 'Vals del café',
    titleEnglish: 'Coffee Waltz',
    description: 'A 3/4 time waltz with fingerpicking. Uses Am, Dm, E7, and Am — a classic Spanish/Flamenco-style progression.',
    descriptionSpanish: 'Un vals en 3/4 con punteo. Usa Am, Dm, E7 y Am — una progresión clásica estilo español/flamenco.',
    difficulty: 'intermediate',
    chords: ['Am', 'Dm', 'E7'],
    chordDiagrams: [
      { name: 'Am', frets: 'x02210', fingers: '--231-' },
      { name: 'Dm', frets: 'xx0231', fingers: '---231' },
      { name: 'E7', frets: '020100', fingers: '-2-1--' },
    ],
    strumPattern: 'D . . D U D',
    strumPatternDescription: 'Waltz time (3/4). Count: ONE two three ONE-and two-and. Emphasize beat 1.',
    accentPattern: ['accent', 'ghost', 'ghost'],
    sections: [
      {
        type: 'verse',
        label: 'Verse 1',
        labelSpanish: 'Verso 1',
        lines: [
          { chords: 'Am                  Dm', lyrics: 'En la esquina del café,', lyricsEnglish: 'At the corner of the café,' },
          { chords: 'E7                  Am', lyrics: 'donde siempre voy a estar.', lyricsEnglish: 'where I\'ll always be.' },
          { chords: 'Am                  Dm', lyrics: 'Con un libro y un café,', lyricsEnglish: 'With a book and a coffee,' },
          { chords: 'E7                  Am', lyrics: 'el mundo puedo olvidar.', lyricsEnglish: 'I can forget the world.' },
        ],
      },
      {
        type: 'chorus',
        label: 'Chorus',
        labelSpanish: 'Coro',
        lines: [
          { chords: 'Dm           Am', lyrics: 'Gira, gira, gira el vals,', lyricsEnglish: 'Spin, spin, spin the waltz,' },
          { chords: 'E7           Am', lyrics: 'el humo sube y se va.', lyricsEnglish: 'the steam rises and goes.' },
          { chords: 'Dm           Am', lyrics: 'Otra taza, por favor,', lyricsEnglish: 'Another cup, please,' },
          { chords: 'E7           Am', lyrics: 'esta noche es para soñar.', lyricsEnglish: 'tonight is for dreaming.' },
        ],
      },
      {
        type: 'verse',
        label: 'Verse 2',
        labelSpanish: 'Verso 2',
        lines: [
          { chords: 'Am                  Dm', lyrics: 'Las parejas van y vienen,', lyricsEnglish: 'Couples come and go,' },
          { chords: 'E7                  Am', lyrics: 'las historias nunca acaban.', lyricsEnglish: 'the stories never end.' },
          { chords: 'Am                  Dm', lyrics: 'Yo me quedo con mi música,', lyricsEnglish: 'I stay with my music,' },
          { chords: 'E7                  Am', lyrics: 'y las notas que me abrazan.', lyricsEnglish: 'and the notes that embrace me.' },
        ],
      },
    ],
    tab: [
      {
        label: 'Am arpeggio (waltz pattern)',
        e: '|-------0-----------|',
        B: '|-----1---1---------|',
        G: '|---2-------2-------|',
        D: '|-------------------|',
        A: '|-0-----------------| ← bass on beat 1',
        E: '|-------------------|',
      },
      {
        label: 'Dm arpeggio',
        e: '|-------1-----------|',
        B: '|-----3---3---------|',
        G: '|---2-------2-------|',
        D: '|-0-----------------| ← bass on beat 1',
        A: '|-------------------|',
        E: '|-------------------|',
      },
      {
        label: 'E7 arpeggio',
        e: '|-------0-----------|',
        B: '|-----0---0---------|',
        G: '|---1-------1-------|',
        D: '|-------------------|',
        A: '|-------------------|',
        E: '|-0-----------------| ← bass on beat 1',
      },
      {
        label: 'Spanish-style ending',
        e: '|---0---1---0---0---|',
        B: '|---1---1---1---0---|',
        G: '|---2---2---1---1---|',
        D: '|---2---3---2---2---|',
        A: '|---0---0---2---2---|',
        E: '|-------0---0---0---|',
      },
    ],
    similarSongs: [
      { title: 'Bésame Mucho', artist: 'Consuelo Velázquez', note: 'Classic Am-Dm-E7 bolero' },
      { title: 'Historia de un Amor', artist: 'Guadalupe Pineda', note: 'Beautiful Am-Dm-E7 standard' },
      { title: 'Ojos Así', artist: 'Shakira', note: 'Uses minor key progressions' },
    ],
    tips: [
      'The Am-Dm-E7 progression is the foundation of flamenco and bolero music',
      'In waltz time, strongly accent beat 1 — it gives the music its swaying feel',
      'Try the rasgueado technique: flick your fingers out one at a time (pinky, ring, middle, index) for a flamenco sound',
    ],
    tipsSpanish: [
      'La progresión Am-Dm-E7 es la base de la música flamenca y el bolero',
      'En tiempo de vals, acentúa fuertemente el beat 1 — le da a la música su sensación de balanceo',
      'Intenta la técnica de rasgueado: saca tus dedos uno a la vez (meñique, anular, medio, índice) para un sonido flamenco',
    ],
  },
  {
    id: 'amigos-para-siempre',
    title: 'Amigos para siempre',
    titleEnglish: 'Friends Forever',
    description: 'A campfire-style sing-along with easy chords. Great for group practice with friendship and family vocabulary.',
    descriptionSpanish: 'Una canción estilo fogata para cantar juntos con acordes fáciles. Excelente para práctica grupal con vocabulario de amistad y familia.',
    difficulty: 'beginner',
    chords: ['G', 'Em', 'C', 'D'],
    chordDiagrams: [
      { name: 'G', frets: '320003', fingers: '21---3' },
      { name: 'Em', frets: '022000', fingers: '-23---' },
      { name: 'C', frets: 'x32010', fingers: '-32-1-' },
      { name: 'D', frets: 'xx0232', fingers: '---132' },
    ],
    strumPattern: 'D D U U D U',
    strumPatternDescription: 'Relaxed campfire strum. Play it slow and sing along!',
    accentPattern: ['accent', 'ghost', 'normal', 'ghost'],
    sections: [
      {
        type: 'verse',
        label: 'Verse 1',
        labelSpanish: 'Verso 1',
        lines: [
          { chords: 'G                   Em', lyrics: 'Sentados junto al fuego,', lyricsEnglish: 'Sitting by the fire,' },
          { chords: 'C                   D', lyrics: 'miramos las estrellas brillar.', lyricsEnglish: 'we watch the stars shine.' },
          { chords: 'G                   Em', lyrics: 'Tú eres mi mejor amigo,', lyricsEnglish: 'You are my best friend,' },
          { chords: 'C                   D', lyrics: 'juntos podemos todo lograr.', lyricsEnglish: 'together we can achieve anything.' },
        ],
      },
      {
        type: 'chorus',
        label: 'Chorus',
        labelSpanish: 'Coro',
        lines: [
          { chords: 'C            D', lyrics: 'Amigos para siempre,', lyricsEnglish: 'Friends forever,' },
          { chords: 'G            Em', lyrics: 'amigos tú y yo.', lyricsEnglish: 'friends you and I.' },
          { chords: 'C            D', lyrics: 'En español cantamos,', lyricsEnglish: 'In Spanish we sing,' },
          { chords: 'Em           G', lyrics: 'esta canción de amor.', lyricsEnglish: 'this song of love.' },
        ],
      },
      {
        type: 'verse',
        label: 'Verse 2',
        labelSpanish: 'Verso 2',
        lines: [
          { chords: 'G                   Em', lyrics: 'Mi familia es mi tesoro,', lyricsEnglish: 'My family is my treasure,' },
          { chords: 'C                   D', lyrics: 'mi casa es tu casa también.', lyricsEnglish: 'my home is your home too.' },
          { chords: 'G                   Em', lyrics: 'Con risas y con abrazos,', lyricsEnglish: 'With laughter and hugs,' },
          { chords: 'C                   D', lyrics: 'la vida siempre nos va bien.', lyricsEnglish: 'life always goes well for us.' },
        ],
      },
    ],
    similarSongs: [
      { title: 'De Colores', artist: 'Traditional', note: 'Classic campfire Spanish folk song' },
      { title: 'Cielito Lindo', artist: 'Traditional Mexican', note: 'Great for group singing' },
    ],
    tips: [
      'This is a great song to teach to friends who are also learning Spanish',
      'Em is the easiest chord — just two fingers! Use it as your "rest" chord',
      'Try adding a capo on fret 2 for a brighter sound',
    ],
    tipsSpanish: [
      'Esta es una gran canción para enseñar a amigos que también aprenden español',
      'Em es el acorde más fácil — ¡solo dos dedos! Úsalo como tu acorde de "descanso"',
      'Intenta añadir un capo en el traste 2 para un sonido más brillante',
    ],
  },
  // ============================================================
  // ADVANCED - Salsa
  // ============================================================
  {
    id: 'fuego-en-la-cocina',
    title: 'Fuego en la cocina',
    titleEnglish: 'Fire in the Kitchen',
    description: 'A salsa-style montuno progression with quick chord changes and syncopated strumming. Emphasizes the clave rhythm — perfect for learning Latin syncopation and food vocabulary.',
    descriptionSpanish: 'Una progresión estilo montuno de salsa con cambios rápidos de acordes y rasgueo sincopado. Enfatiza el ritmo de clave — perfecto para aprender la síncopa latina y vocabulario de comida.',
    difficulty: 'advanced',
    chords: ['Am7', 'Dm7', 'G7', 'Cmaj7'],
    chordDiagrams: [
      { name: 'Am7', frets: 'x02010', fingers: '--2-1-' },
      { name: 'Dm7', frets: 'xx0211', fingers: '---211' },
      { name: 'G7', frets: '320001', fingers: '32---1' },
      { name: 'Cmaj7', frets: 'x32000', fingers: '-32---' },
    ],
    strumPattern: 'D . U . D U . U',
    strumPatternDescription: 'Salsa montuno strum (2-3 son clave feel). Stress beats 1 and the "and" of 2. Mute with your palm on the rests — the silence is as important as the sound.',
    accentPattern: ['accent', 'ghost', 'accent', 'ghost', 'accent', 'normal', 'ghost', 'normal'],
    sections: [
      {
        type: 'intro',
        label: 'Intro (Montuno)',
        labelSpanish: 'Introducción (Montuno)',
        lines: [
          { chords: 'Am7          Dm7', lyrics: '(montuno pattern x2)', lyricsEnglish: '(montuno pattern x2)' },
          { chords: 'G7           Cmaj7', lyrics: '(montuno pattern x2)', lyricsEnglish: '(montuno pattern x2)' },
        ],
      },
      {
        type: 'verse',
        label: 'Verse 1',
        labelSpanish: 'Verso 1',
        lines: [
          { chords: 'Am7                Dm7', lyrics: 'Hay fuego en la cocina,', lyricsEnglish: 'There\'s fire in the kitchen,' },
          { chords: 'G7                 Cmaj7', lyrics: 'el arroz se va a quemar.', lyricsEnglish: 'the rice is going to burn.' },
          { chords: 'Am7                Dm7', lyrics: 'Mi abuela grita fuerte,', lyricsEnglish: 'My grandma shouts loudly,' },
          { chords: 'G7                 Cmaj7', lyrics: '"¡Ven aquí a cocinar!"', lyricsEnglish: '"Come here to cook!"' },
        ],
      },
      {
        type: 'chorus',
        label: 'Chorus (Coro)',
        labelSpanish: 'Coro',
        lines: [
          { chords: 'Am7       Dm7', lyrics: '¡Sazón, sazón!', lyricsEnglish: 'Flavor, flavor!' },
          { chords: 'G7        Cmaj7', lyrics: 'Ponle más sazón.', lyricsEnglish: 'Add more flavor.' },
          { chords: 'Am7       Dm7', lyrics: 'La cebolla, el ajo,', lyricsEnglish: 'The onion, the garlic,' },
          { chords: 'G7        Cmaj7', lyrics: 'sal y pimentón.', lyricsEnglish: 'salt and paprika.' },
        ],
      },
      {
        type: 'verse',
        label: 'Verse 2',
        labelSpanish: 'Verso 2',
        lines: [
          { chords: 'Am7                Dm7', lyrics: 'Los plátanos se fríen,', lyricsEnglish: 'The plantains are frying,' },
          { chords: 'G7                 Cmaj7', lyrics: 'los frijoles en la olla.', lyricsEnglish: 'the beans in the pot.' },
          { chords: 'Am7                Dm7', lyrics: 'El café está caliente,', lyricsEnglish: 'The coffee is hot,' },
          { chords: 'G7                 Cmaj7', lyrics: 'y la mesa tiene silla.', lyricsEnglish: 'and the table has a chair.' },
        ],
      },
      {
        type: 'bridge',
        label: 'Bridge (Pregón)',
        labelSpanish: 'Puente (Pregón)',
        lines: [
          { chords: 'Dm7               G7', lyrics: '¡Agua! — para la sed.', lyricsEnglish: 'Water! — for the thirst.' },
          { chords: 'Cmaj7             Am7', lyrics: '¡Música! — para bailar.', lyricsEnglish: 'Music! — to dance.' },
          { chords: 'Dm7               G7', lyrics: '¡Comida! — para el alma.', lyricsEnglish: 'Food! — for the soul.' },
          { chords: 'Cmaj7             Am7', lyrics: '¡Salsa! — para gozar.', lyricsEnglish: 'Salsa! — to enjoy.' },
        ],
      },
    ],
    tab: [
      {
        label: 'Montuno pattern (Am7 → Dm7)',
        e: '|--0-----0---|--1-----1---|',
        B: '|--1-----1---|--1-----1---|',
        G: '|--0-----0---|--2-----2---|',
        D: '|--2---2---2-|--0---0---0-|',
        A: '|--0---------|--x---------|',
        E: '|--x---------|--x---------|',
      },
    ],
    similarSongs: [
      { title: 'Oye Como Va', artist: 'Tito Puente / Santana', note: 'Same Am7-Dm7 montuno feel — iconic Latin groove' },
      { title: 'El Cantante', artist: 'Héctor Lavoe', note: 'Classic salsa with similar chord movement' },
      { title: 'Quimbara', artist: 'Celia Cruz', note: 'High-energy salsa with call-and-response' },
    ],
    tips: [
      'The clave rhythm is everything in salsa — listen for the "1, and-of-2, 4" accent pattern',
      'Mute the strings with your palm on ghost beats to create that choppy salsa feel',
      'Start at 80 BPM and work up to 140+ BPM for authentic salsa tempo',
      'The Am7 → Dm7 → G7 → Cmaj7 is a ii-v-V-I in C major — the foundation of Latin jazz',
    ],
    tipsSpanish: [
      'El ritmo de clave lo es todo en la salsa — escucha el patrón de acentos "1, y-de-2, 4"',
      'Silencia las cuerdas con la palma en los tiempos fantasma para crear ese sonido cortado de salsa',
      'Comienza a 80 BPM y sube hasta 140+ BPM para tempo auténtico de salsa',
      'Am7 → Dm7 → G7 → Cmaj7 es un ii-v-V-I en Do mayor — la base del jazz latino',
    ],
  },
  {
    id: 'bailando-en-la-calle',
    title: 'Bailando en la calle',
    titleEnglish: 'Dancing in the Street',
    description: 'An uptempo salsa dura progression with a tumbao-style strum. Uses dominant 7th chords and a classic descarga pattern. Great for practicing body movement vocabulary and imperatives.',
    descriptionSpanish: 'Una progresión de salsa dura a tempo rápido con rasgueo estilo tumbao. Usa acordes de séptima dominante y un patrón clásico de descarga. Excelente para practicar vocabulario de movimiento corporal e imperativos.',
    difficulty: 'advanced',
    chords: ['E7', 'Am7', 'D7', 'G7'],
    chordDiagrams: [
      { name: 'E7', frets: '020100', fingers: '-2-1--' },
      { name: 'Am7', frets: 'x02010', fingers: '--2-1-' },
      { name: 'D7', frets: 'xx0212', fingers: '---213' },
      { name: 'G7', frets: '320001', fingers: '32---1' },
    ],
    strumPattern: 'D U . U D . U .',
    strumPatternDescription: 'Tumbao strum (3-2 son clave feel). Accent beat 1 hard, skip beat 3. The offbeat upstrums drive the rhythm forward — think of the conga pattern.',
    accentPattern: ['accent', 'normal', 'ghost', 'accent', 'normal', 'ghost', 'accent', 'ghost'],
    sections: [
      {
        type: 'verse',
        label: 'Verse 1',
        labelSpanish: 'Verso 1',
        lines: [
          { chords: 'E7                  Am7', lyrics: '¡Mueve las caderas,', lyricsEnglish: 'Move your hips,' },
          { chords: 'D7                  G7', lyrics: 'levanta los brazos ya!', lyricsEnglish: 'raise your arms now!' },
          { chords: 'E7                  Am7', lyrics: 'Dobla las rodillas,', lyricsEnglish: 'Bend your knees,' },
          { chords: 'D7                  G7', lyrics: 'gira sin parar.', lyricsEnglish: 'spin without stopping.' },
        ],
      },
      {
        type: 'chorus',
        label: 'Chorus (Coro)',
        labelSpanish: 'Coro',
        lines: [
          { chords: 'E7        Am7', lyrics: '¡Baila, baila, baila!', lyricsEnglish: 'Dance, dance, dance!' },
          { chords: 'D7        G7', lyrics: 'Bailando en la calle.', lyricsEnglish: 'Dancing in the street.' },
          { chords: 'E7        Am7', lyrics: '¡Siente la música,', lyricsEnglish: 'Feel the music,' },
          { chords: 'D7        G7', lyrics: 'que nadie se calle!', lyricsEnglish: 'let no one be silent!' },
        ],
      },
      {
        type: 'verse',
        label: 'Verse 2',
        labelSpanish: 'Verso 2',
        lines: [
          { chords: 'E7                  Am7', lyrics: 'Pon la mano izquierda,', lyricsEnglish: 'Put your left hand,' },
          { chords: 'D7                  G7', lyrics: 'sobre tu corazón.', lyricsEnglish: 'over your heart.' },
          { chords: 'E7                  Am7', lyrics: 'Cierra bien los ojos,', lyricsEnglish: 'Close your eyes tight,' },
          { chords: 'D7                  G7', lyrics: 'siente este son.', lyricsEnglish: 'feel this groove.' },
        ],
      },
      {
        type: 'bridge',
        label: 'Mambo Break',
        labelSpanish: 'Corte de Mambo',
        lines: [
          { chords: 'E7  (staccato)', lyrics: '¡Pa! — ¡Pa! — ¡Pa-pa-pa!', lyricsEnglish: '(rhythmic hits)' },
          { chords: 'Am7 (staccato)', lyrics: '¡Eso! — ¡Dilo! — ¡Wepa!', lyricsEnglish: 'That\'s it! — Say it! — Wepa!' },
          { chords: 'E7             Am7', lyrics: '¡Azúcar!', lyricsEnglish: 'Sugar! (Celia Cruz\'s catchphrase)' },
        ],
      },
      {
        type: 'chorus',
        label: 'Final Chorus',
        labelSpanish: 'Coro Final',
        lines: [
          { chords: 'E7        Am7', lyrics: '¡Baila, baila, baila!', lyricsEnglish: 'Dance, dance, dance!' },
          { chords: 'D7        G7', lyrics: 'Bailando en la calle.', lyricsEnglish: 'Dancing in the street.' },
          { chords: 'E7        Am7', lyrics: 'De la cabeza a los pies,', lyricsEnglish: 'From head to toe,' },
          { chords: 'D7        G7', lyrics: '¡la salsa no tiene fin!', lyricsEnglish: 'salsa has no end!' },
        ],
      },
    ],
    tab: [
      {
        label: 'Tumbao rhythm (E7)',
        e: '|--0---0-x-0---x-0-x-|',
        B: '|--0---0-x-0---x-0-x-|',
        G: '|--1---1-x-1---x-1-x-|',
        D: '|--0---0-x-0---x-0-x-|',
        A: '|--x---x-x-x---x-x-x-|',
        E: '|--0---0-x-0---x-0-x-| x = palm mute',
      },
    ],
    similarSongs: [
      { title: 'Aguanilé', artist: 'Héctor Lavoe & Willie Colón', note: 'Classic salsa dura with call-and-response' },
      { title: 'La Vida Es Un Carnaval', artist: 'Celia Cruz', note: 'Uptempo salsa with similar energy and body movement' },
      { title: 'Pedro Navaja', artist: 'Rubén Blades', note: 'Salsa storytelling with similar chord changes' },
    ],
    tips: [
      'Palm-muting is essential — slap the strings with your strumming hand on ghost beats',
      'The E7 → Am7 movement is the backbone of salsa dura — practice just those two chords first',
      'Count the clave out loud: "ONE two AND four" for the 3-2 feel',
      'Body vocabulary: caderas (hips), brazos (arms), rodillas (knees), cabeza (head), pies (feet)',
    ],
    tipsSpanish: [
      'El palm-mute es esencial — golpea las cuerdas con la mano de rasgueo en los tiempos fantasma',
      'El movimiento E7 → Am7 es la columna vertebral de la salsa dura — practica solo esos dos acordes primero',
      'Cuenta la clave en voz alta: "UNO dos Y cuatro" para el sentimiento 3-2',
      'Vocabulario corporal: caderas, brazos, rodillas, cabeza, pies',
    ],
  },
];
