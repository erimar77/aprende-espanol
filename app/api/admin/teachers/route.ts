import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTeachers, createTeacher, getSessionByToken, getUserById } from '@/lib/db';

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

// GET /api/admin/teachers - List all teachers (including inactive)
export async function GET() {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const teachers = getTeachers(true); // Include inactive
  return NextResponse.json(teachers);
}

// POST /api/admin/teachers - Create new teacher
export async function POST(request: NextRequest) {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, imageUrl, greeting, greetingTranslation, specialty, gender } = body;

    if (!name || !imageUrl || !greeting || !greetingTranslation || !specialty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current teacher count for order
    const existingTeachers = getTeachers(true);
    const maxOrder = existingTeachers.length > 0
      ? Math.max(...existingTeachers.map(t => t.order))
      : -1;

    const teacher = createTeacher({
      name,
      imageUrl,
      greeting,
      greetingTranslation,
      specialty,
      gender: gender || undefined,
      order: maxOrder + 1,
      isActive: true,
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error('Failed to create teacher:', error);
    return NextResponse.json(
      { error: 'Failed to create teacher' },
      { status: 500 }
    );
  }
}
