import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUsers, getSessionByToken, getUserById } from '@/lib/db';

// Helper to check if current user is admin
async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('spanish_session')?.value;
  if (!sessionToken) return false;

  const session = getSessionByToken(sessionToken);
  if (!session) return false;

  const user = getUserById(session.userId);
  return user?.role === 'ADMIN';
}

// GET /api/admin/users - List all users
export async function GET() {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = getUsers();

  // Remove sensitive data
  const safeUsers = users.map(({ providerId, ...user }) => user);

  return NextResponse.json(safeUsers);
}
