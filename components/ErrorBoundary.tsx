'use client';

import React, { ReactNode, ErrorInfo } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  handleReset = () => {
    // Reload the page to attempt recovery
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream dark:bg-charcoal flex items-center justify-center px-4 py-8">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-8">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Error Heading */}
              <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">
                Something went wrong
              </h1>

              {/* Error Message */}
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                We encountered an unexpected error. Don't worry, we've logged the details and you can try again.
              </p>

              {/* Error Details (if in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                  <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-words">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {/* Try Again Button */}
              <button
                onClick={this.handleReset}
                className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>

              {/* Home Link */}
              <a
                href="/"
                className="block text-center mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
