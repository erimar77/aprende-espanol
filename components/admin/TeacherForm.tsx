'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Save, X, Upload, Link as LinkIcon } from 'lucide-react';

interface TeacherFormData {
  name: string;
  imageUrl: string;
  greeting: string;
  greetingTranslation: string;
  specialty: string;
  gender?: 'male' | 'female';
}

interface TeacherFormProps {
  initialData?: TeacherFormData;
  teacherId?: string;
  mode: 'create' | 'edit';
}

const SPECIALTIES = [
  'Vocabulary & Conversations',
  'Grammar & Structure',
  'Verb Conjugation',
  'Flashcards & Review',
  'Testing & Assessment',
  'Interactive Dialogues',
  'Numbers & Time',
  'Advanced Conversations',
  'Pronunciation',
  'Culture & Customs',
];

export default function TeacherForm({ initialData, teacherId, mode }: TeacherFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageInputType, setImageInputType] = useState<'url' | 'upload'>('url');

  const [formData, setFormData] = useState<TeacherFormData>({
    name: initialData?.name || '',
    imageUrl: initialData?.imageUrl || '',
    greeting: initialData?.greeting || '',
    greetingTranslation: initialData?.greetingTranslation || '',
    specialty: initialData?.specialty || SPECIALTIES[0],
    gender: initialData?.gender,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      setError('Failed to upload image. Please try again or use a URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'create'
        ? '/api/admin/teachers'
        : `/api/admin/teachers/${teacherId}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save teacher');
      }

      router.push('/admin/teachers');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save teacher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Maria"
            />
          </div>

          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Specialty *
            </label>
            <select
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {SPECIALTIES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender (optional)
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Not specified</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>

          {/* Image Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Image *
            </label>

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImageInputType('url')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  imageInputType === 'url'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                URL
              </button>
              <button
                type="button"
                onClick={() => setImageInputType('upload')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  imageInputType === 'upload'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
            </div>

            {imageInputType === 'url' ? (
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com/image.jpg"
              />
            ) : (
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-600 dark:file:bg-primary-900/30 dark:file:text-primary-400"
              />
            )}

            {formData.imageUrl && (
              <div className="mt-3 flex items-center gap-3">
                <div className="relative w-16 h-16">
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    fill
                    className="rounded-full object-cover border-2 border-secondary-400"
                    sizes="64px"
                  />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Image preview
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Greetings */}
        <div className="space-y-6">
          <div>
            <label htmlFor="greeting" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Greeting (Spanish) *
            </label>
            <textarea
              id="greeting"
              name="greeting"
              value={formData.greeting}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              placeholder="e.g., Hola! Soy Maria, tu profesora de español."
            />
          </div>

          <div>
            <label htmlFor="greetingTranslation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Greeting Translation (English) *
            </label>
            <textarea
              id="greetingTranslation"
              name="greetingTranslation"
              value={formData.greetingTranslation}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              placeholder="e.g., Hello! I'm Maria, your Spanish teacher."
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : mode === 'create' ? 'Create Teacher' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
