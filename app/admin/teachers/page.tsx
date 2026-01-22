'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Download } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import { clearTeachersCache } from '@/hooks/useTeachers';

interface Teacher {
  id: string;
  name: string;
  imageUrl: string;
  greeting: string;
  greetingTranslation: string;
  specialty: string;
  gender?: 'male' | 'female';
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    try {
      const response = await fetch('/api/admin/teachers');
      if (response.ok) {
        const data = await response.json();
        setTeachers(data.sort((a: Teacher, b: Teacher) => a.order - b.order));
      }
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function seedTeachers() {
    if (teachers.length > 0) {
      if (!confirm('Teachers already exist. Seeding will not add duplicates. Continue?')) {
        return;
      }
    }

    setSeeding(true);
    try {
      const response = await fetch('/api/seed', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        alert(`Seeded ${data.seeded} teachers from static data.`);
        clearTeachersCache();
        fetchTeachers();
      }
    } catch (error) {
      console.error('Failed to seed teachers:', error);
      alert('Failed to seed teachers. Check console for details.');
    } finally {
      setSeeding(false);
    }
  }

  async function toggleActive(id: string, currentActive: boolean) {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/admin/teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (response.ok) {
        setTeachers(teachers.map(t =>
          t.id === id ? { ...t, isActive: !currentActive } : t
        ));
      }
    } catch (error) {
      console.error('Failed to toggle teacher status:', error);
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteTeacherHandler(id: string, name: string) {
    if (!confirm(`Are you sure you want to permanently delete ${name}?`)) return;

    setActionLoading(id);
    try {
      const response = await fetch(`/api/admin/teachers/${id}?hard=true`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTeachers(teachers.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete teacher:', error);
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const activeCount = teachers.filter(t => t.isActive).length;
  const inactiveCount = teachers.filter(t => !t.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Teacher Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {activeCount} active, {inactiveCount} inactive
          </p>
        </div>
        <div className="flex gap-2">
          {teachers.length === 0 && (
            <button
              onClick={seedTeachers}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {seeding ? 'Importing...' : 'Import'}
            </button>
          )}
          <Link
            href="/admin/teachers/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Teacher
          </Link>
        </div>
      </div>

      {teachers.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No teachers found. Add your first teacher or import from static data.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/admin/teachers/new"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Teacher
                </Link>
                <button
                  onClick={seedTeachers}
                  disabled={seeding}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  {seeding ? 'Importing...' : 'Import from Static Data'}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className={!teacher.isActive ? 'opacity-60' : ''}>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-gray-400 cursor-move">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={teacher.imageUrl}
                        alt={teacher.name}
                        fill
                        className="rounded-full object-cover border-2 border-secondary-400"
                        sizes="64px"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {teacher.name}
                        </p>
                        {!teacher.isActive && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-primary-500 font-medium">
                        {teacher.specialty}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                        {teacher.greeting}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(teacher.id, teacher.isActive)}
                      disabled={actionLoading === teacher.id}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                        teacher.isActive
                          ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={teacher.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {teacher.isActive ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>

                    <Link
                      href={`/admin/teachers/${teacher.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5" />
                    </Link>

                    <button
                      onClick={() => deleteTeacherHandler(teacher.id, teacher.name)}
                      disabled={actionLoading === teacher.id}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
