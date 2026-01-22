'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check, X, Shield, ShieldOff, Trash2, Search, Filter } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: string;
  role: 'USER' | 'ADMIN';
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

type FilterType = 'all' | 'pending' | 'approved' | 'admin';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function approveUser(id: string) {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      });
      if (response.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, approved: true } : u));
      }
    } catch (error) {
      console.error('Failed to approve user:', error);
    } finally {
      setActionLoading(null);
    }
  }

  async function rejectUser(id: string) {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: false }),
      });
      if (response.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, approved: false } : u));
      }
    } catch (error) {
      console.error('Failed to reject user:', error);
    } finally {
      setActionLoading(null);
    }
  }

  async function toggleAdmin(id: string, currentRole: string) {
    setActionLoading(id);
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, role: newRole as 'USER' | 'ADMIN' } : u));
      }
    } catch (error) {
      console.error('Failed to toggle admin:', error);
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteUserHandler(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setActionLoading(id);
    try {
      const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setActionLoading(null);
    }
  }

  const filteredUsers = users
    .filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === 'all' ||
        (filter === 'pending' && !user.approved) ||
        (filter === 'approved' && user.approved && user.role === 'USER') ||
        (filter === 'admin' && user.role === 'ADMIN');

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Pending users first, then by creation date
      if (!a.approved && b.approved) return -1;
      if (a.approved && !b.approved) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const pendingCount = users.filter(u => !u.approved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Approve, reject, or manage user accounts
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'admin'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-yellow-500 text-white rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* User List */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No users found
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="rounded-full flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        {user.role === 'ADMIN' && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                            Admin
                          </span>
                        )}
                        {!user.approved && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Joined {new Date(user.createdAt).toLocaleDateString()} via {user.provider}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!user.approved ? (
                      <>
                        <button
                          onClick={() => approveUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteUserHandler(user.id)}
                          disabled={actionLoading === user.id}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Reject & Delete"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleAdmin(user.id, user.role)}
                          disabled={actionLoading === user.id}
                          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                            user.role === 'ADMIN'
                              ? 'text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                              : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          title={user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                        >
                          {user.role === 'ADMIN' ? (
                            <ShieldOff className="w-5 h-5" />
                          ) : (
                            <Shield className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => rejectUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Revoke Access"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteUserHandler(user.id)}
                          disabled={actionLoading === user.id}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
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
