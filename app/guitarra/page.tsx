'use client';

import { useState, useEffect, useCallback } from 'react';
import { Music, ChevronDown, ChevronUp, Volume2, BookOpen, Guitar, Star, Info, Play, Square } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { GuitarSong, TabLine, ChordDiagram } from '@/data/guitarra';
import { guitarSongs, chordLibrary } from '@/data/guitarra';
import { speak } from '@/lib/speech';
import {
  GuitarSettings,
  DEFAULT_GUITAR_SETTINGS,
  loadGuitarSettings,
  playChordProgression,
  playChord,
  stopPlayback,
} from '@/lib/chord-audio';

// ============================================================
// CHORD DIAGRAM COMPONENT
// ============================================================

function ChordDiagramDisplay({ chord, guitarSettings }: { chord: ChordDiagram; guitarSettings?: GuitarSettings }) {
  const frets = chord.frets.split('');
  const stringNames = ['E', 'A', 'D', 'G', 'B', 'e'];

  return (
    <div
      className="inline-flex flex-col items-center mx-2 mb-3 cursor-pointer group"
      onClick={() => guitarSettings && playChord(chord.name, guitarSettings)}
      title={`Click to hear ${chord.name}`}
    >
      <span className="text-sm font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{chord.name}</span>
      <div className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-2">
        {/* Nut or barre indicator */}
        <div className="flex gap-1 mb-0.5">
          {frets.map((f, i) => (
            <div key={i} className="w-5 text-center text-[10px] text-gray-500 dark:text-gray-400 font-mono">
              {f === 'x' ? '×' : f === '0' ? '○' : ''}
            </div>
          ))}
        </div>
        {/* Fret grid */}
        <div className="border-t-2 border-gray-900 dark:border-gray-300">
          {[1, 2, 3, 4].map(fretNum => (
            <div key={fretNum} className="flex gap-1 border-b border-gray-300 dark:border-gray-600">
              {frets.map((f, stringIdx) => {
                const fretVal = parseInt(f);
                const isPressed = fretVal === fretNum;
                return (
                  <div key={stringIdx} className="w-5 h-4 flex items-center justify-center relative">
                    <div className="absolute inset-y-0 left-1/2 w-px bg-gray-300 dark:bg-gray-600" />
                    {isPressed && (
                      <div className="w-3 h-3 rounded-full bg-gray-900 dark:bg-white z-10" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {/* String names */}
        <div className="flex gap-1 mt-0.5">
          {stringNames.map((name, i) => (
            <div key={i} className="w-5 text-center text-[9px] text-gray-400 dark:text-gray-500 font-mono">
              {name}
            </div>
          ))}
        </div>
        {chord.barFret && (
          <div className="absolute -right-1 top-6 text-[9px] text-gray-500 dark:text-gray-400">
            {chord.barFret}fr
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TAB DISPLAY COMPONENT
// ============================================================

function TabDisplay({ tabs }: { tabs: TabLine[] }) {
  return (
    <div className="space-y-4">
      {tabs.map((tab, idx) => (
        <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 overflow-x-auto">
          {tab.label && (
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{tab.label}</p>
          )}
          <pre className="font-mono text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre">
{`e|${tab.e}
B|${tab.B}
G|${tab.G}
D|${tab.D}
A|${tab.A}
E|${tab.E}`}
          </pre>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// SONG CARD COMPONENT
// ============================================================

function SongCard({ song, guitarSettings }: { song: GuitarSong; guitarSettings: GuitarSettings }) {
  const [expanded, setExpanded] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showTab, setShowTab] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChordIndex, setActiveChordIndex] = useState(-1);
  const [activeBeat, setActiveBeat] = useState(0);

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
      setIsPlaying(false);
      setActiveChordIndex(-1);
      return;
    }
    setIsPlaying(true);
    playChordProgression(
      song.chords,
      guitarSettings,
      2,
      {
        onChordChange: (idx) => setActiveChordIndex(idx),
        onBeat: (beat) => setActiveBeat(beat),
        onComplete: () => {
          setIsPlaying(false);
          setActiveChordIndex(-1);
        },
      },
      song.strumPattern,
      song.accentPattern
    );
  }, [isPlaying, song.chords, guitarSettings, song.strumPattern, song.accentPattern]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isPlaying) stopPlayback();
    };
  }, [isPlaying]);

  const sectionColors: Record<string, string> = {
    verse: 'border-l-blue-400',
    chorus: 'border-l-orange-400',
    bridge: 'border-l-purple-400',
    intro: 'border-l-green-400',
    outro: 'border-l-gray-400',
    interlude: 'border-l-pink-400',
  };

  const sectionBadgeColors: Record<string, string> = {
    verse: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    chorus: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    bridge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    intro: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    outro: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    interlude: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  };

  return (
    <Card className="overflow-hidden">
      <CardContent>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle>{song.title}</CardTitle>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                song.difficulty === 'beginner'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : song.difficulty === 'intermediate'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {song.difficulty === 'beginner' ? 'Principiante' : song.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                song.strumPattern?.toLowerCase().includes('fingerpick')
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {song.strumPattern?.toLowerCase().includes('fingerpick') ? 'Punteo' : 'Rasgueo'}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">{song.titleEnglish}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Chord pills + play button */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button
            onClick={handlePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isPlaying
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
            title={isPlaying ? 'Stop playback' : 'Listen to chord progression'}
          >
            {isPlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Stop' : 'Listen'}
          </button>
          {song.chords.map((chord, idx) => (
            <span
              key={`${chord}-${idx}`}
              className={`px-2 py-1 rounded font-mono text-sm font-bold transition-all ${
                isPlaying && activeChordIndex === idx
                  ? 'bg-amber-500 text-white scale-110 shadow-lg'
                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
              }`}
            >
              {chord}
              {isPlaying && activeChordIndex === idx && (
                <span className="ml-1 text-xs opacity-75">{activeBeat + 1}</span>
              )}
            </span>
          ))}
        </div>

        <CardDescription>{song.description}</CardDescription>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-5 space-y-6">
            {/* Chord Diagrams */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <Guitar className="w-4 h-4" /> Chord Diagrams / Diagramas de acordes
              </h3>
              <div className="flex flex-wrap justify-start">
                {song.chordDiagrams.map(chord => (
                  <ChordDiagramDisplay key={chord.name} chord={chord} guitarSettings={guitarSettings} />
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click any chord to hear it</p>
            </div>

            {/* Strum Pattern */}
            {song.strumPattern && (
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                  Strum Pattern / Patrón de rasgueo:
                </p>
                <p className="font-mono text-lg text-amber-900 dark:text-amber-200 tracking-widest">
                  {song.strumPattern}
                </p>
                {song.strumPatternDescription && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                    {song.strumPatternDescription}
                  </p>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowEnglish(!showEnglish)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  showEnglish
                    ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                {showEnglish ? '🇺🇸 English ON' : '🇺🇸 English OFF'}
              </button>
              {song.tab && (
                <button
                  onClick={() => setShowTab(!showTab)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    showTab
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  🎸 {showTab ? 'Hide Tab' : 'Show Tab'}
                </button>
              )}
              <button
                onClick={() => setShowTips(!showTips)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  showTips
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                💡 {showTips ? 'Hide Tips' : 'Show Tips'}
              </button>
              {song.similarSongs && (
                <button
                  onClick={() => setShowSimilar(!showSimilar)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    showSimilar
                      ? 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300'
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  🎵 {showSimilar ? 'Hide Similar' : 'Real Songs to Try'}
                </button>
              )}
            </div>

            {/* Tips (shown directly below toggle buttons) */}
            {showTips && song.tips && (
              <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-1">
                  <Info className="w-4 h-4" /> Tips / Consejos
                </h3>
                <div className="space-y-2">
                  {song.tips.map((tip, i) => (
                    <div key={i} className="text-sm">
                      <p className="text-green-800 dark:text-green-300">• {tip}</p>
                      {song.tipsSpanish && song.tipsSpanish[i] && (
                        <p className="text-green-600 dark:text-green-500 text-xs italic ml-3">
                          {song.tipsSpanish[i]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Real Songs (shown directly below toggle buttons) */}
            {showSimilar && song.similarSongs && (
              <div className="bg-cyan-50 dark:bg-cyan-900/10 rounded-lg p-4 border border-cyan-200 dark:border-cyan-800">
                <h3 className="text-sm font-semibold text-cyan-800 dark:text-cyan-300 mb-2 flex items-center gap-1">
                  <Star className="w-4 h-4" /> Real Songs with Similar Chords
                </h3>
                <p className="text-xs text-cyan-700 dark:text-cyan-400 mb-2">
                  Look these up to practice with the same chord progressions:
                </p>
                <div className="space-y-2">
                  {song.similarSongs.map((s, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-medium text-cyan-900 dark:text-cyan-200">
                        &ldquo;{s.title}&rdquo;
                      </span>
                      <span className="text-cyan-700 dark:text-cyan-400"> — {s.artist}</span>
                      <p className="text-xs text-cyan-600 dark:text-cyan-500 ml-2">{s.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Song Sections (Lyrics + Chords) */}
            <div className="space-y-4">
              {song.sections.map((section, sIdx) => (
                <div
                  key={sIdx}
                  className={`border-l-4 ${sectionColors[section.type] || 'border-l-gray-400'} pl-4`}
                >
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-2 ${sectionBadgeColors[section.type] || 'bg-gray-100 text-gray-700'}`}>
                    {section.labelSpanish} / {section.label}
                  </span>
                  <div className="space-y-1">
                    {section.lines.map((line, lIdx) => (
                      <div key={lIdx} className="group">
                        {/* Chord line */}
                        <pre className="font-mono text-xs sm:text-sm text-amber-600 dark:text-amber-400 whitespace-pre leading-tight">
                          {line.chords}
                        </pre>
                        {/* Spanish lyrics */}
                        <div className="flex items-start gap-1">
                          <p className="text-sm sm:text-base text-gray-900 dark:text-white leading-snug">
                            {line.lyrics}
                          </p>
                          <button
                            onClick={() => speak(line.lyrics)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-primary-500 hover:text-primary-700 transition-opacity flex-shrink-0 mt-0.5"
                            title="Escuchar"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* English translation */}
                        {showEnglish && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-snug mb-2">
                            {line.lyricsEnglish}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tab Section */}
            {showTab && song.tab && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  🎸 Tablature / Tablatura
                </h3>
                <TabDisplay tabs={song.tab} />
              </div>
            )}

          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function GuitarraPage() {
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [guitarSettings, setGuitarSettings] = useState<GuitarSettings | null>(null);

  useEffect(() => {
    setGuitarSettings(loadGuitarSettings());
  }, []);

  const filteredSongs = guitarSongs.filter(
    s => filter === 'all' || s.difficulty === filter
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
            <Music className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Guitarra y Español
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Guitar & Spanish</p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-3">
          Learn Spanish while playing guitar! Each song uses 3-4 easy chords with original Spanish lyrics,
          chord diagrams, strum patterns, and tablature. Hover over any lyric line to hear it spoken aloud.
        </p>
      </div>

      {/* Quick chord reference */}
      <Card className="mb-6">
        <CardContent>
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Quick Chord Reference / Referencia rápida de acordes
            </summary>
            <div className="mt-4 flex flex-wrap justify-start">
              {Object.values(chordLibrary).slice(0, 12).map(chord => (
                <ChordDiagramDisplay key={chord.name} chord={chord} guitarSettings={guitarSettings || DEFAULT_GUITAR_SETTINGS} />
              ))}
              <p className="w-full text-xs text-gray-400 dark:text-gray-500 mt-1">Click any chord to hear it</p>
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(level => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === level
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {level === 'all' ? 'All Songs / Todas' : level === 'beginner' ? 'Beginner / Principiante' : level === 'intermediate' ? 'Intermediate / Intermedio' : 'Advanced / Avanzado'}
          </button>
        ))}
        <span className="self-center text-sm text-gray-500 dark:text-gray-400 ml-2">
          {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'}
        </span>
      </div>

      {/* Song List */}
      <div className="space-y-4">
        {filteredSongs.map(song => (
          <SongCard key={song.id} song={song} guitarSettings={guitarSettings || DEFAULT_GUITAR_SETTINGS} />
        ))}
      </div>

      {/* Footer tip */}
      <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Pro tip:</strong> Start with &ldquo;Caminando por la ciudad&rdquo; (G-C-D) if you&apos;re new to guitar.
          Once comfortable, try &ldquo;Mi corazón canta&rdquo; to tackle the F chord.
          Check &ldquo;Real Songs to Try&rdquo; on each song for famous songs that use the same chords!
        </p>
      </div>
    </div>
  );
}
