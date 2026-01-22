'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthButton() {
  const { user, status, isAdmin, signIn, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  if (status === 'unauthenticated' || !user) {
    return (
      <>
        <button
          onClick={() => setShowSignInModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Sign In</span>
        </button>

        {/* Sign In Modal */}
        {showSignInModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Sign in to Aprende Espanol
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose your preferred sign-in method to track your progress and access all features.
              </p>

              {/* Demo sign in for testing (simulates OAuth) */}
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    await signIn('google', {
                      email: 'demo@example.com',
                      name: 'Demo User',
                      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                    });
                    setShowSignInModal(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Continue with Google
                  </span>
                </button>

                <button
                  onClick={async () => {
                    await signIn('github', {
                      email: 'demo@example.com',
                      name: 'Demo User',
                      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                    });
                    setShowSignInModal(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Continue with GitHub
                  </span>
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                New accounts require admin approval before accessing learning content.
              </p>

              <button
                onClick={() => setShowSignInModal(false)}
                className="mt-4 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 hidden sm:block" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
            {!user.approved && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                Pending Approval
              </span>
            )}
            {user.role === 'ADMIN' && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                Admin
              </span>
            )}
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setShowDropdown(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
              Admin Panel
            </Link>
          )}

          <button
            onClick={() => {
              signOut();
              setShowDropdown(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
