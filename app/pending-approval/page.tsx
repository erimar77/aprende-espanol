'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function PendingApprovalPage() {
  const { user, status, isApproved, signOut, refreshSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/');
    }
    // Redirect if approved
    if (status === 'authenticated' && isApproved) {
      router.push('/');
    }
  }, [status, isApproved, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
          <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Account Pending Approval
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Hola <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>!
          Your account has been created successfully, but it needs to be approved by an administrator
          before you can access the learning content.
        </p>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Email: <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Status: <span className="text-yellow-600 dark:text-yellow-400 font-medium">Pending Approval</span>
          </p>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          You will receive access once an administrator approves your account.
          Please check back later or contact the site administrator.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={refreshSession}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Check Status
          </button>

          <button
            onClick={signOut}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
