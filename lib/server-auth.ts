import { cookies } from 'next/headers';
import { getSessionByToken, getUserById } from '@/lib/db';

const SESSION_COOKIE_NAME = 'spanish_session';

/**
 * Returns true if the request carries a valid session cookie that maps to a
 * user with role === 'ADMIN'. Used by every /api/admin/* route handler.
 *
 * Note: this only checks the session/role. The custom auth POST handler that
 * minted these sessions was removed (it was the privilege-escalation vector).
 * Until NextAuth is fully wired, no client flow creates a session, so this
 * function effectively returns false for everyone — admin endpoints are
 * unreachable, which is the safe state.
 */
export async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return false;

  const session = await getSessionByToken(sessionToken);
  if (!session) return false;

  const user = await getUserById(session.userId);
  return user?.role === 'ADMIN';
}
