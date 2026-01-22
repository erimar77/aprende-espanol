'use client';

let speechSynthesis: SpeechSynthesis | null = null;
let spanishVoice: SpeechSynthesisVoice | null = null;
let currentAudio: HTMLAudioElement | null = null;
let premiumTTSAvailable: boolean | null = null;

export function initSpeech(): void {
  if (typeof window === 'undefined') return;

  speechSynthesis = window.speechSynthesis;

  // Load voices
  const loadVoices = () => {
    const voices = speechSynthesis?.getVoices() || [];

    // Prefer Spanish voices, with Mexican Spanish as first choice
    spanishVoice = voices.find(v => v.lang === 'es-MX')
      || voices.find(v => v.lang === 'es-ES')
      || voices.find(v => v.lang.startsWith('es'))
      || null;
  };

  loadVoices();

  // Chrome loads voices asynchronously
  if (speechSynthesis) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  // Check if premium TTS is available
  checkPremiumTTS();
}

async function checkPremiumTTS(): Promise<boolean> {
  if (premiumTTSAvailable !== null) return premiumTTSAvailable;

  try {
    const response = await fetch('/api/tts');
    const data = await response.json();
    const isAvailable = data.premiumAvailable || false;
    premiumTTSAvailable = isAvailable;
    return isAvailable;
  } catch {
    premiumTTSAvailable = false;
    return false;
  }
}

// Speak using ElevenLabs API
async function speakWithElevenLabs(text: string): Promise<boolean> {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const data = await response.json();
      if (data.useBrowserFallback) {
        return false; // Signal to use browser fallback
      }
      throw new Error(data.error);
    }

    // Stop any existing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    // Play the audio
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    currentAudio = new Audio(audioUrl);

    return new Promise((resolve) => {
      if (!currentAudio) {
        resolve(false);
        return;
      }
      currentAudio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        resolve(true);
      };
      currentAudio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        resolve(false); // Fall back to browser
      };
      currentAudio.play().catch(() => resolve(false));
    });
  } catch {
    return false; // Fall back to browser TTS
  }
}

// Speak using browser's built-in TTS
function speakWithBrowser(text: string, rate: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!speechSynthesis) {
      initSpeech();
    }

    if (!speechSynthesis) {
      reject(new Error('Speech synthesis not available'));
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      if (event.error !== 'canceled') {
        reject(new Error(`Speech error: ${event.error}`));
      } else {
        resolve();
      }
    };

    speechSynthesis.speak(utterance);
  });
}

export async function speak(text: string, rate: number = 0.9): Promise<void> {
  // Try ElevenLabs first if available
  const isPremiumAvailable = await checkPremiumTTS();

  if (isPremiumAvailable) {
    const success = await speakWithElevenLabs(text);
    if (success) return;
    // If ElevenLabs fails, fall through to browser TTS
  }

  // Fallback to browser TTS
  return speakWithBrowser(text, rate);
}

export function stopSpeaking(): void {
  // Stop ElevenLabs audio if playing
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  // Stop browser TTS if speaking
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  // Check both ElevenLabs audio and browser TTS
  const audioPlaying = currentAudio && !currentAudio.paused;
  const browserSpeaking = speechSynthesis?.speaking || false;
  return audioPlaying || browserSpeaking;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!speechSynthesis) {
    initSpeech();
  }

  return speechSynthesis?.getVoices().filter(v => v.lang.startsWith('es')) || [];
}

// Reset premium TTS cache (call after settings change)
export function resetPremiumTTSCache(): void {
  premiumTTSAvailable = null;
}

// Hook for React components
export function useSpeech() {
  return {
    speak,
    stopSpeaking,
    isSpeaking,
    getAvailableVoices,
    resetPremiumTTSCache,
  };
}
