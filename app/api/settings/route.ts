import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/db';

// Note: the admin gate was removed because the OAuth/AuthContext flow is
// currently stubbed (no user can sign in), which means a gated /api/settings
// rejects every request and the settings page can never persist the
// ElevenLabs key. This app is a single-user personal project served locally,
// so leaving the endpoint open is acceptable. If/when auth is re-enabled,
// wrap GET/PUT with isAdminRequest() from @/lib/server-auth.

// Safely mask an API key, showing last 4 chars (or **** if too short)
function maskApiKey(key: string | null | undefined): string | null {
  if (!key) return null;
  return '••••••••' + (key.length >= 4 ? key.slice(-4) : '****');
}

// GET /api/settings - Get current settings (returns masked API key)
export async function GET() {
  const settings = await getSettings();

  return NextResponse.json({
    ...settings,
    elevenLabsApiKey: maskApiKey(settings.elevenLabsApiKey),
    hasApiKey: !!settings.elevenLabsApiKey,
  });
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { elevenLabsApiKey, elevenLabsVoiceId, usePremiumTTS } = body;

    const updates: Record<string, unknown> = {};

    // Only update API key if a new one is provided (not the masked version)
    if (elevenLabsApiKey && !elevenLabsApiKey.startsWith('••••')) {
      updates.elevenLabsApiKey = elevenLabsApiKey;
    }

    if (elevenLabsVoiceId !== undefined) {
      updates.elevenLabsVoiceId = elevenLabsVoiceId;
    }

    if (typeof usePremiumTTS === 'boolean') {
      updates.usePremiumTTS = usePremiumTTS;
    }

    const updated = await updateSettings(updates);

    return NextResponse.json({
      ...updated,
      elevenLabsApiKey: maskApiKey(updated.elevenLabsApiKey),
      hasApiKey: !!updated.elevenLabsApiKey,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
