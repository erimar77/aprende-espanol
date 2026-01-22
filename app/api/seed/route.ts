import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTeachers, createTeacher, getSessionByToken, getUserById } from '@/lib/db';
import { teachers as staticTeachers } from '@/data/teachers';

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

// POST /api/seed - Seed teachers from static data
export async function POST() {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existingTeachers = getTeachers(true);

    if (existingTeachers.length > 0) {
      return NextResponse.json({
        message: 'Teachers already exist in database',
        count: existingTeachers.length,
        seeded: 0,
      });
    }

    // Seed from static data
    const seededTeachers = staticTeachers.map((teacher, index) => {
      return createTeacher({
        name: teacher.name,
        imageUrl: teacher.imageUrl,
        greeting: teacher.greeting,
        greetingTranslation: teacher.greetingTranslation,
        specialty: teacher.specialty,
        gender: teacher.gender,
        order: index,
        isActive: true,
      });
    });

    return NextResponse.json({
      message: 'Teachers seeded successfully',
      count: seededTeachers.length,
      seeded: seededTeachers.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed teachers' },
      { status: 500 }
    );
  }
}

// GET /api/seed - Check seed status
export async function GET() {
  const existingTeachers = getTeachers(true);
  const staticCount = staticTeachers.length;

  return NextResponse.json({
    databaseCount: existingTeachers.length,
    staticCount,
    needsSeeding: existingTeachers.length === 0,
  });
}
