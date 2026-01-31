/* 'use client';

import { useEffect } from 'react';
import {  getAppId } from '@/lib/client/api-client';

interface DeviceProviderProps {
  children: React.ReactNode;
}

export function DeviceProvider({ children }: DeviceProviderProps) {
  useEffect(() => {

    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
     
    }
  }, []);

  return <>{children}</>;
}
 */