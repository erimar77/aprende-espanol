import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';
import { isAdminRequest } from '@/lib/server-auth';

// GET /api/admin/users - List all users
export async function GET() {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = await getUsers();

  // Strip sensitive providerId before returning
  const safeUsers = users.map(({ providerId: _providerId, ...user }) => user);

  return NextResponse.json(safeUsers);
}
