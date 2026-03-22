import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTeachers, createTeacher, getSessionByToken, getUserById } from '@/lib/db';

// Helper to check if current user is admin
async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('spanish_session')?.value;
  if (!sessionToken) return false;

  const session = await getSessionByToken(sessionToken);
  if (!session) return false;

  const user = await getUserById(session.userId);
  return user?.role === 'ADMIN';
}

// GET /api/admin/teachers - List all teachers (including inactive)
export async function GET() {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const teachers = await getTeachers(true); // Include inactive
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

    // Validation: name must be a string, max 100 chars, trimmed
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name must be a non-empty string' },
        { status: 400 }
      );
    }
    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Name must be at most 100 characters' },
        { status: 400 }
      );
    }

    // Validation: imageUrl must be a string that starts with '/' or 'http'
    if (typeof imageUrl !== 'string') {
      return NextResponse.json(
        { error: 'Image URL must be a string' },
        { status: 400 }
      );
    }
    if (!imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
      return NextResponse.json(
        { error: 'Image URL must start with "/" or "http"' },
        { status: 400 }
      );
    }

    // Validation: greeting must be a string, max 500 chars
    if (typeof greeting !== 'string' || greeting.trim().length === 0) {
      return NextResponse.json(
        { error: 'Greeting must be a non-empty string' },
        { status: 400 }
      );
    }
    if (greeting.trim().length > 500) {
      return NextResponse.json(
        { error: 'Greeting must be at most 500 characters' },
        { status: 400 }
      );
    }

    // Validation: greetingTranslation must be a string, max 500 chars
    if (typeof greetingTranslation !== 'string' || greetingTranslation.trim().length === 0) {
      return NextResponse.json(
        { error: 'Greeting translation must be a non-empty string' },
        { status: 400 }
      );
    }
    if (greetingTranslation.trim().length > 500) {
      return NextResponse.json(
        { error: 'Greeting translation must be at most 500 characters' },
        { status: 400 }
      );
    }

    // Validation: specialty must be a string, max 200 chars
    if (typeof specialty !== 'string' || specialty.trim().length === 0) {
      return NextResponse.json(
        { error: 'Specialty must be a non-empty string' },
        { status: 400 }
      );
    }
    if (specialty.trim().length > 200) {
      return NextResponse.json(
        { error: 'Specialty must be at most 200 characters' },
        { status: 400 }
      );
    }

    // Validation: gender if provided must be 'male' or 'female'
    if (gender !== undefined && gender !== null) {
      if (typeof gender !== 'string' || !['male', 'female'].includes(gender)) {
        return NextResponse.json(
          { error: 'Gender must be either "male" or "female"' },
          { status: 400 }
        );
      }
    }

    // Get current teacher count for order
    const existingTeachers = await getTeachers(true);
    const maxOrder = existingTeachers.length > 0
      ? Math.max(...existingTeachers.map(t => t.order))
      : -1;

    const teacher = await createTeacher({
      name: name.trim(),
      imageUrl,
      greeting: greeting.trim(),
      greetingTranslation: greetingTranslation.trim(),
      specialty: specialty.trim(),
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
