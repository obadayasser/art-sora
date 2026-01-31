'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { adminLogin, setupTwoFactor, verifyTwoFactor } from '@/lib/client/api-admin';
import type { AdminUser, TwoFactorSetupResponse } from '@/types';

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  twoFactorRequired: boolean;
  twoFactorData: TwoFactorSetupResponse | null;
  login: (email: string, password: string) => Promise<void>;
  verifyTwoFactorCode: (code: string) => Promise<void>;
  setupTwoFactorAuth: () => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorSetupResponse | null>(null);
  const [pendingCredentials, setPendingCredentials] = useState<{ email: string; password: string } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const authInitializedRef = useRef(false);

  // Load admin data from cookies on mount
  useEffect(() => {
    // Prevent multiple initializations
    if (authInitializedRef.current) {
     
      return;
    }
    
   
    
    if (typeof window !== 'undefined') {
      // Check if token exists in cookies
      const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
          return parts.pop()?.split(';').shift() || null;
        }
        return null;
      };

      const cookieToken = getCookie('accessToken');
      const cookieAdmin = getCookie('admin');

      
     

      // Load data synchronously
      let adminData: AdminUser | null = null;
      let isAuthenticated = false;

      if (cookieAdmin && cookieToken) {
        try {
          adminData = JSON.parse(decodeURIComponent(cookieAdmin));
          isAuthenticated = true;
         
         
        } catch (error) {
          
        }
      } else {
       
      }

      // Update all states at once
      setAdmin(adminData);
      setToken(cookieToken);
      setIsLoading(false);
      setIsInitialized(true);
      authInitializedRef.current = true;
    }
  }, []);

  const clearAdminData = useCallback(() => {
   
    setAdmin(null);
    setToken(null);
    setTwoFactorRequired(false);
    setTwoFactorData(null);
    setPendingCredentials(null);
    if (typeof window !== 'undefined') {
      // Remove cookies only
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
     
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
   
    try {
      setIsLoading(true);
      
      const response = await adminLogin(email, password);
     
      
      // Store credentials for potential 2FA
      setPendingCredentials({ email, password });
      
      // Use the full user object from response
      const adminUser: AdminUser = {
        id: response.user.id,
        email: response.user.email,
        fullName: response.user.fullName,
        phone: response.user.phone,
        role: response.user.role as 'ADMIN' | 'SUPER_ADMIN',
        isActive: response.user.isActive,
        lastLoginAt: response.user.lastLoginAt,
        createdAt: response.user.createdAt
      };

     
      setAdmin(adminUser);
      setToken(response.accessToken);
      
      // Check if 2FA is required
      const requires2FA = response.requiresTwoFactor || false;
     
      
      if (requires2FA) {
        // Set pending state and wait for 2FA verification
        setTwoFactorRequired(true);
       
      } else {
        // No 2FA required, mark as fully authenticated
        setTwoFactorRequired(false);
       
      }
    } catch (error: any) {
      
      clearAdminData();
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, [clearAdminData]);

  const verifyTwoFactorCode = useCallback(async (code: string) => {
   
    try {
      setIsLoading(true);
      
      if (!token) {
        throw new Error('No token available for 2FA verification');
      }

      const response = await verifyTwoFactor(code, token);
     
      
      if (!response.isValid) {
        throw new Error(response.message || 'Invalid verification code');
      }

      // 2FA verified, admin is now fully authenticated
      setTwoFactorRequired(false);
      setPendingCredentials(null);
     
      
    } catch (error: any) {
      
      throw new Error(error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const setupTwoFactorAuth = useCallback(async () => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      setIsLoading(true);
      
      const response = await setupTwoFactor(token);
      setTwoFactorData(response);
      
    } catch (error: any) {
      throw new Error(error.message || 'Failed to setup 2FA');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const logout = useCallback(() => {
    clearAdminData();
  }, [clearAdminData]);

  const value: AdminAuthContextType = {
    admin,
    token,
    isAuthenticated: !!admin && !!token,
    isLoading,
    isInitialized,
    twoFactorRequired,
    twoFactorData,
    login,
    verifyTwoFactorCode,
    setupTwoFactorAuth,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
