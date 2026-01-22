import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getUserByEmail,
  getUserById,
  createUser,
  createSession,
  getSessionByToken,
  deleteSessionByToken,
  DbUser,
} from '@/lib/db';

const SESSION_COOKIE_NAME = 'spanish_session';

// GET /api/auth - Get current session
export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return NextResponse.json({ user: null });
  }

  const session = getSessionByToken(sessionToken);
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  // Return user without sensitive data
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      approved: user.approved,
    },
  });
}

// POST /api/auth - Sign in (simulated OAuth callback)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, email, name, image, providerId } = body;

    if (!provider || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = getUserByEmail(email);

    if (!user) {
      // Create new user
      user = createUser({
        email,
        name,
        image: image || undefined,
        provider,
        providerId: providerId || email,
        role: 'USER',
        approved: false, // New users need approval
      });
    }

    // Create session
    const session = createSession(user.id);

    // Set cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        approved: user.approved,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// DELETE /api/auth - Sign out
export async function DELETE() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    deleteSessionByToken(sessionToken);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE_NAME);

  return response;
}
