import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/db';
import { cookies } from 'next/headers';
import { getSessionByToken, getUserById } from '@/lib/db';

const SESSION_COOKIE_NAME = 'spanish_session';

// Check if user is admin
async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;

  const session = getSessionByToken(token);
  if (!session) return false;

  const user = getUserById(session.userId);
  return user?.role === 'ADMIN';
}

// GET /api/settings - Get current settings (admin only, returns masked API key)
export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = getSettings();

  // Return settings with masked API key for security
  return NextResponse.json({
    ...settings,
    elevenLabsApiKey: settings.elevenLabsApiKey ? '••••••••' + settings.elevenLabsApiKey.slice(-4) : null,
    hasApiKey: !!settings.elevenLabsApiKey,
  });
}

// PUT /api/settings - Update settings (admin only)
export async function PUT(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

    if (usePremiumTTS !== undefined) {
      updates.usePremiumTTS = usePremiumTTS;
    }

    const updated = updateSettings(updates);

    return NextResponse.json({
      ...updated,
      elevenLabsApiKey: updated.elevenLabsApiKey ? '••••••••' + updated.elevenLabsApiKey.slice(-4) : null,
      hasApiKey: !!updated.elevenLabsApiKey,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
