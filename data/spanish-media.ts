// Curated Spanish media resources for immersion learning

export interface MediaResource {
  id: string;
  title: string;
  titleSpanish?: string;
  description: string;
  type: 'youtube' | 'podcast' | 'music' | 'news' | 'app';
  level: 'beginner' | 'elementary' | 'intermediate' | 'all';
  url: string;
  imageUrl?: string;
  tags: string[];
  featured?: boolean;
}

export const mediaResources: MediaResource[] = [
  // YouTube Channels
  {
    id: 'yt001',
    title: 'Dreaming Spanish',
    description: 'Comprehensible input videos at multiple levels. Great for passive listening and picking up natural speech patterns.',
    type: 'youtube',
    level: 'beginner',
    url: 'https://www.youtube.com/@DreamingSpanish',
    tags: ['comprehensible input', 'immersion', 'stories'],
    featured: true,
  },
  {
    id: 'yt002',
    title: 'SpanishPod101',
    description: 'Structured lessons with native speakers. Good mix of vocabulary, grammar, and cultural content.',
    type: 'youtube',
    level: 'beginner',
    url: 'https://www.youtube.com/@spanishpod101',
    tags: ['lessons', 'vocabulary', 'grammar'],
  },
  {
    id: 'yt003',
    title: 'Easy Spanish',
    description: 'Street interviews with Spanish speakers from different countries. Real conversations with subtitles.',
    type: 'youtube',
    level: 'elementary',
    url: 'https://www.youtube.com/@EasySpanish',
    tags: ['interviews', 'real Spanish', 'subtitles'],
    featured: true,
  },
  {
    id: 'yt004',
    title: 'Español con Juan',
    description: 'Fun, engaging lessons entirely in Spanish. Juan explains grammar and vocabulary in a clear, entertaining way.',
    type: 'youtube',
    level: 'elementary',
    url: 'https://www.youtube.com/@espaborjuan',
    tags: ['grammar', 'vocabulary', 'entertainment'],
  },
  {
    id: 'yt005',
    title: 'Butterfly Spanish',
    description: 'Mexican Spanish lessons with clear explanations. Great for learning common expressions and pronunciation.',
    type: 'youtube',
    level: 'beginner',
    url: 'https://www.youtube.com/@ButterflySpanish',
    tags: ['Mexican Spanish', 'expressions', 'pronunciation'],
  },
  {
    id: 'yt006',
    title: 'Why Not Spanish?',
    description: 'Colombian couple teaching Spanish through real-life situations and cultural insights.',
    type: 'youtube',
    level: 'beginner',
    url: 'https://www.youtube.com/@WhyNotSpanish',
    tags: ['Colombian Spanish', 'culture', 'couples'],
  },

  // Podcasts
  {
    id: 'pod001',
    title: 'News in Slow Spanish',
    description: 'Current events discussed slowly and clearly. Perfect for training your ear to Spanish news.',
    type: 'podcast',
    level: 'elementary',
    url: 'https://www.newsinslowspanish.com/',
    tags: ['news', 'slow speech', 'current events'],
    featured: true,
  },
  {
    id: 'pod002',
    title: 'Españolistos',
    description: 'Conversational podcast by a Colombian-American couple. Natural speech with explanations.',
    type: 'podcast',
    level: 'elementary',
    url: 'https://espanolistos.com/',
    tags: ['conversation', 'natural speech', 'explanations'],
  },
  {
    id: 'pod003',
    title: 'Duolingo Spanish Podcast',
    description: 'True stories from Spanish speakers with English narration. Great bridge for beginners.',
    type: 'podcast',
    level: 'beginner',
    url: 'https://podcast.duolingo.com/spanish',
    tags: ['stories', 'bilingual', 'culture'],
    featured: true,
  },
  {
    id: 'pod004',
    title: 'Radio Ambulante',
    description: 'Latin American stories and journalism. More advanced but incredibly engaging content.',
    type: 'podcast',
    level: 'intermediate',
    url: 'https://radioambulante.org/',
    tags: ['journalism', 'Latin America', 'stories'],
  },
  {
    id: 'pod005',
    title: 'Hoy Hablamos',
    description: 'Daily Spanish podcast covering vocabulary, expressions, and grammar in short episodes.',
    type: 'podcast',
    level: 'elementary',
    url: 'https://www.hoyhablamos.com/',
    tags: ['daily', 'vocabulary', 'expressions'],
  },

  // Music
  {
    id: 'mus001',
    title: 'Natalia Lafourcade',
    titleSpanish: 'Natalia Lafourcade',
    description: 'Mexican singer with clear pronunciation and beautiful melodies. Great for learning through music.',
    type: 'music',
    level: 'all',
    url: 'https://open.spotify.com/artist/1GmsPCcpKgF9OhlNXjOsbS',
    tags: ['Mexican', 'folk', 'clear vocals'],
    featured: true,
  },
  {
    id: 'mus002',
    title: 'Juanes',
    titleSpanish: 'Juanes',
    description: 'Colombian rock/pop artist. Catchy songs with relatable lyrics about love and life.',
    type: 'music',
    level: 'all',
    url: 'https://open.spotify.com/artist/0UWZUmn7sybxMCqrw9tGa7',
    tags: ['Colombian', 'rock', 'pop'],
  },
  {
    id: 'mus003',
    title: 'Natalia Lafourcade',
    titleSpanish: 'Natalia Lafourcade',
    description: 'Mexican singer-songwriter with beautiful, clear vocals. Perfect for learning with poetic lyrics.',
    type: 'music',
    level: 'all',
    url: 'https://open.spotify.com/artist/1vBbkvtOPBFBhOJJv5cEwi',
    tags: ['Mexican', 'folk', 'singer-songwriter'],
  },
  {
    id: 'mus004',
    title: 'Rosalía',
    titleSpanish: 'Rosalía',
    description: 'Spanish artist blending flamenco with modern pop. Unique sound and Castilian Spanish.',
    type: 'music',
    level: 'intermediate',
    url: 'https://open.spotify.com/artist/7ltDVBr6mKbRvohxheJ9h1',
    tags: ['Spanish', 'flamenco', 'modern'],
  },
  {
    id: 'mus005',
    title: 'Manu Chao',
    titleSpanish: 'Manu Chao',
    description: 'French-Spanish artist with simple, repetitive lyrics. Perfect for beginners to sing along.',
    type: 'music',
    level: 'beginner',
    url: 'https://open.spotify.com/artist/2FZS5xSSNQmgo6goOGKDT9',
    tags: ['Latin', 'reggae', 'simple lyrics'],
    featured: true,
  },
  {
    id: 'mus006',
    title: 'Calle 13 / Residente',
    titleSpanish: 'Calle 13 / Residente',
    description: 'Puerto Rican hip-hop with socially conscious lyrics. Great vocabulary but fast-paced.',
    type: 'music',
    level: 'intermediate',
    url: 'https://open.spotify.com/artist/2DQChZuPMxKyD6e8RXCGJB',
    tags: ['Puerto Rican', 'hip-hop', 'vocabulary'],
  },

  // News Sources
  {
    id: 'news001',
    title: 'BBC Mundo',
    description: 'International news in clear, neutral Spanish. Great for reading practice.',
    type: 'news',
    level: 'intermediate',
    url: 'https://www.bbc.com/mundo',
    tags: ['news', 'international', 'reading'],
  },
  {
    id: 'news002',
    title: 'El País',
    description: 'Major Spanish newspaper. Spain perspective on world and local news.',
    type: 'news',
    level: 'intermediate',
    url: 'https://elpais.com/',
    tags: ['Spain', 'newspaper', 'current events'],
  },
  {
    id: 'news003',
    title: 'Vix',
    description: 'Entertainment, lifestyle, and viral content in Spanish. Easy, fun reading.',
    type: 'news',
    level: 'elementary',
    url: 'https://www.vix.com/es',
    tags: ['entertainment', 'lifestyle', 'fun'],
  },

  // Apps & Tools
  {
    id: 'app001',
    title: 'Tandem',
    description: 'Language exchange app to chat with native Spanish speakers learning English.',
    type: 'app',
    level: 'all',
    url: 'https://www.tandem.net/',
    tags: ['conversation', 'exchange', 'native speakers'],
  },
  {
    id: 'app002',
    title: 'Lyrics Training',
    description: 'Learn Spanish through song lyrics. Fill in the blanks while listening to music.',
    type: 'app',
    level: 'all',
    url: 'https://lyricstraining.com/es/',
    tags: ['music', 'game', 'listening'],
    featured: true,
  },
  {
    id: 'app003',
    title: 'Language Reactor',
    description: 'Chrome extension for Netflix/YouTube with dual subtitles and word lookup.',
    type: 'app',
    level: 'all',
    url: 'https://www.languagereactor.com/',
    tags: ['Netflix', 'YouTube', 'subtitles'],
    featured: true,
  },
];

export function getMediaByType(type: MediaResource['type']): MediaResource[] {
  return mediaResources.filter(m => m.type === type);
}

export function getMediaByLevel(level: MediaResource['level']): MediaResource[] {
  return mediaResources.filter(m => m.level === level || m.level === 'all');
}

export function getFeaturedMedia(): MediaResource[] {
  return mediaResources.filter(m => m.featured);
}

export function searchMedia(query: string): MediaResource[] {
  const q = query.toLowerCase();
  return mediaResources.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.description.toLowerCase().includes(q) ||
    m.tags.some(t => t.toLowerCase().includes(q))
  );
}
