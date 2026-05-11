import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById, updateUser, deleteUser, getSessionByToken } from '@/lib/db';
import { isAdminRequest } from '@/lib/server-auth';

type UserUpdate = Partial<{
  approved: boolean;
  role: 'USER' | 'ADMIN';
}>;

// GET /api/admin/users/[id] - Get specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { providerId: _providerId, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

// PATCH /api/admin/users/[id] - Update user (approve, change role)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { approved, role } = body;

  const updates: UserUpdate = {};
  if (typeof approved === 'boolean') {
    updates.approved = approved;
  }
  if (role === 'USER' || role === 'ADMIN') {
    updates.role = role;
  }

  const updatedUser = await updateUser(id, updates);

  if (!updatedUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { providerId: _providerId, ...safeUser } = updatedUser;
  return NextResponse.json(safeUser);
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Prevent deleting yourself
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('spanish_session')?.value;
  if (sessionToken) {
    const session = await getSessionByToken(sessionToken);
    if (session?.userId === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }
  }

  const success = await deleteUser(id);

  if (!success) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
