'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Key,
  Check,
  AlertCircle,
  Loader2,
  Sun,
  Moon,
  Monitor,
  BookOpen,
  Download,
  Trash2,
  GraduationCap,
  Music,
  Play,
} from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { resetPremiumTTSCache } from '@/lib/speech';
import { useTheme } from '@/context/ThemeContext';
import { useProgress } from '@/context/ProgressContext';
import {
  GuitarSettings,
  DEFAULT_GUITAR_SETTINGS,
  loadGuitarSettings,
  saveGuitarSettings,
  playChordProgression,
  stopPlayback,
} from '@/lib/chord-audio';

interface TTSSettings {
  elevenLabsApiKey: string | null;
  elevenLabsVoiceId: string;
  usePremiumTTS: boolean;
  hasApiKey: boolean;
}

// Popular ElevenLabs voices that work well with Spanish
const VOICE_OPTIONS = [
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily (Warm, Natural)' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Soft, Gentle)' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Deep, Authoritative)' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam (Young, Energetic)' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte (Calm, Professional)' },
];

const SPEECH_RATES = [
  { value: 0.5, label: 'Very Slow (0.5x)' },
  { value: 0.75, label: 'Slow (0.75x)' },
  { value: 0.85, label: 'Comfortable (0.85x)' },
  { value: 1.0, label: 'Normal (1.0x)' },
  { value: 1.25, label: 'Fast (1.25x)' },
];

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner / Principiante' },
  { value: 'elementary', label: 'Elementary / Elemental' },
  { value: 'intermediate', label: 'Intermediate / Intermedio' },
];

const COLOR_SCHEMES = [
  { value: 'default', label: 'Default', description: 'Warm coral & gold', colors: ['#E85D4C', '#F4C430', '#1A535C'] },
  { value: 'peru', label: 'Perú', description: 'Red, white & gold', colors: ['#D91023', '#FFFFFF', '#C8A951'] },
  { value: 'mexico', label: 'México', description: 'Green, white & red', colors: ['#006847', '#FFFFFF', '#CE1126'] },
  { value: 'colombia', label: 'Colombia', description: 'Yellow, blue & red', colors: ['#FCD116', '#003893', '#CE1126'] },
  { value: 'argentina', label: 'Argentina', description: 'Light blue & gold', colors: ['#74ACDF', '#FFFFFF', '#FCBF49'] },
];

// Local settings stored in localStorage
interface LocalSettings {
  speechRate: number;
  autoPlayAudio: boolean;
  showTranslationsByDefault: boolean;
  defaultDifficulty: string;
  flashcardRevealDelay: number;
}

const DEFAULT_LOCAL_SETTINGS: LocalSettings = {
  speechRate: 0.85,
  autoPlayAudio: false,
  showTranslationsByDefault: false,
  defaultDifficulty: 'beginner',
  flashcardRevealDelay: 3,
};

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function SettingsPage() {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const { progress, resetProgress } = useProgress();

  // Section refs for scroll navigation
  const appearanceRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
  const learningRef = useRef<HTMLDivElement>(null);
  const guitarRef = useRef<HTMLDivElement>(null);
  const ttsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [ttsSettings, setTtsSettings] = useState<TTSSettings>({
    elevenLabsApiKey: null,
    elevenLabsVoiceId: 'pFZP5JQG7iQjIQuC4Bku',
    usePremiumTTS: false,
    hasApiKey: false,
  });
  const [localSettings, setLocalSettings] = useState<LocalSettings>(DEFAULT_LOCAL_SETTINGS);
  const [newApiKey, setNewApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [guitarSettings, setGuitarSettings] = useState<GuitarSettings>(DEFAULT_GUITAR_SETTINGS);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');

  useEffect(() => {
    fetchSettings();
    loadLocalSettings();
    setGuitarSettings(loadGuitarSettings());
  }, []);

  // Tabs configuration
  const tabs: TabItem[] = [
    { id: 'appearance', label: 'Appearance', icon: <Monitor className="w-4 h-4" /> },
    { id: 'audio', label: 'Audio', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'learning', label: 'Learning', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'guitar', label: 'Guitar', icon: <Music className="w-4 h-4" /> },
    { id: 'tts', label: 'TTS', icon: <Key className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const scrollToSection = (sectionId: string, ref: React.RefObject<HTMLDivElement | null>) => {
    setActiveTab(sectionId);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  function updateGuitarSettings(updates: Partial<GuitarSettings>) {
    const newSettings = { ...guitarSettings, ...updates };
    setGuitarSettings(newSettings);
    saveGuitarSettings(newSettings);
    setMessage({ type: 'success', text: 'Guitar settings saved!' });
    setTimeout(() => setMessage(null), 2000);
  }

  function previewGuitarSound() {
    if (isPreviewPlaying) {
      stopPlayback();
      setIsPreviewPlaying(false);
      return;
    }
    setIsPreviewPlaying(true);
    playChordProgression(
      ['G', 'C', 'D', 'G'],
      guitarSettings,
      1,
      { onComplete: () => setIsPreviewPlaying(false) },
      'D D U U D U'
    );
  }

  function loadLocalSettings() {
    try {
      const stored = localStorage.getItem('learningSettings');
      if (stored) {
        setLocalSettings({ ...DEFAULT_LOCAL_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to load local settings:', e);
    }
  }

  function saveLocalSettings(newSettings: LocalSettings) {
    setLocalSettings(newSettings);
    localStorage.setItem('learningSettings', JSON.stringify(newSettings));
    setMessage({ type: 'success', text: 'Settings saved!' });
    setTimeout(() => setMessage(null), 2000);
  }

  async function fetchSettings() {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setTtsSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveTTSSettings() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elevenLabsApiKey: newApiKey || undefined,
          elevenLabsVoiceId: ttsSettings.elevenLabsVoiceId,
          usePremiumTTS: ttsSettings.usePremiumTTS,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTtsSettings(data);
        setNewApiKey('');
        resetPremiumTTSCache();
        setMessage({ type: 'success', text: 'TTS settings saved!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  }

  async function testTTS() {
    setTesting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hola, esta es una prueba de voz.' }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => URL.revokeObjectURL(audioUrl);
        await audio.play();
        setMessage({ type: 'success', text: 'Voice test successful!' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Voice test failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to test voice' });
    } finally {
      setTesting(false);
    }
  }

  function handleResetProgress() {
    resetProgress();
    setShowResetConfirm(false);
    setMessage({ type: 'success', text: 'Progress has been reset!' });
  }

  function exportProgress() {
    const data = {
      progress,
      settings: localSettings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aprende-español-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: 'Progress exported!' });
  }

  // Calculate stats
  const lessonsCompleted = progress.lessonsCompleted.length;
  const conversationsCompleted = progress.conversationsCompleted.length;
  const wordsLearned = Object.keys(progress.flashcardProgress).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configuración / Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your learning experience
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <div className="flex gap-1 p-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  switch (tab.id) {
                    case 'appearance':
                      scrollToSection('appearance', appearanceRef);
                      break;
                    case 'audio':
                      scrollToSection('audio', audioRef);
                      break;
                    case 'learning':
                      scrollToSection('learning', learningRef);
                      break;
                    case 'guitar':
                      scrollToSection('guitar', guitarRef);
                      break;
                    case 'tts':
                      scrollToSection('tts', ttsRef);
                      break;
                    case 'progress':
                      scrollToSection('progress', progressRef);
                      break;
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Appearance Settings */}
      <div ref={appearanceRef} id="appearance" className="scroll-mt-32">
      <Card>
        <CardContent>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Monitor className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the app looks</CardDescription>
            </div>
          </div>

          <div className="space-y-6">
            {/* Theme Selection */}
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-3">Theme</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                    theme === 'light'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Sun className="w-5 h-5" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                    theme === 'dark'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Moon className="w-5 h-5" />
                  <span>Dark</span>
                </button>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="font-medium text-gray-900 dark:text-white mb-3">Color Scheme</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Choose a Latin American-inspired color palette
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLOR_SCHEMES.map((scheme) => (
                  <button
                    key={scheme.value}
                    onClick={() => setColorScheme(scheme.value as 'default' | 'peru' | 'mexico' | 'colombia' | 'argentina')}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      colorScheme === scheme.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex gap-1 mb-2">
                      {scheme.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="block font-medium text-sm text-gray-900 dark:text-white">
                      {scheme.label}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {scheme.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
      </div>

      {/* Audio Settings */}
      <div ref={audioRef} id="audio" className="scroll-mt-32">
      <Card>
        <CardContent>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Volume2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle>Audio</CardTitle>
              <CardDescription>Configure pronunciation and speech settings</CardDescription>
            </div>
          </div>

          <div className="space-y-6">
            {/* Speech Rate */}
            <div>
              <label className="block font-medium text-gray-900 dark:text-white mb-2">
                Speech Speed
              </label>
              <select
                value={localSettings.speechRate}
                onChange={(e) => saveLocalSettings({ ...localSettings, speechRate: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {SPEECH_RATES.map((rate) => (
                  <option key={rate.value} value={rate.value}>{rate.label}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Adjust how fast Spanish audio is played
              </p>
            </div>

            {/* Auto-play Audio */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto-play Audio</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically play pronunciation when viewing words
                </p>
              </div>
              <button
                onClick={() => saveLocalSettings({ ...localSettings, autoPlayAudio: !localSettings.autoPlayAudio })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.autoPlayAudio ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.autoPlayAudio ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Learning Preferences */}
      <div ref={learningRef} id="learning" className="scroll-mt-32">
      <Card>
        <CardContent>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle>Learning Preferences</CardTitle>
              <CardDescription>Customize your learning experience</CardDescription>
            </div>
          </div>

          <div className="space-y-6">
            {/* Default Difficulty */}
            <div>
              <label className="block font-medium text-gray-900 dark:text-white mb-2">
                Default Difficulty Level
              </label>
              <select
                value={localSettings.defaultDifficulty}
                onChange={(e) => saveLocalSettings({ ...localSettings, defaultDifficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            {/* Show Translations by Default */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Show Translations by Default</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Display English translations when reading stories
                </p>
              </div>
              <button
                onClick={() => saveLocalSettings({ ...localSettings, showTranslationsByDefault: !localSettings.showTranslationsByDefault })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.showTranslationsByDefault ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.showTranslationsByDefault ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Flashcard Reveal Delay */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block font-medium text-gray-900 dark:text-white mb-2">
                Flashcard Auto-reveal Delay
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={localSettings.flashcardRevealDelay}
                  onChange={(e) => saveLocalSettings({ ...localSettings, flashcardRevealDelay: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-20">
                  {localSettings.flashcardRevealDelay} seconds
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Time before the flashcard answer is automatically revealed (if enabled)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Guitar Playback Settings */}
      <div ref={guitarRef} id="guitar" className="scroll-mt-32">
      <Card>
        <CardContent>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Music className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle>Guitar Playback / Reproducción de guitarra</CardTitle>
              <CardDescription>Configure the chord playback engine for the Guitarra section</CardDescription>
            </div>
          </div>

          <div className="space-y-6">
            {/* Tempo */}
            <div>
              <label className="block font-medium text-gray-900 dark:text-white mb-2">
                Tempo: {guitarSettings.tempo} BPM
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="40"
                  max="180"
                  step="5"
                  value={guitarSettings.tempo}
                  onChange={(e) => updateGuitarSettings({ tempo: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 w-20 text-right">
                  {guitarSettings.tempo < 70 ? 'Slow' : guitarSettings.tempo < 110 ? 'Medium' : guitarSettings.tempo < 140 ? 'Upbeat' : 'Fast'}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Start slow (60-80 BPM) when learning new chord changes
              </p>
            </div>

            {/* Volume */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block font-medium text-gray-900 dark:text-white mb-2">
                Playback Volume: {guitarSettings.volume}%
              </label>
              <div className="flex items-center gap-4">
                <Volume2 className="w-4 h-4 text-gray-400" />
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={guitarSettings.volume}
                  onChange={(e) => updateGuitarSettings({ volume: parseInt(e.target.value) })}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Sound Character */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block font-medium text-gray-900 dark:text-white mb-3">
                Sound Character
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {([
                  { value: 'clean' as const, label: 'Clean', desc: 'Clear triangle wave' },
                  { value: 'warm' as const, label: 'Warm', desc: 'Soft, rounded sine' },
                  { value: 'bright' as const, label: 'Bright', desc: 'Crisp, detailed' },
                  { value: 'acoustic' as const, label: 'Acoustic', desc: 'Woody, resonant body' },
                  { value: 'nylon' as const, label: 'Nylon', desc: 'Classical, muted highs' },
                  { value: 'electric' as const, label: 'Electric', desc: 'Overdriven crunch' },
                  { value: 'jazz' as const, label: 'Jazz', desc: 'Mellow hollow-body' },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateGuitarSettings({ sound: opt.value })}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      guitarSettings.sound === opt.value
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="block font-medium text-sm text-gray-900 dark:text-white">
                      {opt.label}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Beats Per Chord */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block font-medium text-gray-900 dark:text-white mb-3">
                Beats Per Chord Change
              </label>
              <div className="flex gap-3">
                {[2, 4, 8].map(beats => (
                  <button
                    key={beats}
                    onClick={() => updateGuitarSettings({ beatsPerChord: beats })}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition-colors ${
                      guitarSettings.beatsPerChord === beats
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {beats} beats
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Use 8 beats for slow practice, 4 for normal, 2 for fast changes
              </p>
            </div>

            {/* Count-In */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Count-In Clicks</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Play 4 metronome clicks before the progression starts
                </p>
              </div>
              <button
                onClick={() => updateGuitarSettings({ countIn: !guitarSettings.countIn })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  guitarSettings.countIn ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  guitarSettings.countIn ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Metronome During Playback */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Metronome</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Play click track during chord progression playback
                </p>
              </div>
              <button
                onClick={() => updateGuitarSettings({ metronome: !guitarSettings.metronome })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  guitarSettings.metronome ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  guitarSettings.metronome ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Strum Pattern */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Strum Pattern</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Play each song&apos;s strum rhythm instead of sustained chords
                </p>
              </div>
              <button
                onClick={() => updateGuitarSettings({ useStrumPattern: !guitarSettings.useStrumPattern })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  guitarSettings.useStrumPattern ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  guitarSettings.useStrumPattern ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Preview Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={previewGuitarSound}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  isPreviewPlaying
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                <Play className="w-5 h-5" />
                {isPreviewPlaying ? 'Stop Preview' : 'Preview Sound (G → C → D → G)'}
              </button>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                Plays a sample G-C-D-G progression with your current settings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Premium TTS Settings */}
      <div ref={ttsRef} id="tts" className="scroll-mt-32">
      <Card>
        <CardContent>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Key className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle>Premium Text-to-Speech</CardTitle>
              <CardDescription>
                Use ElevenLabs for natural-sounding Spanish voices (optional)
              </CardDescription>
            </div>
          </div>

          <div className="space-y-6">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Enable Premium TTS</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use ElevenLabs instead of browser TTS
                </p>
              </div>
              <button
                onClick={() => setTtsSettings(s => ({ ...s, usePremiumTTS: !s.usePremiumTTS }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  ttsSettings.usePremiumTTS ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  ttsSettings.usePremiumTTS ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {ttsSettings.usePremiumTTS && (
              <>
                {/* API Key */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ElevenLabs API Key
                  </label>
                  {ttsSettings.hasApiKey ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-700 dark:text-green-400">
                          API key configured
                        </span>
                      </div>
                      <input
                        type="password"
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        placeholder="Enter new API key to replace..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                  ) : (
                    <input
                      type="password"
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      placeholder="Enter your ElevenLabs API key"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Get your API key from{' '}
                    <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
                      elevenlabs.io
                    </a>
                  </p>
                </div>

                {/* Voice Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Voice
                  </label>
                  <select
                    value={ttsSettings.elevenLabsVoiceId}
                    onChange={(e) => setTtsSettings(s => ({ ...s, elevenLabsVoiceId: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {VOICE_OPTIONS.map((voice) => (
                      <option key={voice.id} value={voice.id}>{voice.name}</option>
                    ))}
                  </select>
                </div>

                {/* Save & Test */}
                <div className="flex items-center gap-3">
                  <Button onClick={saveTTSSettings} disabled={saving}>
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : 'Save TTS Settings'}
                  </Button>
                  {ttsSettings.hasApiKey && (
                    <Button variant="secondary" onClick={testTTS} disabled={testing}>
                      {testing ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Testing...</> : <><Volume2 className="w-4 h-4 mr-2" /> Test Voice</>}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Progress & Data */}
      <div ref={progressRef} id="progress" className="scroll-mt-32">
      <Card>
        <CardContent>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle>Progress & Data</CardTitle>
              <CardDescription>Manage your learning progress</CardDescription>
            </div>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">{lessonsCompleted}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-500">{conversationsCompleted}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-500">{wordsLearned}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Words</div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Export Progress */}
            <Button variant="secondary" onClick={exportProgress} className="w-full justify-center">
              <Download className="w-4 h-4 mr-2" />
              Export Progress
            </Button>

            {/* Reset Progress */}
            {!showResetConfirm ? (
              <Button
                variant="secondary"
                onClick={() => setShowResetConfirm(true)}
                className="w-full justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All Progress
              </Button>
            ) : (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                  Are you sure? This will delete all your progress and cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleResetProgress}
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    Yes, Reset
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
