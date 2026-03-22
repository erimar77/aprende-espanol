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

  const session = await getSessionByToken(sessionToken);
  if (!session) return false;

  const user = await getUserById(session.userId);
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
  const teacher = await getTeacherById(id);

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

    // Validation: name must be a string, max 100 chars, trimmed
    if (name !== undefined && name !== null) {
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
      updates.name = name.trim();
    }

    // Validation: imageUrl must be a string that starts with '/' or 'http'
    if (imageUrl !== undefined && imageUrl !== null) {
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
      updates.imageUrl = imageUrl;
    }

    // Validation: greeting must be a string, max 500 chars
    if (greeting !== undefined && greeting !== null) {
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
      updates.greeting = greeting.trim();
    }

    // Validation: greetingTranslation must be a string, max 500 chars
    if (greetingTranslation !== undefined && greetingTranslation !== null) {
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
      updates.greetingTranslation = greetingTranslation.trim();
    }

    // Validation: specialty must be a string, max 200 chars
    if (specialty !== undefined && specialty !== null) {
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
      updates.specialty = specialty.trim();
    }

    // Validation: gender if provided must be 'male' or 'female'
    if (gender !== undefined && gender !== null) {
      if (typeof gender !== 'string' || !['male', 'female'].includes(gender)) {
        return NextResponse.json(
          { error: 'Gender must be either "male" or "female"' },
          { status: 400 }
        );
      }
      updates.gender = gender;
    }

    // Validation: order must be a number
    if (typeof order === 'number') updates.order = order;

    // Validation: isActive must be a boolean
    if (typeof isActive === 'boolean') updates.isActive = isActive;

    const updatedTeacher = await updateTeacher(id, updates);

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

  const success = hard ? await hardDeleteTeacher(id) : await deleteTeacher(id);

  if (!success) {
    return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
