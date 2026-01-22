import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  hardDeleteTeacher,
  getSessionByToken,
  getUserById,
} from '@/lib/db';

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

// GET /api/admin/teachers/[id] - Get specific teacher
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const teacher = getTeacherById(id);

  if (!teacher) {
    return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
  }

  return NextResponse.json(teacher);
}

// PUT /api/admin/teachers/[id] - Update teacher
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, imageUrl, greeting, greetingTranslation, specialty, gender, order, isActive } = body;

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (greeting !== undefined) updates.greeting = greeting;
    if (greetingTranslation !== undefined) updates.greetingTranslation = greetingTranslation;
    if (specialty !== undefined) updates.specialty = specialty;
    if (gender !== undefined) updates.gender = gender;
    if (typeof order === 'number') updates.order = order;
    if (typeof isActive === 'boolean') updates.isActive = isActive;

    const updatedTeacher = updateTeacher(id, updates);

    if (!updatedTeacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error('Failed to update teacher:', error);
    return NextResponse.json(
      { error: 'Failed to update teacher' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/teachers/[id] - Delete teacher (soft delete by default)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const hard = searchParams.get('hard') === 'true';

  const success = hard ? hardDeleteTeacher(id) : deleteTeacher(id);

  if (!success) {
    return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
