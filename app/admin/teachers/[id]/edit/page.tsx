'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card, { CardContent } from '@/components/ui/Card';
import TeacherForm from '@/components/admin/TeacherForm';

interface Teacher {
  id: string;
  name: string;
  imageUrl: string;
  greeting: string;
  greetingTranslation: string;
  specialty: string;
  gender?: 'male' | 'female';
}

export default function EditTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeacher() {
      try {
        const response = await fetch(`/api/admin/teachers/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Teacher not found');
          } else {
            setError('Failed to load teacher');
          }
          return;
        }
        const data = await response.json();
        setTeacher(data);
      } catch (err) {
        setError('Failed to load teacher');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchTeacher();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Teacher
        </h1>
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">
                {error || 'Teacher not found'}
              </p>
              <button
                onClick={() => router.push('/admin/teachers')}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Back to Teachers
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Teacher: {teacher.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update the teacher profile information
        </p>
      </div>

      <Card>
        <CardContent>
          <TeacherForm
            mode="edit"
            teacherId={teacher.id}
            initialData={{
              name: teacher.name,
              imageUrl: teacher.imageUrl,
              greeting: teacher.greeting,
              greetingTranslation: teacher.greetingTranslation,
              specialty: teacher.specialty,
              gender: teacher.gender,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
