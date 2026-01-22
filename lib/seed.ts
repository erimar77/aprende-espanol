// Seed script to initialize the database with existing teacher data
import { teachers } from '@/data/teachers';
import { createTeacher, getTeachers, DbTeacher } from './db';

export function seedTeachers(): void {
  const existingTeachers = getTeachers(true);
  if (existingTeachers.length > 0) {
    console.log('Teachers already exist in database, skipping seed');
    return;
  }

  console.log('Seeding teachers from static data...');

  teachers.forEach((teacher, index) => {
    createTeacher({
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

  console.log(`Seeded ${teachers.length} teachers`);
}

// Run if called directly
if (require.main === module) {
  seedTeachers();
}
