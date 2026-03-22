import { NextRequest, NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

// Default Spanish voice from ElevenLabs (or can be configured)
const DEFAULT_VOICE_ID = 'pFZP5JQG7iQjIQuC4Bku'; // Lily - works well for Spanish

// Rate limiter: 20 requests per minute per IP
const ttsLimiter = rateLimit({ interval: 60000, limit: 20 });

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const limitResult = ttsLimiter(ip);

  if (!limitResult.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded: 20 requests per minute allowed' },
      { status: 429 }
    );
  }

  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Limit text length for API costs
    if (text.length > 1000) {
      return NextResponse.json({ error: 'Text too long (max 1000 characters)' }, { status: 400 });
    }

    const settings = await getSettings();

    // Get API key: env var first, then settings fallback
    const apiKey = process.env.ELEVENLABS_API_KEY || settings.elevenLabsApiKey;

    // Check if ElevenLabs is configured and enabled
    if (!apiKey || !settings.usePremiumTTS) {
      return NextResponse.json({
        error: 'Premium TTS not configured',
        useBrowserFallback: true
      }, { status: 404 });
    }

    // Get voice ID: env var first, then settings fallback, then default
    const voiceId = process.env.ELEVENLABS_VOICE_ID || settings.elevenLabsVoiceId || DEFAULT_VOICE_ID;

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
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

    if (!response.ok) {
      const errorText = await response.text();

      // Return fallback signal so client uses browser TTS
      return NextResponse.json({
        error: 'ElevenLabs API error',
        useBrowserFallback: true
      }, { status: 500 });
    }

    // Return the audio stream
    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Internal server error',
      useBrowserFallback: true
    }, { status: 500 });
  }
}

// GET endpoint to check TTS status
export async function GET() {
  const settings = await getSettings();
  const apiKey = process.env.ELEVENLABS_API_KEY || settings.elevenLabsApiKey;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || settings.elevenLabsVoiceId || DEFAULT_VOICE_ID;
  const result = {
    premiumAvailable: !!apiKey && settings.usePremiumTTS,
    voiceId,
  };
  return NextResponse.json(result);
}
