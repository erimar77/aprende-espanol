'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, GraduationCap, Clock, CheckCircle, Settings } from 'lucide-react';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';

interface Stats {
  totalUsers: number;
  pendingUsers: number;
  approvedUsers: number;
  totalTeachers: number;
  activeTeachers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
    totalTeachers: 0,
    activeTeachers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, teachersRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/teachers'),
        ]);

        const users = await usersRes.json();
        const teachers = await teachersRes.json();

        if (Array.isArray(users)) {
          setStats(prev => ({
            ...prev,
            totalUsers: users.length,
            pendingUsers: users.filter((u: any) => !u.approved).length,
            approvedUsers: users.filter((u: any) => u.approved).length,
          }));
        }

        if (Array.isArray(teachers)) {
          setStats(prev => ({
            ...prev,
            totalTeachers: teachers.length,
            activeTeachers: teachers.filter((t: any) => t.isActive).length,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage users and teachers for Aprende Español
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingUsers}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.approvedUsers}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approved Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.activeTeachers}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/users">
          <Card hover className="h-full">
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Manage Users</CardTitle>
                  <CardDescription>
                    Approve or reject user registrations, manage roles
                  </CardDescription>
                  {stats.pendingUsers > 0 && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                      {stats.pendingUsers} pending
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/teachers">
          <Card hover className="h-full">
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Manage Teachers</CardTitle>
                  <CardDescription>
                    Add, edit, or remove teacher profiles
                  </CardDescription>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                    {stats.activeTeachers} active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings">
          <Card hover className="h-full">
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <Settings className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Configure TTS voices, API keys, and integrations
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
