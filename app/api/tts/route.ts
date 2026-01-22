import { NextRequest, NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';

// Default Spanish voice from ElevenLabs (or can be configured)
const DEFAULT_VOICE_ID = 'pFZP5JQG7iQjIQuC4Bku'; // Lily - works well for Spanish

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    console.log('[TTS] POST request received, text length:', text?.length);

    if (!text || typeof text !== 'string') {
      console.log('[TTS] Error: Text is required');
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Limit text length for API costs
    if (text.length > 1000) {
      console.log('[TTS] Error: Text too long');
      return NextResponse.json({ error: 'Text too long (max 1000 characters)' }, { status: 400 });
    }

    const settings = getSettings();
    console.log('[TTS] Settings loaded:', {
      hasApiKey: !!settings.elevenLabsApiKey,
      usePremiumTTS: settings.usePremiumTTS,
      voiceId: settings.elevenLabsVoiceId
    });

    // Check if ElevenLabs is configured and enabled
    if (!settings.elevenLabsApiKey || !settings.usePremiumTTS) {
      console.log('[TTS] Premium TTS not configured or disabled');
      return NextResponse.json({
        error: 'Premium TTS not configured',
        useBrowserFallback: true
      }, { status: 404 });
    }

    const voiceId = settings.elevenLabsVoiceId || DEFAULT_VOICE_ID;
    console.log('[TTS] Using voice ID:', voiceId);

    // Call ElevenLabs API
    console.log('[TTS] Calling ElevenLabs API...');
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': settings.elevenLabsApiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2', // Best for Spanish
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    console.log('[TTS] ElevenLabs response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TTS] ElevenLabs API error:', response.status, errorText);

      // Return fallback signal so client uses browser TTS
      return NextResponse.json({
        error: 'ElevenLabs API error',
        useBrowserFallback: true
      }, { status: 500 });
    }

    // Return the audio stream
    const audioBuffer = await response.arrayBuffer();
    console.log('[TTS] Success! Audio buffer size:', audioBuffer.byteLength);

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      useBrowserFallback: true
    }, { status: 500 });
  }
}

// GET endpoint to check TTS status
export async function GET() {
  const settings = getSettings();
  const result = {
    premiumAvailable: !!settings.elevenLabsApiKey && settings.usePremiumTTS,
    voiceId: settings.elevenLabsVoiceId || DEFAULT_VOICE_ID,
  };
  console.log('[TTS] GET status check:', result);
  return NextResponse.json(result);
}
