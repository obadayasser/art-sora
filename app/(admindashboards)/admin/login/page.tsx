'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Loader2, Shield, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, verifyTwoFactorCode, twoFactorRequired } = useAdminAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (showTwoFactor) {
        // Verify 2FA code
        await verifyTwoFactorCode(formData.twoFactorCode);
        toast.success('Login successful!');
        router.push('/admin');
      } else {
        // Initial login
        await login(formData.email, formData.password);
        
        // Check if 2FA is required
        if (twoFactorRequired) {
          setShowTwoFactor(true);
          toast.success('Please enter your 2FA code');
        } else {
          toast.success('Login successful!');
          router.push('/admin');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to manage your store
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!showTwoFactor ? (
              <>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="admin@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Two Factor Authentication */
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                  <Shield className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Two-Factor Authentication
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Enter the 6-digit code from your authenticator app
                </p>
                
                <div className="flex justify-center gap-2 mb-6">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && /^\d+$/.test(value)) {
                          const newCode = formData.twoFactorCode.split('');
                          newCode[index] = value;
                          setFormData(prev => ({ ...prev, twoFactorCode: newCode.join('') }));
                          
                          // Auto-focus next input
                          const nextInput = e.target.nextElementSibling as HTMLInputElement;
                          if (nextInput) nextInput.focus();
                        } else {
                          const newCode = formData.twoFactorCode.split('');
                          newCode[index] = '';
                          setFormData(prev => ({ ...prev, twoFactorCode: newCode.join('') }));
                        }
                      }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowTwoFactor(false);
                    setFormData(prev => ({ ...prev, twoFactorCode: '' }));
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Back to login
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  {showTwoFactor ? 'Verifying...' : 'Signing in...'}
                </>
              ) : (
                showTwoFactor ? 'Verify Code' : 'Sign In'
              )}
            </button>
          </form>

          {/* Security Notice */}
          {!showTwoFactor && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start">
                <Shield className="text-blue-600 dark:text-blue-400 mr-3 mt-0.5" size={18} />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Secure Login
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    Your login is protected with enterprise-grade security
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2026 Art Frames Admin. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
