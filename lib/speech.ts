'use client';

let speechSynthesis: SpeechSynthesis | null = null;
let spanishVoice: SpeechSynthesisVoice | null = null;

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
}

export function speak(text: string, rate: number = 0.9): Promise<void> {
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

export function stopSpeaking(): void {
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  return speechSynthesis?.speaking || false;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!speechSynthesis) {
    initSpeech();
  }

  return speechSynthesis?.getVoices().filter(v => v.lang.startsWith('es')) || [];
}

// Hook for React components
export function useSpeech() {
  return {
    speak,
    stopSpeaking,
    isSpeaking,
    getAvailableVoices,
  };
}
