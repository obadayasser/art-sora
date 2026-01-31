'use client';

import { useEffect } from 'react';
import { initializeDevice, getDeviceId, getAppId } from '@/lib/client/api-client';

interface DeviceProviderProps {
  children: React.ReactNode;
}

export function DeviceProvider({ children }: DeviceProviderProps) {
  useEffect(() => {
    // Initialize device verification on mount
    initializeDevice();

    // Log device info for debugging (remove in production)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('Device Initialized:', {
        deviceId: getDeviceId(),
        appId: getAppId()
      });
    }
  }, []);

  return <>{children}</>;
}
