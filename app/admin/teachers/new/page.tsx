'use client';

import Card, { CardContent } from '@/components/ui/Card';
import TeacherForm from '@/components/admin/TeacherForm';

export default function NewTeacherPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Teacher
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Create a new teacher profile for the learning platform
        </p>
      </div>

      <Card>
        <CardContent>
          <TeacherForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
