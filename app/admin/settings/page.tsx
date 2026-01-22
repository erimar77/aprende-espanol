'use client';

import { useState, useEffect } from 'react';
import { Volume2, Key, Check, AlertCircle, Loader2 } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { resetPremiumTTSCache } from '@/lib/speech';

interface Settings {
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

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    elevenLabsApiKey: null,
    elevenLabsVoiceId: 'pFZP5JQG7iQjIQuC4Bku',
    usePremiumTTS: false,
    hasApiKey: false,
  });
  const [newApiKey, setNewApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elevenLabsApiKey: newApiKey || undefined,
          elevenLabsVoiceId: settings.elevenLabsVoiceId,
          usePremiumTTS: settings.usePremiumTTS,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setNewApiKey('');
        // Reset the TTS cache so it picks up the new settings
        resetPremiumTTSCache();
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure app settings and integrations
        </p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* ElevenLabs TTS Settings */}
      <Card>
        <CardContent>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Volume2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle>Premium Text-to-Speech</CardTitle>
              <CardDescription>
                Use ElevenLabs for natural-sounding Spanish voices. Falls back to browser TTS if unavailable.
              </CardDescription>
            </div>
          </div>

          <div className="space-y-6">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Enable Premium TTS</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use ElevenLabs when an API key is configured
                </p>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, usePremiumTTS: !s.usePremiumTTS }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.usePremiumTTS ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.usePremiumTTS ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  ElevenLabs API Key
                </div>
              </label>
              {settings.hasApiKey ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      API key configured: {settings.elevenLabsApiKey}
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
                <a
                  href="https://elevenlabs.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:underline"
                >
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
                value={settings.elevenLabsVoiceId}
                onChange={(e) => setSettings(s => ({ ...s, elevenLabsVoiceId: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {VOICE_OPTIONS.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                All voices use the multilingual v2 model which supports Spanish.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={saveSettings}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>

              {settings.hasApiKey && settings.usePremiumTTS && (
                <Button
                  variant="secondary"
                  onClick={testTTS}
                  disabled={testing}
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Test Voice
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardContent>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            About Text-to-Speech
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• <strong>Browser TTS:</strong> Free, built into the browser. Quality varies by device.</li>
            <li>• <strong>ElevenLabs:</strong> Premium, natural-sounding voices. Requires API key and has usage costs.</li>
            <li>• The app automatically falls back to browser TTS if ElevenLabs is unavailable or fails.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
