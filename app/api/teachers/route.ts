import { NextResponse } from 'next/server';
import { getTeachers } from '@/lib/db';

// GET /api/teachers - List active teachers (public endpoint)
export async function GET() {
  const teachers = getTeachers(false); // Only active teachers

  // If no teachers in database, return empty array
  // The client should handle seeding or use static data as fallback
  return NextResponse.json(teachers);
}
