// Web Audio API chord playback engine
// Synthesizes chord tones for guitar practice

// Note frequencies (Hz) for standard tuning reference
const NOTE_FREQUENCIES: Record<string, number> = {
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
  'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
  'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
  'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.26, 'F5': 698.46, 'G5': 783.99,
};

// Chord note definitions (actual notes played on guitar)
const CHORD_NOTES: Record<string, string[]> = {
  'C':     ['C3', 'E3', 'G3', 'C4', 'E4'],
  'G':     ['G2', 'B2', 'D3', 'G3', 'B3', 'G4'],
  'D':     ['D3', 'A3', 'D4', 'F#4'],
  'Dm':    ['D3', 'A3', 'D4', 'F4'],
  'Em':    ['E2', 'B2', 'E3', 'G3', 'B3', 'E4'],
  'Am':    ['A2', 'E3', 'A3', 'C4', 'E4'],
  'E':     ['E2', 'B2', 'E3', 'G#3', 'B3', 'E4'],
  'A':     ['A2', 'E3', 'A3', 'C#4', 'E4'],
  'F':     ['F2', 'C3', 'F3', 'A3', 'C4', 'F4'],
  'Bm':    ['B2', 'F#3', 'B3', 'D4', 'F#4'],
  'B7':    ['B2', 'D#3', 'A3', 'B3', 'D#4'],
  'E7':    ['E2', 'B2', 'D3', 'G#3', 'B3', 'E4'],
  'A7':    ['A2', 'E3', 'G3', 'C#4', 'E4'],
  'D7':    ['D3', 'A3', 'C4', 'F#4'],
  'G7':    ['G2', 'B2', 'D3', 'G3', 'B3', 'F4'],
  'C7':    ['C3', 'E3', 'A#3', 'C4', 'E4'],
  'Cadd9': ['C3', 'E3', 'G3', 'D4', 'E4'],
  'Am7':   ['A2', 'E3', 'G3', 'C4', 'E4'],
  'Dm7':   ['D3', 'A3', 'C4', 'F4'],
  'Cmaj7': ['C3', 'E3', 'G3', 'B3', 'E4'],
  'Fmaj7': ['F3', 'A3', 'C4', 'E4'],
};

export interface GuitarSettings {
  tempo: number;        // BPM (60-160)
  volume: number;       // 0-100
  sound: 'clean' | 'warm' | 'bright' | 'acoustic' | 'nylon' | 'electric' | 'jazz';  // tone character
  countIn: boolean;     // play count-in clicks before progression
  metronome: boolean;   // play metronome clicks during playback
  beatsPerChord: number; // how many beats per chord change (2 or 4)
  useStrumPattern: boolean; // play strum pattern instead of sustained chord
}

export const DEFAULT_GUITAR_SETTINGS: GuitarSettings = {
  tempo: 90,
  volume: 70,
  sound: 'warm',
  countIn: true,
  metronome: true,
  beatsPerChord: 4,
  useStrumPattern: false,
};

export function loadGuitarSettings(): GuitarSettings {
  try {
    const stored = localStorage.getItem('guitarSettings');
    if (stored) {
      return { ...DEFAULT_GUITAR_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load guitar settings:', e);
  }
  return DEFAULT_GUITAR_SETTINGS;
}

export function saveGuitarSettings(settings: GuitarSettings) {
  localStorage.setItem('guitarSettings', JSON.stringify(settings));
}

// ============================================================
// STRUM PATTERN PARSER
// ============================================================

export type StrumDirection = 'D' | 'U' | 'rest';

export interface StrumEvent {
  direction: StrumDirection;
  /** Position within the pattern as a fraction of total beats (0 to 1) */
  position: number;
}

/**
 * Fingerpick finger-to-string mapping.
 * Standard classical guitar right hand:
 *   p (pulgar/thumb)  = bass note (lowest in chord, index 0)
 *   i (índice/index)  = 3rd string from top (G string area)
 *   m (medio/middle)  = 2nd string from top (B string area)
 *   a (anular/ring)   = 1st string / highest note (e string)
 */
export interface FingerpickEvent {
  finger: 'p' | 'i' | 'm' | 'a';
  /** Position within the pattern as a fraction of total beats (0 to 1) */
  position: number;
}

/**
 * Parse a fingerpick pattern string into timed events.
 * Patterns like "Fingerpick: p i m a m i"
 */
export function parseFingerpickPattern(pattern: string): FingerpickEvent[] {
  if (!pattern) return [];

  // Extract the finger sequence after "Fingerpick:" prefix
  const match = pattern.match(/fingerpick[:\s]+(.+)/i);
  if (!match) return [];

  const tokens = match[1].trim().split(/\s+/);
  const validFingers = new Set(['p', 'i', 'm', 'a']);
  const events: FingerpickEvent[] = [];

  for (let idx = 0; idx < tokens.length; idx++) {
    const f = tokens[idx].toLowerCase();
    if (validFingers.has(f)) {
      events.push({
        finger: f as FingerpickEvent['finger'],
        position: idx / tokens.length,
      });
    }
  }

  return events;
}

/**
 * Resolve a fingerpick finger to the correct note from a chord's note array.
 *   p = bass (index 0)
 *   i = 3rd from end (G string)
 *   m = 2nd from end (B string)
 *   a = last / highest (e string)
 * Falls back gracefully for chords with fewer notes.
 */
function fingerpickNoteIndex(finger: FingerpickEvent['finger'], noteCount: number): number {
  switch (finger) {
    case 'p': return 0;                                  // bass note
    case 'i': return Math.max(0, noteCount - 3);         // G string area
    case 'm': return Math.max(0, noteCount - 2);         // B string area
    case 'a': return noteCount - 1;                      // high e string
  }
}

/**
 * Parse a strum pattern string into timed events.
 * Patterns like "D D U U D U" or "D . D U . U D U"
 * where D = downstrum, U = upstrum, . or space-gap = rest.
 * Each token gets equal time subdivision.
 * Returns empty for fingerpick patterns (use parseFingerpickPattern instead).
 */
export function parseStrumPattern(pattern: string): StrumEvent[] {
  if (!pattern) return [];

  // Fingerpick patterns are handled separately
  if (pattern.toLowerCase().includes('fingerpick')) return [];

  // Tokenize: split by whitespace, each token is a slot
  const tokens = pattern.trim().split(/\s+/);
  if (tokens.length === 0) return [];

  const events: StrumEvent[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i].toUpperCase();
    const position = i / tokens.length;
    if (t === 'D') {
      events.push({ direction: 'D', position });
    } else if (t === 'U') {
      events.push({ direction: 'U', position });
    }
    // '.' or anything else = rest (no event)
  }

  return events;
}

/**
 * Play a single short strum hit.
 * Down strums play notes low-to-high, up strums high-to-low.
 * Duration is short (like a real strum, not a sustained pad).
 */
function playStrumHit(
  ctx: AudioContext,
  destination: GainNode,
  notes: string[],
  startTime: number,
  duration: number,
  sound: GuitarSettings['sound'],
  direction: StrumDirection
): OscillatorNode[] {
  const oscillators: OscillatorNode[] = [];
  const orderedNotes = direction === 'U' ? [...notes].reverse() : notes;
  const noteGain = 0.15 / Math.sqrt(orderedNotes.length);
  // Up strums are slightly softer
  const volumeMultiplier = direction === 'U' ? 0.75 : 1.0;

  orderedNotes.forEach((note, i) => {
    const freq = NOTE_FREQUENCIES[note];
    if (!freq) return;

    // Strum delay per string — slightly faster for upstrums
    const strumDelay = i * (direction === 'U' ? 0.008 : 0.012);
    const noteStart = startTime + strumDelay;
    const noteStop = noteStart + duration + 0.05;

    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    const { output: toneOut, extraOscs } = applyTone(ctx, osc, sound, freq, noteStart, noteStop);
    const envelope = ctx.createGain();

    toneOut.connect(envelope);
    envelope.connect(destination);

    const gain = noteGain * volumeMultiplier;

    // Shorter ADSR for individual strum hits
    envelope.gain.setValueAtTime(0, noteStart);
    envelope.gain.linearRampToValueAtTime(gain, noteStart + 0.015);  // quick attack
    envelope.gain.linearRampToValueAtTime(gain * 0.6, noteStart + 0.06); // fast decay
    envelope.gain.setValueAtTime(gain * 0.6, noteStart + duration * 0.6); // sustain
    envelope.gain.linearRampToValueAtTime(0, noteStart + duration); // release

    osc.start(noteStart);
    osc.stop(noteStop);
    oscillators.push(osc, ...extraOscs);
  });

  return oscillators;
}

/**
 * Play a single fingerpicked note with a plucky, bright attack.
 */
function playFingerpickNote(
  ctx: AudioContext,
  destination: GainNode,
  note: string,
  startTime: number,
  duration: number,
  sound: GuitarSettings['sound'],
  isBass: boolean
): OscillatorNode[] {
  const freq = NOTE_FREQUENCIES[note];
  if (!freq) return [];

  const noteStop = startTime + duration + 0.05;
  const osc = ctx.createOscillator();
  osc.frequency.value = freq;
  const { output: toneOut, extraOscs } = applyTone(ctx, osc, sound, freq, startTime, noteStop);
  const envelope = ctx.createGain();

  toneOut.connect(envelope);
  envelope.connect(destination);

  // Bass notes are a bit louder and have longer sustain
  const baseGain = isBass ? 0.18 : 0.14;

  // Plucky envelope: fast attack, quick decay, gentle sustain
  envelope.gain.setValueAtTime(0, startTime);
  envelope.gain.linearRampToValueAtTime(baseGain, startTime + 0.008);   // very fast attack
  envelope.gain.linearRampToValueAtTime(baseGain * 0.4, startTime + 0.08); // quick decay
  envelope.gain.setValueAtTime(baseGain * 0.4, startTime + duration * 0.5);
  envelope.gain.linearRampToValueAtTime(0, startTime + duration);       // release

  osc.start(startTime);
  osc.stop(noteStop);

  return [osc, ...extraOscs];
}

// ============================================================
// AUDIO ENGINE
// ============================================================

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let currentPlayback: { stop: () => void } | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioContext || audioContext.state === 'closed') {
      audioContext = new AudioContext();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  } catch {
    return null;
  }
}

function getMasterGain(ctx: AudioContext, volume: number): GainNode {
  if (!masterGain || masterGain.context !== ctx) {
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
  }
  masterGain.gain.value = volume / 100;
  return masterGain;
}

/**
 * Sound shaping for different tone characters.
 * `freq` is the actual note frequency — needed so harmonic oscillators
 * can be tuned correctly (osc.frequency may not be set yet when this runs).
 * Returns { output: GainNode, extraOscs: OscillatorNode[] } so callers
 * can schedule start/stop for any auxiliary oscillators.
 */
function applyTone(
  ctx: AudioContext,
  osc: OscillatorNode,
  sound: GuitarSettings['sound'],
  freq: number,
  startTime: number,
  stopTime: number
): { output: GainNode; extraOscs: OscillatorNode[] } {
  const gain = ctx.createGain();
  const extraOscs: OscillatorNode[] = [];

  /** Helper: create a harmonic oscillator at a multiple of the base freq */
  function addHarmonic(
    type: OscillatorType,
    multiple: number,
    volume: number,
    filterFreq?: number
  ) {
    const h = ctx.createOscillator();
    h.type = type;
    h.frequency.value = freq * multiple;
    const hGain = ctx.createGain();
    hGain.gain.value = volume;
    if (filterFreq) {
      const hFilter = ctx.createBiquadFilter();
      hFilter.type = 'lowpass';
      hFilter.frequency.value = filterFreq;
      h.connect(hFilter);
      hFilter.connect(hGain);
    } else {
      h.connect(hGain);
    }
    hGain.connect(gain);
    h.start(startTime);
    h.stop(stopTime);
    extraOscs.push(h);
  }

  switch (sound) {
    case 'clean':
      osc.type = 'triangle';
      osc.connect(gain);
      break;

    case 'warm':
      osc.type = 'sine';
      osc.connect(gain);
      break;

    case 'bright': {
      osc.type = 'sawtooth';
      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 2000;
      lpf.Q.value = 1;
      osc.connect(lpf);
      lpf.connect(gain);
      break;
    }

    case 'acoustic': {
      // Triangle base + body resonance + subtle 2nd harmonic (sawtooth, filtered)
      osc.type = 'triangle';
      const bodyFilter = ctx.createBiquadFilter();
      bodyFilter.type = 'peaking';
      bodyFilter.frequency.value = 250;
      bodyFilter.Q.value = 2;
      bodyFilter.gain.value = 6;
      const topFilter = ctx.createBiquadFilter();
      topFilter.type = 'lowpass';
      topFilter.frequency.value = 4500;
      topFilter.Q.value = 0.7;
      osc.connect(bodyFilter);
      bodyFilter.connect(topFilter);
      topFilter.connect(gain);
      addHarmonic('sawtooth', 2, 0.08, 2500);
      break;
    }

    case 'nylon': {
      // Sine base + warm body + muted highs + faint 3rd harmonic
      osc.type = 'sine';
      const nylonBody = ctx.createBiquadFilter();
      nylonBody.type = 'peaking';
      nylonBody.frequency.value = 200;
      nylonBody.Q.value = 1.5;
      nylonBody.gain.value = 4;
      const nylonRoll = ctx.createBiquadFilter();
      nylonRoll.type = 'lowpass';
      nylonRoll.frequency.value = 2200;
      nylonRoll.Q.value = 0.5;
      osc.connect(nylonBody);
      nylonBody.connect(nylonRoll);
      nylonRoll.connect(gain);
      addHarmonic('sine', 3, 0.04);
      break;
    }

    case 'electric': {
      // Square wave → waveshaper distortion → cabinet sim
      osc.type = 'square';
      const waveshaper = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i / 128) - 1;
        curve[i] = (Math.PI + 3.5) * x / (Math.PI + 3.5 * Math.abs(x));
      }
      waveshaper.curve = curve;
      waveshaper.oversample = '2x';
      const cabLow = ctx.createBiquadFilter();
      cabLow.type = 'highpass';
      cabLow.frequency.value = 120;
      const cabHigh = ctx.createBiquadFilter();
      cabHigh.type = 'lowpass';
      cabHigh.frequency.value = 3500;
      cabHigh.Q.value = 0.8;
      const cabMid = ctx.createBiquadFilter();
      cabMid.type = 'peaking';
      cabMid.frequency.value = 800;
      cabMid.Q.value = 1.5;
      cabMid.gain.value = 4;
      osc.connect(waveshaper);
      waveshaper.connect(cabLow);
      cabLow.connect(cabHigh);
      cabHigh.connect(cabMid);
      cabMid.connect(gain);
      break;
    }

    case 'jazz': {
      // Sine base + warm low-mid + rolled highs + subtle 2nd harmonic
      osc.type = 'sine';
      const jazzWarm = ctx.createBiquadFilter();
      jazzWarm.type = 'peaking';
      jazzWarm.frequency.value = 300;
      jazzWarm.Q.value = 1;
      jazzWarm.gain.value = 5;
      const jazzRoll = ctx.createBiquadFilter();
      jazzRoll.type = 'lowpass';
      jazzRoll.frequency.value = 1800;
      jazzRoll.Q.value = 0.4;
      osc.connect(jazzWarm);
      jazzWarm.connect(jazzRoll);
      jazzRoll.connect(gain);
      addHarmonic('sine', 2, 0.06, 1500);
      break;
    }

    default:
      osc.connect(gain);
  }

  return { output: gain, extraOscs };
}

function playChordTone(
  ctx: AudioContext,
  destination: GainNode,
  notes: string[],
  startTime: number,
  duration: number,
  sound: GuitarSettings['sound']
): OscillatorNode[] {
  const oscillators: OscillatorNode[] = [];
  const noteGain = 0.15 / Math.sqrt(notes.length); // normalize volume by note count

  notes.forEach((note, i) => {
    const freq = NOTE_FREQUENCIES[note];
    if (!freq) return;

    // Strum effect: slight delay per string (10ms apart)
    const strumDelay = i * 0.01;
    const noteStart = startTime + strumDelay;
    const noteStop = noteStart + duration + 0.05;

    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    const { output: toneOut, extraOscs } = applyTone(ctx, osc, sound, freq, noteStart, noteStop);
    const envelope = ctx.createGain();

    toneOut.connect(envelope);
    envelope.connect(destination);

    // ADSR envelope for each note
    envelope.gain.setValueAtTime(0, noteStart);
    envelope.gain.linearRampToValueAtTime(noteGain, noteStart + 0.02); // attack
    envelope.gain.linearRampToValueAtTime(noteGain * 0.7, noteStart + 0.1); // decay to sustain
    envelope.gain.setValueAtTime(noteGain * 0.7, noteStart + duration - 0.1); // sustain
    envelope.gain.linearRampToValueAtTime(0, noteStart + duration); // release

    osc.start(noteStart);
    osc.stop(noteStop);
    oscillators.push(osc, ...extraOscs);
  });

  return oscillators;
}

/**
 * Accent level for metronome clicks:
 *   'accent'  = loud high-pitched click (beat 1 / clave hit)
 *   'normal'  = standard click
 *   'ghost'   = quiet click (unstressed beat)
 *   'silent'  = no sound (skip this beat)
 */
type ClickAccent = 'accent' | 'normal' | 'ghost' | 'silent';

function playClick(
  ctx: AudioContext,
  destination: GainNode,
  time: number,
  accent: ClickAccent = 'normal'
) {
  if (accent === 'silent') return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(destination);

  const freqMap: Record<ClickAccent, number> = { accent: 1200, normal: 900, ghost: 700, silent: 0 };
  const volMap: Record<ClickAccent, number> = { accent: 0.35, normal: 0.18, ghost: 0.08, silent: 0 };

  osc.frequency.value = freqMap[accent];
  osc.type = 'sine';

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(volMap[accent], time + 0.005);
  gain.gain.linearRampToValueAtTime(0, time + (accent === 'accent' ? 0.06 : 0.04));

  osc.start(time);
  osc.stop(time + 0.07);
}

export interface PlaybackCallbacks {
  onChordChange?: (chordIndex: number, chord: string) => void;
  onBeat?: (beat: number) => void;
  onComplete?: () => void;
}

/**
 * Play a chord progression with the given settings.
 * Optionally pass a strumPattern string (e.g. "D D U U D U") to use strum rhythm.
 * Returns a stop function.
 */
/**
 * Optional accent pattern for metronome.
 * Array of ClickAccent values, one per beat. Cycles if shorter than beatsPerChord.
 * Example salsa 4-beat: ['accent', 'ghost', 'accent', 'ghost']
 */
export type AccentPattern = ('accent' | 'normal' | 'ghost' | 'silent')[];

export function playChordProgression(
  chords: string[],
  settings: GuitarSettings,
  loops: number = 2,
  callbacks?: PlaybackCallbacks,
  strumPattern?: string,
  accentPattern?: AccentPattern
): { stop: () => void } {
  // Stop any current playback
  if (currentPlayback) {
    currentPlayback.stop();
  }

  const ctx = getAudioContext();
  if (!ctx) {
    callbacks?.onComplete?.();
    return { stop: () => {} };
  }
  const master = getMasterGain(ctx, settings.volume);

  const beatDuration = 60 / settings.tempo;
  const allOscillators: OscillatorNode[] = [];
  let stopped = false;
  let animFrameId: number | null = null;
  const startTime = ctx.currentTime + 0.1;

  let currentTime = startTime;

  // Count-in (4 clicks) — uses accent pattern if provided
  if (settings.countIn) {
    for (let i = 0; i < 4; i++) {
      const countAccent: ClickAccent = accentPattern
        ? accentPattern[i % accentPattern.length]
        : (i === 0 ? 'accent' : 'normal');
      playClick(ctx, master, currentTime + i * beatDuration, countAccent);
    }
    currentTime += 4 * beatDuration;
  }

  const progressionStart = currentTime;

  // Parse strum or fingerpick pattern if enabled
  const strumEvents = (settings.useStrumPattern && strumPattern)
    ? parseStrumPattern(strumPattern)
    : [];
  const fingerpickEvents = (settings.useStrumPattern && strumPattern)
    ? parseFingerpickPattern(strumPattern)
    : [];
  const useStrum = strumEvents.length > 0;
  const useFingerpick = fingerpickEvents.length > 0;

  // Schedule all chord tones
  for (let loop = 0; loop < loops; loop++) {
    for (let ci = 0; ci < chords.length; ci++) {
      const chord = chords[ci];
      const notes = CHORD_NOTES[chord];
      if (!notes) continue;

      const chordDuration = settings.beatsPerChord * beatDuration;

      // Play metronome clicks for each beat (if enabled)
      if (settings.metronome) {
        for (let beat = 0; beat < settings.beatsPerChord; beat++) {
          const beatAccent: ClickAccent = accentPattern
            ? accentPattern[beat % accentPattern.length]
            : (beat === 0 ? 'accent' : 'normal');
          playClick(ctx, master, currentTime + beat * beatDuration, beatAccent);
        }
      }

      if (useFingerpick) {
        // Play individual fingerpicked notes at pattern-defined times
        for (const evt of fingerpickEvents) {
          const pickTime = currentTime + evt.position * chordDuration;
          const noteIdx = fingerpickNoteIndex(evt.finger, notes.length);
          const note = notes[noteIdx];
          // Each picked note rings until the next pick or end of chord
          const nextPosition = fingerpickEvents.find(e => e.position > evt.position)?.position ?? 1;
          const noteDuration = (nextPosition - evt.position) * chordDuration * 0.95;
          const oscs = playFingerpickNote(ctx, master, note, pickTime, Math.max(noteDuration, 0.12), settings.sound, evt.finger === 'p');
          allOscillators.push(...oscs);
        }
      } else if (useStrum) {
        // Play individual strum hits at pattern-defined times
        for (const evt of strumEvents) {
          const strumTime = currentTime + evt.position * chordDuration;
          // Each strum hit lasts until the next event or end of chord
          const nextPosition = strumEvents.find(e => e.position > evt.position)?.position ?? 1;
          const hitDuration = (nextPosition - evt.position) * chordDuration * 0.9;
          const oscs = playStrumHit(ctx, master, notes, strumTime, Math.max(hitDuration, 0.1), settings.sound, evt.direction);
          allOscillators.push(...oscs);
        }
      } else {
        // Sustained chord tone (original behavior)
        const oscs = playChordTone(ctx, master, notes, currentTime, chordDuration - 0.05, settings.sound);
        allOscillators.push(...oscs);
      }

      currentTime += chordDuration;
    }
  }

  const totalDuration = currentTime - startTime;

  // Animation frame loop for callbacks
  if (callbacks) {
    const tick = () => {
      if (stopped) return;
      const elapsed = ctx.currentTime - progressionStart;

      if (elapsed >= 0) {
        const beatsPerChord = settings.beatsPerChord;
        const totalBeatsPerLoop = chords.length * beatsPerChord;
        const currentBeatInAll = Math.floor(elapsed / beatDuration);
        const currentBeatInLoop = currentBeatInAll % totalBeatsPerLoop;
        const chordIndex = Math.floor(currentBeatInLoop / beatsPerChord) % chords.length;
        const beat = currentBeatInLoop % beatsPerChord;

        callbacks.onChordChange?.(chordIndex, chords[chordIndex]);
        callbacks.onBeat?.(beat);
      }

      if (ctx.currentTime < startTime + totalDuration) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        callbacks.onComplete?.();
      }
    };
    animFrameId = requestAnimationFrame(tick);
  }

  const stopFn = {
    stop: () => {
      stopped = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      allOscillators.forEach(osc => {
        try { osc.stop(); } catch { /* already stopped */ }
      });
      callbacks?.onComplete?.();
    }
  };

  currentPlayback = stopFn;

  // Auto-complete
  setTimeout(() => {
    if (!stopped) {
      callbacks?.onComplete?.();
      currentPlayback = null;
    }
  }, totalDuration * 1000 + 200);

  return stopFn;
}

export function stopPlayback() {
  if (currentPlayback) {
    currentPlayback.stop();
    currentPlayback = null;
  }
}

/**
 * Play a single chord (for preview / chord diagram taps)
 */
export function playChord(chordName: string, settings?: Partial<GuitarSettings>) {
  const s = { ...DEFAULT_GUITAR_SETTINGS, ...settings };
  const ctx = getAudioContext();
  if (!ctx) return;
  const master = getMasterGain(ctx, s.volume);
  const notes = CHORD_NOTES[chordName];
  if (!notes) return;

  playChordTone(ctx, master, notes, ctx.currentTime + 0.02, 1.5, s.sound);
}
