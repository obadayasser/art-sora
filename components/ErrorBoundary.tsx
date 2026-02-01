'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
            >
              <AlertCircle className="w-10 h-10 text-red-500" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
            </p>

            {this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono text-left break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <RefreshCcw size={18} />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
